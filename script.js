// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { getDatabase, ref, set, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDkWIOJ7DaQ7pozupt84f3j6JbCPKdYZnU",
  authDomain: "ghost-8921c.firebaseapp.com",
  projectId: "ghost-8921c",
  storageBucket: "ghost-8921c.firebasestorage.app",
  messagingSenderId: "282650978484",
  appId: "1:282650978484:web:e4c1ccb63719eb04c78fe1",
  measurementId: "G-P1HW9LHPR4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Function to save code name
function saveCodeName() {
  const codeName = document.getElementById('codeName').value;
  const userTag = document.getElementById('userTag');
  if (codeName) {
    userTag.textContent = `Ghost Access Granted, ${codeName}`;
    document.getElementById('setup').style.display = 'none';
    document.getElementById('pinScreen').style.display = 'block';
  } else {
    alert("Please enter a code name.");
  }
}

// Function to save PIN and continue
function savePIN() {
  const pin = document.getElementById('setPIN').value;
  if (pin.length === 4) {
    const userData = {
      codeName: document.getElementById('codeName').value,
      pin: pin
    };
    const newUserRef = push(ref(db, 'users/'));
    set(newUserRef, userData);
    document.getElementById('pinScreen').style.display = 'none';
    document.getElementById('appUI').style.display = 'block';
  } else {
    alert("Please enter a 4-digit PIN.");
  }
}

// Function to show the selected tab
function showTab(tabName) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.style.display = 'none');
  document.getElementById(tabName).style.display = 'block';
}

// Function to send a message
function sendMessage() {
  const message = document.getElementById('messageBox').value;
  if (message) {
    const messageThread = document.getElementById('messageThread');
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageThread.appendChild(messageElement);
    document.getElementById('messageBox').value = ''; // Clear message input
  }
}

// Function to clear messages with Nuke
function nuclearPurge() {
  const messageThread = document.getElementById('messageThread');
  messageThread.innerHTML = ''; // Clear all messages
}

// Function for sending real-time encrypted messages
function sendMessageTo() {
  const recipient = document.getElementById('toUser').value;
  const message = document.getElementById('messageInput').value;
  if (recipient && message) {
    const newMessageRef = push(ref(db, 'messages/'));
    set(newMessageRef, {
      recipient: recipient,
      message: message
    });
    document.getElementById('toUser').value = ''; // Clear recipient
    document.getElementById('messageInput').value = ''; // Clear message
  }
}

// Function to fetch real-time messages
function fetchMessages() {
  const messagesRef = ref(db, 'messages/');
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messageThread = document.getElementById('messageThread');
    messageThread.innerHTML = ''; // Clear old messages
    for (const key in data) {
      const message = data[key].message;
      const messageElement = document.createElement('p');
      messageElement.textContent = message;
      messageThread.appendChild(messageElement);
    }
  });
}

// Call fetchMessages every 5 seconds for real-time updates
setInterval(fetchMessages, 5000);