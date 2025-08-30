import { chatHistory, userData } from "./user_data.js";

const API_KEY = "AIzaSyC_MphMS4dI5acuFMS9T_i4zYM5P2PQyXs";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const input = document.getElementById("inputBox");
const selectorBox = document.getElementById("search_selector");
const output = document.getElementById("output");
const submit = document.getElementById("submit");
const startVoice = document.getElementById("startVoice");
const jarvis_speaking_img = document.getElementById("jarvis_speaking");
const time_div = document.getElementById("time");
const online_div = document.getElementById("online");
const battery_div = document.getElementById("battery");
const date_div = document.getElementById("date");

let recognition;

setInterval(() => {
  const now = new Date();
  time_div.innerHTML = now.toLocaleTimeString();
  date_div.innerHTML = now.toLocaleDateString();
  online_div.innerHTML = window.navigator.onLine ? "🟢 Online" : "🔴 Offline";

  navigator.getBattery().then((battery) => {
    battery_div.innerHTML = `${Math.round(battery.level * 100)}%`;
  });
}, 1000);

function arrayToParagraph(text) {
  if (Array.isArray(text)) text = text.join(" ");
  return text
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\n/g, " ")
    .trim();
}

function speakText(text) {
  const newText = arrayToParagraph(text);

  // Stop recognition before speaking
  if (recognition) {
    try {
      recognition.onend = null; // prevent auto-restart
      recognition.stop();
    } catch (err) {
      console.warn("Recognition stop failed:", err);
    }
  }

  const voice = "Hindi Male" || "Hindi Female";

  responsiveVoice.speak(newText, voice, {
    pitch: 1,
    rate: 1,
    onstart: () => {
      jarvis_speaking_img.style.display = "block";
    },
    onend: () => {
      jarvis_speaking_img.style.display = "none";
      // Resume recognition after speaking ends
      startVoiceHandler();
    },
  });
}

function startVoiceHandler() {
  recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    JarvisCommands(text);
  };

  recognition.onend = () => recognition.start();
  recognition.onerror = () => recognition.start();

  recognition.start();
}

function JarvisCommands(text) {
  if (text.startsWith("search for") || text.startsWith("jarvis search for")) {
    speakText("Searching for");
    const query = text.replace(/^(jarvis )?search for/, "").trim();
    window.open(`https://google.com/search?q=${query}`);
  } else if (text.startsWith("search") || text.startsWith("jarvis search")) {
    speakText("Searching on YouTube");
    const query = text.replace(/^(jarvis )?search/, "").trim();
    window.open(`https://www.youtube.com/results?search_query=${query}`);
  } else {
    StartJarvis(text);
  }
}

async function StartJarvis(promptText) {
  const md = window.markdownit();
  const data = {
    contents: [
      {
        parts: [
          {
            text: `
            About You:
              Name: ${userData[0]["Assistant Name"]}
              More: ${userData[0]["About assistant"]}

            About Me:
              Name: ${userData[0]["User Name"]}
              Age: ${userData[0]["User age"]}
              Skills: ${userData[0]["User skills"]}
              Education: ${userData[0]["User education"]}
              Address: ${userData[0]["User address"]}

            Chat History:\n${chatHistory
              .map((chat) => `User: ${chat.user}\nYou: ${chat.jarvis}`)
              .join("\n")}

            Prompt: ${promptText}
            `,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.candidates?.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      const htmlOutput = md.render(text);
      output.innerHTML = htmlOutput;
      chatHistory.push({ user: promptText, jarvis: arrayToParagraph(text) });
      speakText(text);
    } else {
      output.innerHTML = "⚠️ No response received.";
      speakText("No response received. Try again!");
    }
  } catch (err) {
    console.error("API Error:", err);
    output.innerHTML =
      "⚠️ API request failed. Please check your key or internet.";
  }
}

// Input event handling
[input, submit].forEach((el) =>
  el.addEventListener("click", handleInputSubmit)
);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleInputSubmit();
});

function handleInputSubmit() {
  const val = input.value.trim();
  if (!val) {
    output.innerHTML = "⚠️ Please enter a prompt!";
    return;
  }

  if (selectorBox.value === "AI") {
    StartJarvis(val);
  } else {
    speakText("Searching for");
    window.open(`https://google.com/search?q=${val}`);
  }

  input.value = "";
}

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

// 🟢 Trigger Jarvis welcome after user interaction
document.addEventListener(
  "click",
  () => {
    if (!window.__jarvisStarted) {
      speakText("Welcome Mr Tayyeb, how can I help you?");
      startVoiceHandler();
      window.__jarvisStarted = true;
    }
  },
  { once: true }
);
startVoice.onclick = startVoiceHandler;
