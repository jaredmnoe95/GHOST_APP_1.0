let pin, codeName;
let failCount = 0;
let messages = [];

function saveSetup() {
  codeName = document.getElementById("codeName").value;
  pin = document.getElementById("setPIN").value;
  if (pin.length !== 4 || !codeName) return alert("Set a 4-digit PIN and code name.");
  localStorage.setItem("ghostPin", pin);
  localStorage.setItem("ghostName", codeName);
  document.getElementById("setup").style.display = "none";
  document.getElementById("login").style.display = "block";
}

function verifyPIN() {
  const input = document.getElementById("pinInput").value;
  const realPIN = localStorage.getItem("ghostPin");
  const status = document.getElementById("loginStatus");

  if (input === realPIN) {
    openApp();
  } else if (input === realPIN.split("").reverse().join("")) {
    status.innerText = "Ghost Spoof Mode Enabled.";
    openApp(true); // spoof
  } else {
    failCount++;
    if (failCount === 2) alert(`[SECURITY] ${localStorage.getItem("ghostName")} — 2 failed attempts`);
    if (failCount >= 5) {
      alert(`[SECURITY] ${localStorage.getItem("ghostName")} — Spoof Mode Activated`);
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
  alert(`[SECURITY] ${localStorage.getItem("ghostName")} — Jailbreak/Root risk detected`);
}
