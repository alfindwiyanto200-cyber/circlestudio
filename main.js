import '@fontsource/playfair-display';
import '@fontsource/caveat';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const container = document.getElementById('canvas-container');
const width = window.innerWidth;
const height = window.innerHeight;

// --- Three.js Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.set(0, 0, 50);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// --- Cannon-es Setup ---
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -30, 0), // Realistic downward gravity
});
world.solver.iterations = 10;

// Materials
const physicsMaterial = new CANNON.Material();
const physicsContactMaterial = new CANNON.ContactMaterial(
    physicsMaterial,
    physicsMaterial,
    {
        friction: 0.3,
        restitution: 0.6 // Bouncy collisions
    }
);
world.addContactMaterial(physicsContactMaterial);

// --- Objects ---
const meshes = [];
const bodies = [];

// Helper function to create objects
function createObject(geometry, material, mass, shape, position) {
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshes.push(mesh);

    const body = new CANNON.Body({
        mass: mass,
        shape: shape,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        material: physicsMaterial,
        linearDamping: 0.1,
        angularDamping: 0.1
    });
    world.addBody(body);
    bodies.push(body);

    return { mesh, body };
}

// Colors
const colYellow = 0xffe81a;
const colGray = 0x888888;
const colWhite = 0xf5f5f5;

// Shared Three.js materials
const matYellow = new THREE.MeshStandardMaterial({ color: colYellow, roughness: 0.2, metalness: 0.2 });
const matGray = new THREE.MeshStandardMaterial({ color: colGray, roughness: 0.3, metalness: 0.1 });
const matWhite = new THREE.MeshStandardMaterial({ color: colWhite, roughness: 0.2, metalness: 0.1 });
const matWire = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

// Pivot (Static Body at the top) - The anchor for the keychain
const pivotBody = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Sphere(0.1),
    position: new CANNON.Vec3(0, 22, 0) // Positioned above the screen
});
world.addBody(pivotBody);

// 1. Central Hub (Wireframe Sphere)
const hubObj = createObject(
    new THREE.SphereGeometry(2.5, 16, 16),
    matWire,
    5,
    new CANNON.Sphere(2.5),
    { x: 0, y: 10, z: 0 }
);

// Connect hub to pivot (The main keychain string)
const constraintPivot = new CANNON.DistanceConstraint(pivotBody, hubObj.body, 12);
world.addConstraint(constraintPivot);

// 2. Yellow Triangle (Tetrahedron)
const triObj = createObject(
    new THREE.TetrahedronGeometry(3),
    matYellow,
    1,
    new CANNON.Sphere(3), // Approximated collision for stability
    { x: -5, y: 5, z: 0 }
);

// 3. Gray Rectangle (Box)
const rectObj = createObject(
    new THREE.BoxGeometry(2.5, 8, 2.5),
    matGray,
    1,
    new CANNON.Box(new CANNON.Vec3(1.25, 4, 1.25)),
    { x: -3, y: 5, z: -2 }
);

// 4. Yellow Circle (Sphere)
const sphereObj = createObject(
    new THREE.SphereGeometry(3, 32, 32),
    matYellow,
    1,
    new CANNON.Sphere(3),
    { x: 5, y: 7, z: 2 }
);

// 5. White Pill (Capsule)
const pillObj = createObject(
    new THREE.CapsuleGeometry(1.5, 4, 16, 16),
    matWhite,
    1,
    new CANNON.Cylinder(1.5, 1.5, 7, 16),
    { x: 7, y: 5, z: -2 }
);

// 6. Cross (Two intersecting boxes)
const crossGeometry = new THREE.BoxGeometry(1, 6, 1);
const crossMesh = new THREE.Mesh(crossGeometry, matGray);
const crossMesh2 = new THREE.Mesh(crossGeometry, matGray);
crossMesh2.rotation.z = Math.PI / 2;
crossMesh.add(crossMesh2); // Child mesh
scene.add(crossMesh);
meshes.push(crossMesh);

const crossBody = new CANNON.Body({ mass: 1, material: physicsMaterial, linearDamping: 0.1, angularDamping: 0.1, position: new CANNON.Vec3(0, 5, 5) });
crossBody.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 3, 0.5)));
crossBody.addShape(new CANNON.Box(new CANNON.Vec3(3, 0.5, 0.5)));
world.addBody(crossBody);
bodies.push(crossBody);

// Link them all to the hub using DistanceConstraints to simulate loose string connections
const createLink = (body1, body2, distance) => {
    const constraint = new CANNON.DistanceConstraint(body1, body2, distance);
    world.addConstraint(constraint);
};

createLink(hubObj.body, triObj.body, 8);
createLink(hubObj.body, rectObj.body, 9);
createLink(hubObj.body, sphereObj.body, 8);
createLink(hubObj.body, pillObj.body, 10);
createLink(hubObj.body, crossBody, 9);

// Add visual lines for the constraints (the keychain strings)
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
const constraintLines = [];

function createVisualLine() {
    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const line = new THREE.Line(geometry, lineMaterial);
    scene.add(line);
    constraintLines.push(line);
    return line;
}

const lines = [
    { bodyA: pivotBody, bodyB: hubObj.body, line: createVisualLine() },
    { bodyA: hubObj.body, bodyB: triObj.body, line: createVisualLine() },
    { bodyA: hubObj.body, bodyB: rectObj.body, line: createVisualLine() },
    { bodyA: hubObj.body, bodyB: sphereObj.body, line: createVisualLine() },
    { bodyA: hubObj.body, bodyB: pillObj.body, line: createVisualLine() },
    { bodyA: hubObj.body, bodyB: crossBody, line: createVisualLine() }
];

// --- Mouse Interaction ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-100, -100);

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.1);
    world.step(1/60, delta, 3);

    // Mouse repel force for interaction
    raycaster.setFromCamera(mouse, camera);
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, target);
    
    // Apply repel force to make it swing
    bodies.forEach(body => {
        // Skip the static pivot body
        if(body.mass === 0) return;

        const dx = body.position.x - target.x;
        const dy = body.position.y - target.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 8) {
            const force = (8 - dist) * 15;
            body.applyForce(new CANNON.Vec3(dx/dist * force, dy/dist * force, -force*0.5), body.position);
        }
    });

    // Sync bodies to meshes
    for (let i = 0; i < meshes.length; i++) {
        meshes[i].position.copy(bodies[i].position);
        meshes[i].quaternion.copy(bodies[i].quaternion);
    }

    // Update visual lines
    lines.forEach(item => {
        const positions = item.line.geometry.attributes.position.array;
        positions[0] = item.bodyA.position.x;
        positions[1] = item.bodyA.position.y;
        positions[2] = item.bodyA.position.z;
        positions[3] = item.bodyB.position.x;
        positions[4] = item.bodyB.position.y;
        positions[5] = item.bodyB.position.z;
        item.line.geometry.attributes.position.needsUpdate = true;
    });

    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Scroll Animation Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        } else {
            entry.target.classList.remove('is-visible');
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll('.animate-on-scroll');
animatedElements.forEach(el => observer.observe(el));

// GSAP ScrollTrigger for Featured Works
const worksSlides = gsap.utils.toArray('.work-slide');
if (worksSlides.length > 1) {
    gsap.set(worksSlides.slice(1), { yPercent: 100 });
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.works-container',
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: true,
            anticipatePin: 1
        }
    });
    tl.to(worksSlides[1], { yPercent: 0, ease: 'none' });
    if (worksSlides.length > 2) {
        tl.to(worksSlides[2], { yPercent: 0, ease: 'none' });
    }
    
    document.querySelector('.work-slide-1 .work-header').addEventListener('click', () => {
        gsap.to(window, {scrollTo: {y: '.works-container'}, duration: 1});
    });
    document.querySelector('.work-slide-2 .work-header').addEventListener('click', () => {
        const st = tl.scrollTrigger;
        gsap.to(window, {scrollTo: {y: st.start + (st.end - st.start) / 2}, duration: 1});
    });
    document.querySelector('.work-slide-3 .work-header').addEventListener('click', () => {
        const st = tl.scrollTrigger;
        gsap.to(window, {scrollTo: {y: st.end}, duration: 1});
    });
}
