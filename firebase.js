import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpy-kPsI3OMFo0-W6JY3sl0pmSOfoLjSI",
  authDomain: "oneforall-b7407.firebaseapp.com",
  projectId: "oneforall-b7407",
  storageBucket: "oneforall-b7407.appspot.com",
  messagingSenderId: "418453063031",
  appId: "1:418453063031:web:f074e5d43c3553619d8d72",
  measurementId: "G-LLGQZYRP6Z"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, arrayUnion };

export async function addRelease(name) {
  try {
    const docRef = await addDoc(collection(db, "releases"), {
      name: name,
      progress: 0,
      bugs: [],
      changelogs: []
    });
    console.log(`La release "${name}" a été ajoutée avec succès.`);
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la release : ", error);
    throw error;
  }
}
