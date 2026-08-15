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
camera.position.set(0, 0, 30);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(10, 20, 20);
scene.add(dirLight);

// --- Cannon-es Setup ---
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -40, 0),
});
world.solver.iterations = 20;

const physicsMaterial = new CANNON.Material();
const physicsContactMaterial = new CANNON.ContactMaterial(
    physicsMaterial,
    physicsMaterial,
    { friction: 0.1, restitution: 0.2 }
);
world.addContactMaterial(physicsContactMaterial);

const meshes = [];
const bodies = [];

// --- Procedural Texture Helper ---
function createTextTexture(text, bgColor, textColor, w=512, h=512, fontSize=80, rotation=0, bold=true) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
    
    ctx.translate(w/2, h/2);
    ctx.rotate(rotation * Math.PI / 180);
    
    ctx.font = `${bold ? 'bold' : 'normal'} ${fontSize}px "JetBrains Mono", sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Support multiline
    const lines = text.split('\n');
    lines.forEach((line, i) => {
        ctx.fillText(line, 0, (i - (lines.length-1)/2) * fontSize * 1.2);
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
}

// --- Materials ---
const matMetal = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
const matOrangeMetal = new THREE.MeshStandardMaterial({ color: 0xff6600, metalness: 0.6, roughness: 0.2 });
const matOrangeTrans = new THREE.MeshPhysicalMaterial({ 
    color: 0xff8800, metalness: 0.1, roughness: 0.1, 
    transparent: true, opacity: 0.9, transmission: 0.8, thickness: 0.5 
});

// Helper to create physics object
function addPhysObj(mesh, mass, shape, pos, offset = new CANNON.Vec3(0,0,0), isRing = false) {
    scene.add(mesh);
    meshes.push({ mesh, offset });

    const body = new CANNON.Body({
        mass: mass,
        shape: shape,
        position: new CANNON.Vec3(pos.x, pos.y, pos.z),
        material: physicsMaterial,
        linearDamping: 0.4,
        angularDamping: 0.4,
        // Tags collide with tags (group 1). Ring is group 2.
        collisionFilterGroup: isRing ? 2 : 1,
        collisionFilterMask: isRing ? 0 : 1
    });
    world.addBody(body);
    bodies.push(body);
    return body;
}

// --- 1. Top Pivot & Carabiner ---
// Static invisible pivot
const pivotBody = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(0, 11, 0) });
world.addBody(pivotBody);

// Carabiner visuals (static) - Using Orange Metal
const carabinerGroup = new THREE.Group();
const carTop = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.2, 16, 32), matOrangeMetal);
carTop.position.y = 8;
const carBodyMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 0.5), matOrangeMetal);
carBodyMesh.position.y = 6.5;
carabinerGroup.add(carTop);
carabinerGroup.add(carBodyMesh);
scene.add(carabinerGroup);

// --- 2. Main Keyring ---
const ringRadius = 2.5;
const ringTube = 0.15;
const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(ringRadius, ringTube, 16, 64), matOrangeMetal);
// Ring collision uses a thin cylinder or sphere approximation
const ringBody = addPhysObj(ringMesh, 2, new CANNON.Sphere(ringRadius), {x:0, y:4, z:0}, new CANNON.Vec3(0,0,0), true);

// Hinge ring to pivot
const ringConstraint = new CANNON.PointToPointConstraint(
    pivotBody, new CANNON.Vec3(0, -4.5, 0),
    ringBody, new CANNON.Vec3(0, ringRadius, 0)
);
world.addConstraint(ringConstraint);

// Helper to create tags
function createTag(mesh, shape, attachOffset, mass=1) {
    // spawn slightly randomly so they explode naturally
    const pos = { x: (Math.random()-0.5)*2, y: 1 + Math.random()*2, z: (Math.random()-0.5)*2 };
    const body = addPhysObj(mesh, mass, shape, pos);
    
    // Tiny metal ring attaching tag to main ring
    const tinyRing = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.05, 8, 16), matOrangeMetal);
    mesh.add(tinyRing);
    tinyRing.position.copy(attachOffset);
    tinyRing.position.y += 0.4;
    
    // Connect top of tag to bottom of main ring
    const c = new CANNON.PointToPointConstraint(
        ringBody, new CANNON.Vec3((Math.random()-0.5), -ringRadius, (Math.random()-0.5)),
        body, new CANNON.Vec3(attachOffset.x, attachOffset.y + 0.4, attachOffset.z)
    );
    world.addConstraint(c);
    return body;
}

// --- 3. The Orange 'C' Tags ---
function createOrangeCTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, 512, 512);
    
    // Outer ring
    ctx.strokeStyle = '#ff6600';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(256, 256, 170, 0, Math.PI * 2);
    ctx.stroke();

    // The 'C'
    ctx.fillStyle = '#ff6600';
    ctx.font = 'bold 300px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('C', 256, 280);

    return new THREE.CanvasTexture(canvas);
}

const texOrangeC = createOrangeCTexture();

// Create 3 identical orange C tags
for(let i = 0; i < 3; i++) {
    const cMatFace = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, // White base so the canvas texture colors pop
        map: texOrangeC,
        transparent: true,
        transmission: 0.8,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.1
    });
    const cMatEdge = new THREE.MeshPhysicalMaterial({
        color: 0xff6600,
        transparent: true,
        transmission: 0.8,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1
    });

    const cGeom = new THREE.CylinderGeometry(2.5, 2.5, 0.2, 64);
    const cMesh = new THREE.Mesh(cGeom, [cMatEdge, cMatFace, cMatFace]);
    cMesh.rotateX(Math.PI/2);
    
    // The physics shape is a Cylinder, wait Cannon's Cylinder goes along Y axis, 
    // so we need a Cylinder physics shape but maybe a Box is easier and perfectly fine
    createTag(cMesh, new CANNON.Box(new CANNON.Vec3(2.5, 2.5, 0.1)), new THREE.Vector3(0, 2.5, 0));
}

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

    // Mouse repel force
    raycaster.setFromCamera(mouse, camera);
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, target);
    
    bodies.forEach(body => {
        if(body.mass === 0) return;
        const dx = body.position.x - target.x;
        const dy = body.position.y - target.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 8) {
            const force = (8 - dist) * 12; // Swings tags naturally
            body.applyForce(new CANNON.Vec3(dx/dist * force, dy/dist * force, -force*0.2), body.position);
        }
    });

    // Sync bodies to meshes
    for (let i = 0; i < meshes.length; i++) {
        const item = meshes[i];
        
        item.mesh.position.copy(bodies[i].position);
        item.mesh.quaternion.copy(bodies[i].quaternion);
    }

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
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
        else entry.target.classList.remove('is-visible');
    });
}, observerOptions);
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

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
    if (worksSlides.length > 2) tl.to(worksSlides[2], { yPercent: 0, ease: 'none' });
    
    document.querySelector('.work-slide-1 .work-header').addEventListener('click', () => gsap.to(window, {scrollTo: {y: '.works-container'}, duration: 1}));
    document.querySelector('.work-slide-2 .work-header').addEventListener('click', () => gsap.to(window, {scrollTo: {y: tl.scrollTrigger.start + (tl.scrollTrigger.end - tl.scrollTrigger.start) / 2}, duration: 1}));
    document.querySelector('.work-slide-3 .work-header').addEventListener('click', () => gsap.to(window, {scrollTo: {y: tl.scrollTrigger.end}, duration: 1}));
}
