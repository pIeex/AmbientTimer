/* ================================
   FINAL PREMIUM TIMER SCRIPT
   ================================ */

let remainingSeconds = 0;
let timerInterval = null;
let paused = false;

const bgVideoA = document.getElementById("bgVideoA");
const bgVideoB = document.getElementById("bgVideoB");
const bgImageA = document.getElementById("bgImageA");
const bgImageB = document.getElementById("bgImageB");
const timerDisplay = document.getElementById("timerDisplay");
const alarmSound = document.getElementById("alarmSound");
const localUploadInput = document.getElementById("localUploadInput");
const localFolderInput = document.getElementById("localFolderInput");
const localThemesGrid = document.getElementById("localThemesGrid");
const onlineThemesGrid = document.getElementById("onlineThemesGrid");
const onlineUrlInput = document.getElementById("onlineUrlInput");
const addOnlineThemeBtn = document.getElementById("addOnlineThemeBtn");
const uploadMenuBtn = document.getElementById("uploadMenuBtn");
const uploadMenu = document.getElementById("uploadMenu");
const uploadFolderBtn = document.getElementById("uploadFolderBtn");
const searchHeader = document.getElementById("searchHeader");
const confirmOverlay = document.getElementById("confirmOverlay");
const confirmTitle = document.getElementById("confirmTitle");
const confirmMessage = document.getElementById("confirmMessage");
const confirmCancel = document.getElementById("confirmCancel");
const confirmOk = document.getElementById("confirmOk");
const topBar = document.getElementById("topBar");
const themeSearch = document.getElementById("themeSearch");
const burgerBtn = document.getElementById("burgerBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuClose = document.getElementById("mobileMenuClose");
const mobileSearchInput = document.getElementById("mobileSearchInput");
const mobileSearchWrap = document.getElementById("mobileSearchWrap");
const mobileMenuHomeBtn = document.getElementById("mobileMenuHomeBtn");
const mobileMenuSettingsBtn = document.getElementById("mobileMenuSettingsBtn");
const mobileMenuLoginBtn = document.getElementById("mobileMenuLoginBtn");
const mobileMenuSignupBtn = document.getElementById("mobileMenuSignupBtn");
const mobileMenuLogoutBtn = document.getElementById("mobileMenuLogoutBtn");
const homeTimerBtn = document.getElementById("homeTimerBtn");
const homeSignupBtn = document.getElementById("homeSignupBtn");
const homeGoThemesBtn = document.getElementById("homeGoThemesBtn");
const homeUsername = document.getElementById("homeUsername");
const timerBackBtn = document.getElementById("timerBackBtn");
const timeBackBtn = document.getElementById("timeBackBtn");
const localMultiBtn = document.getElementById("localMultiBtn");
const localDeleteBtn = document.getElementById("localDeleteBtn");
const onlineMultiBtn = document.getElementById("onlineMultiBtn");
const onlineDeleteBtn = document.getElementById("onlineDeleteBtn");
const profileShell = document.getElementById("profileShell");
const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");
const profileAvatar = document.getElementById("profileAvatar");
const profileMiniAvatar = document.getElementById("profileMiniAvatar");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileSettingsBtn = document.getElementById("profileSettingsBtn");
const profileLoginBtn = document.getElementById("profileLoginBtn");
const profileSignupBtn = document.getElementById("profileSignupBtn");
const profileLogoutBtn = document.getElementById("profileLogoutBtn");
const authOverlay = document.getElementById("authOverlay");
const authCloseBtn = document.getElementById("authCloseBtn");
const authTabLogin = document.getElementById("authTabLogin");
const authTabSignup = document.getElementById("authTabSignup");
const authTitle = document.getElementById("authTitle");
const authEmail = document.getElementById("authEmail");
const authDisplayName = document.getElementById("authDisplayName");
const authPassword = document.getElementById("authPassword");
const authPasswordConfirm = document.getElementById("authPasswordConfirm");
const authGoogleBtn = document.getElementById("authGoogleBtn");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authMessage = document.getElementById("authMessage");
const toastContainer = document.getElementById("toastContainer");
const settingsBackBtn = document.getElementById("settingsBackBtn");
const settingsAvatar = document.getElementById("settingsAvatar");
const settingsAvatarFallback = document.getElementById("settingsAvatarFallback");
const settingsAvatarInput = document.getElementById("settingsAvatarInput");
const settingsDisplayName = document.getElementById("settingsDisplayName");
const settingsEmail = document.getElementById("settingsEmail");
const settingsPasswordBtn = document.getElementById("settingsPasswordBtn");
const settingsPasswordLabel = document.getElementById("settingsPasswordLabel");
const settingsPasswordHint = document.getElementById("settingsPasswordHint");
const settingsSaveBtn = document.getElementById("settingsSaveBtn");
const settingsDeleteBtn = document.getElementById("settingsDeleteBtn");
const settingsMessage = document.getElementById("settingsMessage");

const LOCAL_DB_NAME = "ambientTimerThemes";
const LOCAL_STORE_NAME = "localThemes";
const ONLINE_STORAGE_KEY = "ambientTimerOnlineThemes";

const SUPABASE_URL = window.SUPABASE_URL || "https://fytjxvaxxtmnaoynpxqy.supabase.co";
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dGp4dmF4eHRtbmFveW5weHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTMzMjEsImV4cCI6MjA4NTY4OTMyMX0.CxVEQUgYEfkVqtyj78pyDCuWfgqU98r3oFTzS7ijM-0";

const localObjectUrls = new Map();
const bgVideos = [bgVideoA, bgVideoB];
const bgImages = [bgImageA, bgImageB];
const VIDEO_LOOP_BASE_FADE_MS = 900;
const VIDEO_LOOP_MIN_FADE_MS = 160;
const VIDEO_LOOP_SHORT_CLIP_SEC = 5.5;
const BG_SWITCH_FADE_MS = 700;

let activeVideoIndex = 0;
let activeImageIndex = 0;
let isCrossfading = false;
let currentVideoSrc = "";
let currentUser = null;
let supabaseClient = null;
let lastMainPage = "page1";
let authMode = "login";
let cloudThemesCache = [];
const PAGE_FADE_MS = 450;
const DEFAULT_BG_SRC = "images/bg.jpg";
let confirmedTheme = { mediaType: "image", src: DEFAULT_BG_SRC };
let hoverResetTimer = null;
let lastHoveredCard = null;
let hoverPreviewTimer = null;
const HOVER_PREVIEW_DELAY_MS = 200;
let currentPreviewTheme = { mediaType: "image", src: DEFAULT_BG_SRC };
let videoWatchdog = null;
let localRenderToken = 0;
let onlineRenderToken = 0;
const multiSelect = {
  local: { enabled: false, selected: new Set() },
  online: { enabled: false, selected: new Set() }
};
let alarmFadeHandler = null;
let isPreviewMode = false;
let isForceRestarting = false;
const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
const touchQuery = window.matchMedia("(hover: none), (pointer: coarse)");
let supportsHover = hoverQuery.matches;
let isTouchDevice = touchQuery.matches;
document.body.classList.toggle("touch", isTouchDevice);
hoverQuery.addEventListener("change", (e) => {
  supportsHover = e.matches;
});
touchQuery.addEventListener("change", (e) => {
  isTouchDevice = e.matches;
  document.body.classList.toggle("touch", isTouchDevice);
});

/* ================================
   PAGE CONTROL (Bulletproof)
   ================================ */

function showPage(id) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
    page.classList.remove("fade-out");
  });

  document.getElementById(id).classList.add("active");
  document.body.dataset.page = id;
  if (id === "page1" || id === "page2") {
    lastMainPage = id;
  }
  if (id === "pageHome") {
    localStorage.setItem("ambientLastPage", "home");
  } else if (["page1", "page2", "timerBox", "pageSettings"].includes(id)) {
    localStorage.setItem("ambientLastPage", "selector");
  }
  updateMobileMenuState();
  requestAnimationFrame(() => fitActivePage());
}

function goHomeWithFade() {
  transitionTo("pageHome");
}

function transitionTo(id) {
  const active = document.querySelector(".page.active");
  if (!active) {
    showPage(id);
    return;
  }
  if (active.id === id) return;
  if (active.id === "page1" && id === "page2") {
    document.body.classList.add("tint-exit");
  }
  active.classList.add("fade-out");
  setTimeout(() => {
    showPage(id);
    document.body.classList.remove("tint-exit");
  }, PAGE_FADE_MS);
}

function openMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.add("active");
  mobileMenu.setAttribute("aria-hidden", "false");
  if (mobileSearchInput && themeSearch) {
    mobileSearchInput.value = themeSearch.value || "";
  }
  updateMobileMenuState();
}

function closeMobileMenu() {
  if (!mobileMenu) return;
  mobileMenu.classList.remove("active");
  mobileMenu.setAttribute("aria-hidden", "true");
}

function updateMobileMenuState() {
  if (!mobileMenu) return;
  const loggedIn = isLoggedIn();
  if (mobileMenuSettingsBtn) mobileMenuSettingsBtn.style.display = loggedIn ? "block" : "none";
  if (mobileMenuLogoutBtn) mobileMenuLogoutBtn.style.display = loggedIn ? "block" : "none";
  if (mobileMenuLoginBtn) mobileMenuLoginBtn.style.display = loggedIn ? "none" : "block";
  if (mobileMenuSignupBtn) mobileMenuSignupBtn.style.display = loggedIn ? "none" : "block";
  if (mobileSearchWrap) {
    mobileSearchWrap.style.display = document.body.dataset.page === "page1" ? "block" : "none";
  }
}

/* ================================
   THEME LIBRARY
   ================================ */

function chooseBg(src) {
  const mediaType = src.endsWith(".mp4") ? "video" : "image";
  applyTheme({ src, mediaType });
}

function applyTheme(theme, { previewOnly = false } = {}) {
  isPreviewMode = previewOnly;
  if (previewOnly) {
    if (currentPreviewTheme.src === theme.src && currentPreviewTheme.mediaType === theme.mediaType) {
      return;
    }
    currentPreviewTheme = { mediaType: theme.mediaType, src: theme.src };
  }
  if (theme.mediaType === "video") {
    transitionToVideo(theme.src);
  } else {
    transitionToImage(theme.src);
  }

  if (!previewOnly) {
    confirmedTheme = { mediaType: theme.mediaType, src: theme.src };
    currentPreviewTheme = { mediaType: theme.mediaType, src: theme.src };
    transitionTo("page2");
  }
}

function getMediaTypeFromUrl(url) {
  let clean = "";
  try {
    const parsed = new URL(url);
    clean = parsed.pathname.toLowerCase();
  } catch {
    clean = url.split("?")[0].split("#")[0].toLowerCase();
  }
  if (/\.(mp4)$/.test(clean) || clean.includes(".mp4")) return "video";
  if (/\.(png|jpg|jpeg)$/.test(clean) || clean.includes(".png") || clean.includes(".jpg") || clean.includes(".jpeg")) return "image";
  return null;
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `theme_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function themeKeyFromFile(file) {
  return `${file.name}|${file.size}|${file.type}`;
}

function deriveNameFromFile(file) {
  if (!file || !file.name) return "Untitled";
  return file.name.replace(/\.[^/.]+$/, "");
}

function deriveNameFromUrl(url) {
  try {
    const clean = url.split("?")[0];
    const parts = clean.split("/");
    const last = parts[parts.length - 1] || "Untitled";
    return decodeURIComponent(last.replace(/\.[^/.]+$/, "")) || "Untitled";
  } catch {
    return "Untitled";
  }
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

async function updateLocalThemeName(id, name) {
  const db = await openThemeDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LOCAL_STORE_NAME, "readwrite");
    const store = tx.objectStore(LOCAL_STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => {
      const item = req.result;
      if (!item) return resolve();
      item.name = name;
      store.put(item);
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function getOnlineThemes() {
  const raw = localStorage.getItem(ONLINE_STORAGE_KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    return list.filter(item => {
      const key = `${item.kind || "online"}|${item.mediaType || ""}|${item.url || ""}`;
      if (!item.url || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return [];
  }
}

function setOnlineThemes(list) {
  localStorage.setItem(ONLINE_STORAGE_KEY, JSON.stringify(list));
}

function attachThemeInteractions(card, theme, onSelect) {
  let blockNextClick = false;
  let touchTimer = null;

  card.addEventListener("click", () => {
    if (isTouchDevice && blockNextClick) {
      blockNextClick = false;
      return;
    }
    onSelect();
  });

  if (supportsHover) {
    card.addEventListener("mouseenter", () => {
      clearTimeout(hoverResetTimer);
      clearTimeout(hoverPreviewTimer);
      lastHoveredCard = card;
      hoverPreviewTimer = setTimeout(() => {
        if (lastHoveredCard === card) {
          applyTheme(theme, { previewOnly: true });
        }
      }, HOVER_PREVIEW_DELAY_MS);
    });
    card.addEventListener("mouseleave", () => scheduleHoverReset());
  }

  if (isTouchDevice) {
    const clearTouchTimer = () => {
      if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
      }
    };

    card.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "touch") return;
      clearTouchTimer();
      blockNextClick = false;
      touchTimer = setTimeout(() => {
        blockNextClick = true;
        applyTheme(theme, { previewOnly: true });
      }, HOVER_PREVIEW_DELAY_MS);
    });

    card.addEventListener("pointerup", (e) => {
      if (e.pointerType !== "touch") return;
      clearTouchTimer();
    });

    card.addEventListener("pointercancel", (e) => {
      if (e.pointerType !== "touch") return;
      clearTouchTimer();
    });

    card.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "touch") return;
      clearTouchTimer();
    });
  }
}

function renderThemeCard(theme, container, options) {
  if (container) {
    const key = theme.id || theme.src || "";
    if (key && container.querySelector(`.thumb[data-key="${CSS.escape(key)}"]`)) {
      return;
    }
  }
  const card = document.createElement("div");
  card.className = "thumb";
  card.dataset.id = theme.id || "";
  card.dataset.kind = theme.kind || "";
  card.dataset.key = theme.id || theme.src || "";
  card.dataset.group = options?.group || "";
  const displayName = theme.name || "Untitled";
  card.dataset.name = displayName.toLowerCase();
  if (theme.mediaType === "video") {
    card.classList.add("video");
  }

  if (theme.preview) {
    card.style.backgroundImage = `url(${theme.preview})`;
  }

  attachThemeInteractions(card, theme, () => {
    if (options?.group && multiSelect[options.group]?.enabled) {
      toggleSelectCard(card, theme, options.group);
      return;
    }
    applyTheme(theme);
  });

  const meta = document.createElement("div");
  meta.className = "thumb-meta";
  const nameSpan = document.createElement("span");
  nameSpan.className = "thumb-name";
  nameSpan.textContent = displayName;
  meta.appendChild(nameSpan);

  if (options && options.editable) {
    const renameBtn = document.createElement("button");
    renameBtn.className = "rename-btn";
    renameBtn.textContent = "✎";
    renameBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const input = document.createElement("input");
      input.className = "rename-input";
      input.value = nameSpan.textContent;
      meta.replaceChild(input, nameSpan);
      input.focus();
      input.select();
      input.addEventListener("click", (evt) => evt.stopPropagation());

      const cleanup = (restore) => {
        if (restore) {
          meta.replaceChild(nameSpan, input);
        }
      };

      input.addEventListener("keydown", async (evt) => {
        if (evt.key === "Enter") {
          const nextName = (input.value || "").trim();
          if (!nextName) {
            cleanup(true);
            return;
          }
          if (options.onRename) {
            await options.onRename(theme, nextName);
          }
          nameSpan.textContent = nextName;
          card.dataset.name = nextName.toLowerCase();
          cleanup(true);
        } else if (evt.key === "Escape") {
          cleanup(true);
        }
      });

      input.addEventListener("blur", () => cleanup(true));
    });
    meta.appendChild(renameBtn);
  }

  card.appendChild(meta);

  if (options && options.deletable) {
    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "✕";
    del.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (options?.group && multiSelect[options.group]?.enabled) {
        return;
      }
      const ok = await openConfirm({
        title: "Delete theme?",
        message: "This cannot be undone."
      });
      if (!ok) return;
      await animateRemoveCard(card);
      if (options.onDelete) {
        await options.onDelete(theme);
      } else if (theme.source === "cloud") {
        await deleteCloudTheme(theme);
      }
    });
    card.appendChild(del);
  }

  card.classList.add("pop-in");
  if (options?.group) {
    updateSelectableState(card, options.group);
  }
  container.appendChild(card);
  applySearchFilter(themeSearch?.value || "");
  fitActivePage();
}

function scheduleHoverReset() {
  clearTimeout(hoverResetTimer);
  clearTimeout(hoverPreviewTimer);
  hoverResetTimer = setTimeout(() => {
    const hovering = document.querySelector("#page1 .thumb:hover");
    if (!hovering) {
      lastHoveredCard = null;
    }
  }, 20);
}

function animateRemoveCard(card) {
  return new Promise((resolve) => {
    if (!card) return resolve();
    card.classList.remove("pop-in");
    card.classList.add("pop-out");
    setTimeout(() => {
      resolve();
      fitActivePage();
    }, 220);
  });
}

function toggleSelectCard(card, theme, group) {
  const bucket = multiSelect[group];
  if (!bucket) return;
  const key = theme.id || theme.src || "";
  if (!key) return;
  if (bucket.selected.has(key)) {
    bucket.selected.delete(key);
    card.classList.remove("selected");
  } else {
    bucket.selected.add(key);
    card.classList.add("selected");
  }
  updateMultiButtons(group);
}

function updateSelectableState(card, group) {
  const bucket = multiSelect[group];
  if (!bucket) return;
  card.classList.toggle("selectable", bucket.enabled);
  const key = card.dataset.key;
  card.classList.toggle("selected", bucket.selected.has(key));
}

function updateMultiButtons(group) {
  const bucket = multiSelect[group];
  if (!bucket) return;
  const count = bucket.selected.size;
  if (group === "local") {
    if (localDeleteBtn) localDeleteBtn.disabled = count === 0;
    if (localMultiBtn) localMultiBtn.textContent = bucket.enabled ? "Cancel" : "Multi-select";
    if (localDeleteBtn) {
      localDeleteBtn.classList.toggle("visible", bucket.enabled && count > 0);
    }
  }
  if (group === "online") {
    if (onlineDeleteBtn) onlineDeleteBtn.disabled = count === 0;
    if (onlineMultiBtn) onlineMultiBtn.textContent = bucket.enabled ? "Cancel" : "Multi-select";
    if (onlineDeleteBtn) {
      onlineDeleteBtn.classList.toggle("visible", bucket.enabled && count > 0);
    }
  }
}

function setMultiSelect(group, enabled) {
  const bucket = multiSelect[group];
  if (!bucket) return;
  bucket.enabled = enabled;
  if (!enabled) {
    bucket.selected.clear();
  }
  const cards = document.querySelectorAll(`.thumb[data-group="${group}"]`);
  cards.forEach(card => updateSelectableState(card, group));
  updateMultiButtons(group);
}

async function deleteSelected(group) {
  const bucket = multiSelect[group];
  if (!bucket || bucket.selected.size === 0) return;
  const ok = await openConfirm({
    title: `Delete ${bucket.selected.size} theme(s)?`,
    message: "This cannot be undone."
  });
  if (!ok) return;

  const keys = Array.from(bucket.selected);
  if (group === "local") {
    for (const key of keys) {
      if (isLoggedIn()) {
        await deleteCloudTheme({ cloudId: key });
      } else {
        await deleteLocalTheme(key);
      }
    }
    loadAndRenderLocalThemes();
  } else if (group === "online") {
    if (isLoggedIn()) {
      for (const key of keys) {
        await deleteCloudTheme({ cloudId: key });
      }
    } else {
      const list = getOnlineThemes().filter(item => !keys.includes(item.id) && !keys.includes(item.url));
      setOnlineThemes(list);
    }
    loadAndRenderOnlineThemes();
  }
  setMultiSelect(group, false);
}

function applySearchFilter(query) {
  const q = (query || "").trim().toLowerCase();
  const cards = document.querySelectorAll("#page1 .thumb");
  cards.forEach(card => {
    const name = (card.dataset.name || "").toLowerCase();
    card.style.display = !q || name.includes(q) ? "" : "none";
  });
  const isSearching = q.length > 0;
  if (searchHeader) {
    searchHeader.textContent = isSearching ? `Search: ${query.trim()}` : "Search:";
    searchHeader.classList.toggle("active", isSearching);
  }

  const page1 = document.getElementById("page1");
  if (page1) {
    const sections = page1.querySelectorAll(".section-title:not(.search-title)");
    const controls = page1.querySelectorAll(".controls");
    sections.forEach(el => el.classList.toggle("fade-hide", isSearching));
    controls.forEach(el => el.classList.toggle("fade-hide", isSearching));
  }
  fitActivePage();
}

function fitActivePage() {
  const active = document.querySelector(".page.active");
  if (!active) return;
  if (active.id !== "pageHome") {
    const content = active.querySelector(".page-content");
    if (content) {
      content.style.transform = "";
      content.style.transformOrigin = "";
      content.style.width = "";
      content.style.height = "";
    }
    return;
  }
  const content = active.querySelector(".page-content");
  if (!content) return;

  content.style.transform = "scale(1)";
  content.style.transformOrigin = "top center";
  content.style.width = "";
  content.style.height = "";

  const topBarHeight = topBar && getComputedStyle(topBar).display !== "none"
    ? topBar.offsetHeight
    : 0;
  const availableHeight = window.innerHeight - topBarHeight - 16;
  const availableWidth = window.innerWidth - 16;
  const contentHeight = content.scrollHeight;
  const contentWidth = content.scrollWidth;
  if (!contentHeight || !contentWidth) return;

  const scale = Math.min(
    1,
    availableHeight / contentHeight,
    availableWidth / contentWidth
  );

  content.style.transform = `scale(${scale})`;
  content.style.transformOrigin = "top center";
}

function initBuiltInThemes() {
  const builtins = document.querySelectorAll("#defaultThemes .thumb");
  builtins.forEach(card => {
    const src = card.dataset.src;
    const mediaType = card.dataset.type || (src && src.endsWith(".mp4") ? "video" : "image");
    const name = card.dataset.name || "Built-in";
    card.dataset.name = name.toLowerCase();
    const theme = { src, mediaType, name };
    attachThemeInteractions(card, theme, () => applyTheme(theme));
  });
}

function initSearch() {
  const syncSearch = (value) => {
    if (themeSearch && themeSearch.value !== value) {
      themeSearch.value = value;
    }
    if (mobileSearchInput && mobileSearchInput.value !== value) {
      mobileSearchInput.value = value;
    }
    applySearchFilter(value);
  };

  if (themeSearch) {
    themeSearch.addEventListener("input", (e) => {
      syncSearch(e.target.value);
    });
  }

  if (mobileSearchInput) {
    mobileSearchInput.addEventListener("input", (e) => {
      syncSearch(e.target.value);
    });
  }
}

window.addEventListener("resize", () => {
  fitActivePage();
});


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

function mapCloudTheme(item) {
  return {
    id: item.id,
    kind: item.kind,
    mediaType: item.media_type,
    name: item.name || "Untitled",
    src: item.url,
    preview: item.preview_url || null,
    cloudId: item.id,
    storagePath: item.storage_path || "",
    source: "cloud"
  };
}

function getCloudThemesByKind(kind) {
  return cloudThemesCache
    .filter(item => item.kind === kind)
    .map(mapCloudTheme);
}

async function saveCloudThemeRecord({ kind, mediaType, url, storagePath = "", name = "Untitled" }) {
  if (!supabaseClient || !currentUser) return null;
  const payload = {
    user_id: currentUser.id,
    kind,
    media_type: mediaType,
    name,
    url,
    storage_path: storagePath
  };
  const { data, error } = await supabaseClient
    .from("themes")
    .insert(payload)
    .select("*")
    .single();
  if (error) return { data: null, error };
  return { data, error: null };
}

async function uploadThemeFile(file, id) {
  if (!supabaseClient || !currentUser) return null;
  const ext = file.name.split(".").pop() || "mp4";
  const path = `${currentUser.id}/${id}-${Date.now()}.${ext}`;
  const { error } = await supabaseClient.storage.from("themes").upload(path, file, {
    upsert: true,
    contentType: file.type
  });
  if (error) return null;
  const { data } = supabaseClient.storage.from("themes").getPublicUrl(path);
  return { publicUrl: data.publicUrl, path };
}

async function deleteCloudTheme(theme) {
  if (!supabaseClient || !currentUser || !theme.cloudId) return;
  await supabaseClient.from("themes")
    .delete()
    .eq("id", theme.cloudId)
    .eq("user_id", currentUser.id);
  if (theme.storagePath) {
    await supabaseClient.storage.from("themes").remove([theme.storagePath]);
  }
}

async function renameCloudTheme(theme, name) {
  if (!supabaseClient || !currentUser || !theme.cloudId) return;
  await supabaseClient.from("themes")
    .update({ name })
    .eq("id", theme.cloudId)
    .eq("user_id", currentUser.id);
}

async function addLocalThemeFromFile(file, autoApply = false, options = {}) {
  const mediaType = file.type.startsWith("video") ? "video" : "image";
  const id = makeId();
  const name = deriveNameFromFile(file);
  const sig = themeKeyFromFile(file);

  if (options.existingSigSet && options.existingSigSet.has(sig)) {
    showToast({
      message: "That file already exists in Your Themes.",
      type: "error",
      durationMs: 2000
    });
    return;
  }

  if (options.cloudNameSet && options.cloudNameSet.has(name.toLowerCase())) {
    showToast({
      message: "A theme with this name already exists.",
      type: "error",
      durationMs: 2000
    });
    return;
  }

  if (isLoggedIn() && supabaseClient) {
    const upload = await uploadThemeFile(file, id);
    if (upload) {
      const preview = mediaType === "image"
        ? upload.publicUrl
        : await captureVideoFrame(upload.publicUrl);
      const result = await saveCloudThemeRecord({
        kind: "local",
        mediaType,
        name,
        url: upload.publicUrl,
        storagePath: upload.path
      });
      if (result?.data) {
        const record = result.data;
        const theme = {
          id: record.id,
          kind: "local",
          mediaType,
          name: record.name || name,
          src: upload.publicUrl,
          preview,
          cloudId: record.id,
          storagePath: upload.path,
          source: "cloud"
        };
        renderThemeCard(theme, localThemesGrid, {
          deletable: true,
          editable: true,
          group: "local",
          onRename: async (t, nextName) => {
            await renameCloudTheme(t, nextName);
            loadAndRenderLocalThemes();
          },
          onDelete: async (t) => {
            await deleteCloudTheme(t);
            loadAndRenderLocalThemes();
          }
        });
        if (autoApply) applyTheme(theme);
        return;
      } else if (result?.error) {
        showToast({
          message: result.error.message || "Could not save theme to cloud.",
          type: "error",
          durationMs: 2000
        });
      }
    }
  }

  await saveLocalTheme({
    id,
    name,
    sig,
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

  const theme = { id, kind: "local", mediaType, src, preview, name };
  renderThemeCard(theme, localThemesGrid, {
    deletable: true,
    editable: true,
    group: "local",
    onRename: async (t, nextName) => {
      await updateLocalThemeName(t.id, nextName);
      loadAndRenderLocalThemes();
    },
    onDelete: async (t) => {
      await deleteLocalTheme(t.id);
      const url = localObjectUrls.get(t.id);
      if (url) URL.revokeObjectURL(url);
      localObjectUrls.delete(t.id);
      loadAndRenderLocalThemes();
    }
  });

  if (!isLoggedIn()) {
    promptLoginToast();
  }

  if (autoApply) {
    applyTheme(theme);
  }
}

async function handleLocalUpload(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  const existing = await loadLocalThemes();
  const existingSigSet = new Set(
    existing.map(item => item.sig || `${item.name}|${item.blob?.size || 0}|${item.blob?.type || ""}`)
  );
  const cloudNameSet = isLoggedIn()
    ? new Set(getCloudThemesByKind("local").map(t => (t.name || "").toLowerCase()))
    : new Set();

  for (const file of files) {
    if (!file.type.startsWith("video") && !file.type.startsWith("image")) {
      showToast({
        message: "Skipped a non-image/video file.",
        type: "error",
        durationMs: 2000
      });
      continue;
    }
    await addLocalThemeFromFile(file, false, { existingSigSet, cloudNameSet });
    existingSigSet.add(themeKeyFromFile(file));
    cloudNameSet.add(deriveNameFromFile(file).toLowerCase());
  }
  event.target.value = "";
}

function toggleUploadMenu(force) {
  if (!uploadMenu) return;
  if (typeof force === "boolean") {
    if (force) {
      uploadMenu.classList.remove("hiding");
      uploadMenu.classList.add("active");
    } else if (uploadMenu.classList.contains("active")) {
      uploadMenu.classList.remove("active");
      uploadMenu.classList.add("hiding");
      setTimeout(() => uploadMenu.classList.remove("hiding"), 160);
    } else {
      uploadMenu.classList.remove("active");
      uploadMenu.classList.remove("hiding");
    }
  } else {
    if (uploadMenu.classList.contains("active")) {
      uploadMenu.classList.remove("active");
      uploadMenu.classList.add("hiding");
      setTimeout(() => uploadMenu.classList.remove("hiding"), 160);
    } else {
      uploadMenu.classList.remove("hiding");
      uploadMenu.classList.add("active");
    }
  }
}

async function handleAddOnlineTheme() {
  const url = (onlineUrlInput.value || "").trim();
  if (!url) return;

  const mediaType = getMediaTypeFromUrl(url);
  if (!mediaType) {
    showToast({
      message: "Please use a direct .mp4, .png, or .jpg URL.",
      type: "error",
      durationMs: 2000
    });
    return;
  }

  const theme = {
    id: makeId(),
    kind: "online",
    mediaType,
    url,
    name: deriveNameFromUrl(url),
    createdAt: Date.now()
  };

  if (isLoggedIn() && supabaseClient) {
    const result = await saveCloudThemeRecord({
      kind: "online",
      mediaType,
      url,
      name: theme.name
    });
    if (result?.data) {
      const record = result.data;
      await renderOnlineTheme({
        id: record.id,
        kind: "online",
        mediaType,
        url: record.url,
        name: record.name || theme.name,
        storagePath: record.storage_path || "",
        source: "cloud"
      });
    } else {
      if (result?.error) {
        showToast({
          message: result.error.message || "Could not add this URL.",
          type: "error",
          durationMs: 2000
        });
      }
      const list = getOnlineThemes();
      const exists = list.some(item => item.url === theme.url && item.mediaType === theme.mediaType);
      if (!exists) {
        list.push(theme);
        setOnlineThemes(list);
      }
      await renderOnlineTheme(theme);
      promptLoginToast();
    }
  } else {
    const list = getOnlineThemes();
    const exists = list.some(item => item.url === theme.url && item.mediaType === theme.mediaType);
    if (!exists) {
      list.push(theme);
      setOnlineThemes(list);
    }
    await renderOnlineTheme(theme);
    promptLoginToast();
  }
  onlineUrlInput.value = "";
}

async function renderOnlineTheme(theme) {
  if (onlineThemesGrid) {
    const key = theme.id || theme.url || "";
    if (key && onlineThemesGrid.querySelector(`.thumb[data-key="${CSS.escape(key)}"]`)) {
      return;
    }
  }
  let preview = theme.preview || null;
  if (!preview) {
    if (theme.mediaType === "image") {
      preview = theme.url;
    } else {
      preview = await captureVideoFrame(theme.url);
      if (!preview) {
        preview = theme.url;
      }
    }
  }
  const name = theme.name || deriveNameFromUrl(theme.url);

  const cardTheme = {
    id: theme.id,
    kind: "online",
    mediaType: theme.mediaType,
    name,
    src: theme.url,
    preview,
    cloudId: theme.cloudId || theme.id,
    storagePath: theme.storagePath || "",
    source: theme.source || ""
  };

  renderThemeCard(cardTheme, onlineThemesGrid, {
    deletable: true,
    editable: true,
    group: "online",
    onRename: async (t, nextName) => {
      if (t.source === "cloud") {
        await renameCloudTheme(t, nextName);
      } else {
        const list = getOnlineThemes().map(item =>
          item.id === t.id ? { ...item, name: nextName } : item
        );
        setOnlineThemes(list);
      }
      loadAndRenderOnlineThemes();
    },
    onDelete: async (t) => {
      if (t.source === "cloud") {
        await deleteCloudTheme(t);
      } else {
        const list = getOnlineThemes().filter(item => item.id !== t.id);
        setOnlineThemes(list);
      }
      loadAndRenderOnlineThemes();
    }
  });
}

async function loadAndRenderLocalThemes() {
  if (!localThemesGrid) return;
  const token = ++localRenderToken;
  localThemesGrid.innerHTML = "";
  for (const url of localObjectUrls.values()) {
    URL.revokeObjectURL(url);
  }
  localObjectUrls.clear();

  const stored = await loadLocalThemes();
  if (token !== localRenderToken) return;
  for (const item of stored) {
    if (!item.sig && item.blob) {
      item.sig = `${item.name}|${item.blob.size}|${item.blob.type}`;
      await saveLocalTheme(item);
    }
    const src = URL.createObjectURL(item.blob);
    localObjectUrls.set(item.id, src);

    let preview = null;
    if (item.mediaType === "image") {
      preview = await createImagePreviewFromBlob(item.blob);
    } else {
      preview = await captureVideoFrame(src);
    }
    if (token !== localRenderToken) return;
    const name = item.name || deriveNameFromFile(item.blob);

    const theme = {
      id: item.id,
      kind: "local",
      mediaType: item.mediaType,
      src,
      preview,
      name
    };

    renderThemeCard(theme, localThemesGrid, {
      deletable: true,
      editable: true,
      group: "local",
      onRename: async (t, nextName) => {
        await updateLocalThemeName(t.id, nextName);
        loadAndRenderLocalThemes();
      },
      onDelete: async (t) => {
        await deleteLocalTheme(t.id);
        const url = localObjectUrls.get(t.id);
        if (url) URL.revokeObjectURL(url);
        localObjectUrls.delete(t.id);
        loadAndRenderLocalThemes();
      }
    });
  }

  if (isLoggedIn()) {
    const cloudLocal = getCloudThemesByKind("local");
    for (const theme of cloudLocal) {
      let preview = theme.preview;
      if (!preview) {
        preview = theme.mediaType === "image"
          ? theme.src
          : await captureVideoFrame(theme.src);
      }
      if (token !== localRenderToken) return;
    renderThemeCard({ ...theme, preview }, localThemesGrid, {
      deletable: true,
      editable: true,
      group: "local",
      onRename: async (t, nextName) => {
        await renameCloudTheme(t, nextName);
        loadAndRenderLocalThemes();
      },
      onDelete: async (t) => {
        await deleteCloudTheme(t);
        loadAndRenderLocalThemes();
      }
    });
  }
  }

  applySearchFilter(themeSearch?.value || "");
}

async function loadAndRenderOnlineThemes() {
  if (!onlineThemesGrid) return;
  const token = ++onlineRenderToken;
  onlineThemesGrid.innerHTML = "";

  if (isLoggedIn()) {
    const cloudOnline = getCloudThemesByKind("online");
    for (const theme of cloudOnline) {
      await renderOnlineTheme({
        id: theme.id,
        kind: "online",
        mediaType: theme.mediaType,
        url: theme.src,
        preview: theme.preview,
        storagePath: theme.storagePath,
        source: "cloud",
        cloudId: theme.cloudId
      });
      if (token !== onlineRenderToken) return;
    }
  } else {
    const list = getOnlineThemes();
    if (token !== onlineRenderToken) return;
    for (const theme of list) {
      await renderOnlineTheme(theme);
      if (token !== onlineRenderToken) return;
    }
  }

  applySearchFilter(themeSearch?.value || "");
}

function initThemeLibrary() {
  if (localUploadInput) {
    localUploadInput.addEventListener("change", handleLocalUpload);
  }
  if (localFolderInput) {
    localFolderInput.addEventListener("change", handleLocalUpload);
  }
  if (uploadMenuBtn) {
    uploadMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleUploadMenu();
    });
  }
  if (uploadFolderBtn && localFolderInput) {
    uploadFolderBtn.addEventListener("click", () => {
      toggleUploadMenu(false);
      localFolderInput.click();
    });
  }
  document.addEventListener("click", (e) => {
    if (!uploadMenu || !uploadMenuBtn) return;
    if (uploadMenu.contains(e.target) || uploadMenuBtn.contains(e.target)) return;
    toggleUploadMenu(false);
  });
  if (addOnlineThemeBtn) {
    addOnlineThemeBtn.addEventListener("click", handleAddOnlineTheme);
  }
  if (localMultiBtn) {
    localMultiBtn.addEventListener("click", () => {
      setMultiSelect("local", !multiSelect.local.enabled);
    });
  }
  if (localDeleteBtn) {
    localDeleteBtn.addEventListener("click", () => deleteSelected("local"));
  }
  if (onlineMultiBtn) {
    onlineMultiBtn.addEventListener("click", () => {
      setMultiSelect("online", !multiSelect.online.enabled);
    });
  }
  if (onlineDeleteBtn) {
    onlineDeleteBtn.addEventListener("click", () => deleteSelected("online"));
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
initBuiltInThemes();
initSearch();
initAuth();
fitActivePage();
setConfirmedThemeFromCurrent();

/* ================================
   CONFIRM MODAL
   ================================ */

function openConfirm({ title, message }) {
  return new Promise((resolve) => {
    if (!confirmOverlay) return resolve(true);
    confirmTitle.textContent = title || "Confirm";
    confirmMessage.textContent = message || "";
    confirmOverlay.classList.add("active");
    confirmOverlay.setAttribute("aria-hidden", "false");

    const cleanup = (result) => {
      confirmOverlay.classList.remove("active");
      confirmOverlay.setAttribute("aria-hidden", "true");
      confirmCancel.removeEventListener("click", onCancel);
      confirmOk.removeEventListener("click", onOk);
      confirmOverlay.removeEventListener("click", onOverlay);
      document.removeEventListener("keydown", onKeydown);
      resolve(result);
    };

    const onCancel = () => cleanup(false);
    const onOk = () => cleanup(true);
    const onOverlay = (e) => {
      if (e.target === confirmOverlay) cleanup(false);
    };
    const onKeydown = (e) => {
      if (e.key === "Escape") cleanup(false);
    };

    confirmCancel.addEventListener("click", onCancel);
    confirmOk.addEventListener("click", onOk);
    confirmOverlay.addEventListener("click", onOverlay);
    document.addEventListener("keydown", onKeydown);
  });
}

/* ================================
   AUTH + PROFILE (SUPABASE)
   ================================ */

function initSupabaseClient() {
  if (!window.supabase) return null;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (SUPABASE_URL.includes("YOUR_SUPABASE")) return null;
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function isLoggedIn() {
  return !!currentUser;
}

function showToast({ message, actions = [], type = "info", durationMs, closable = false }) {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast${type === "error" ? " error" : ""}`;
  const msg = document.createElement("div");
  msg.textContent = message;
  toast.appendChild(msg);

  if (closable) {
    const closeBtn = document.createElement("button");
    closeBtn.className = "toast-close";
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", () => toast.remove());
    toast.appendChild(closeBtn);
  }

  if (actions.length) {
    const actionRow = document.createElement("div");
    actionRow.className = "toast-actions";
    actions.forEach(action => {
      const btn = document.createElement("button");
      btn.className = "menu-btn";
      btn.textContent = action.label;
      btn.addEventListener("click", () => {
        action.onClick();
        toast.remove();
      });
      actionRow.appendChild(btn);
    });
    toast.appendChild(actionRow);
  }

  toastContainer.appendChild(toast);
  const ttl = durationMs ?? (type === "error" ? 2000 : 3000);
  setTimeout(() => toast.remove(), ttl);
}

function openAuth(mode = "login") {
  if (!authOverlay) return;
  if (!supabaseClient) {
    showToast({
      message: "Supabase is not configured yet. Add your URL and anon key in script.js.",
      type: "error",
      durationMs: 2000
    });
    return;
  }
  setAuthMode(mode);
  authOverlay.classList.add("active");
  authOverlay.setAttribute("aria-hidden", "false");
}

function closeAuth() {
  if (!authOverlay) return;
  authOverlay.classList.remove("active");
  authOverlay.setAttribute("aria-hidden", "true");
  setMessage(authMessage, "", false);
}

function setAuthMode(mode) {
  authMode = mode;
  const isSignup = mode === "signup";
  authTabLogin.classList.toggle("active", !isSignup);
  authTabSignup.classList.toggle("active", isSignup);
  authTitle.textContent = isSignup ? "Create your account" : "Welcome back";
  document.querySelectorAll(".auth-signup-only").forEach(el => {
    el.style.display = isSignup ? "grid" : "none";
  });
  if (authPassword) {
    authPassword.autocomplete = isSignup ? "new-password" : "off";
    if (!isSignup) {
      authPassword.setAttribute("data-lpignore", "true");
      authPassword.setAttribute("data-1p-ignore", "true");
    } else {
      authPassword.removeAttribute("data-lpignore");
      authPassword.removeAttribute("data-1p-ignore");
    }
  }
  if (authPasswordConfirm) {
    authPasswordConfirm.autocomplete = "new-password";
  }
  setMessage(authMessage, "", false);
}

function setMessage(el, text, isError = false) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("error", isError);
}

async function handleLogout() {
  if (!supabaseClient) return;
  if (profileMenu) profileMenu.classList.remove("active");
  closeMobileMenu();
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    showToast({
      message: error.message || "Logout failed.",
      type: "error",
      durationMs: 2000
    });
    return;
  }
  currentUser = null;
  updateProfileUI();
  localStorage.setItem("ambientLastPage", "home");
  transitionTo("pageHome");
  setTimeout(() => window.location.reload(), 250);
}

async function handleAuthSubmit() {
  if (!supabaseClient) return;
  const email = (authEmail.value || "").trim();
  const password = authPassword.value || "";
  const displayName = (authDisplayName.value || "").trim();
  const confirm = authPasswordConfirm.value || "";

  if (!email || !password) {
    setMessage(authMessage, "Please enter an email and password.", true);
    return;
  }

  if (authMode === "signup") {
    if (password !== confirm) {
      setMessage(authMessage, "Passwords do not match.", true);
      return;
    }
    if (!displayName) {
      setMessage(authMessage, "Please add a display name.", true);
      return;
    }
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split("@")[0] }
      }
    });
    setMessage(authMessage, error ? error.message : "Check your email to confirm your account.", !!error);
  } else {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    setMessage(authMessage, error ? error.message : "Signed in successfully.", !!error);
    if (!error) closeAuth();
  }
}

async function signInWithGoogle() {
  if (!supabaseClient) return;
  const redirectTo = "https://pieex.github.io/AmbientTimer/";
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo }
  });
  if (error) {
    setMessage(authMessage, error.message, true);
  }
}

async function syncGoogleProfileIfNeeded(user) {
  if (!supabaseClient || !user) return;
  const currentName = user.user_metadata?.display_name;
  const googleName = user.user_metadata?.full_name || user.user_metadata?.name;
  if (!currentName && googleName) {
    await supabaseClient.auth.updateUser({ data: { display_name: googleName } });
  }
}

function updateProfileUI() {
  const meta = currentUser?.user_metadata || {};
  const fallbackName = meta.full_name || meta.name || (currentUser?.email ? currentUser.email.split("@")[0] : "");
  const name = meta.display_name || fallbackName || "Guest";
  const email = currentUser?.email || "Not signed in";
  const avatarUrl = currentUser?.user_metadata?.avatar_url || "";
  const initial = name ? name.charAt(0).toUpperCase() : "A";
  const loggedIn = isLoggedIn();
  const isOAuth = !!currentUser?.app_metadata?.provider && currentUser.app_metadata.provider !== "email";

  if (profileName) profileName.textContent = name;
  if (profileEmail) profileEmail.textContent = email;
  if (profileAvatar) profileAvatar.textContent = initial;
  if (profileMiniAvatar) profileMiniAvatar.textContent = initial;

  if (profileAvatar && avatarUrl) {
    profileAvatar.style.backgroundImage = `url(${avatarUrl})`;
    profileAvatar.style.backgroundSize = "cover";
    profileAvatar.style.color = "transparent";
  } else if (profileAvatar) {
    profileAvatar.style.backgroundImage = "";
    profileAvatar.style.color = "";
  }

  if (profileMiniAvatar && avatarUrl) {
    profileMiniAvatar.style.backgroundImage = `url(${avatarUrl})`;
    profileMiniAvatar.style.backgroundSize = "cover";
    profileMiniAvatar.style.color = "transparent";
  } else if (profileMiniAvatar) {
    profileMiniAvatar.style.backgroundImage = "";
    profileMiniAvatar.style.color = "";
  }

  if (settingsAvatar) {
    if (avatarUrl) {
      settingsAvatar.src = avatarUrl;
      settingsAvatar.style.display = "block";
      settingsAvatarFallback.style.display = "none";
    } else {
      settingsAvatar.style.display = "none";
      settingsAvatarFallback.style.display = "grid";
      settingsAvatarFallback.textContent = initial;
    }
  }

  if (settingsDisplayName) settingsDisplayName.value = name === "Guest" ? "" : name;
  if (settingsEmail) settingsEmail.value = currentUser?.email || "";
  if (settingsPasswordLabel) {
    settingsPasswordLabel.textContent = isOAuth ? "Add password" : "Change password";
  }
  if (settingsPasswordHint) {
    settingsPasswordHint.textContent = isOAuth
      ? "We’ll email you a link to set a password."
      : "We’ll email you a secure link.";
  }

  if (profileLoginBtn) profileLoginBtn.style.display = loggedIn ? "none" : "block";
  if (profileSignupBtn) profileSignupBtn.style.display = loggedIn ? "none" : "block";
  if (profileLogoutBtn) profileLogoutBtn.style.display = loggedIn ? "block" : "none";
  if (profileSettingsBtn) profileSettingsBtn.style.display = loggedIn ? "block" : "none";

  document.body.dataset.auth = loggedIn ? "true" : "false";
  if (homeUsername) homeUsername.textContent = loggedIn ? name : "";
  updateMobileMenuState();
}

async function initAuth() {
  supabaseClient = initSupabaseClient();
  document.body.dataset.page = "pageHome";
  const last = localStorage.getItem("ambientLastPage");
  if (last === "home") {
    showPage("pageHome");
  } else {
    showPage("page1");
  }

  const logo = document.querySelector(".logo-img");
  if (logo) {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => {
      goHomeWithFade();
    });
  }

  if (burgerBtn) burgerBtn.addEventListener("click", openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener("click", closeMobileMenu);
  if (mobileMenu) {
    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) closeMobileMenu();
    });
  }
  if (mobileMenuHomeBtn) mobileMenuHomeBtn.addEventListener("click", () => {
    closeMobileMenu();
    goHomeWithFade();
  });
  if (mobileMenuSettingsBtn) mobileMenuSettingsBtn.addEventListener("click", () => {
    closeMobileMenu();
    transitionTo("pageSettings");
  });
  if (mobileMenuLoginBtn) mobileMenuLoginBtn.addEventListener("click", () => {
    closeMobileMenu();
    openAuth("login");
  });
  if (mobileMenuSignupBtn) mobileMenuSignupBtn.addEventListener("click", () => {
    closeMobileMenu();
    openAuth("signup");
  });
  if (mobileMenuLogoutBtn) mobileMenuLogoutBtn.addEventListener("click", handleLogout);

  if (authTabLogin) authTabLogin.addEventListener("click", () => setAuthMode("login"));
  if (authTabSignup) authTabSignup.addEventListener("click", () => setAuthMode("signup"));
  if (authCloseBtn) authCloseBtn.addEventListener("click", closeAuth);
  if (authSubmitBtn) authSubmitBtn.addEventListener("click", handleAuthSubmit);
  if (authGoogleBtn) authGoogleBtn.addEventListener("click", signInWithGoogle);
  if (authPassword && authPasswordConfirm) {
    const syncConfirm = () => {
      if (authMode === "signup") {
        authPasswordConfirm.value = authPassword.value;
      }
    };
    authPassword.addEventListener("input", syncConfirm);
    authPassword.addEventListener("change", syncConfirm);
    authPassword.addEventListener("paste", () => setTimeout(syncConfirm, 0));
  }

  if (homeTimerBtn) homeTimerBtn.addEventListener("click", () => transitionTo("page1"));
  if (homeSignupBtn) homeSignupBtn.addEventListener("click", () => openAuth("signup"));
  if (homeGoThemesBtn) homeGoThemesBtn.addEventListener("click", () => transitionTo("page1"));
  if (timeBackBtn) timeBackBtn.addEventListener("click", () => transitionTo("page1"));
  if (timerBackBtn) timerBackBtn.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    transitionTo("page1");
  });

  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      if (!profileMenu) return;
      const isOpen = profileMenu.classList.toggle("active");
      profileBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.addEventListener("click", (e) => {
    if (!profileMenu || !profileBtn) return;
    if (profileMenu.contains(e.target) || profileBtn.contains(e.target)) return;
    profileMenu.classList.remove("active");
    profileBtn.setAttribute("aria-expanded", "false");
  });

  if (profileLoginBtn) profileLoginBtn.addEventListener("click", () => {
    if (profileMenu) profileMenu.classList.remove("active");
    openAuth("login");
  });
  if (profileSignupBtn) profileSignupBtn.addEventListener("click", () => {
    if (profileMenu) profileMenu.classList.remove("active");
    openAuth("signup");
  });
  if (profileLogoutBtn) profileLogoutBtn.addEventListener("click", handleLogout);
  if (profileSettingsBtn) profileSettingsBtn.addEventListener("click", () => {
    if (profileMenu) profileMenu.classList.remove("active");
    transitionTo("pageSettings");
  });
  if (settingsBackBtn) settingsBackBtn.addEventListener("click", () => transitionTo(lastMainPage));

  if (settingsSaveBtn) {
    settingsSaveBtn.addEventListener("click", async () => {
      if (!supabaseClient || !currentUser) return;
      const updates = {};
      const newName = (settingsDisplayName.value || "").trim();
      if (newName) updates.display_name = newName;
      const newEmail = (settingsEmail.value || "").trim();
      const hasMetadata = Object.keys(updates).length > 0;

      if (hasMetadata) {
        const { error } = await supabaseClient.auth.updateUser({ data: updates });
        if (error) {
          setMessage(settingsMessage, error.message, true);
          return;
        }
      }
      if (newEmail) {
        const { error } = await supabaseClient.auth.updateUser({ email: newEmail });
        if (error) {
          setMessage(settingsMessage, error.message, true);
          return;
        }
      }

      setMessage(settingsMessage, "Profile updated.", false);
      await refreshAuthState();
      setTimeout(() => window.location.reload(), 250);
    });
  }

  if (settingsPasswordBtn) {
    settingsPasswordBtn.addEventListener("click", async () => {
      if (!supabaseClient || !currentUser) return;
      const email = currentUser.email;
      if (!email) return;
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
      setMessage(settingsMessage, error ? error.message : "Password email sent.", !!error);
    });
  }

  if (settingsDeleteBtn) {
    settingsDeleteBtn.addEventListener("click", async () => {
      if (!supabaseClient || !currentUser) return;
      const ok1 = await openConfirm({
        title: "Delete account?",
        message: "This will remove your account and themes."
      });
      if (!ok1) return;
      const ok2 = await openConfirm({
        title: "Are you absolutely sure?",
        message: "This action cannot be undone."
      });
      if (!ok2) return;
      try {
        const session = await supabaseClient.auth.getSession();
        const token = session?.data?.session?.access_token;
        if (!token) throw new Error("No session");
        await fetch(`${SUPABASE_URL}/auth/v1/user`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "apikey": SUPABASE_ANON_KEY
          }
        });
        await supabaseClient.auth.signOut();
        showPage("pageHome");
      } catch (err) {
        setMessage(settingsMessage, "Unable to delete account right now.", true);
      }
    });
  }

  if (settingsAvatarInput) {
    settingsAvatarInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file || !supabaseClient || !currentUser) return;
      const path = `${currentUser.id}/avatar-${Date.now()}.${file.name.split(".").pop()}`;
      const { error } = await supabaseClient.storage.from("avatars").upload(path, file, {
        upsert: true,
        contentType: file.type
      });
      if (error) {
        setMessage(settingsMessage, error.message, true);
        return;
      }
      const { data } = supabaseClient.storage.from("avatars").getPublicUrl(path);
      await supabaseClient.auth.updateUser({ data: { avatar_url: data.publicUrl } });
      setMessage(settingsMessage, "Avatar updated.", false);
      await refreshAuthState();
    });
  }

  if (!supabaseClient) {
    updateProfileUI();
    return;
  }

  await refreshAuthState();
  supabaseClient.auth.onAuthStateChange(async () => {
    await refreshAuthState();
  });
}

async function refreshAuthState() {
  if (!supabaseClient) return;
  const { data } = await supabaseClient.auth.getSession();
  currentUser = data?.session?.user || null;
  await syncGoogleProfileIfNeeded(currentUser);
  const fresh = await supabaseClient.auth.getUser();
  currentUser = fresh?.data?.user || currentUser;
  updateProfileUI();
  await loadCloudThemes();
  loadAndRenderLocalThemes();
  loadAndRenderOnlineThemes();
}

async function loadCloudThemes() {
  if (!supabaseClient || !currentUser) {
    cloudThemesCache = [];
    return;
  }
  const { data, error } = await supabaseClient
    .from("themes")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });
  if (error) {
    cloudThemesCache = [];
    return;
  }
  cloudThemesCache = data || [];
}

function promptLoginToast() {
  showToast({
    message: "To keep themes across devices, please log in or sign up.",
    closable: true,
    durationMs: 3000,
    actions: [
      { label: "Log in", onClick: () => openAuth("login") },
      { label: "Sign up", onClick: () => openAuth("signup") }
    ]
  });
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
  transitionTo("timerBox");

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
        playAlarmStandard();
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

function playAlarmStandard() {
  if (!alarmSound) return;
  alarmSound.currentTime = 0;
  alarmSound.volume = 1;
  if (alarmFadeHandler) {
    alarmSound.removeEventListener("timeupdate", alarmFadeHandler);
  }
  alarmFadeHandler = () => {
    if (!Number.isFinite(alarmSound.duration)) return;
    const remaining = alarmSound.duration - alarmSound.currentTime;
    if (remaining <= 2.5) {
      const ratio = Math.max(0, remaining / 2.5);
      alarmSound.volume = ratio;
    }
  };
  alarmSound.addEventListener("timeupdate", alarmFadeHandler);
  alarmSound.play().catch(() => {});
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
   SEAMLESS VIDEO LOOPING
   ================================ */

function normalizeSrc(src) {
  try {
    return new URL(src, window.location.href).href;
  } catch {
    return src;
  }
}

function getAdaptiveFadeMs(durationSec) {
  if (!Number.isFinite(durationSec) || durationSec <= 0) {
    return VIDEO_LOOP_BASE_FADE_MS;
  }
  if (durationSec <= VIDEO_LOOP_SHORT_CLIP_SEC) {
    return VIDEO_LOOP_MIN_FADE_MS;
  }
  const scaled = Math.round(durationSec * 120);
  return Math.min(VIDEO_LOOP_BASE_FADE_MS, Math.max(VIDEO_LOOP_MIN_FADE_MS, scaled));
}

function getLeadSec(fadeMs) {
  return Math.min(0.18, Math.max(0.08, fadeMs / 1000 + 0.02));
}

function setFadeMsForVideo(video, fadeMs) {
  if (!video) return;
  video.style.setProperty("--fade-ms", `${fadeMs}ms`);
}

function initVideoElements() {
  bgVideos.forEach(video => {
    if (!video) return;
    video.muted = true;
    video.volume = 0;
    video.loop = false;
    video.playsInline = true;
    video.addEventListener("timeupdate", handleVideoTimeUpdate);
    video.addEventListener("ended", () => {
      if (video === getActiveVideo()) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    });
  });
}

function getActiveVideo() {
  return bgVideos[activeVideoIndex];
}

function getIdleVideo() {
  return bgVideos[1 - activeVideoIndex];
}

function setActiveLayer(active) {
  bgVideos.forEach(video => {
    video.classList.toggle("active", video === active);
  });
}

function setActiveImageLayer(active) {
  bgImages.forEach(image => {
    image.classList.toggle("active", image === active);
  });
}

function prepareVideo(video, src) {
  video.src = src;
  video.muted = true;
  video.volume = 0;
  video.loop = false;
  video.preload = "auto";
  video.load();
}

function startSeamlessVideoLoop(src) {
  currentVideoSrc = normalizeSrc(src);
  isCrossfading = false;

  const active = getActiveVideo();
  const idle = getIdleVideo();

  prepareVideo(active, currentVideoSrc);
  prepareVideo(idle, currentVideoSrc);

  active.currentTime = 0;
  active.play().catch(() => {});
  idle.pause();
  idle.currentTime = 0;

  setFadeMsForVideo(active, VIDEO_LOOP_BASE_FADE_MS);
  setFadeMsForVideo(idle, VIDEO_LOOP_BASE_FADE_MS);
  setActiveLayer(active);
  startVideoWatchdog();
}

function startImageFade(src) {
  const active = bgImages[activeImageIndex];
  const idle = bgImages[1 - activeImageIndex];
  if (!idle) return;
  setFadeMsForImage(active, BG_SWITCH_FADE_MS);
  setFadeMsForImage(idle, BG_SWITCH_FADE_MS);
  idle.style.backgroundImage = `url(${src})`;
  setActiveImageLayer(idle);
  activeImageIndex = 1 - activeImageIndex;
}

function setFadeMsForImage(image, fadeMs) {
  if (!image) return;
  image.style.setProperty("--fade-ms", `${fadeMs}ms`);
}

function pauseVideoAfterFade(video) {
  if (!video) return;
  setTimeout(() => {
    if (!video.classList.contains("active")) {
      video.pause();
      video.currentTime = 0;
    }
  }, BG_SWITCH_FADE_MS + 50);
}

function transitionToVideo(src) {
  const targetSrc = normalizeSrc(src);
  if (currentVideoSrc === targetSrc) {
    const active = getActiveVideo();
    if (active && !active.paused) {
      return;
    }
    if (active) {
      active.play().catch(() => {});
      return;
    }
  }
  currentVideoSrc = targetSrc;
  isCrossfading = false;

  const activeVideo = getActiveVideo();
  const idleVideo = getIdleVideo();

  setFadeMsForVideo(activeVideo, BG_SWITCH_FADE_MS);
  setFadeMsForVideo(idleVideo, BG_SWITCH_FADE_MS);

  idleVideo.src = targetSrc;
  idleVideo.muted = true;
  idleVideo.volume = 0;
  idleVideo.loop = false;
  idleVideo.preload = "auto";
  idleVideo.load();

  let didSwitch = false;
  const switchToIdle = () => {
    if (didSwitch) return;
    didSwitch = true;
    idleVideo.currentTime = 0;
    idleVideo.play().then(() => {
      setActiveLayer(idleVideo);
      bgImages.forEach(image => image.classList.remove("active"));
      pauseVideoAfterFade(activeVideo);
      activeVideoIndex = 1 - activeVideoIndex;
    }).catch(() => {});
  };

  if (idleVideo.readyState >= 2) {
    switchToIdle();
  } else {
    idleVideo.addEventListener("canplay", switchToIdle, { once: true });
    setTimeout(() => {
      if (idleVideo.readyState >= 2) {
        switchToIdle();
      }
    }, 300);
  }
  startVideoWatchdog();
}

function transitionToImage(src) {
  const targetSrc = normalizeSrc(src);
  if (currentPreviewTheme.mediaType === "image" && currentPreviewTheme.src === targetSrc) {
    return;
  }
  stopVideoWatchdog();
  bgVideos.forEach(video => {
    setFadeMsForVideo(video, BG_SWITCH_FADE_MS);
    video.classList.remove("active");
    pauseVideoAfterFade(video);
  });
  startImageFade(targetSrc);
}

function startVideoWatchdog() {
  if (videoWatchdog || isPreviewMode) return;
  videoWatchdog = setInterval(() => {
    const active = getActiveVideo();
    if (!active || !currentVideoSrc) return;
    const isStuck = Number.isFinite(active.currentTime) && Number.isFinite(active.duration)
      ? active.currentTime >= active.duration - 0.08
      : false;
    if ((active.ended || isStuck) && !isForceRestarting && !isPreviewMode) {
      forceSeamlessRestart();
    }
  }, 1000);
}

function stopVideoWatchdog() {
  if (videoWatchdog) {
    clearInterval(videoWatchdog);
    videoWatchdog = null;
  }
}

function forceSeamlessRestart() {
  const active = getActiveVideo();
  const idle = getIdleVideo();
  if (!active || !idle || !currentVideoSrc) return;
  isForceRestarting = true;

  setFadeMsForVideo(active, BG_SWITCH_FADE_MS);
  setFadeMsForVideo(idle, BG_SWITCH_FADE_MS);

  idle.src = currentVideoSrc;
  idle.muted = true;
  idle.volume = 0;
  idle.loop = false;
  idle.preload = "auto";
  idle.load();
  idle.currentTime = 0.05;

  let didSwap = false;
  const swap = () => {
    if (didSwap) return;
    didSwap = true;
    idle.play().then(() => {
      setActiveLayer(idle);
      setTimeout(() => {
        active.pause();
        active.currentTime = 0;
        activeVideoIndex = 1 - activeVideoIndex;
        isForceRestarting = false;
      }, BG_SWITCH_FADE_MS + 40);
    }).catch(() => {
      isForceRestarting = false;
    });
  };

  if (idle.readyState >= 2) {
    swap();
  } else {
    idle.addEventListener("canplay", swap, { once: true });
    setTimeout(() => swap(), 120);
  }
}

function setConfirmedThemeFromCurrent() {
  if (currentVideoSrc) {
    confirmedTheme = { mediaType: "video", src: currentVideoSrc };
    return;
  }
  confirmedTheme = { mediaType: "image", src: bgImageA?.style.backgroundImage?.replace(/^url\(["']?|["']?\)$/g, "") || "images/bg.jpg" };
}

function handleVideoTimeUpdate(e) {
  const video = e.currentTarget;
  if (video !== getActiveVideo()) return;
  const activeSrc = normalizeSrc(video.currentSrc || video.src);
  if (isCrossfading || activeSrc !== currentVideoSrc) return;

  const duration = video.duration;
  if (!Number.isFinite(duration) || duration <= 0) return;

  if (duration <= VIDEO_LOOP_SHORT_CLIP_SEC) {
    video.loop = true;
    return;
  }

  video.loop = false;
  const fadeMs = getAdaptiveFadeMs(duration);
  const leadSec = getLeadSec(fadeMs);
  const remaining = duration - video.currentTime;
  if (remaining > leadSec) return;

  isCrossfading = true;
  const idle = getIdleVideo();
  const previousActive = video;

  const doCrossfade = () => {
    if (activeSrc !== currentVideoSrc) {
      isCrossfading = false;
      return;
    }
    setFadeMsForVideo(previousActive, fadeMs);
    setFadeMsForVideo(idle, fadeMs);
    idle.currentTime = 0.05;
    const startSwap = () => {
      idle.play().then(() => {
        setActiveLayer(idle);
        setTimeout(() => {
          previousActive.pause();
          previousActive.currentTime = 0;
          activeVideoIndex = 1 - activeVideoIndex;
          isCrossfading = false;
        }, fadeMs + 40);
      }).catch(() => {
        isCrossfading = false;
      });
    };
    const waitForSeekOrTimeout = () => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        startSwap();
      };
      const onSeeked = () => finish();
      idle.addEventListener("seeked", onSeeked, { once: true });
      setTimeout(finish, 120);
    };
    if (idle.readyState >= 2) {
      waitForSeekOrTimeout();
    } else {
      idle.addEventListener("loadeddata", () => {
        waitForSeekOrTimeout();
      }, { once: true });
    }
  };

  if (idle.readyState >= 2) {
    doCrossfade();
  } else {
    idle.addEventListener("canplay", () => {
      doCrossfade();
    }, { once: true });
  }
}

initVideoElements();
