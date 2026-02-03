/* ================================
   FINAL PREMIUM TIMER SCRIPT
   ================================ */

let remainingSeconds = 0;
let timerInterval = null;
let paused = false;

const bgVideo = document.getElementById("bgVideo");
const bgImage = document.getElementById("bgImage");
const timerDisplay = document.getElementById("timerDisplay");
const muteBtn = document.getElementById("muteBtn");

/* ================================
   PAGE CONTROL (Bulletproof)
   ================================ */

function showPage(id) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
}

/* ================================
   BACKGROUND SELECTION
   ================================ */

function chooseBg(src) {
  if (src.endsWith(".mp4")) {
    bgImage.style.display = "none";
    bgVideo.style.display = "block";
    bgVideo.style.zIndex = "1";
    bgVideo.src = src;

    bgVideo.muted = false;
    bgVideo.volume = 0.9;

    bgVideo.load();
    bgVideo.play().catch(() => {});
  }

  showPage("page2");
}

/* Upload Custom Background */
function uploadBackground(event) {
  const file = event.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);

  if (file.type.startsWith("video")) {
    bgImage.style.display = "none";
    bgVideo.style.display = "block";
    bgVideo.src = url;

    bgVideo.muted = false;
    bgVideo.volume = 0.9;

    bgVideo.load();
    bgVideo.play().catch(() => {});
  }

  if (file.type.startsWith("image")) {
    bgVideo.style.display = "none";
    bgImage.style.display = "block";
    bgImage.style.backgroundImage = `url(${url})`;
  }

  showPage("page2");
}

/* ================================
   TIMER STARTERS
   ================================ */

function startTimer(minutes) {
  startTimerFromSeconds(minutes * 60);
}

/* Custom Time Input */
function startCustomTimer() {
  let h = parseInt(document.getElementById("customHours").value) || 0;
  let m = parseInt(document.getElementById("customMinutes").value) || 0;
  let s = parseInt(document.getElementById("customSeconds").value) || 0;

  let totalSeconds = (h * 3600) + (m * 60) + s;

  if (totalSeconds <= 0) return;

  // Normalize overflow back
  h = Math.floor(totalSeconds / 3600);
  m = Math.floor((totalSeconds % 3600) / 60);
  s = totalSeconds % 60;

  document.getElementById("customHours").value = h;
  document.getElementById("customMinutes").value = m;
  document.getElementById("customSeconds").value = s;

  startTimerFromSeconds(totalSeconds);
}

/* Main Timer Start */
function startTimerFromSeconds(totalSeconds) {

  remainingSeconds = totalSeconds;
  paused = false;

  // Show timer page
  showPage("timerBox");

  // Fullscreen immersion
  document.documentElement.requestFullscreen().catch(() => {});

  updateDisplay();

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (!paused) {
      remainingSeconds--;

      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = "DONE";
        return;
      }

      updateDisplay();
    }
  }, 1000);
}

/* ================================
   DISPLAY FORMAT (H:MM:SS)
   ================================ */

function updateDisplay() {
  let hours = Math.floor(remainingSeconds / 3600);
  let mins = Math.floor((remainingSeconds % 3600) / 60);
  let secs = remainingSeconds % 60;

  if (hours > 0) {
    timerDisplay.textContent =
      `${hours}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  } else {
    timerDisplay.textContent =
      `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
}

/* ================================
   PAUSE CONTROLS
   ================================ */

timerDisplay.addEventListener("click", () => {
  paused = !paused;
  timerDisplay.style.opacity = paused ? "0.45" : "1";
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    paused = !paused;
    timerDisplay.style.opacity = paused ? "0.45" : "1";
  }
});

/* ================================
   MUTE BUTTON
   ================================ */

muteBtn.addEventListener("click", () => {
  bgVideo.muted = !bgVideo.muted;
  muteBtn.textContent = bgVideo.muted ? "🔇" : "🔊";
});

/* Enable audio after first click (browser rule) */
document.addEventListener("click", () => {
  bgVideo.play().catch(() => {});
}, { once: true });
