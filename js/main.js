// Importer les modules nécessaires
import * as THREE from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
import { MyFirstPersonControls } from "../modules/MyFirstPersonControls.mjs";
// import { OrbitControls } from "three/examples/jsm/Addons.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87ceeb);
document.getElementById("container").appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(-80, 10, 0);
camera.up.set(0, 1, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(100, 10);
scene.add(gridHelper);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Contrôles
// const controls = new OrbitControls(camera, renderer.domElement);
const controls = new MyFirstPersonControls(camera, renderer.domElement);
// Hauteur du regard à 8 unités selon Y
controls.setLookHeight(8.0);
// Vitesse de déplacement de 15 unités par seconde
controls.setMoveSpeed(15.0);

// ---------- Activation des ombres ----------

renderer.shadowMap.enabled = true;
// Par défaut : ombres "dures"
//renderer.shadowMap.type = THREE.PCFShadowMap;
// Ombres douces
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ---------- Création des sources de lumière ----------

// Ajout d'une lumière ambiante
let ambient = new THREE.AmbientLight(0x555555, 1.0);
scene.add(ambient);

// Ajout d'une lumière directionnelle
let light1 = new THREE.DirectionalLight(0xffffff, 1.5 * Math.PI);
light1.position.set(-100, 100, -100);
scene.add(light1);

// La source de lumière directionnelle produit des ombres
light1.castShadow = true;

// Propriétés de l'ombre
// Résolution de la shadow map (par défaut :
// 512*512)
light1.shadow.mapSize.width = 2048;
light1.shadow.mapSize.height = 2048;
// Propriétés de la projection depuis
// la source de lumière
let d = 200;
light1.shadow.camera.left = -d;
light1.shadow.camera.right = d;
light1.shadow.camera.top = d;
light1.shadow.camera.bottom = -d;
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 500;
light1.shadow.bias = 0.0005;

// Ajout d'une lumière ponctuelle (pour atténuer les ombres
// dans la salle sud)
let light2 = new THREE.PointLight(0xffffff, 0.5, 50);
light2.position.set(-50, 20, -25);
scene.add(light2);

// ---------- Sol ----------

let floorMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
let floorGeometry = new THREE.PlaneGeometry(200, 100, 200, 100);
floorGeometry.rotateX(-Math.PI / 2);
let floor = new THREE.Mesh(floorGeometry, floorMaterial);
// Le plan du sol reçoit des ombres
floor.receiveShadow = true;
scene.add(floor);

// ---------- Murs ----------

// Matériau des murs
let wallMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

// Géométrie des murs wall E et W
let wallGeometryX = new THREE.BoxGeometry(200, 20, 1);

let wallE = new THREE.Mesh(wallGeometryX, wallMaterial);
wallE.position.z = 50;
wallE.position.y = 10;
wallE.castShadow = true;
wallE.receiveShadow = true;
scene.add(wallE);

let wallW = new THREE.Mesh(wallGeometryX, wallMaterial);
wallW.position.z = -50;
wallW.position.y = 10;
wallW.castShadow = true;
wallW.receiveShadow = true;
scene.add(wallW);

// Géométrie des murs wall N et S
let wallGeometryZ = new THREE.BoxGeometry(1, 20, 100);

let wallN = new THREE.Mesh(wallGeometryZ, wallMaterial);
wallN.position.x = 100;
wallN.position.y = 10;
wallN.castShadow = true;
wallN.receiveShadow = true;
scene.add(wallN);

let wallS = new THREE.Mesh(wallGeometryZ, wallMaterial);
wallS.position.x = -100;
wallS.position.y = 10;
wallS.castShadow = true;
wallS.receiveShadow = true;
scene.add(wallS);

// ---------- Cloison centrale ----------

let midWallGeom = new THREE.BoxGeometry(1, 20, 40);

// Partie E
let midWallE = new THREE.Mesh(midWallGeom, wallMaterial);
midWallE.position.z = 30;
midWallE.position.y = 10;
midWallE.castShadow = true;
midWallE.receiveShadow = true;
scene.add(midWallE);

// Partie W
let midWallW = new THREE.Mesh(midWallGeom, wallMaterial);
midWallW.position.z = -30;
midWallW.position.y = 10;
midWallW.castShadow = true;
midWallW.receiveShadow = true;
scene.add(midWallW);

// ---------- Verrière ----------

// Géométrie sphérique
let sphereGeometry = new THREE.SphereGeometry(
  80,
  20,
  10,
  0,
  Math.PI * 2,
  0,
  Math.PI / 2
);
sphereGeometry.scale(1.8, 0.5, 1);
sphereGeometry.translate(0, 8, 0);

// Wireframe
let edgesGeom = new THREE.EdgesGeometry(sphereGeometry); // or WireframeGeometry
let wireframeMat = new THREE.LineBasicMaterial({
  color: 0xffffff,
  linewidth: 2,
});
let sphere = new THREE.LineSegments(edgesGeom, wireframeMat);
scene.add(sphere);

const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load(
  "assets/textures/floor.png",
  function (texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 5);
    floorMaterial.map = texture;
    floorMaterial.needsUpdate = true;
  }
);

const benchMaterial = wallMaterial.clone();
const benchGeometry = new THREE.BoxGeometry(20, 3, 5);
const bench = new THREE.Mesh(benchGeometry, benchMaterial);
bench.position.set(-50, 0, 0);
bench.receiveShadow = true;
bench.castShadow = true;
scene.add(bench);

const pedestalGeometry = new THREE.BoxGeometry(8, 2, 8);
const pedestal = new THREE.Mesh(pedestalGeometry, benchMaterial);
pedestal.position.set(50, 0, 0);
pedestal.receiveShadow = true;
pedestal.castShadow = true;
scene.add(pedestal);

let clock = new THREE.Clock();

// Création d'un matériau
let victoireMat = new THREE.MeshLambertMaterial({
  color: 0xdddddd,
});

const colladaLoader = new ColladaLoader();
colladaLoader.load(
  "assets/models/victoire.dae",
  function (collada) {
    let dae = collada.scene.children[0];
    // Application du matériau à l'objet
    dae.material = victoireMat;
    // Transformations
    dae.rotateZ(Math.PI / 2);
    dae.rotateX(Math.PI);
    dae.scale.set(0.8, 0.8, 0.8);
    dae.position.set(50, 0.5, 0);
    // L'objet projette et reçoit des ombres
    dae.castShadow = true;
    dae.receiveShadow = true;

    dae.name = "Statue de la Victoire";
    // Ajout de l'objet à la scène
    scene.add(dae);
    console.log("Loading complete!");
    renderer.render(scene, camera);
  },
  // onProgress callback
  function (xhr) {
    console.log("Loading in progress...");
  },
  // onError callback
  function (err) {
    console.log("An error happened", err);
  }
);

function createPainting(fileName, name) {
  // Création d'un matériau pour le support
  let paintingMat = new THREE.MeshLambertMaterial({
    color: 0xaaaaaa,
  });
  // Création d'une géométrie de type Box pour le support
  let paintingGeom = new THREE.BoxGeometry(10, 10, 0.5);
  // Création d'un matériau pour chaque face de l'objet
  // représentant le support du tableau
  let materials = [
    paintingMat,
    paintingMat,
    paintingMat,
    paintingMat,
    paintingMat,
    paintingMat,
  ];
  // Création de l'objet représentant le support
  let painting = new THREE.Mesh(paintingGeom, materials);
  // Les tableaux projettent et reçoivent des ombres
  painting.castShadow = true;
  painting.receiveShadow = true;
  // Ajout de la peinture à la scène
  scene.add(painting);
  painting.name = name;

  // Chargement d'une image de peinture et placage sur une face
  // (face d'indice 5) de l'objet représentant le support
  new THREE.TextureLoader().load(fileName, function (tex) {
    // Calcul du rapport largeur/hauteur du tableau
    let aspectRatio = tex.image.width / tex.image.height;
    // Mise à jour du matériau pour la face d'indice 5
    materials[5] = new THREE.MeshBasicMaterial({
      map: tex,
    });
    // Mise à l'échelle en fonction du
    // rapport largeur/hauteur
    painting.scale.set(aspectRatio, 1.0, 1.0);
    // Indication que le matériau doit être mis à jour
    painting.material[5].needsUpdate = true;
    // Mise à jour du rendu
    renderer.render(scene, camera);
  });

  return painting;
}

// On place les tableaux sur les murs
const painting1 = createPainting(
  "assets/textures/paintings/steve-johnson-758735-unsplash.jpg",
  "Représentation du Monde"
);
painting1.position.set(-50, 10, 49); // Placer contre le mur Est

const painting2 = createPainting(
  "assets/textures/paintings/steve-johnson-1150048-unsplash.jpg",
  "Un monde imaginaire"
);
painting2.position.set(-50, 10, -49); // Placer contre le mur Ouest
//On le retourn
painting2.rotateY(Math.PI);

function checkCollisions() {
  if (camera.position.x <= -98) camera.position.x = -98;
  if (camera.position.x >= 98) camera.position.x = 98;
  if (camera.position.z <= -48) camera.position.z = -48;
  if (camera.position.z >= 48) camera.position.z = 48;

  // Cloison centrale
  // Si la camera est dans l'axe de l'entrée, alors on check pas pour les murs centraux
  if (
    (camera.position.z <= 10 && camera.position.z >= -10) ||
    camera.position.x <= -1 ||
    camera.position.x >= 1
  )
    return;

  if (camera.position.x >= -1 && camera.position.x < 0) {
    camera.position.x = -1;
    return;
  }
  if (camera.position.x <= 1 && camera.position.x > 0) {
    camera.position.x = 1;
    return;
  }
}

document.addEventListener("contextmenu", function (event) {
  event.preventDefault();
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const intersected = intersects.find((intersect) => intersect.object.name);
    if (intersected) {
      const objectName = intersected.object.name;
      infoBulle(mouse, objectName);
    }
  }
});

function infoBulle(mouse, text) {
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("info-bulle");
  infoDiv.style.top = `${
    (mouse.y * window.innerHeight) / 2 + window.innerHeight / 2
  }px`;
  infoDiv.style.left = `${
    (mouse.x * window.innerWidth) / 2 + window.innerWidth / 2
  }px`;
  infoDiv.textContent = text;
  document.body.appendChild(infoDiv);

  setTimeout(() => {
    document.body.removeChild(infoDiv);
  }, 800);
}

function render() {
  requestAnimationFrame(render);
  let delta = clock.getDelta();
  controls.update(delta);
  checkCollisions();
  renderer.render(scene, camera);
}
render();
