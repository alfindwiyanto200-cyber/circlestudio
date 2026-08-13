import '@fontsource/playfair-display';
import '@fontsource/caveat';
import './style.css'
import Matter from 'matter-js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// module aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Constraint = Matter.Constraint,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

// create an engine
const engine = Engine.create();

// create a renderer
const container = document.getElementById('canvas-container');
const render = Render.create({
    element: container,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'transparent',
        wireframes: false
    }
});

const width = window.innerWidth;
const height = window.innerHeight;

// Create common properties
const commonOptions = {
    restitution: 0.2, // Lower bounciness
    friction: 0.1,
    frictionAir: 0.02,
    density: 0.04
};

const cx = width / 2;
const cy = height / 2;

// Central wireframe circle
const hub = Bodies.circle(cx, cy, 30, {
    ...commonOptions,
    render: { fillStyle: 'transparent', strokeStyle: '#ffffff', lineWidth: 2 }
});

// Yellow triangle
const triangle = Bodies.polygon(cx - 80, cy - 50, 3, 50, {
    ...commonOptions,
    render: { fillStyle: '#ffe81a' }
});

// Gray rectangle
const rect = Bodies.rectangle(cx - 30, cy - 80, 40, 120, {
    ...commonOptions,
    render: { fillStyle: '#888888' } // semi-dark gray
});

// Yellow circle
const yellowCircle = Bodies.circle(cx + 80, cy + 20, 45, {
    ...commonOptions,
    render: { fillStyle: '#ffe81a' }
});

// White pill shape
const pill = Bodies.rectangle(cx + 120, cy + 30, 100, 40, {
    ...commonOptions,
    chamfer: { radius: 20 },
    render: { fillStyle: '#f5f5f5' }
});

// Cross/X shape (thin lines)
const line1 = Bodies.rectangle(cx, cy + 80, 4, 80, { render: { fillStyle: '#888888' } });
const line2 = Bodies.rectangle(cx, cy + 80, 80, 4, { render: { fillStyle: '#888888' } });
const cross = Body.create({ parts: [line1, line2], ...commonOptions });
Body.setAngle(cross, Math.PI / 4); // Rotate 45 degrees to make X

// Add constraints (the white lines in the image) connecting everything to the hub
const createLink = (bodyA, bodyB) => {
    return Constraint.create({
        bodyA: bodyA,
        bodyB: bodyB,
        stiffness: 0.4,
        length: 100,
        render: { strokeStyle: '#888888', lineWidth: 1 }
    });
};

const link1 = createLink(hub, triangle);
const link2 = createLink(hub, rect);
const link3 = createLink(hub, yellowCircle);
const link4 = createLink(hub, pill);
const link5 = createLink(hub, cross);

// Add everything to the world
const shapes = [hub, triangle, rect, yellowCircle, pill, cross];
World.add(engine.world, [
    ...shapes,
    link1, link2, link3, link4, link5
]);

// Mouse interaction setup
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: { visible: false }
    }
});
World.add(engine.world, mouseConstraint);
render.mouse = mouse;

// Continuous update loop for custom forces
Events.on(engine, 'beforeUpdate', function() {
    // 1. Attract the hub back to the center so the cluster doesn't drift away
    const dxCenter = cx - hub.position.x;
    const dyCenter = cy - hub.position.y;
    Body.applyForce(hub, hub.position, {
        x: dxCenter * 0.0001,
        y: dyCenter * 0.0001
    });
    
    // 2. Mouse repel force
    if (mouse.position.x && mouse.position.y) {
        shapes.forEach((body) => {
            const dx = body.position.x - mouse.position.x;
            const dy = body.position.y - mouse.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) { // Interaction radius
                const forceMagnitude = 0.0005 * (200 - distance);
                Body.applyForce(body, body.position, {
                    x: (dx / distance) * forceMagnitude,
                    y: (dy / distance) * forceMagnitude
                });
            }
        });
    }
});

// run the renderer
Render.run(render);

// create runner
const runner = Runner.create();
Runner.run(runner, engine);

// Handle window resize
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
});

// Scroll Animation Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2 // Trigger when 20% of the element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Optional: unobserve if we only want it to animate once
            // observer.unobserve(entry.target);
        } else {
            // Remove class when out of view so it animates again when scrolling back
            entry.target.classList.remove('is-visible');
        }
    });
}, observerOptions);

// Select all elements to animate
const animatedElements = document.querySelectorAll('.animate-on-scroll');
animatedElements.forEach(el => observer.observe(el));

// GSAP ScrollTrigger for Featured Works
const worksSlides = gsap.utils.toArray('.work-slide');

// Set initial position of slide 2 and 3 to be fully below
if (worksSlides.length > 1) {
    gsap.set(worksSlides.slice(1), { yPercent: 100 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.works-container',
            start: 'top top',
            end: '+=100%', // Shorter scroll distance for easier scrolling
            pin: true,
            scrub: true, // true (instead of 1) makes it instantly responsive to trackpad/scroll without lag
            anticipatePin: 1
        }
    });

    // Animate slide 2 up
    tl.to(worksSlides[1], { yPercent: 0, ease: 'none' });
    // Animate slide 3 up
    if (worksSlides.length > 2) {
        tl.to(worksSlides[2], { yPercent: 0, ease: 'none' });
    }

    // Add click to scroll functionality to the tabs
    // Note: ScrollTo offset calculation based on timeline progress
    document.querySelector('.work-slide-1 .work-header').addEventListener('click', () => {
        gsap.to(window, {scrollTo: {y: '.works-container'}, duration: 1});
    });
    
    document.querySelector('.work-slide-2 .work-header').addEventListener('click', () => {
        // Scroll to middle of the pin duration
        const st = tl.scrollTrigger;
        gsap.to(window, {scrollTo: {y: st.start + (st.end - st.start) / 2}, duration: 1});
    });
    
    document.querySelector('.work-slide-3 .work-header').addEventListener('click', () => {
        // Scroll to end of the pin duration
        const st = tl.scrollTrigger;
        gsap.to(window, {scrollTo: {y: st.end}, duration: 1});
    });
}
