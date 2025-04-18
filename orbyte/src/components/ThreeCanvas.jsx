import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ThreeCanvas() {
  useEffect(() => {
    
// 1️⃣ Crear la escena
const scene = new THREE.Scene();

// 2️⃣ Crear la cámara en perspectiva
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 6);

// Variables para el seguimiento del mouse
const mousePosition = new THREE.Vector2();
const cameraOffset = new THREE.Vector3();
const sensitivity = 0.01; // Ajusta la sensibilidad del movimiento

// Evento para actualizar la posición del mouse
window.addEventListener('mousemove', (event) => {
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 3️⃣ Crear el renderizador y agregarlo al DOM
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4️⃣ Controles de cámara (mouse)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

controls.enableZoom = false;
controls.enableRotate = false;
controls.enablePan = false;


// 5️⃣ Cargar texturas para los planetas
const textureLoader = new THREE.TextureLoader();
const textures = [
    textureLoader.load('/public/planet1.jpg'),
];

// 6️⃣ Crear planetas con texturas y anillos
const planets = [];
const planetData = [
    { position: { x: 0, y: 0, z: 0 }, size: 1.3, textureIndex: 0 }
];

planetData.forEach((data, index) => {
    const geometry = new THREE.SphereGeometry(data.size, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: textures[data.textureIndex] });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(data.position.x, data.position.y, data.position.z);
    planets.push(planet);
    scene.add(planet);

    // Borde brillante
    const outlineMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, // Color del borde
        side: THREE.BackSide,
        transparent: true,
        opacity: 0,
        depthWrite: false
    });
    // Ajuste del tamaño del borde para el planeta 2
    const outlineGeometry = new THREE.SphereGeometry(data.size * (index === 1 ? 1.002 : 1.01), 64, 64);
    const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    planet.add(outline);
    planet.outline = outline; // Guardamos el borde en el planeta
});

// 7️⃣ Agregar luces dinámicas y el Sol
const sunGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 20, 30);
scene.add(sun);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.copy(sun.position);
scene.add(directionalLight);

// 8️⃣ Nebulosa de fondo
const nebulaTexture = textureLoader.load('/public/nebula.jpg');
const nebulaMaterial = new THREE.MeshBasicMaterial({
    map: nebulaTexture,
    side: THREE.BackSide,
    opacity: 0.7,
    transparent: true
});

const nebulaGeometry = new THREE.SphereGeometry(500, 32, 32);
const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
scene.add(nebula);

// 9️⃣ Partículas flotantes de estrellas
const particleGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const positionsParticles = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
    positionsParticles[i * 3] = (Math.random() - 0.5) * 300;
    positionsParticles[i * 3 + 1] = (Math.random() - 0.5) * 300;
    positionsParticles[i * 3 + 2] = (Math.random() - 0.5) * 300;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positionsParticles, 3));
const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// 1️⃣0️⃣ Animación de los planetas y partículas
function animate() {
    composer.render();
    requestAnimationFrame(animate);

    planets.forEach(planet => {
        planet.rotation.y += 0.0005;
    });

    for (let i = 0; i < particlesCount; i++) {
        positionsParticles[i * 3] += (Math.random() - 0.5) * 0.01;
        positionsParticles[i * 3 + 1] += (Math.random() - 0.5) * 0.01;
        positionsParticles[i * 3 + 2] += (Math.random() - 0.5) * 0.01;
    }

    particleGeometry.attributes.position.needsUpdate = true;

    controls.update();

    // Movimiento suave de la cámara siguiendo el mouse
    cameraOffset.x = mousePosition.x * sensitivity;
    cameraOffset.y = mousePosition.y * sensitivity;

    gsap.to(camera.position, {
        x: camera.position.x + cameraOffset.x,
        y: camera.position.y + cameraOffset.y,
        duration: 0.01, // Ajusta la suavidad del movimiento
        overwrite: true // Para evitar animaciones que se superponen
    });
}

// 1️⃣3️⃣ Crear EffectComposer y añadir pases después de inicializar el renderer
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    5,
    0.1,
    0.1
);
composer.addPass(bloomPass);

animate();

window.addEventListener('click', (event) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
        const targetPlanet = intersects[0].object;

        gsap.to(camera.position, {
            x: targetPlanet.position.x,
            y: 2,
            z: 3,
            duration: 1.5,
            ease: "power2.inOut"
        });
    }
});

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Evento para hover de los planetas
window.addEventListener('mousemove', (event) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets);

    planets.forEach(planet => {
        if (intersects.some(intersect => intersect.object === planet)) {
            gsap.to(planet.outline.material, { opacity: 1, duration: 0.3 });
        } else {
            gsap.to(planet.outline.material, { opacity: 0, duration: 0.3 });
        }
    });
});

    


  }, [])

  return null
}
