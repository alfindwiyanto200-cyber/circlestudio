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
const matYellowTrans = new THREE.MeshPhysicalMaterial({ 
    color: 0xffe81a, metalness: 0.1, roughness: 0.1, 
    transparent: true, opacity: 0.9, transmission: 0.5, thickness: 0.5 
});
const matWhitePlastic = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.4 });
const matYellowPlastic = new THREE.MeshStandardMaterial({ color: 0xffe81a, metalness: 0.1, roughness: 0.4 });

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
const pivotBody = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(0, 8, 0) });
world.addBody(pivotBody);

// Carabiner visuals (static)
const carabinerGroup = new THREE.Group();
const carTop = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.2, 16, 32), matMetal);
carTop.position.y = 5;
const carBodyMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 0.5), matMetal);
carBodyMesh.position.y = 3.5;
carabinerGroup.add(carTop);
carabinerGroup.add(carBodyMesh);
scene.add(carabinerGroup);

// --- 2. Main Keyring ---
const ringRadius = 2.5;
const ringTube = 0.15;
const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(ringRadius, ringTube, 16, 64), matMetal);
// Ring collision uses a thin cylinder or sphere approximation
const ringBody = addPhysObj(ringMesh, 2, new CANNON.Sphere(ringRadius), {x:0, y:1, z:0}, new CANNON.Vec3(0,0,0), true);

// Hinge ring to pivot
const ringConstraint = new CANNON.PointToPointConstraint(
    pivotBody, new CANNON.Vec3(0, -4.5, 0),
    ringBody, new CANNON.Vec3(0, ringRadius, 0)
);
world.addConstraint(ringConstraint);

// Helper to create tags
function createTag(mesh, shape, attachOffset, mass=1) {
    // spawn slightly randomly so they explode naturally
    const pos = { x: (Math.random()-0.5)*2, y: -2 + Math.random()*2, z: (Math.random()-0.5)*2 };
    const body = addPhysObj(mesh, mass, shape, pos);
    
    // Tiny metal ring attaching tag to main ring
    const tinyRing = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.05, 8, 16), matMetal);
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

// --- 3. Yellow Triangle (motion) ---
const triGeom = new THREE.CylinderGeometry(3.5, 3.5, 0.3, 3);
triGeom.rotateX(Math.PI/2);
triGeom.rotateZ(Math.PI);
const texTri = createTextTexture("motion\n01", "#ffe81a", "#ffffff", 512, 512, 70, 0, true);
const matTriArray = [matYellowTrans, matYellowTrans, new THREE.MeshStandardMaterial({map: texTri, transparent:true, opacity:0.9})];
const triMesh = new THREE.Mesh(triGeom, matTriArray);
createTag(triMesh, new CANNON.Box(new CANNON.Vec3(2.5, 2.5, 0.2)), new THREE.Vector3(0, 2.5, 0));

// --- 4. White Pill (02) ---
function createPillGeom(w, h, r) {
    const s = new THREE.Shape();
    s.moveTo(-w, h-r); s.quadraticCurveTo(-w, h, -w+r, h);
    s.lineTo(w-r, h); s.quadraticCurveTo(w, h, w, h-r);
    s.lineTo(w, -h+r); s.quadraticCurveTo(w, -h, w-r, -h);
    s.lineTo(-w+r, -h); s.quadraticCurveTo(-w, -h, -w, -h+r);
    return new THREE.ExtrudeGeometry(s, { depth: 0.3, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 });
}
const pillGeom = createPillGeom(1.5, 3.5, 1.5);
const texPill = createTextTexture("02", "#ffffff", "#000000", 256, 512, 100);
const pillMesh = new THREE.Mesh(pillGeom, new THREE.MeshStandardMaterial({map: texPill, color: 0xffffff, roughness: 0.3}));
createTag(pillMesh, new CANNON.Box(new CANNON.Vec3(1.5, 3.5, 0.2)), new THREE.Vector3(0, 3.5, 0));

// --- 5. Editorial 03 (Rect) ---
const edGeom = new THREE.BoxGeometry(2, 7, 0.4);
const texEd = createTextTexture("Editorial 03", "#ffffff", "#a0a0a0", 256, 1024, 80, -90);
const edMesh = new THREE.Mesh(edGeom, new THREE.MeshStandardMaterial({map: texEd}));
createTag(edMesh, new CANNON.Box(new CANNON.Vec3(1, 3.5, 0.2)), new THREE.Vector3(0, 3.5, 0));

// --- 6. Photo (Rect) ---
const phGeom = new THREE.BoxGeometry(2.2, 6, 0.4);
const texPh = createTextTexture("Photo", "#ffffff", "#a0a0a0", 256, 1024, 100, -90);
const phMesh = new THREE.Mesh(phGeom, new THREE.MeshStandardMaterial({map: texPh}));
createTag(phMesh, new CANNON.Box(new CANNON.Vec3(1.1, 3, 0.2)), new THREE.Vector3(0, 3, 0));

// --- 7. Yellow Blob/Cat ---
// Approximated by a bumpy circle
const blobGeom = new THREE.CylinderGeometry(2.5, 2.5, 0.4, 32);
blobGeom.rotateX(Math.PI/2);
const texBlob = createTextTexture("^__^", "#ffe81a", "#d4b300", 512, 512, 100);
const blobMesh = new THREE.Mesh(blobGeom, new THREE.MeshStandardMaterial({map: texBlob, color: 0xffe81a}));
createTag(blobMesh, new CANNON.Cylinder(2.5, 2.5, 0.4, 16), new THREE.Vector3(0, 2.2, 0));

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
