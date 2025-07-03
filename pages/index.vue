<script setup lang="ts">
import type { Models } from "appwrite";
import { ref } from "vue";

const utils = useAppwriteUtils();
const { client, account, databases, ID } = utils;

const user = ref<null | Models.User<Models.Preferences>>(null);
try {
  user.value = await account.get();
} catch (error) {
  console.error("User not logged in:", error);
}

const email = ref("");
const password = ref("");
const name = ref("");
const submission = ref("");
const docs = ref<Models.Document[]>([]);

const login = async (email: string, password: string) => {
  await account.createEmailPasswordSession(email, password);
  user.value = await account.get();
};

const register = async () => {
  await account.create(ID.unique(), email.value, password.value, name.value);
  login(email.value, password.value);
};

const logout = async () => {
  await account.deleteSession("current");
  user.value = null;
};

const submit = async () => {
  if (!user.value) {
    console.error("User not logged in, cannot submit.");
    return;
  }
  const databaseId = "6865f583001cc0e8c5f7"; // Replace with your actual database ID
  const collectionId = "6865f84a000e6af64611"; // Replace with your actual collection ID
  await databases
    .createDocument(databaseId, collectionId, ID.unique(), {
      submission: submission.value,
    })
    .then((response) => {
      console.log("Submission successful", response);
    })
    .catch((error) => {
      console.error("Error submitting:", error);
    });
  submission.value = ""; // Clear the submission after successful submit
};

let promise = databases.listDocuments(
  "6865f583001cc0e8c5f7",
  "6865f84a000e6af64611",
  []
);

try {
  await promise
    .then((response) => {
      console.log("Documents:", response.documents);
      docs.value = response.documents;
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
    });

  client.subscribe(
    "databases.6865f583001cc0e8c5f7.collections.6865f84a000e6af64611.documents",
    (response) => {
      console.log("Real-time update:", response);
      docs.value.push(response.payload as Models.Document);
    }
  );
} catch (error) {
  console.error("Error subscribing to real-time updates:", error);
}

client;
</script>

<template>
  <div>
    <p>
      {{ user ? `Logged in as ${user.name}` : "Not logged in" }}
    </p>

    <form>
      <input type="email" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <input type="text" placeholder="Name" v-model="name" />
      <button type="button" @click="login(email, password)">Login</button>
      <button type="button" @click="register">Register</button>
      <button type="button" @click="logout">Logout</button>
    </form>

    <textarea v-model="submission"> </textarea>
    <button type="button" @click="submit">Submit</button>
    <br />
    <hr />
    <h2>Submissions</h2>
    <ul>
      <li v-for="doc in docs" :key="doc.$id">
        {{ doc.submission }} ({{ doc.$createdAt }})
      </li>
    </ul>
  </div>
</template>
