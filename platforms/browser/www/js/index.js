// import { credentials } from 'credentials.js';
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    const firebaseConfig = {
        apiKey: credentials.apiKey,
        authDomain: credentials.authDomain,
        databaseURL: credentials.databaseURL,
        projectId: credentials.projectId,
        storageBucket: credentials.storageBucket,
        messagingSenderId: credentials.messagingSenderId,
        appId: credentials.appId,
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}


const db = firebase.firestore();

const taskForm = document.getElementById('task-form');

taskForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const title = taskForm['task-title'].value;
    const description = taskForm['task-description'].value;

    const respuesta = await db.collection('tareas').doc().set({
        title,
        description
    });
    console.log(respuesta);
    console.log(title, description);
    taskForm.reset();

});


//Leer datos

const tabla = document.getElementById('table');
db.collection("tareas").onSnapshot((querySnapshot) => {
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().title}`);
        tabla.innerHTML += `
        <tr>
        <td>${doc.data().title}</td>
        <td>${doc.data().description}</td>        
         </tr>
        `
    });
});