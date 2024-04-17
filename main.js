import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles

const aspectRatio = 1;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

const minSize = Math.min(window.innerWidth, window.innerHeight);
const newSize = minSize * 0.5;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = "saturn";
let currentPlanetIndex = 0; // Keeps track of the current planet index

// Linje 29 til 57 virker ikke, så det skal lige fjernes og så kan man skifte planet ved at ændre linje 24 til den ønskede planet via
// mappe navn

const planets = ['solen', 'merkur', 'venus', 'jorden', 'mars', 'jupiter', 'saturn', 'uranus', 'Neptune'];

// Function to update the objToRender based on the current planet index
function updateObjectToRender() {
    objToRender = planets[currentPlanetIndex];
}

// Function to handle when the next button is clicked
document.querySelector("#nextBtn").addEventListener('click', nextPlanet);
function nextPlanet() {
    console.log("its doing something")
    currentPlanetIndex++;
    if (currentPlanetIndex >= planets.length) {
        currentPlanetIndex = 0; // Wrap around to the first planet if reached the end
    }
    updateObjectToRender();
}
document.querySelector("#prevBtn").addEventListener('click', previousPlanet);
// Function to handle when the previous button is clicked
function previousPlanet() {
    currentPlanetIndex--;
    if (currentPlanetIndex < 0) {
        currentPlanetIndex = planets.length - 1; // Wrap around to the last planet if reached the beginning
    }
    updateObjectToRender();
}

// Call the initial render
updateObjectToRender();

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: false  }); //Alpha: true allows for the transparent background
renderer.setSize(newSize, newSize);
renderer.setPixelRatio(window.devicePixelRatio * 2);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 03D model
camera.position.z = objToRender === objToRender ? 220 : 500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xc4c4c4, 8); // (color, intensity)
topLight.position.set(150, 100, 120) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === objToRender ? 5 : 1);
scene.add(ambientLight);


//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  object.rotation.y += 0.01;
  renderer.render(scene, camera);
  

}

//Start the 3D rendering
animate();