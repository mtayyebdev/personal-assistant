import { chatHistory, userData, songs } from "./user_data.js";

const API_KEY = "AIzaSyC_MphMS4dI5acuFMS9T_i4zYM5P2PQyXs";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
const songs = [
  "/songs/Aye Khuda aye Khuda jab bana uska hi bana lyrics 😍-FXovEq1VhDk.webm",
];

let assistentStatus = document.getElementById("assistentStatus");

let recognition;
let songPlayed = false;
let audio;
let songsIndex = 0;

function arrayToParagraph(text) {
  if (Array.isArray(text)) text = text.join(" ");
  return text
    .replace(/<\/?[^>]+(>|$)/g, "") // remove HTML tags
    .replace(/\*/g, "") // ✅ remove asterisks (*)
    .replace(/\n/g, " ") // replace new lines with space
    .trim(); // remove extra spaces
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
      assistentStatus.innerHTML = "Speaking...";
    },
    onend: () => {
      assistentStatus.innerHTML = "Listening...";
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
  recognition.onerror = (err) => {
    if (err.message) {
      recognition.start();
    }
  };

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
  } else if (text.startsWith("open") || text.startsWith("jarvis open")) {
    const query = text.replace(/^(jarvis )?open/, "").trim();
    speakText(`Opening ${query}`);
    window.open(`https://www.${query}.com`);
  } else if (
    text.startsWith("play songs") ||
    text.startsWith("play song") ||
    text.startsWith("jarvis play song") ||
    text.startsWith("jarvis play songs")
  ) {
    speakText("playing song");
    playSongs("play");
  } else if (
    text.startsWith("stop") ||
    text.startsWith("stop song") ||
    text.startsWith("jarvis stop song") ||
    text.startsWith("jarvis stop songs")
  ) {
    playSongs("stop");
    speakText("song stoped");
  } else if (
    text.startsWith("next") ||
    text.startsWith("next song") ||
    text.startsWith("jarvis next song") ||
    text.startsWith("jarvis next songs")
  ) {
    speakText("playing next song");
    playSongs("next");
  } else if (
    text.startsWith("back") ||
    text.startsWith("back song") ||
    text.startsWith("jarvis back song") ||
    text.startsWith("previous song")
  ) {
    speakText("playing previous song");
    playSongs("back");
  } else {
    StartJarvis(text);
  }
}
const playSong = (index) => {
  audio = new Audio(songs[index]);
};
function playSongs(action) {
  if (action == "play") {
    if (!songPlayed) {
      playSong(songsIndex);
      songPlayed = true;
    }
    audio.play();
  } else if (action == "stop") {
    audio.pause();
  } else if (action == "next") {
    if (songsIndex == songs.length - 1) {
      songsIndex = 0;
    } else {
      songsIndex += 1;
    }
    audio.pause();
    playSong(songsIndex);
    audio.play();
  } else if (action == "back") {
    if (songsIndex == 0) {
      songsIndex = songs.length - 1;
    } else {
      songsIndex -= 1;
    }
    audio.pause();
    playSong(songsIndex);
    audio.play();
  }
}

async function StartJarvis(promptText) {
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
    assistentStatus.innerHTML = "Thinking...";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.candidates?.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      chatHistory.push({ user: promptText, jarvis: arrayToParagraph(text) });
      speakText(text);
    } else {
      speakText("No response received. Try again!");
    }
  } catch (err) {
    console.error("API Error:", err);
  }
}

// 🟢 Trigger Jarvis welcome after user interaction
document.addEventListener(
  "click",
  () => {
    speakText("Kya hokam hai, mere aaka!");
  },
  { once: true }
);

document.addEventListener("DOMContentLoaded", () => {
  assistentStatus.innerHTML = "Click To Start";
});

window.speakText = speakText;
window.StartJarvis = StartJarvis;
