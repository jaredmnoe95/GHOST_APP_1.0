// Firebase SDK setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWH_u_8qK2K_jbrn2_Pcp5UyUYUHFg_w",
  authDomain: "ghost-app-fa2b4.firebaseapp.com",
  databaseURL: "https://ghost-app-fa2b4-default-rtdb.firebaseio.com",
  projectId: "ghost-app-fa2b4",
  storageBucket: "ghost-app-fa2b4.appspot.com",
  messagingSenderId: "63344368978",
  appId: "1:63344368978:web:0aed1c03e6f06edb2fae8b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function saveSetup() {
  const codeName = document.getElementById("codeName").value;
  const pin = document.getElementById("setPIN").value;
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
    openApp(true);
  } else {
    status.innerText = "Incorrect PIN.";
  }
}

function openApp(spoof = false) {
  document.getElementById("login").style.display = "none";
  document.getElementById("appUI").style.display = "block";
  document.getElementById("userTag").innerText = `Welcome, ${localStorage.getItem("ghostName")}`;

  if (spoof) {
    document.getElementById("messaging").innerHTML = "<p>Secure messaging unavailable.</p>";
  } else {
    loadMessages();
  }
}

function sendMessage() {
  const sender = localStorage.getItem("ghostName");
  const receiver = document.getElementById("toUser").value;
  const message = document.getElementById("messageInput").value;
  const timestamp = new Date().toISOString();

  if (!receiver || !message) return alert("Fill out all fields");

  const msgRef = ref(db, "messages");
  push(msgRef, {
    sender,
    receiver,
    message,
    timestamp
  });

  document.getElementById("messageInput").value = "";
}

function loadMessages() {
  const thread = document.getElementById("messageThread");
  thread.innerHTML = "";
  const ghost = localStorage.getItem("ghostName");

  const msgRef = ref(db, "messages");
  onChildAdded(msgRef, (snapshot) => {
    const data = snapshot.val();
    if (
      (data.sender === ghost && data.receiver === document.getElementById("toUser").value) ||
      (data.receiver === ghost && data.sender === document.getElementById("toUser").value)
    ) {
      const msg = document.createElement("div");
      msg.textContent = `${data.sender}: ${data.message}`;
      thread.appendChild(msg);
    }
  });
}
