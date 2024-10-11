import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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
const db = getFirestore(app);

const releasesCollection = collection(db, "releases");

async function loadReleases() {
    const querySnapshot = await getDocs(releasesCollection);
    const releasesContainer = document.getElementById('releases');
    releasesContainer.innerHTML = '';
    querySnapshot.forEach((doc) => {
        const release = doc.data();
        const releaseElement = createReleaseElement(doc.id, release);
        releasesContainer.appendChild(releaseElement);
    });
}

function createReleaseElement(id, release) {
    const element = document.createElement('div');
    element.className = 'release';
    element.dataset.id = id;
    element.innerHTML = `
        <h3 contenteditable="true">${release.name}</h3>
        <p>INFO: ${release.category || "Non catégorisé"}</p>
        <progress value="${release.progress}" max="100"></progress>
        <span>${release.progress}%</span>
        <br>
        <button class="modify-progress">Modifier progression</button>
        <button class="rename-release">Renommer</button>
        <button class="delete-release">Supprimer</button>
        <button class="add-bug">add-Bug</button>
        <button class="add-log">add-log</button>
        <button class="change-category">Infos</button>
       


    `;

    element.querySelector('.modify-progress').addEventListener('click', () => modifyProgress(id));
    element.querySelector('.rename-release').addEventListener('click', () => renameRelease(id));
    element.querySelector('.delete-release').addEventListener('click', () => deleteRelease(id));
    element.querySelector('.add-bug').addEventListener('click', () => addBug(id));
    element.querySelector('.add-log').addEventListener('click', () => addLog(id));
    element.querySelector('.change-category').addEventListener('click', () => changeCategory(id));
    

    return element;
}

async function addNewRelease() {
    const name = prompt("Nom de la nouvelle release:");
    if (name) {
        const category = prompt("Catégorie de la release:");
        await addDoc(releasesCollection, {
            name: name,
            progress: 0,
            bugs: [],
            category: category || "Non catégorisé"
        });
        loadReleases();
    }
}

async function modifyProgress(id) {
    const newProgress = prompt("Nouvelle progression (0-100):");
    if (newProgress !== null && !isNaN(newProgress)) {
        const releaseRef = doc(db, "releases", id);
        await updateDoc(releaseRef, { progress: parseInt(newProgress) });
        loadReleases();
    }
}

async function renameRelease(id) {
    const newName = prompt("Nouveau nom de la release:");
    if (newName) {
        const releaseRef = doc(db, "releases", id);
        await updateDoc(releaseRef, { name: newName });
        loadReleases();
    }
}

async function deleteRelease(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette release ?")) {
        await deleteDoc(doc(db, "releases", id));
        loadReleases();
    }
}

async function addBug(id) {
    const bugDescription = prompt("Description du bug:");
    if (bugDescription) {
        const releaseRef = doc(db, "releases", id);
        await updateDoc(releaseRef, { 
            bugs: arrayUnion(bugDescription) 
        });
        alert("Bug ajouté avec succès!");
    }
}


async function addLog(id) {
    const logDescription = prompt("ChangeLog:");
    if (logDescription) {
        const releaseRef = doc(db, "releases", id);
        await updateDoc(releaseRef, { 
            logs: arrayUnion(logDescription) 
        });
        alert("ChangeLog ajouté avec succès!");
    }
}



async function changeCategory(id) {
    const newCategory = prompt("Nouvelle Info:");
    if (newCategory) {
        const releaseRef = doc(db, "releases", id);
        await updateDoc(releaseRef, { category: newCategory });
        loadReleases();
    }
}

async function readAllBugs() {
    const querySnapshot = await getDocs(releasesCollection);
    let allBugs = [];
    querySnapshot.forEach((doc) => {
        const release = doc.data();
        if (release.bugs && release.bugs.length > 0) {
            allBugs.push(`${release.name}:`);
            release.bugs.forEach((bug, index) => {
                allBugs.push(`  ${index + 1}. ${bug}`);
            });
            allBugs.push(''); // Add an empty line between releases
        }
    });
    
    if (allBugs.length > 0) {
        alert(allBugs.join('\n'));
    } else {
        alert("Aucun bug enregistré pour le moment.");
    }
}


async function readAllLogs() {
    const querySnapshot = await getDocs(releasesCollection);
    let allLogs = [];
    querySnapshot.forEach((doc) => {
        const release = doc.data();
        if (release.logs && release.logs.length > 0) {
            allLogs.push(`${release.name}:`);
            release.logs.forEach((log, index) => {
                allLogs.push(`  ${index + 1}. ${log}`);
            });
            allLogs.push(''); // Add an empty line between releases
        }
    });
    
    if (allLogs.length > 0) {
        alert(allLogs.join('\n'));
    } else {
        alert("Aucun Changelog enregistré pour le moment.");
    }
}

async function saveAllChanges() {
    const releases = document.querySelectorAll('.release');
    for (const release of releases) {
        const id = release.dataset.id;
        const name = release.querySelector('h3').textContent;
        const progress = parseInt(release.querySelector('progress').value);
        
        const releaseRef = doc(db, "releases", id);
        await updateDoc(releaseRef, { name, progress });
    }
    alert("Toutes les modifications ont été sauvegardées!");
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addReleaseButton').addEventListener('click', addNewRelease);
    document.getElementById('saveButton').addEventListener('click', saveAllChanges);
    document.getElementById('readBugsButton').addEventListener('click', readAllBugs);
    document.getElementById('readLogsButton').addEventListener('click', readAllLogs);
    loadReleases();
});
