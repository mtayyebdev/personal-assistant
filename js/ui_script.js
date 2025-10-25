const time_div = document.getElementById("time");
const online_div = document.getElementById("online");
const date_div = document.getElementById("date");

setInterval(() => {
  const now = new Date();
  time_div.innerHTML = now.toLocaleTimeString();
  date_div.innerHTML = now.toLocaleDateString();
  online_div.innerHTML = window.navigator.onLine ? "🟢 Online" : "🔴 Offline";
}, 1000);

// Dropdown Logic
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownItems = document.querySelectorAll(".dropdown-item");

dropdownBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdownMenu.classList.toggle("show");
  dropdownBtn.classList.toggle("active");
});

dropdownItems.forEach((item) =>
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownItems.forEach((i) => i.classList.remove("selected"));
    item.classList.add("selected");

    const selectedClass = item.classList[1];
    dropdownBtn.querySelector(
      ".dropdown-button-icon"
    ).className = `dropdown-button-icon ${selectedClass}`;

    dropdownMenu.classList.remove("show");
    dropdownBtn.classList.remove("active");
  })
);

document.addEventListener("click", () => {
  dropdownMenu.classList.remove("show");
  dropdownBtn.classList.remove("active");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    dropdownMenu.classList.remove("show");
    dropdownBtn.classList.remove("active");
  }
});

dropdownMenu.addEventListener("click", (e) => e.stopPropagation());

// main center logo logic...........................
let currentSector = null;

function toggleSector(direction) {
  console.log(direction);
  const allSectors = document.querySelectorAll(".sector-panel");
  allSectors.forEach((sector) => sector.classList.remove("active"));
  if (currentSector === direction) {
    currentSector = null;
    return;
  }
  const sector = document.getElementById(`sector-${direction}`);
  if (sector) {
    sector.classList.add("active");
    currentSector = direction;
  }
}

// Close sector when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".sector-panel") && !e.target.closest(".hover-area")) {
    const allSectors = document.querySelectorAll(".sector-panel");
    allSectors.forEach((sector) => sector.classList.remove("active"));
    currentSector = null;
  }
});

function executeCommand(command) {
  const responses = {
    tools: "Tools panel.",
    restart: "System restart initiated.",
    preferences: "Preferences panel opened.",
    customize: "Theme customization enabled.",
    audio: "Audio settings configured.",
    voice: "Voice recognition active.",
    gestures: "Gesture controls enabled.",
    "user-info": "User profile loaded.",
    "ai-status": "AI systems nominal.",
    help: "Help documentation accessed.",
  };
  speakText(responses[command]);
}

// Add animation keyframes
const style = document.createElement("style");
style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(100%); }
                20% { opacity: 1; transform: translateX(0); }
                80% { opacity: 1; transform: translateX(0); }
                100% { opacity: 0; transform: translateX(100%); }
            }
        `;
document.head.appendChild(style);

// Floating particles effect...........
let particles_dev = document.getElementById("particles-effect");

[...Array(20)].forEach((_, i) => {
  particles_dev.innerHTML += `
   <div
    class="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
    style="left:${Math.random() * 100}%;top:${
    Math.random() * 100
  }%;animation-delay:${Math.random() * 5}s;animation-duration:${
    3 + Math.random() * 4
  }s"}
  ></div>
  `;
});

// animatedBg................
let animatedBg = document.getElementById("animatedBg");
[...Array(144)].map(
  (_, i) =>
    (animatedBg.innerHTML += `
  <div
    class="border border-cyan-400/20 animate-pulse"
    style="animation-delay: ${(i % 12) * 0.1}s"
  ></div>
  `)
);
