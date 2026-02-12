const envelopeView = document.getElementById("envelopeView");
const letterView = document.getElementById("letterView");
const yesView = document.getElementById("yesView");

const envelope = document.querySelector(".envelope");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const resetBtn = document.getElementById("resetBtn");
const noLine = document.getElementById("noLine");

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

function showLetter() {
    envelope.classList.add("is-open");

    // small delay so the flap animation reads
    setTimeout(() => {
        envelopeView.classList.remove("is-active");
        letterView.classList.add("is-active");
        noLine.textContent = "";
    }, 450);
}

function onNo() {
    const line = funnyNoLines[noCount % funnyNoLines.length];
    noLine.textContent = line;

    // tiny wiggle for feedback
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

function onYes() {
    noLine.textContent = "";
    yesView.classList.add("is-active");

    // scroll to the gif area on small screens
    yesView.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetAll() {
    noCount = 0;
    noLine.textContent = "";
    yesView.classList.remove("is-active");

    letterView.classList.remove("is-active");
    envelopeView.classList.add("is-active");

    envelope.classList.remove("is-open");
}

// Click and keyboard support
envelope.addEventListener("click", showLetter);
envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") showLetter();
});

noBtn.addEventListener("click", onNo);
yesBtn.addEventListener("click", onYes);
resetBtn.addEventListener("click", resetAll);
