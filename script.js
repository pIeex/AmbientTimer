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
const localUploadInput = document.getElementById("localUploadInput");
const localThemesGrid = document.getElementById("localThemesGrid");
const onlineThemesGrid = document.getElementById("onlineThemesGrid");
const onlineUrlInput = document.getElementById("onlineUrlInput");
const addOnlineThemeBtn = document.getElementById("addOnlineThemeBtn");

const LOCAL_DB_NAME = "ambientTimerThemes";
const LOCAL_STORE_NAME = "localThemes";
const ONLINE_STORAGE_KEY = "ambientTimerOnlineThemes";

const localObjectUrls = new Map();

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
   THEME LIBRARY
   ================================ */

function chooseBg(src) {
  const mediaType = src.endsWith(".mp4") ? "video" : "image";
  applyTheme({ src, mediaType });
}

function applyTheme(theme) {
  if (theme.mediaType === "video") {
    bgImage.style.display = "none";
    bgVideo.style.display = "block";
    bgVideo.style.zIndex = "1";
    bgVideo.src = theme.src;

    bgVideo.muted = false;
    bgVideo.volume = 0.9;

    bgVideo.load();
    bgVideo.play().catch(() => {});
  } else {
    bgVideo.style.display = "none";
    bgImage.style.display = "block";
    bgImage.style.backgroundImage = `url(${theme.src})`;
  }

  showPage("page2");
}

function getMediaTypeFromUrl(url) {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".mp4")) return "video";
  if (clean.endsWith(".png") || clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "image";
  return null;
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `theme_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function openThemeDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LOCAL_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(LOCAL_STORE_NAME)) {
        db.createObjectStore(LOCAL_STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveLocalTheme(theme) {
  const db = await openThemeDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOCAL_STORE_NAME, "readwrite");
    tx.objectStore(LOCAL_STORE_NAME).put(theme);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadLocalThemes() {
  const db = await openThemeDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOCAL_STORE_NAME, "readonly");
    const req = tx.objectStore(LOCAL_STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function deleteLocalTheme(id) {
  const db = await openThemeDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOCAL_STORE_NAME, "readwrite");
    tx.objectStore(LOCAL_STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function getOnlineThemes() {
  const raw = localStorage.getItem(ONLINE_STORAGE_KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function setOnlineThemes(list) {
  localStorage.setItem(ONLINE_STORAGE_KEY, JSON.stringify(list));
}

function renderThemeCard(theme, container, options) {
  const card = document.createElement("div");
  card.className = "thumb";
  card.dataset.id = theme.id || "";
  card.dataset.kind = theme.kind || "";
  if (theme.mediaType === "video") {
    card.classList.add("video");
  }

  if (theme.preview) {
    card.style.backgroundImage = `url(${theme.preview})`;
  }

  card.addEventListener("click", () => applyTheme(theme));

  if (options && options.deletable) {
    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "Delete";
    del.addEventListener("click", async (e) => {
      e.stopPropagation();
      const ok = confirm("Delete this theme? This cannot be undone.");
      if (!ok) return;
      await options.onDelete(theme);
    });
    card.appendChild(del);
  }

  container.appendChild(card);
}

function createImagePreviewFromBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function captureVideoFrame(src) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.src = src;

    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
    };

    video.addEventListener("loadedmetadata", () => {
      const seekTime = Math.min(0.1, video.duration || 0);
      video.currentTime = seekTime;
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL("image/jpeg", 0.85);
        cleanup();
        resolve(data);
      } catch {
        cleanup();
        resolve(null);
      }
    });

    video.addEventListener("error", () => {
      cleanup();
      resolve(null);
    });
  });
}

async function addLocalThemeFromFile(file, autoApply = false) {
  const mediaType = file.type.startsWith("video") ? "video" : "image";
  const id = makeId();

  await saveLocalTheme({
    id,
    name: file.name,
    mediaType,
    blob: file,
    createdAt: Date.now()
  });

  const src = URL.createObjectURL(file);
  localObjectUrls.set(id, src);

  let preview = null;
  if (mediaType === "image") {
    preview = await createImagePreviewFromBlob(file);
  } else {
    preview = await captureVideoFrame(src);
  }

  const theme = { id, kind: "local", mediaType, src, preview };
  renderThemeCard(theme, localThemesGrid, {
    deletable: true,
    onDelete: async (t) => {
      await deleteLocalTheme(t.id);
      const url = localObjectUrls.get(t.id);
      if (url) URL.revokeObjectURL(url);
      localObjectUrls.delete(t.id);
      loadAndRenderLocalThemes();
    }
  });

  if (autoApply) {
    applyTheme(theme);
  }
}

async function handleLocalUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  await addLocalThemeFromFile(file, true);
  event.target.value = "";
}

async function handleAddOnlineTheme() {
  const url = (onlineUrlInput.value || "").trim();
  if (!url) return;

  const mediaType = getMediaTypeFromUrl(url);
  if (!mediaType) {
    alert("Please use a direct .mp4, .png, or .jpg URL.");
    return;
  }

  const theme = {
    id: makeId(),
    kind: "online",
    mediaType,
    url,
    createdAt: Date.now()
  };

  const list = getOnlineThemes();
  list.push(theme);
  setOnlineThemes(list);

  await renderOnlineTheme(theme);
  onlineUrlInput.value = "";
}

async function renderOnlineTheme(theme) {
  let preview = null;
  if (theme.mediaType === "image") {
    preview = theme.url;
  } else {
    preview = await captureVideoFrame(theme.url);
  }

  const cardTheme = {
    id: theme.id,
    kind: "online",
    mediaType: theme.mediaType,
    src: theme.url,
    preview
  };

  renderThemeCard(cardTheme, onlineThemesGrid, {
    deletable: true,
    onDelete: async (t) => {
      const list = getOnlineThemes().filter(item => item.id !== t.id);
      setOnlineThemes(list);
      loadAndRenderOnlineThemes();
    }
  });
}

async function loadAndRenderLocalThemes() {
  if (!localThemesGrid) return;
  localThemesGrid.innerHTML = "";
  for (const url of localObjectUrls.values()) {
    URL.revokeObjectURL(url);
  }
  localObjectUrls.clear();

  const stored = await loadLocalThemes();
  for (const item of stored) {
    const src = URL.createObjectURL(item.blob);
    localObjectUrls.set(item.id, src);

    let preview = null;
    if (item.mediaType === "image") {
      preview = await createImagePreviewFromBlob(item.blob);
    } else {
      preview = await captureVideoFrame(src);
    }

    const theme = {
      id: item.id,
      kind: "local",
      mediaType: item.mediaType,
      src,
      preview
    };

    renderThemeCard(theme, localThemesGrid, {
      deletable: true,
      onDelete: async (t) => {
        await deleteLocalTheme(t.id);
        const url = localObjectUrls.get(t.id);
        if (url) URL.revokeObjectURL(url);
        localObjectUrls.delete(t.id);
        loadAndRenderLocalThemes();
      }
    });
  }
}

async function loadAndRenderOnlineThemes() {
  if (!onlineThemesGrid) return;
  onlineThemesGrid.innerHTML = "";

  const list = getOnlineThemes();
  for (const theme of list) {
    await renderOnlineTheme(theme);
  }
}

function initThemeLibrary() {
  if (localUploadInput) {
    localUploadInput.addEventListener("change", handleLocalUpload);
  }
  if (addOnlineThemeBtn) {
    addOnlineThemeBtn.addEventListener("click", handleAddOnlineTheme);
  }
  if (onlineUrlInput) {
    onlineUrlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddOnlineTheme();
      }
    });
  }

  loadAndRenderLocalThemes();
  loadAndRenderOnlineThemes();
}

initThemeLibrary();

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
