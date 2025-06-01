// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("three-container").appendChild(renderer.domElement);

// Background (Stars)
scene.background = new THREE.Color(0x000000);
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.9
});
const starCount = 10000;
const positions = [];
for (let i = 0; i < starCount; i++) {
    positions.push((Math.random() - 0.5) * 2000);
    positions.push((Math.random() - 0.5) * 2000);
    positions.push((Math.random() - 0.5) * 2000);
}
starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Milky Way
const milkyWayGeometry = new THREE.BufferGeometry();
const milkyWayMaterial = new THREE.PointsMaterial({
    color: 0x888888,
    size: 0.9
});
const milkyWayCount = 5000;
const milkyWayPositions = [];
for (let i = 0; i < milkyWayCount; i++) {
    milkyWayPositions.push((Math.random() - 0.5) * 1000);
    milkyWayPositions.push((Math.random() - 0.5) * 1000);
    milkyWayPositions.push((Math.random() - 0.5) * 1000);
}
milkyWayGeometry.setAttribute("position", new THREE.Float32BufferAttribute(milkyWayPositions, 3));
const milkyWay = new THREE.Points(milkyWayGeometry, milkyWayMaterial);
scene.add(milkyWay);

// Camera Positioning and Animation
camera.position.z = 500;
gsap.to(camera.position, {
    z: 10,
    duration: 20,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut"
});

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0001;
    renderer.render(scene, camera);
}
animate();

// Title and Subtitle Animations
gsap.from("#title", {
    duration: 3.5,
    opacity: 0,
    scaleX: 0.5,
    ease: "back.out(1.7)",
    transformOrigin: "center",
    delay: 0.5
});
gsap.from("#subtitle", {
    duration: 2.5,
    opacity: 0,
    y: 50, // This animates the vertical movement
    ease: "bounce.out",
    delay: 1,
    onComplete: () => {
        // Ensuring that opacity is set to 1 after the animation completes
        document.querySelector("#subtitle").style.opacity = 1;

        // If transform values are modified in CSS, reset them after animation
        document.querySelector("#subtitle").style.transform = "translate(0px, 0px)";
    }
});

gsap.from("#downloadresume", {
    duration: 3,
    opacity: 0,
    y: 50,
    ease: "bounce.out",
    delay: 2
});
 


// Sun Setup
const sun = document.createElement("img");
sun.src = "assets/3D/sun.png";
sun.classList.add("planet");
sun.style.width = "200px";
sun.style.height = "200px";
sun.style.position = "absolute";
sun.style.left = "50%";
sun.style.top = "50%";
sun.style.transformOrigin = "center";
sun.style.transform = "translate(-50%, -50%)";
sun.style.filter = "drop-shadow(0 1px 20px rgba(255, 255, 0, 0.7))";
document.body.appendChild(sun);

// Planet Definitions
const planets = [
    {
        id: "earth",
        size: 100,
        image: "assets/3D/Earth.png",
        distance: 300,
        speed: 0.003,
        rotationSpeed: 6,
        orbitElement: null
    },
    {
        id: "venus",
        size: 90,
        image: "assets/3D/venus.png",
        distance: 200,
        speed: 0.003,
        rotationSpeed: 6,
        orbitElement: null
    },
    {
        id: "Mercury",
        size: 60,
        image: "assets/3D/mercury.png",
        distance: 135,
        speed: 0.003,
        rotationSpeed: 6,
        orbitElement: null
    }
];

// Create Planet Elements
planets.forEach((planet) => {
    planet.orbitElement = document.createElement("img");
    planet.orbitElement.src = planet.image;
    planet.orbitElement.classList.add("planet");
    planet.orbitElement.style.width = `${planet.size}px`;
    planet.orbitElement.style.height = `${planet.size}px`;
    planet.orbitElement.style.position = "absolute";
    planet.orbitElement.style.transformOrigin = "center";
    planet.orbitElement.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(planet.orbitElement);
});

// Sun Rotation
gsap.to(sun, {
    rotation: 360,
    repeat: -1,
    duration: 120,
    ease: "linear"
});

// Planet Animation Function
function animatePlanet(planet) {
    let angle = 0;
    const orbitRadius = planet.distance;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    gsap.to(planet.orbitElement, {
        rotation: 360,
        repeat: -1,
        duration: 60 / planet.rotationSpeed,
        ease: "linear"
    });

    gsap.to(planet.orbitElement, {
        x: `${centerX + orbitRadius * Math.cos(angle)}px`,
        y: `${centerY + orbitRadius * Math.sin(angle)}px`,
        repeat: -1,
        duration: 60 / planet.speed,
        ease: "linear",
        onUpdate: function () {
            const newX = centerX + orbitRadius * Math.cos(angle);
            const newY = centerY + orbitRadius * Math.sin(angle);
            const maxX = window.innerWidth - planet.size / 2;
            const maxY = window.innerHeight - planet.size / 2;
            const minX = planet.size / 2;
            const minY = planet.size / 2;

            planet.orbitElement.style.left = `${Math.min(Math.max(newX, minX), maxX)}px`;
            planet.orbitElement.style.top = `${Math.min(Math.max(newY, minY), maxY)}px`;
            angle += planet.speed;
        }
    });
}
planets.forEach((planet) => animatePlanet(planet));

// Typing Animation Setup
const textElement = document.getElementById("gsap-text");
const fullText = "Thulasi Raman S";
let currentText = "";
const totalLength = fullText.length;
let typingInterval;

const randomIncorrectLetter = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return chars[Math.floor(Math.random() * chars.length)];
};

function startTypingAnimation() {
    currentText = "";
    let i = 0;

    typingInterval = setInterval(() => {
        if (i < totalLength) {
            let char = randomIncorrectLetter();
            currentText += char;
            textElement.innerText = currentText;
            i++;
        } else {
            clearInterval(typingInterval);
            startCorrectingAnimation();
        }
    }, 200);
}

function startCorrectingAnimation() {
    let i = 0;
    const correctingInterval = setInterval(() => {
        if (i < totalLength) {
            let correctedText = currentText.slice(0, i) + fullText[i] + currentText.slice(i + 1);
            textElement.innerText = correctedText;
            currentText = correctedText;
            i++;
        } else {
            clearInterval(correctingInterval);
            addShineEffect();
        }
    }, 100);
}

function addShineEffect() {
    textElement.classList.add("shine-effect");
    setTimeout(() => {
        textElement.classList.remove("shine-effect");
    }, 2000);
}

setInterval(() => {
    startTypingAnimation();
}, 20000);
startTypingAnimation();

// Mobile Menu Handling
const menuButton = document.getElementById("menuButton");
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");
const sideNav = document.getElementById("sideNav");
const sideNavLinks = document.querySelectorAll(".side-nav-link");

menuButton.addEventListener("click", () => {
    if (sideNav.style.width === "0px" || sideNav.style.width === "") {
        gsap.to(sideNav, {
            width: "250px",
            duration: 0.7,
            onComplete: () => {
                gsap.fromTo(
                    sideNavLinks,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, stagger: 0.1, duration: 0.7 }
                );
            }
        });
        openMenu.classList.add("hidden");
        closeMenu.classList.remove("hidden");
    } else {
        gsap.to(sideNav, { width: "0px", duration: 0.3 });
        gsap.to(sideNavLinks, { opacity: 0, x: -20, stagger: 0.1, duration: 0.2 });
        openMenu.classList.remove("hidden");
        closeMenu.classList.add("hidden");
    }
});

sideNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
        gsap.to(sideNav, { width: "0px", duration: 0.3 });
        gsap.to(sideNavLinks, { opacity: 0, x: -20, stagger: 0.1, duration: 0.2 });
        openMenu.classList.remove("hidden");
        closeMenu.classList.add("hidden");
    });
});

document.addEventListener("click", (event) => {
    if (!sideNav.contains(event.target) && !menuButton.contains(event.target)) {
        gsap.to(sideNav, { width: "0px", duration: 0.3 });
        gsap.to(sideNavLinks, { opacity: 0, x: -20, stagger: 0.1, duration: 0.2 });
        openMenu.classList.remove("hidden");
        closeMenu.classList.add("hidden");
    }
});

sideNav.addEventListener("click", (event) => {
    event.stopPropagation();
});

// About Section
const satellite = document.getElementById("satellite");
gsap.to(satellite, {
    rotation: 360,
    repeat: -1,
    duration: 60,
    ease: "linear"
});
gsap.registerPlugin(Draggable);
Draggable.create("#satellite", { inertia: true });

// About Content
const aboutText1 = `I am a passionate frontend and full-stack developer with expertise in MERN stack and Django. My focus is on building interactive, user-friendly web applications that provide seamless digital experiences. With a background in Computer Science and Engineering, I have developed a strong foundation in web development, software architecture, and scalable applications. I believe in writing well-structured, efficient, and maintainable code that ensures both functionality and performance.`;
const aboutText2 = `My technical skill set includes JavaScript, React, Node.js, Express, MongoDB, and Python, along with Django and Django REST Framework for backend development. I have experience in handling APIs, database management, authentication systems, and optimizing web performance. My approach to coding revolves around clean, reusable code and best industry practices, ensuring smooth development for both individual projects and team collaborations.`;
const aboutText3 = `Beyond development, I have a strong eye for UI/UX design, editing, and creating engaging digital experiences. I focus on crafting applications that not only function efficiently but also offer an intuitive and aesthetically pleasing user experience. By combining my design and development skills, I ensure that my applications are visually compelling while maintaining high performance.`;
const aboutText4 = `I am driven by a passion for problem-solving and technological innovation. Whether it's building dynamic web applications, automating workflows, or enhancing user interactions, I constantly seek ways to improve and optimize. I am always eager to learn, experiment, and collaborate on projects that challenge my skills and push me to grow as a developer.`;

// ScrollTrigger for About Section
gsap.registerPlugin(ScrollTrigger);

function animateText(elementId, text, delay = 0) {
    const element = document.getElementById(elementId);
    element.textContent = "";
    const duration = text.length * 0.05;
    gsap.fromTo(
        element,
        { textContent: "" },
        {
            textContent: text,
            duration: duration,
            delay: delay,
            ease: "none",
            stagger: 0.1,
            onUpdate: function () {
                element.innerText = text.substring(0, Math.ceil(this.progress() * text.length));
            }
        }
    );
}

function fadeInText(elementId, text, delay = 0) {
    const element = document.getElementById(elementId);
    element.textContent = text;
    gsap.fromTo(
        element,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, delay: delay, ease: "power1.inOut" }
    );
}

function isMobile() {
    return window.innerWidth <= 768;
}

ScrollTrigger.create({
    trigger: "#about",
    start: "top center",
    onEnter: () => {
        if (isMobile()) {
            fadeInText("about-text", aboutText1, 0);
            fadeInText("about-text2", aboutText2, 1.5);
        } else {
            animateText("about-text", aboutText1, 0);
            animateText("about-text2", aboutText2, 15);
            animateText("about-text3", aboutText3, 30);
            animateText("about-text4", aboutText4, 45);
        }
    }
});

// Skill Section
const meters = document.querySelectorAll('.meter-fill');

function animateMeter(meter, percentage) {
    let angle = (percentage / 100) * 360;
    gsap.to(meter, { rotation: angle, duration: 2, ease: 'power3.inOut' });
}

gsap.utils.toArray('.skill-container').forEach((container, index) => {
    gsap.fromTo(
        container,
        { opacity: 0, y: 100 },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.5,
            scrollTrigger: {
                trigger: container,
                start: "top bottom",
                end: "top 80%",
                scrub: true
            }
        }
    );
});

gsap.utils.toArray('.skill-item').forEach((skillItem, index) => {
    gsap.from(skillItem, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: index * 0.1,
        scrollTrigger: {
            trigger: skillItem,
            start: "top 80%",
            end: "bottom 30%",
            scrub: true
        }
    });
});

// Project Cards Animation
gsap.utils.toArray(".project-card").forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 20%",
            scrub: true
        },
        opacity: 0,
        y: 100,
        duration: 1
    });
});
