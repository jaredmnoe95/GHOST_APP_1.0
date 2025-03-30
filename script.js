// Firebase SDK setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWH_u_8qK2K_jbrm2_Pcp5UyUYUHG_w",
  authDomain: "ghost-app-fa2b4.firebaseapp.com",
  projectId: "ghost-app-fa2b4",
  storageBucket: "ghost-app-fa2b4.appspot.com",
  messagingSenderId: "63344368978",
  appId: "1:63344368978:web:0aed1c03e6f06edb2fae8b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let pin, codeName;
let failCount = 0;
let messages = [];

function saveSetup() {
  codeName = document.getElementById("codeName").value;
  pin = document.getElementById("setPIN").value;
  if (pin.length !== 4 || !codeName) return alert("Set a 4-digit PIN and code name.");
  localStorage.setItem("ghostPIN", pin);
  localStorage.setItem("ghostName", codeName);
  document.getElementById("setup").style.display = "none";
  document.getElementById("login").style.display = "block";
}

function verifyPIN() {
  const input = document.getElementById("pinInput").value;
  const realPIN = localStorage.getItem("ghostPIN");
  const status = document.getElementById("loginStatus");

  if (input === realPIN) {
    openApp();
  } else if (input === realPIN.split("").reverse().join("")) {
    status.innerText = "Ghost Spoof Mode Enabled.";
    openApp(true); // spoof
  } else {
    failCount++;
    if (failCount === 2) alert(`[SECURITY] ${localStorage.getItem("ghostName")} – 2 failed attempts`);
    if (failCount >= 5) {
      alert(`[SECURITY] ${localStorage.getItem("ghostName")} – Spoof Mode Activated`);
      openApp(true); // force spoof
    } else {
      status.innerText = "Incorrect PIN.";
    }
  }
}

function openApp(spoof = false) {
  document.getElementById("login").style.display = "none";
  document.getElementById("appUI").style.display = "block";
  document.getElementById("userTag").innerText = `Welcome, ${localStorage.getItem("ghostName")}`;
  if (spoof) {
    document.getElementById("messaging").innerHTML = "<p>Secure messaging unavailable.</p>";
  } else {
    loadMessages(); // FIXED: load real messages on real login
  }
}

function showTab(tabName) {
  document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
  document.getElementById(tabName).style.display = "block";
}

function sendMessage() {
  const input = document.getElementById("messageBox").value;
  if (!input) return;
  const encrypted = btoa(unescape(encodeURIComponent(input))); // basic local encoding
  messages.push(encrypted);
  updateLog();
  document.getElementById("messageBox").value = "";
}

function updateLog() {
  const log = document.getElementById("messageLog");
  log.innerHTML = messages.map(msg => `<div>${decodeURIComponent(escape(atob(msg)))}</div>`).join("");
}

function nuclearPurge() {
  if (confirm("Purge all encrypted messages for all users?")) {
    messages = [];
    updateLog();
    alert(`[NUCLEAR] ${localStorage.getItem("ghostName")} triggered message purge.`);
  }
}

// Spyware/Jailbreak check (basic simulation)
if (/Cydia|Frida|substrate/i.test(navigator.userAgent)) {
  alert(`[SECURITY] ${localStorage.getItem("ghostName")} – Jailbreak/Root risk detected`);
}

async function sendCloudMessage() {
  const sender = localStorage.getItem("ghostName");
  const receiver = document.getElementById("toUser").value;
  const message = document.getElementById("messageInput").value;
  const timestamp = new Date();

  if (!receiver || !message) return alert("Fill out all fields");

  try {
    await addDoc(collection(db, "messages"), {
      sender,
      receiver,
      message,
      timestamp
    });
    document.getElementById("messageInput").value = "";
  } catch (e) {
    console.error("Error sending message: ", e);
  }
}

function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    const thread = document.getElementById("messageThread");
    thread.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (
        (data.sender === localStorage.getItem("ghostName") && data.receiver === document.getElementById("toUser").value) ||
        (data.receiver === localStorage.getItem("ghostName") && data.sender === document.getElementById("toUser").value)
      ) {
        const msg = document.createElement("div");
        msg.textContent = `${data.sender}: ${data.message}`;
        thread.appendChild(msg);
      }
    });
  });
}
