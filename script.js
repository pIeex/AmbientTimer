/* ================================
   FINAL PREMIUM TIMER SCRIPT
   ================================ */

let remainingSeconds = 0;
let timerInterval = null;
let paused = false;

const bgVideoA = document.getElementById("bgVideoA");
const bgVideoB = document.getElementById("bgVideoB");
const bgImage = document.getElementById("bgImage");
const timerDisplay = document.getElementById("timerDisplay");
const localUploadInput = document.getElementById("localUploadInput");
const localThemesGrid = document.getElementById("localThemesGrid");
const onlineThemesGrid = document.getElementById("onlineThemesGrid");
const onlineUrlInput = document.getElementById("onlineUrlInput");
const addOnlineThemeBtn = document.getElementById("addOnlineThemeBtn");
const confirmOverlay = document.getElementById("confirmOverlay");
const confirmTitle = document.getElementById("confirmTitle");
const confirmMessage = document.getElementById("confirmMessage");
const confirmCancel = document.getElementById("confirmCancel");
const confirmOk = document.getElementById("confirmOk");
const topBar = document.getElementById("topBar");
const themeSearch = document.getElementById("themeSearch");
const homeTimerBtn = document.getElementById("homeTimerBtn");
const homeSignupBtn = document.getElementById("homeSignupBtn");
const homeGoThemesBtn = document.getElementById("homeGoThemesBtn");
const homeUsername = document.getElementById("homeUsername");
const timerBackBtn = document.getElementById("timerBackBtn");
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
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authMessage = document.getElementById("authMessage");
const toastContainer = document.getElementById("toastContainer");
const settingsBackBtn = document.getElementById("settingsBackBtn");
const settingsAvatar = document.getElementById("settingsAvatar");
const settingsAvatarFallback = document.getElementById("settingsAvatarFallback");
const settingsAvatarInput = document.getElementById("settingsAvatarInput");
const settingsDisplayName = document.getElementById("settingsDisplayName");
const settingsEmail = document.getElementById("settingsEmail");
const settingsPassword = document.getElementById("settingsPassword");
const settingsSaveBtn = document.getElementById("settingsSaveBtn");
const settingsMessage = document.getElementById("settingsMessage");

const LOCAL_DB_NAME = "ambientTimerThemes";
const LOCAL_STORE_NAME = "localThemes";
const ONLINE_STORAGE_KEY = "ambientTimerOnlineThemes";

const SUPABASE_URL = window.SUPABASE_URL || "https://fytjxvaxxtmnaoynpxqy.supabase.co";
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dGp4dmF4eHRtbmFveW5weHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTMzMjEsImV4cCI6MjA4NTY4OTMyMX0.CxVEQUgYEfkVqtyj78pyDCuWfgqU98r3oFTzS7ijM-0";

const localObjectUrls = new Map();
const bgVideos = [bgVideoA, bgVideoB];
const VIDEO_LOOP_BASE_FADE_MS = 900;
const VIDEO_LOOP_MIN_FADE_MS = 160;
const VIDEO_LOOP_SHORT_CLIP_SEC = 5.5;

let activeVideoIndex = 0;
let isCrossfading = false;
let currentVideoSrc = "";
let currentUser = null;
let supabaseClient = null;
let lastMainPage = "page1";
let authMode = "login";
let cloudThemesCache = [];

/* ================================
   PAGE CONTROL (Bulletproof)
   ================================ */

function showPage(id) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
  document.body.dataset.page = id;
  if (id === "page1" || id === "page2") {
    lastMainPage = id;
  }
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
    bgVideos.forEach(video => {
      video.style.display = "block";
      video.style.zIndex = "1";
    });
    startSeamlessVideoLoop(theme.src);
  } else {
    bgVideos.forEach(video => {
      video.pause();
      video.classList.remove("active");
      video.style.display = "none";
    });
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
  const displayName = theme.name || "Untitled";
  card.dataset.name = displayName.toLowerCase();
  if (theme.mediaType === "video") {
    card.classList.add("video");
  }

  if (theme.preview) {
    card.style.backgroundImage = `url(${theme.preview})`;
  }

  card.addEventListener("click", () => applyTheme(theme));

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
    del.textContent = "Delete";
    del.addEventListener("click", async (e) => {
      e.stopPropagation();
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
  container.appendChild(card);
  applySearchFilter(themeSearch?.value || "");
}

function animateRemoveCard(card) {
  return new Promise((resolve) => {
    if (!card) return resolve();
    card.classList.remove("pop-in");
    card.classList.add("pop-out");
    setTimeout(() => resolve(), 220);
  });
}

function applySearchFilter(query) {
  const q = (query || "").trim().toLowerCase();
  const cards = document.querySelectorAll("#page1 .thumb");
  cards.forEach(card => {
    const name = (card.dataset.name || "").toLowerCase();
    card.style.display = !q || name.includes(q) ? "" : "none";
  });
}

function initBuiltInThemes() {
  const builtins = document.querySelectorAll("#defaultThemes .thumb");
  builtins.forEach(card => {
    const src = card.dataset.src;
    const mediaType = card.dataset.type || (src && src.endsWith(".mp4") ? "video" : "image");
    const name = card.dataset.name || "Built-in";
    card.dataset.name = name.toLowerCase();
    card.addEventListener("click", () => applyTheme({ src, mediaType, name }));
  });
}

function initSearch() {
  if (!themeSearch) return;
  themeSearch.addEventListener("input", (e) => {
    applySearchFilter(e.target.value);
  });
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
  if (error) return null;
  return data;
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

async function addLocalThemeFromFile(file, autoApply = false) {
  const mediaType = file.type.startsWith("video") ? "video" : "image";
  const id = makeId();
  const name = deriveNameFromFile(file);

  if (isLoggedIn() && supabaseClient) {
    const upload = await uploadThemeFile(file, id);
    if (upload) {
      const preview = mediaType === "image"
        ? upload.publicUrl
        : await captureVideoFrame(upload.publicUrl);
      const record = await saveCloudThemeRecord({
        kind: "local",
        mediaType,
        name,
        url: upload.publicUrl,
        storagePath: upload.path
      });
      if (record) {
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
      }
    }
  }

  await saveLocalTheme({
    id,
    name,
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
    const record = await saveCloudThemeRecord({
      kind: "online",
      mediaType,
      url,
      name: theme.name
    });
    if (record) {
      await renderOnlineTheme({
        id: record.id,
        kind: "online",
        mediaType,
        url: record.url,
        name: record.name || theme.name,
        storagePath: record.storage_path || "",
        source: "cloud"
      });
    }
  } else {
    const list = getOnlineThemes();
    list.push(theme);
    setOnlineThemes(list);
    await renderOnlineTheme(theme);
    promptLoginToast();
  }
  onlineUrlInput.value = "";
}

async function renderOnlineTheme(theme) {
  let preview = theme.preview || null;
  if (!preview) {
    if (theme.mediaType === "image") {
      preview = theme.url;
    } else {
      preview = await captureVideoFrame(theme.url);
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
    renderThemeCard({ ...theme, preview }, localThemesGrid, {
      deletable: true,
      editable: true,
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
  onlineThemesGrid.innerHTML = "";

  const list = getOnlineThemes();
  for (const theme of list) {
    await renderOnlineTheme(theme);
  }

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
    }
  }

  applySearchFilter(themeSearch?.value || "");
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
initBuiltInThemes();
initSearch();
initAuth();

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
  setMessage(authMessage, "", false);
}

function setMessage(el, text, isError = false) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("error", isError);
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

function updateProfileUI() {
  const name = currentUser?.user_metadata?.display_name || "Guest";
  const email = currentUser?.email || "Not signed in";
  const avatarUrl = currentUser?.user_metadata?.avatar_url || "";
  const initial = name ? name.charAt(0).toUpperCase() : "A";
  const loggedIn = isLoggedIn();

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

  if (profileLoginBtn) profileLoginBtn.style.display = loggedIn ? "none" : "block";
  if (profileSignupBtn) profileSignupBtn.style.display = loggedIn ? "none" : "block";
  if (profileLogoutBtn) profileLogoutBtn.style.display = loggedIn ? "block" : "none";
  if (profileSettingsBtn) profileSettingsBtn.style.display = loggedIn ? "block" : "none";

  document.body.dataset.auth = loggedIn ? "true" : "false";
  if (homeUsername) homeUsername.textContent = loggedIn ? name : "";
}

async function initAuth() {
  supabaseClient = initSupabaseClient();
  document.body.dataset.page = "pageHome";

  if (authTabLogin) authTabLogin.addEventListener("click", () => setAuthMode("login"));
  if (authTabSignup) authTabSignup.addEventListener("click", () => setAuthMode("signup"));
  if (authCloseBtn) authCloseBtn.addEventListener("click", closeAuth);
  if (authSubmitBtn) authSubmitBtn.addEventListener("click", handleAuthSubmit);

  if (homeTimerBtn) homeTimerBtn.addEventListener("click", () => showPage("page1"));
  if (homeSignupBtn) homeSignupBtn.addEventListener("click", () => openAuth("signup"));
  if (homeGoThemesBtn) homeGoThemesBtn.addEventListener("click", () => showPage("page1"));
  if (timerBackBtn) timerBackBtn.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    showPage("page1");
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
  if (profileLogoutBtn) profileLogoutBtn.addEventListener("click", async () => {
    if (!supabaseClient) return;
    if (profileMenu) profileMenu.classList.remove("active");
    await supabaseClient.auth.signOut();
  });
  if (profileSettingsBtn) profileSettingsBtn.addEventListener("click", () => {
    if (profileMenu) profileMenu.classList.remove("active");
    showPage("pageSettings");
  });
  if (settingsBackBtn) settingsBackBtn.addEventListener("click", () => showPage(lastMainPage));

  if (settingsSaveBtn) {
    settingsSaveBtn.addEventListener("click", async () => {
      if (!supabaseClient || !currentUser) return;
      const updates = {};
      const newName = (settingsDisplayName.value || "").trim();
      if (newName) updates.display_name = newName;
      const newEmail = (settingsEmail.value || "").trim();
      const newPassword = settingsPassword.value || "";
      const hasMetadata = Object.keys(updates).length > 0;

      if (hasMetadata) {
        await supabaseClient.auth.updateUser({ data: updates });
      }
      if (newEmail) {
        await supabaseClient.auth.updateUser({ email: newEmail });
      }
      if (newPassword) {
        await supabaseClient.auth.updateUser({ password: newPassword });
      }

      setMessage(settingsMessage, "Profile updated.", false);
      settingsPassword.value = "";
      await refreshAuthState();
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
  return Math.max(0.18, fadeMs / 1000 + 0.05);
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
    idle.currentTime = 0;
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

  if (idle.readyState >= 2) {
    doCrossfade();
  } else {
    idle.addEventListener("canplay", () => {
      doCrossfade();
    }, { once: true });
  }
}

initVideoElements();
