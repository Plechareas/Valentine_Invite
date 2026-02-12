const envelopeView = document.getElementById("envelopeView");
const letterView = document.getElementById("letterView");
const yesView = document.getElementById("yesView");

const envelope = document.querySelector(".envelope");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const resetBtn = document.getElementById("resetBtn");
const noLine = document.getElementById("noLine");

const choices = document.getElementById("choices");
const bgMusic = document.getElementById("bgMusic");

const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

const funnyNoLines = [
    "No. I dont think that is the correct answer.",
    "Try again. Your finger slipped.",
    "That button is for decoration.",
    "I respect your choice. But I will ask again.",
    "I will pretend I did not see that.",
    "Error 418. You are a Valentine.",
    "Ok. One more time. Carefully.",
    "Nice try. The only valid option is Yes."
];

let noCount = 0;

// -------------------- Envelope -> Letter --------------------
function showLetter() {
    envelope.classList.add("is-open");
    setTimeout(() => {
        envelopeView.classList.remove("is-active");
        letterView.classList.add("is-active");
        noLine.textContent = "";
    }, 450);
}

// -------------------- NO button --------------------
function onNo() {
    const line = funnyNoLines[noCount % funnyNoLines.length];
    noLine.textContent = line;

    noBtn.animate(
        [
            { transform: "translateX(0)" },
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(0)" }
        ],
        { duration: 240, easing: "ease-out" }
    );

    noCount += 1;
}

// -------------------- YES button --------------------
async function onYes() {
    noLine.textContent = "";

    // Remove the Yes/No options
    choices.classList.add("is-hidden");

    // Show only the gif area
    yesView.classList.add("is-active");
    yesView.scrollIntoView({ behavior: "smooth", block: "start" });

    // Start confetti
    startConfetti(2200);

    // Start music (works because user clicked)
    try {
        bgMusic.currentTime = 0;
        bgMusic.volume = 0.75;
        await bgMusic.play();
    } catch (e) {
        // Autoplay still might fail on some devices.
        // If it fails, show a short hint inside the yes card.
        const hint = document.createElement("p");
        hint.textContent = "Tap the screen once to start the music.";
        hint.style.marginTop = "10px";
        hint.style.color = "rgba(255,255,255,.8)";
        document.querySelector(".yes-card").appendChild(hint);

        // Try again on next user interaction
        const once = async () => {
            try { await bgMusic.play(); } catch (_) { }
            window.removeEventListener("pointerdown", once);
        };
        window.addEventListener("pointerdown", once);
    }
}

// -------------------- Reset --------------------
function resetAll() {
    noCount = 0;
    noLine.textContent = "";

    yesView.classList.remove("is-active");
    choices.classList.remove("is-hidden");

    letterView.classList.remove("is-active");
    envelopeView.classList.add("is-active");

    envelope.classList.remove("is-open");

    // stop music
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }

    stopConfetti();
}

// -------------------- Confetti (no library) --------------------
let confettiRAF = null;
let confettiPieces = [];
let confettiEndAt = 0;

function resizeCanvas() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    confettiCanvas.width = Math.floor(window.innerWidth * dpr);
    confettiCanvas.height = Math.floor(window.innerHeight * dpr);
    confettiCanvas.style.width = window.innerWidth + "px";
    confettiCanvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawnConfetti(count = 140) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const shapes = ["rect", "circle"];
    const colors = ["#ff4d88", "#ff7aa8", "#ffffff", "#ffd1e1", "#ffb3c7"];

    confettiPieces = Array.from({ length: count }, () => {
        const size = 6 + Math.random() * 8;
        return {
            x: Math.random() * w,
            y: -20 - Math.random() * h * 0.3,
            vx: -2 + Math.random() * 4,
            vy: 2 + Math.random() * 4,
            rot: Math.random() * Math.PI,
            vr: -0.12 + Math.random() * 0.24,
            size,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 0.9
        };
    });
}

function drawConfetti() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    for (const p of confettiPieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.vy += 0.03; // gravity

        // wrap a bit
        if (p.x < -40) p.x = w + 40;
        if (p.x > w + 40) p.x = -40;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size * 0.7);
        }

        ctx.restore();
    }

    // stop after duration
    if (performance.now() > confettiEndAt) {
        stopConfetti();
        return;
    }

    confettiRAF = requestAnimationFrame(drawConfetti);
}

function startConfetti(durationMs = 2000) {
    resizeCanvas();
    confettiCanvas.classList.add("is-active");
    spawnConfetti(160);
    confettiEndAt = performance.now() + durationMs;

    if (confettiRAF) cancelAnimationFrame(confettiRAF);
    confettiRAF = requestAnimationFrame(drawConfetti);
}

function stopConfetti() {
    if (confettiRAF) cancelAnimationFrame(confettiRAF);
    confettiRAF = null;
    confettiPieces = [];
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    confettiCanvas.classList.remove("is-active");
}

window.addEventListener("resize", () => {
    if (confettiCanvas.classList.contains("is-active")) resizeCanvas();
});

// -------------------- Events --------------------
envelope.addEventListener("click", showLetter);
envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") showLetter();
});

noBtn.addEventListener("click", onNo);
yesBtn.addEventListener("click", onYes);
resetBtn.addEventListener("click", resetAll);
