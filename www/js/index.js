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

const formularioPelicula = document.getElementById("formulario-pelicula");
const tasksContainer = document.getElementById("tasks-container");

let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} titulo Titulo de la pelicula
 * @param {string} genero Genero de la pelicula
 * @param {string} canales Canales de peliculas
 * @param {string} temporadas Temporada de la peliculas
 * @param {string} actual Si es actual 
 */
const saveTask = (titulo, genero, canales, temporadas, actual) =>
    db.collection("showTv").doc().set({
        titulo,
        genero,
        canales,
        temporadas,
        actual,
    });

const getTasks = () => db.collection("showTv").get();

const onGetTasks = (callback) => db.collection("showTv").onSnapshot(callback);

const deleteTask = (id) => db.collection("showTv").doc(id).delete();

const getTask = (id) => db.collection("showTv").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('showTv').doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async(e) => {
    onGetTasks((querySnapshot) => {
        tasksContainer.innerHTML = "";

        querySnapshot.forEach((doc) => {
            const peliculas = doc.data();

            tasksContainer.innerHTML += `<div class="card  border-primary">
    <h3 class="h5">${peliculas.titulo}</h3>
    <p><span><b>Genero:</b> </span>${peliculas.genero}</p>
    <p><span><b>Canales:</b> </span>${peliculas.canales}</p>
    <p><span><b>Tempradas:</b> </span>${peliculas.temporadas}</p>
    <p><span><b>Actualidad:</b> </span>${peliculas.actual}</p>
    <div>
      <button class="btn btn-danger btn-delete" data-id="${doc.id}">
        🗑 Eliminar
      </button>
      <button class="btn btn-warning btn-edit" data-id="${doc.id}">
        🖉 Editar
      </button>
    </div>
  </div>`;
        });

        const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
        btnsDelete.forEach((btn) =>
            btn.addEventListener("click", async(e) => {
                console.log(e.target.dataset.id);
                try {
                    await deleteTask(e.target.dataset.id);
                } catch (error) {
                    console.log(error);
                }
            })
        );

        const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
        btnsEdit.forEach((btn) => {
            btn.addEventListener("click", async(e) => {
                try {
                    const doc = await getTask(e.target.dataset.id);
                    const contenido = doc.data();
                    formularioPelicula["tituloPelicula"].value = contenido.titulo;
                    formularioPelicula["generoPelicula"].value = contenido.genero;
                    formularioPelicula["canalesPelicula"].value = contenido.canales;
                    formularioPelicula["nTemporadas"].value = contenido.temporadas;
                    formularioPelicula["actualPelicula"].checked = contenido.actual;
                    editStatus = true;
                    id = doc.id;
                    formularioPelicula["btn-task-form"].innerText = "Actualizar";

                } catch (error) {
                    console.log(error);
                }
            });
        });
    });
});
// Agregar una pelicula
formularioPelicula.addEventListener("submit", async(e) => {
    e.preventDefault();

    const titulo = formularioPelicula["tituloPelicula"];
    const genero = formularioPelicula["generoPelicula"];
    const canales = formularioPelicula["canalesPelicula"];
    const temporadas = formularioPelicula["nTemporadas"];
    const actual = formularioPelicula["actualPelicula"];

    try {
        if (!editStatus) {
            await saveTask(titulo.value, genero.value, canales.value, temporadas.value, actual.checked);
        } else {
            await updateTask(id, {
                titulo: titulo.value,
                genero: genero.value,
                canales: canales.value,
                temporadas: temporadas.value,
                actual: actual.checked,
            })

            editStatus = false;
            id = '';
            formularioPelicula['btn-task-form'].innerText = 'Guardar';
        }

        formularioPelicula.reset();
        titulo.focus();
    } catch (error) {
        console.log(error);
    }
});