import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import starsTexture from '../img/stars.jpg'
import sunTexture from '../img/sun.jpg'
import earthTexture from '../img/earth.jpg'
import mercuryTexture from '../img/mercury.jpg'
import venusTexture from '../img/venus.jpg'
import marsTexture from '../img/mars.jpg'
import jupiterTexture from '../img/jupiter.jpg'
import saturnTexture from '../img/saturn.jpg'
import saturnRingTexture from '../img/saturn ring.png'
import uranusTexture from '../img/uranus.jpg'
import uranusRingTexture from '../img/uranus ring.png'
import neptuneTexture from '../img/neptune.jpg'
import plutoTexture from '../img/pluto.jpg'
import { TextureLoader } from 'three';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0xFEFEFE);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(6, 8, 100);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load(
    [
        starsTexture,
        starsTexture,
        starsTexture,
        starsTexture,
        starsTexture,
        starsTexture
    ]
)

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16,30,30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});

const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

function createPlanet(size, texture, position, ring)
{
    const geo = new THREE.SphereGeometry(size,30,30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const planet = new THREE.Mesh(geo, mat);
    
    const planetObj = new THREE.Object3D(); 
    planetObj.add(planet);
    planet.position.x = position;
    scene.add(planetObj);
    if (ring)
    {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius,ring.outerRadius,32)
        const ringMat = new THREE.MeshStandardMaterial(
            {
                map: textureLoader.load(ring.texture),
                side: THREE.DoubleSide
            }
        )
        
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = -0.5 * Math.PI;
        ringMesh.position.x = position;
        planetObj.add(ringMesh);
    }
    return {planet, planetObj};
}

const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6,earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100)
const saturn = createPlanet(10, saturnTexture, 128, {
    texture: saturnRingTexture,
    innerRadius: 10,
    outerRadius: 20
});
const uranus = createPlanet(7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 20,
    texture: uranusRingTexture
});

const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

function animate() {
    sun.rotateY(0.004);
    mercury.planetObj.rotateY(0.004);
    mercury.planet.rotateY(0.004);
    venus.planetObj.rotateY(0.0015);
    venus.planet.rotateY(0.002);
    earth.planetObj.rotateY(0.001);
    earth.planet.rotateY(0.007);
    mars.planetObj.rotateY(0.008);
    mars.planet.rotateY(0.0047);
    jupiter.planetObj.rotateY(0.002);
    jupiter.planet.rotateY(0.0005);
    saturn.planetObj.rotateY(0.0009);
    saturn.planet.rotateY(0.004);
    uranus.planetObj.rotateY(0.0004);
    uranus.planet.rotateY(0.002);
    neptune.planetObj.rotateY(0.0001);
    neptune.planet.rotateY(0.004);
    pluto.planetObj.rotateY(0.00007);
    pluto.planet.rotateY(0.008);
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});