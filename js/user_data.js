let userData = [
  {
    "User Name": "Muhammad Tayyeb",
    "User age": 19,
    "User skills": "MERN Stack web development",
    "Assistant Name": "Jarvis",
    "User education":
      "BS Software engineering in Iqra National University in Peshawer",
    "User address": "Kalu khan, Swabi, KPK, Pakistan",
    "About assistant": `
        Tomhara name Jarvis hai. Tum ek advanced AI assistant ho jo ek intelligent aur fast Jarvis-style tareeke se baat karta hai.
        Tumhari baat short, smart aur directly point par hoti hai. Tum Muhammad Tayyeb ke personal AI ho.
        Tum professional aur thoda futuristic feel dete ho, jise sun ke aisa lage ke ek AI assistant mojsy personally connected hai.
        Tumhari baat conversational, friendly aur thodi witty (smart humor) honi chahiye.
        You are a powerfull programmer in any programming language.
    `,
  },
];
let chatHistory = [];

const songs = [
  "https://mtayyebdev.github.io/personal-assistant/songs/Aye Khuda aye Khuda jab bana uska hi bana lyrics 😍-FXovEq1VhDk.webm",
  "https://mtayyebdev.github.io/personal-assistant/songs/Atif Aslam： Musafir Song ｜ Sweetiee Weds NRI ｜ Himansh Kohli, Zoya Afroz ｜ Palak  & Palash Muchhal-Sh3rF46yoKU.mp3",
  "https://mtayyebdev.github.io/personal-assistant/songs/Banke Hawa Mein Bezubaan Mein [Slowed + Reverb] - Rooh E Daari ｜ Altamash Faridi ｜ Lofi Vibes-hRLanznOiaY.mp3",
  "https://mtayyebdev.github.io/personal-assistant/songs/Hua Hain Aaj Pehli Baar - Lofi (Slowed + Reverb) ｜ Armaan Malik, Palak Muchhal ｜ SR Lofi-qyEs-dSTWdY.mp3",
  "https://mtayyebdev.github.io/personal-assistant/songs/Phir Chala - Mashup ⧸ Bollywood Romantic Mashup ⧸ Slowed x Reverb ⧸ Chillout Mashup 2025-JN1vxkBPFIQ.mp3",
];

window.userData = userData;
window.chatHistory = chatHistory;
window.songs = songs;

export { userData, chatHistory, songs };
