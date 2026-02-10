/* ================================
   FINAL PREMIUM TIMER SCRIPT
   ================================ */

let remainingSeconds = 0;
let timerInterval = null;
let paused = false;
let timerEndMs = 0;
let pauseStartedMs = null;

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
const authBody = document.querySelector(".auth-body");
const authConfirmBox = document.getElementById("authConfirmBox");
const authResendWrap = document.getElementById("authResendWrap");
const authResendBtn = document.getElementById("authResendBtn");
const toastContainer = document.getElementById("toastContainer");
const orientationOverlay = document.getElementById("orientationOverlay");
const orientationMessage = document.getElementById("orientationMessage");
const timerHint = document.getElementById("timerHint");
const timerHintClose = document.getElementById("timerHintClose");
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
const localPanelBlock = document.getElementById("localPanelBlock");
const onlinePanelBlock = document.getElementById("onlinePanelBlock");
const recentSection = document.getElementById("recentSection");
const recentThemesGrid = document.getElementById("recentThemesGrid");
const builtInSection = document.getElementById("builtInSection");
const uploadsSection = document.getElementById("uploadsSection");
const allThemesSection = document.getElementById("allThemesSection");
const allThemesGrid = document.getElementById("allThemesGrid");
const viewDefaultBtn = document.getElementById("viewDefaultBtn");
const viewUploadsBtn = document.getElementById("viewUploadsBtn");
const viewAllBtn = document.getElementById("viewAllBtn");
const allThemesSortWrap = document.getElementById("allThemesSortWrap");
const allThemesSort = document.getElementById("allThemesSort");
const allThemesFilterBtn = document.getElementById("allThemesFilterBtn");
const allThemesFilterPanel = document.getElementById("allThemesFilterPanel");
const filterVideo = document.getElementById("filterVideo");
const filterImage = document.getElementById("filterImage");

const LOCAL_DB_NAME = "ambientTimerThemes";
const LOCAL_STORE_NAME = "localThemes";
const ONLINE_STORAGE_KEY = "ambientTimerOnlineThemes";
const THEME_RECENT_KEY = "ambientRecentThemes";
const THEME_USAGE_KEY = "ambientThemeUsage";
const GUEST_SAVE_TOAST_SEEN_KEY = "ambientGuestSaveToastSeen";

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
let currentMediaMode = "image";
let currentThemeView = "default";
const allThemesMediaFilter = { video: true, image: true };
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
const pendingOnlineUrls = new Set();
const pendingLocalSigs = new Set();
let filterFitScheduled = false;
let loginNeedsConfirm = false;
let orientationLockTarget = "portrait";
let guestImportPrompting = false;
const preloadSeen = new Set();
const preloadQueue = [];
let preloading = 0;
let preloadScheduled = false;
const connectionInfo = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
const DEVICE_MEMORY_GB = Number(navigator.deviceMemory || 0);
const CPU_CORES = Number(navigator.hardwareConcurrency || 0);
const IS_DATA_SAVER = Boolean(connectionInfo && connectionInfo.saveData);
const EFFECTIVE_TYPE = String(connectionInfo?.effectiveType || "").toLowerCase();
const IS_SLOW_NETWORK = /(^|[^a-z])(slow-2g|2g)([^a-z]|$)/.test(EFFECTIVE_TYPE);
const IS_LOW_END_DEVICE = (
  (DEVICE_MEMORY_GB > 0 && DEVICE_MEMORY_GB <= 4) ||
  (CPU_CORES > 0 && CPU_CORES <= 4) ||
  IS_DATA_SAVER ||
  IS_SLOW_NETWORK
);
const MAX_PRELOAD = IS_LOW_END_DEVICE ? 1 : 2;
const MAX_BACKGROUND_VIDEO_PRELOADS = IS_LOW_END_DEVICE ? 5 : 14;
const BUILTIN_REMOTE_VIDEO_PRELOAD_LIMIT = IS_LOW_END_DEVICE ? 3 : 10;
const MAX_VIDEO_WARM_INFLIGHT = IS_LOW_END_DEVICE ? 1 : 2;
let builtInThemes = [];
let queuedVideoPreloads = 0;
const warmingVideoUrls = new Set();
const warmedVideoUrls = new Set();
let recentRenderSignature = "";
let allThemesRenderSignature = "";
const EXTRA_BUILTIN_THEMES = [
  { name: "Waterfall of Godafoss", src: "https://motionbgs.com/dl/hd/6", preview: "https://motionbgs.com/media/6/waterfall-of-godafoss-in-iceland.1920x1080.jpg", captureFirstFrame: true },
  { name: "Green Grass", src: "https://motionbgs.com/dl/hd/34", preview: "https://motionbgs.com/media/34/green-grass.1920x1080.jpg", captureFirstFrame: true },
  { name: "Ireland Beach", src: "https://motionbgs.com/dl/hd/35", preview: "https://motionbgs.com/media/35/irlandbeach.1920x1080.jpg", captureFirstFrame: true },
  { name: "Under the Cherry Tree", src: "https://motionbgs.com/dl/hd/36", preview: "https://motionbgs.com/media/36/under-the-cherry-tree.1920x1080.jpg", captureFirstFrame: true },
  { name: "Raining", src: "https://motionbgs.com/dl/hd/55", preview: "https://motionbgs.com/media/55/raining.1920x1080.jpg", captureFirstFrame: true },
  { name: "Forest Stream", src: "https://motionbgs.com/dl/hd/113", preview: "https://motionbgs.com/media/113/forest-stream.1920x1080.jpg", captureFirstFrame: true },
  { name: "Glow Sunset", src: "https://motionbgs.com/dl/hd/115", preview: "https://motionbgs.com/media/115/glow-sunset.1920x1080.jpg", captureFirstFrame: true },
  { name: "Snowy in the Forest", src: "https://motionbgs.com/dl/hd/441", preview: "https://motionbgs.com/media/441/snowy-in-the-forest.jpg", captureFirstFrame: true },
  { name: "Road in Forest", src: "https://motionbgs.com/dl/hd/712", preview: "https://motionbgs.com/media/712/road-in-forest.jpg", captureFirstFrame: true },
  { name: "Sunset", src: "https://motionbgs.com/dl/hd/717", preview: "https://motionbgs.com/media/717/sunset.jpg", captureFirstFrame: true },
  { name: "Raindrop", src: "https://motionbgs.com/dl/hd/718", preview: "https://motionbgs.com/media/718/raindrop.jpg", captureFirstFrame: true },
  { name: "Winter Mountain Sunset", src: "https://motionbgs.com/dl/hd/724", preview: "https://motionbgs.com/media/724/winter-mountain-sunset.jpg", captureFirstFrame: true },
  { name: "Autumn Forest", src: "https://motionbgs.com/dl/hd/730", preview: "https://motionbgs.com/media/730/autumn-forest.jpg", captureFirstFrame: true },
  { name: "Autumn Lake", src: "https://motionbgs.com/dl/hd/731", preview: "https://motionbgs.com/media/731/autumn-lake.jpg", captureFirstFrame: true },
  { name: "Fantasy Autumn Forest", src: "https://motionbgs.com/dl/hd/742", preview: "https://motionbgs.com/media/742/fantasy-autumn-forest.jpg", captureFirstFrame: true },
  { name: "Blue Lake Near Pine Trees", src: "https://motionbgs.com/dl/hd/751", preview: "https://motionbgs.com/media/751/blue-lake-near-pine-trees.jpg", captureFirstFrame: true },
  { name: "Mountain Landscape in Autumn", src: "https://motionbgs.com/dl/hd/758", preview: "https://motionbgs.com/media/758/mountain-landscape-in-autumn.jpg", captureFirstFrame: true },
  { name: "Autumn Landscape", src: "https://motionbgs.com/dl/hd/763", preview: "https://motionbgs.com/media/763/autumn-landscape.jpg", captureFirstFrame: true },
  { name: "Winter Landscape", src: "https://motionbgs.com/dl/hd/764", preview: "https://motionbgs.com/media/764/winter-landscape.jpg", captureFirstFrame: true },
  { name: "Sakura Tree Landscape", src: "https://motionbgs.com/dl/hd/780", preview: "https://motionbgs.com/media/780/sakura-tree-landscape.jpg", captureFirstFrame: true },
  { name: "Nature Wallpaper", src: "https://www.desktophut.com/files/1673973739-1673973739-nature-wallpaper.mp4", preview: "https://www.desktophut.com/images/thumb_1673973739_328798.jpg", captureFirstFrame: true },
  { name: "Nature 31377", src: "https://www.desktophut.com/files/1672909223-1672909223-nature---31377.mp4", preview: "https://www.desktophut.com/images/thumb_1672909223_932203.jpg", captureFirstFrame: true },
  { name: "Nature Flower and Grass", src: "https://www.desktophut.com/files/1657547525-1657547525-nature-flower-and-grass-live-wallpaper-for-phone.mp4", preview: "https://www.desktophut.com/images/thumb_1657547525_889742.jpg", captureFirstFrame: true },
  { name: "Nature in a Lightbulb", src: "https://www.desktophut.com/files/1655314510-1655314510-nature-in-a-lightbulb-hd-live-wallpaper-for-pc.mp4", preview: "https://www.desktophut.com/images/thumb_1655314510_929198.jpg", captureFirstFrame: true },
  { name: "Forest Drone", src: "https://www.desktophut.com/files/1675384614-1675384614-forest-drone-live-wallpaper.mp4", preview: "https://www.desktophut.com/images/thumb_1675384614_448703.jpg", captureFirstFrame: true },
  { name: "Forest Tower", src: "https://www.desktophut.com/files/1675010255-1675010255-forest-tower.mp4", preview: "https://www.desktophut.com/images/thumb_1675010255_118528.jpg", captureFirstFrame: true },
  { name: "Forest Fox Waterfall", src: "https://www.desktophut.com/files/1657545749-1657545749-forest-fox-waterfall-fall-wallpaper-iphone.mp4", preview: "https://www.desktophut.com/images/thumb_1657545749_637385.jpg", captureFirstFrame: true },
  { name: "Forest Capsule", src: "https://www.desktophut.com/files/1655315590-1655315590-forest-capsule-hd-live-wallpaper-for-pc.mp4", preview: "https://www.desktophut.com/images/thumb_1655315590_241633.jpg", captureFirstFrame: true },
  { name: "Forest Spirits", src: "https://www.desktophut.com/files/1655315524-1655315524-forest-spirits-hd-live-wallpaper-for-pc.mp4", preview: "https://www.desktophut.com/images/thumb_1655315524_993962.jpg", captureFirstFrame: true },
  { name: "Forest Maze", src: "https://www.desktophut.com/files/1655315445-1655315445-forest-maze-hd-live-wallpaper-for-pc.mp4", preview: "https://www.desktophut.com/images/thumb_1655315445_533485.jpg", captureFirstFrame: true }
];
const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
const touchQuery = window.matchMedia("(hover: none), (pointer: coarse)");
let supportsHover = hoverQuery.matches;
let isTouchDevice = touchQuery.matches;
document.body.classList.toggle("touch", isTouchDevice);
document.body.dataset.media = currentMediaMode;
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

  const pageEl = document.getElementById(id);
  pageEl.classList.add("active");
  document.body.dataset.page = id;
  const lock = id === "timerBox" ? "landscape" : "portrait";
  setOrientationLock(lock);
  pageEl.scrollTop = 0;
  const content = pageEl.querySelector(".page-content");
  if (content) content.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  updateTimerHintVisibility();
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
  setMediaMode(theme.mediaType);
  if (theme.mediaType === "video") {
    transitionToVideo(theme.src);
  } else {
    transitionToImage(theme.src);
  }

  if (!previewOnly) {
    recordThemeSelection(theme);
    confirmedTheme = { mediaType: theme.mediaType, src: theme.src };
    currentPreviewTheme = { mediaType: theme.mediaType, src: theme.src };
    transitionTo("page2");
  }
}

function setMediaMode(mediaType) {
  const mode = mediaType === "video" ? "video" : "image";
  if (mode === currentMediaMode) return;
  currentMediaMode = mode;
  document.body.dataset.media = mode;
}

function getThemeUrlKey(url, mediaType) {
  return normalizeUrl(url);
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

function getMediaTypeFromFile(file) {
  const type = (file?.type || "").toLowerCase();
  const name = (file?.name || "").toLowerCase();
  if (type.startsWith("video") || name.endsWith(".mp4")) return "video";
  if (type.startsWith("image") || name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image";
  if (name.endsWith(".pkg")) return "pkg";
  return null;
}

function getThemeIdentity(theme) {
  return `${theme.mediaType || "image"}|${normalizeSrc(theme.src || "")}`;
}

function readStoredJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function getThemeUsageMap() {
  const value = readStoredJson(THEME_USAGE_KEY, {});
  return value && typeof value === "object" ? value : {};
}

function setThemeUsageMap(map) {
  localStorage.setItem(THEME_USAGE_KEY, JSON.stringify(map || {}));
}

function getRecentThemes() {
  const list = readStoredJson(THEME_RECENT_KEY, []);
  return Array.isArray(list) ? list : [];
}

function setRecentThemes(list) {
  localStorage.setItem(THEME_RECENT_KEY, JSON.stringify(Array.isArray(list) ? list : []));
}

function recordThemeSelection(theme) {
  if (!theme || !theme.src) return;
  const now = Date.now();
  const key = getThemeIdentity(theme);
  const usage = getThemeUsageMap();
  const current = usage[key] || { count: 0, lastUsed: 0 };
  usage[key] = {
    count: Number(current.count || 0) + 1,
    lastUsed: now
  };
  setThemeUsageMap(usage);

  const recent = getRecentThemes().filter(item => item.key !== key);
  recent.unshift({
    key,
    id: theme.id || "",
    kind: theme.kind || "",
    src: theme.src,
    mediaType: theme.mediaType || "image",
    name: theme.name || "Theme",
    preview: theme.preview || "",
    createdAt: theme.createdAt || now
  });
  setRecentThemes(recent.slice(0, 4));
  renderRecentThemes();
  if (currentThemeView === "all") {
    renderAllThemesGrid();
  }
}

function buildRecentThemeLookups() {
  const byKey = new Map();
  const byId = new Map();
  const byNameType = new Map();
  const selectors = ["#defaultThemes .thumb", "#localThemesGrid .thumb", "#onlineThemesGrid .thumb"];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((card) => {
      const theme = extractThemeFromCard(card);
      if (!theme || !theme.src) return;
      const key = getThemeIdentity(theme);
      if (!byKey.has(key)) byKey.set(key, theme);
      if (theme.id && !byId.has(theme.id)) byId.set(theme.id, theme);
      const nameKey = `${theme.mediaType || "image"}|${(theme.name || "").trim().toLowerCase()}`;
      if (nameKey && !byNameType.has(nameKey)) byNameType.set(nameKey, theme);
    });
  });

  return { byKey, byId, byNameType };
}

function resolveRecentThemeItem(item, lookups) {
  if (!item) return null;
  if (item.key && lookups.byKey.has(item.key)) {
    const live = lookups.byKey.get(item.key);
    return { ...item, ...live, key: getThemeIdentity(live) };
  }
  if (item.id && lookups.byId.has(item.id)) {
    const live = lookups.byId.get(item.id);
    return { ...item, ...live, key: getThemeIdentity(live) };
  }
  const nameKey = `${item.mediaType || "image"}|${(item.name || "").trim().toLowerCase()}`;
  if (nameKey && lookups.byNameType.has(nameKey)) {
    const live = lookups.byNameType.get(nameKey);
    return { ...item, ...live, key: getThemeIdentity(live) };
  }
  if (typeof item.src === "string" && item.src.startsWith("blob:")) {
    return item.id || item.kind === "local" ? { ...item, unresolvedBlob: true } : null;
  }
  return item.src ? item : null;
}

function appendExtraBuiltInThemes() {
  const grid = document.getElementById("defaultThemes");
  if (!grid) return;
  EXTRA_BUILTIN_THEMES.forEach((item, index) => {
    const existing = grid.querySelector(`.thumb[data-src="${CSS.escape(item.src)}"]`);
    if (existing) return;
    const card = document.createElement("div");
    card.className = "thumb";
    card.dataset.name = item.name;
    card.dataset.src = item.src;
    card.dataset.type = "video";
    card.dataset.createdAt = String(1000 + index);
    card.dataset.preview = item.preview || "";
    if (item.captureFirstFrame) card.dataset.needsFrame = "1";
    if (item.preview) {
      card.style.backgroundImage = `url('${item.preview}')`;
    }
    card.innerHTML = `<div class="thumb-meta"><span class="thumb-name">${item.name}</span></div>`;
    grid.appendChild(card);
  });
}

function hydrateBuiltInPreview(card, theme) {
  if (!card || !theme || theme.mediaType !== "video" || !theme.src) return;
  if (IS_LOW_END_DEVICE && card.dataset.preview) {
    card.dataset.needsFrame = "0";
    return;
  }
  const forceFirstFrame = card.dataset.needsFrame === "1";
  if (!forceFirstFrame && (card.dataset.preview || extractBgUrl(card.style.backgroundImage || ""))) return;
  captureVideoFrame(theme.src).then((preview) => {
    if (!preview || !card.isConnected) return;
    card.dataset.preview = preview;
    card.dataset.needsFrame = "0";
    card.style.backgroundImage = `url('${preview}')`;
    theme.preview = preview;
    if (currentThemeView === "all") {
      renderAllThemesGrid();
    }
  });
}

function extractThemeFromCard(card) {
  if (!card) return null;
  const src = card.dataset.src || "";
  const mediaType = card.dataset.type || "image";
  if (!src) return null;
  return {
    id: card.dataset.id || "",
    src,
    mediaType,
    name: card.dataset.displayName || card.dataset.name || "Theme",
    preview: card.dataset.preview || extractBgUrl(card.style.backgroundImage || ""),
    createdAt: Number(card.dataset.createdAt || 0)
  };
}

function renderRecentThemes() {
  if (!recentSection || !recentThemesGrid) return;
  const recent = getRecentThemes();
  if (!recent.length || currentThemeView === "all") {
    recentSection.hidden = true;
    recentRenderSignature = "";
    return;
  }
  const lookups = buildRecentThemeLookups();
  const resolved = [];
  let unresolvedBlobCount = 0;
  for (const item of recent) {
    const next = resolveRecentThemeItem(item, lookups);
    if (!next) continue;
    if (next.unresolvedBlob) {
      unresolvedBlobCount += 1;
      continue;
    }
    resolved.push(next);
  }
  if (!resolved.length) {
    recentSection.hidden = true;
    if (unresolvedBlobCount === 0) {
      recentRenderSignature = "";
    }
    return;
  }
  const signature = resolved
    .map(theme => `${theme.id || ""}|${theme.kind || ""}|${theme.mediaType || ""}|${theme.src || ""}|${theme.name || ""}`)
    .join("||");
  if (signature === recentRenderSignature && recentThemesGrid.childElementCount === resolved.length) {
    recentSection.hidden = false;
    return;
  }
  recentRenderSignature = signature;
  recentThemesGrid.innerHTML = "";
  recentSection.hidden = false;
  resolved.forEach((theme, index) => {
    renderThemeCard({
      id: `recent-${index}-${theme.key}`,
      kind: "recent",
      mediaType: theme.mediaType,
      src: theme.src,
      preview: theme.preview,
      name: theme.name,
      createdAt: theme.createdAt || 0
    }, recentThemesGrid, { group: "", animate: false });
  });
}

function renderAllThemesGrid() {
  if (!allThemesGrid) return;
  const usage = getThemeUsageMap();
  const map = new Map();
  const collect = (selector) => {
    document.querySelectorAll(selector).forEach(card => {
      const theme = extractThemeFromCard(card);
      if (!theme) return;
      const key = getThemeIdentity(theme);
      if (!map.has(key)) map.set(key, theme);
    });
  };
  collect("#defaultThemes .thumb");
  collect("#localThemesGrid .thumb");
  collect("#onlineThemesGrid .thumb");

  const list = Array.from(map.values()).filter((theme) => {
    const type = theme.mediaType || "image";
    if (type === "video") return allThemesMediaFilter.video;
    if (type === "image") return allThemesMediaFilter.image;
    return true;
  });
  const mode = allThemesSort?.value || "name";
  list.sort((a, b) => {
    const aKey = getThemeIdentity(a);
    const bKey = getThemeIdentity(b);
    const au = usage[aKey] || {};
    const bu = usage[bKey] || {};
    if (mode === "date") {
      return Number(b.createdAt || 0) - Number(a.createdAt || 0);
    }
    if (mode === "recent") {
      return Number(bu.lastUsed || 0) - Number(au.lastUsed || 0);
    }
    if (mode === "used") {
      return Number(bu.count || 0) - Number(au.count || 0);
    }
    return String(a.name || "").localeCompare(String(b.name || ""), undefined, { sensitivity: "base" });
  });

  const signature = `${mode}|v:${allThemesMediaFilter.video ? 1 : 0}|i:${allThemesMediaFilter.image ? 1 : 0}|` +
    list.map(t => `${t.id || ""}|${t.mediaType || ""}|${t.src || ""}|${t.name || ""}|${t.createdAt || 0}`).join("||");
  if (signature === allThemesRenderSignature && allThemesGrid.childElementCount === list.length) {
    return;
  }
  allThemesRenderSignature = signature;
  allThemesGrid.innerHTML = "";

  list.forEach((theme, index) => {
    renderThemeCard({
      ...theme,
      id: `all-${index}-${theme.src}`,
      kind: "all"
    }, allThemesGrid, { group: "", animate: false });
  });
}

function setAllThemesFilterPanel(open) {
  if (!allThemesFilterPanel || !allThemesFilterBtn) return;
  const show = !!open;
  allThemesFilterPanel.hidden = !show;
  allThemesFilterBtn.setAttribute("aria-expanded", show ? "true" : "false");
}

function setThemeView(mode) {
  currentThemeView = mode === "all" ? "all" : mode === "uploads" ? "uploads" : "default";
  const isAll = currentThemeView === "all";
  const isUploads = currentThemeView === "uploads";
  if (viewDefaultBtn) viewDefaultBtn.classList.toggle("active", !isAll && !isUploads);
  if (viewUploadsBtn) viewUploadsBtn.classList.toggle("active", isUploads);
  if (viewAllBtn) viewAllBtn.classList.toggle("active", isAll);
  if (allThemesSortWrap) allThemesSortWrap.hidden = !isAll;
  if (allThemesSection) allThemesSection.hidden = !isAll;
  if (!isAll) setAllThemesFilterPanel(false);
  if (builtInSection) builtInSection.hidden = isAll || isUploads;
  if (uploadsSection) uploadsSection.hidden = isAll;
  if (isAll) {
    if (recentSection) recentSection.hidden = true;
    renderAllThemesGrid();
  } else if (isUploads) {
    if (recentSection) recentSection.hidden = true;
  } else {
    renderRecentThemes();
  }
  applySearchFilter(themeSearch?.value || "");
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
      if (!["image", "video"].includes(item.mediaType)) return false;
      const key = `${item.kind || "online"}|${getThemeUrlKey(item.url || "", item.mediaType || "")}`;
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

function schedulePreloadWork() {
  if (preloadScheduled) return;
  preloadScheduled = true;
  const run = () => {
    preloadScheduled = false;
    processPreloadQueue();
  };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(run, { timeout: 1200 });
  } else {
    setTimeout(run, 250);
  }
}

function enqueuePreload(url, type) {
  enqueuePreloadWithOptions(url, type, {});
}

function enqueuePreloadWithOptions(url, type, options = {}) {
  if (!url) return;
  const normalizedUrl = normalizeSrc(url);
  const force = !!options.force;
  const highPriority = !!options.highPriority;
  if (type === "video" && !force && queuedVideoPreloads >= MAX_BACKGROUND_VIDEO_PRELOADS) {
    return;
  }
  if (type === "video" && force && warmedVideoUrls.has(normalizedUrl)) {
    return;
  }
  const key = `${type}:${url}`;
  if (preloadSeen.has(key)) return;
  preloadSeen.add(key);
  if (type === "video") {
    queuedVideoPreloads += 1;
  }
  const job = { url, type };
  if (highPriority) {
    preloadQueue.unshift(job);
    processPreloadQueue();
  } else {
    preloadQueue.push(job);
    schedulePreloadWork();
  }
}

function processPreloadQueue() {
  while (preloading < MAX_PRELOAD && preloadQueue.length) {
    const job = preloadQueue.shift();
    preloading += 1;
    if (job.type === "image") {
      const img = new Image();
      img.decoding = "async";
      img.onload = img.onerror = () => {
        preloading -= 1;
        processPreloadQueue();
      };
      img.src = job.url;
    } else if (job.type === "video") {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;
      const cleanup = () => {
        video.removeAttribute("src");
        video.load();
        preloading -= 1;
        processPreloadQueue();
      };
      const timeout = setTimeout(cleanup, 2500);
      video.addEventListener("loadedmetadata", () => {
        clearTimeout(timeout);
        cleanup();
      }, { once: true });
      video.addEventListener("error", () => {
        clearTimeout(timeout);
        cleanup();
      }, { once: true });
      video.src = job.url;
      video.load();
    } else {
      preloading -= 1;
    }
  }
}

function warmVideoPreview(url) {
  if (!url) return;
  const normalized = normalizeSrc(url);
  if (warmedVideoUrls.has(normalized) || warmingVideoUrls.has(normalized)) return;
  if (warmingVideoUrls.size >= MAX_VIDEO_WARM_INFLIGHT) return;
  warmingVideoUrls.add(normalized);
  enqueuePreloadWithOptions(normalized, "video", { force: true, highPriority: true });

  const video = document.createElement("video");
  video.muted = true;
  video.volume = 0;
  video.playsInline = true;
  video.preload = "auto";
  video.src = normalized;

  const cleanup = (markReady) => {
    if (markReady) {
      warmedVideoUrls.add(normalized);
    }
    warmingVideoUrls.delete(normalized);
    video.removeAttribute("src");
    video.load();
  };

  const timeout = setTimeout(() => cleanup(false), IS_LOW_END_DEVICE ? 1200 : 1700);
  video.addEventListener("canplay", () => {
    clearTimeout(timeout);
    cleanup(true);
  }, { once: true });
  video.addEventListener("error", () => {
    clearTimeout(timeout);
    cleanup(false);
  }, { once: true });
  video.load();
}

function extractBgUrl(value) {
  if (!value) return "";
  return value.replace(/^url\(["']?|["']?\)$/g, "");
}

function getActiveImageSrc() {
  const active = bgImages[activeImageIndex];
  if (!active) return "";
  return normalizeSrc(extractBgUrl(active.style.backgroundImage || ""));
}

function scheduleFilterAndFit() {
  if (filterFitScheduled) return;
  filterFitScheduled = true;
  requestAnimationFrame(() => {
    filterFitScheduled = false;
    applySearchFilter(themeSearch?.value || "");
  });
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    return parsed.href;
  } catch {
    return (url || "").trim();
  }
}

function createUploadPlaceholder(container, label) {
  if (!container) return null;
  const card = document.createElement("div");
  card.className = "thumb upload-placeholder";
  const overlay = document.createElement("div");
  overlay.className = "upload-overlay";
  const spinner = document.createElement("div");
  spinner.className = "upload-spinner";
  const text = document.createElement("div");
  text.className = "upload-text";
  text.textContent = `Uploading 0%`;
  const name = document.createElement("div");
  name.className = "upload-text";
  name.textContent = label || "Uploading...";
  overlay.appendChild(spinner);
  overlay.appendChild(text);
  overlay.appendChild(name);
  card.appendChild(overlay);
  container.appendChild(card);
  let percent = 0;
  const tick = () => {
    percent = Math.min(90, percent + Math.random() * 12 + 4);
    text.textContent = `Uploading ${Math.round(percent)}%`;
  };
  const interval = setInterval(tick, 350);
  tick();
  scheduleFilterAndFit();
  return {
    update(value) {
      percent = Math.max(percent, Math.min(100, value));
      text.textContent = `Uploading ${Math.round(percent)}%`;
    },
    done() {
      clearInterval(interval);
      text.textContent = "Uploading 100%";
      setTimeout(() => {
        card.remove();
        scheduleFilterAndFit();
      }, 200);
    },
    fail() {
      clearInterval(interval);
      card.remove();
      scheduleFilterAndFit();
    }
  };
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
      if (theme?.mediaType === "video") {
        warmVideoPreview(theme.src);
      }
      if (card.dataset.needsFrame === "1") {
        hydrateBuiltInPreview(card, theme);
      }
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
      if (theme?.mediaType === "video") {
        warmVideoPreview(theme.src);
      }
      if (card.dataset.needsFrame === "1") {
        hydrateBuiltInPreview(card, theme);
      }
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
  card.dataset.displayName = displayName;
  card.dataset.src = theme.src || "";
  card.dataset.type = theme.mediaType || "image";
  card.dataset.preview = theme.preview || "";
  card.dataset.createdAt = String(theme.createdAt || Date.now());
  if (theme.mediaType === "video") {
    card.classList.add("video");
  }

  if (theme.preview) {
    card.style.backgroundImage = `url(${theme.preview})`;
  }
  if (theme.preview) {
    enqueuePreload(theme.preview, "image");
  }
  if (theme.mediaType === "video" && theme.src) {
    enqueuePreload(theme.src, "video");
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

  if (options?.animate !== false) {
    card.classList.add("pop-in");
  }
  if (options?.group) {
    updateSelectableState(card, options.group);
  }
  container.appendChild(card);
  scheduleFilterAndFit();
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
  appendExtraBuiltInThemes();
  builtInThemes = [];
  let remoteQueued = 0;
  const builtins = document.querySelectorAll("#defaultThemes .thumb");
  builtins.forEach((card, index) => {
    const src = card.dataset.src;
    const mediaType = card.dataset.type || (src && src.endsWith(".mp4") ? "video" : "image");
    const name = card.dataset.name || "Built-in";
    const createdAt = Number(card.dataset.createdAt || (index + 1));
    card.dataset.name = name.toLowerCase();
    card.dataset.displayName = name;
    card.dataset.createdAt = String(createdAt);
    const previewUrl = extractBgUrl(card.style.backgroundImage);
    card.dataset.preview = previewUrl || "";
    card.dataset.src = src || "";
    card.dataset.type = mediaType;
    const theme = { src, mediaType, name, preview: previewUrl, createdAt };
    builtInThemes.push(theme);
    if (previewUrl) enqueuePreload(previewUrl, "image");
    if (mediaType === "video" && src) {
      const isRemote = /^https?:\/\//i.test(src);
      if (!isRemote || remoteQueued < BUILTIN_REMOTE_VIDEO_PRELOAD_LIMIT) {
        enqueuePreload(src, "video");
        if (isRemote) remoteQueued += 1;
      }
    }
    attachThemeInteractions(card, theme, () => applyTheme(theme));
    if (!previewUrl) hydrateBuiltInPreview(card, theme);
  });
  renderRecentThemes();
  if (currentThemeView === "all") {
    renderAllThemesGrid();
  }
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
    createdAt: item.created_at ? Date.parse(item.created_at) : 0,
    cloudId: item.id,
    storagePath: item.storage_path || "",
    source: "cloud"
  };
}

function getCloudThemesByKind(kind) {
  return cloudThemesCache
    .filter(item => item.kind === kind && ["image", "video"].includes(item.media_type))
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
  if (!supabaseClient || !currentUser) {
    return {
      publicUrl: "",
      path: "",
      error: { message: "You must be logged in before cloud upload." }
    };
  }
  const ext = file.name.split(".").pop() || "mp4";
  const path = `${currentUser.id}/${id}-${Date.now()}.${ext}`;
  const { error } = await supabaseClient.storage.from("themes").upload(path, file, {
    upsert: true,
    contentType: file.type || "application/octet-stream"
  });
  if (error) {
    return { publicUrl: "", path, error };
  }
  const { data } = supabaseClient.storage.from("themes").getPublicUrl(path);
  return { publicUrl: data.publicUrl, path, error: null };
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
  const mediaType = getMediaTypeFromFile(file);
  if (mediaType === "pkg") {
    showToast({
      message: ".pkg themes are not browser-compatible yet.",
      type: "error",
      durationMs: 2200
    });
    return;
  }
  if (!mediaType) {
    showToast({
      message: "Unsupported file format.",
      type: "error",
      durationMs: 2000
    });
    return;
  }
  const id = makeId();
  const name = deriveNameFromFile(file);
  const sig = themeKeyFromFile(file);

  if (options.existingSigSet && options.existingSigSet.has(sig)) {
    showToast({
      message: `${file.name} already exists.`,
      type: "error",
      durationMs: 2000
    });
    return;
  }

  if (options.cloudNameSet && options.cloudNameSet.has(name.toLowerCase())) {
    showToast({
      message: `${name} already exists.`,
      type: "error",
      durationMs: 2000
    });
    return;
  }

  if (isLoggedIn() && supabaseClient) {
    const upload = await uploadThemeFile(file, id);
    if (!upload || upload.error || !upload.publicUrl) {
      if (upload?.error) {
        console.error("Theme storage upload failed:", upload.error);
      }
      showToast({
        message: upload?.error?.message || "Cloud upload failed. Theme was not added.",
        type: "error",
        durationMs: 2800
      });
      return;
    }
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
        createdAt: record.created_at ? Date.parse(record.created_at) : Date.now(),
        cloudId: record.id,
        storagePath: upload.path,
        source: "cloud"
      };
      await loadCloudThemes();
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
      if (currentThemeView === "all") {
        renderAllThemesGrid();
        applySearchFilter(themeSearch?.value || "");
      }
      if (autoApply) applyTheme(theme);
      return;
    }
    if (upload.path) {
      await supabaseClient.storage.from("themes").remove([upload.path]);
    }
    showToast({
      message: result?.error?.message || "Cloud save failed. Theme was not added.",
      type: "error",
      durationMs: 2200
    });
    return;
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

  const theme = { id, kind: "local", mediaType, src, preview, name, createdAt: Date.now() };
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
  if (currentThemeView === "all") {
    renderAllThemesGrid();
    applySearchFilter(themeSearch?.value || "");
  }

  if (!isLoggedIn()) {
    promptLoginToast();
    markGuestThemesPending();
  }

  if (autoApply) {
    applyTheme(theme);
  }
}

async function handleLocalUpload(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  await processLocalFiles(files);
  event.target.value = "";
}

async function processLocalFiles(files) {
  if (!files.length) return;
  const existing = isLoggedIn() ? [] : await loadLocalThemes();
  const existingSigSet = new Set(
    existing.map(item => item.sig || `${item.name}|${item.blob?.size || 0}|${item.blob?.type || ""}`)
  );
  const cloudNameSet = isLoggedIn()
    ? new Set(getCloudThemesByKind("local").map(t => (t.name || "").toLowerCase()))
    : new Set();

  for (const file of files) {
    const mediaType = getMediaTypeFromFile(file);
    if (mediaType === "pkg") {
      showToast({
        message: `${file.name} is .pkg and cannot run in browser.`,
        type: "error",
        durationMs: 2200
      });
      continue;
    }
    if (!mediaType) {
      showToast({
        message: "Skipped a non-image/video file.",
        type: "error",
        durationMs: 2000
      });
      continue;
    }
    const sig = themeKeyFromFile(file);
    const name = deriveNameFromFile(file);
    if (existingSigSet.has(sig) || pendingLocalSigs.has(sig) || cloudNameSet.has(name.toLowerCase())) {
      showToast({
        message: `${name} already exists.`,
        type: "error",
        durationMs: 2000
      });
      continue;
    }
    pendingLocalSigs.add(sig);
    const placeholder = createUploadPlaceholder(localThemesGrid, name);
    try {
      await addLocalThemeFromFile(file, false, { existingSigSet, cloudNameSet, placeholder });
      existingSigSet.add(sig);
      cloudNameSet.add(deriveNameFromFile(file).toLowerCase());
    } finally {
      pendingLocalSigs.delete(sig);
      placeholder?.done();
    }
  }
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

function getDroppedUrl(dataTransfer) {
  if (!dataTransfer) return "";
  const uri = (dataTransfer.getData("text/uri-list") || "").split("\n").find(Boolean);
  if (uri) return uri.trim();
  const text = (dataTransfer.getData("text/plain") || "").trim();
  if (!text) return "";
  const firstToken = text.split(/\s+/)[0];
  try {
    const parsed = new URL(firstToken);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return firstToken;
    }
  } catch {
    return "";
  }
  return "";
}

function setupDropZone(panel, handlers) {
  if (!panel) return;
  let depth = 0;
  const activate = () => panel.classList.add("drop-active");
  const deactivate = () => panel.classList.remove("drop-active");

  panel.addEventListener("dragenter", (e) => {
    e.preventDefault();
    depth += 1;
    activate();
  });
  panel.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    activate();
  });
  panel.addEventListener("dragleave", (e) => {
    e.preventDefault();
    depth = Math.max(0, depth - 1);
    if (depth === 0) deactivate();
  });
  panel.addEventListener("drop", async (e) => {
    e.preventDefault();
    depth = 0;
    deactivate();
    await handlers(e);
  });
}

async function handleAddOnlineTheme() {
  const rawUrl = (onlineUrlInput.value || "").trim();
  let url = normalizeUrl(rawUrl);
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
  const themeKey = getThemeUrlKey(url, mediaType);

  const existingOnline = new Set([
    ...(isLoggedIn()
      ? getCloudThemesByKind("online").map(item => getThemeUrlKey(item.src || "", item.mediaType))
      : getOnlineThemes().map(item => getThemeUrlKey(item.url || "", item.mediaType))),
    ...Array.from(pendingOnlineUrls)
  ]);
  if (existingOnline.has(themeKey)) {
    showToast({
      message: `${deriveNameFromUrl(url)} already exists.`,
      type: "error",
      durationMs: 2000
    });
    return;
  }
  pendingOnlineUrls.add(themeKey);

  const theme = {
    id: makeId(),
    kind: "online",
    mediaType,
    url,
    name: deriveNameFromUrl(url),
    createdAt: Date.now()
  };

  const placeholder = createUploadPlaceholder(onlineThemesGrid, theme.name);

  try {
    if (isLoggedIn() && supabaseClient) {
      const result = await saveCloudThemeRecord({
        kind: "online",
        mediaType,
        url,
        name: theme.name
      });
      if (result?.data) {
        const record = result.data;
        await loadCloudThemes();
        await renderOnlineTheme({
          id: record.id,
          kind: "online",
          mediaType,
          url: record.url,
          name: record.name || theme.name,
          createdAt: record.created_at ? Date.parse(record.created_at) : Date.now(),
          storagePath: record.storage_path || "",
          source: "cloud"
        });
        placeholder?.done();
      } else {
        showToast({
          message: result?.error?.message || "Cloud save failed. URL was not added.",
          type: "error",
          durationMs: 2200
        });
      }
      placeholder?.done();
    } else {
      const list = getOnlineThemes();
      const exists = list.some(item => item.url === theme.url && item.mediaType === theme.mediaType);
      if (!exists) {
        list.push(theme);
        setOnlineThemes(list);
      }
      await renderOnlineTheme(theme);
      promptLoginToast();
      placeholder?.done();
    }
  } finally {
    pendingOnlineUrls.delete(themeKey);
    onlineUrlInput.value = "";
  }
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
    createdAt: theme.createdAt || 0,
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
  if (currentThemeView === "all") {
    renderAllThemesGrid();
    applySearchFilter(themeSearch?.value || "");
  }
}

async function loadAndRenderLocalThemes() {
  if (!localThemesGrid) return;
  const token = ++localRenderToken;
  localThemesGrid.innerHTML = "";
  for (const url of localObjectUrls.values()) {
    URL.revokeObjectURL(url);
  }
  localObjectUrls.clear();

  if (!isLoggedIn()) {
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
        name,
        createdAt: item.createdAt || 0
      };

      renderThemeCard(theme, localThemesGrid, {
        deletable: true,
        editable: true,
        group: "local",
        onRename: async (t, nextName) => {
          await updateLocalThemeName(t.id, nextName);
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
  } else {
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
      },
      onDelete: async (t) => {
        await deleteCloudTheme(t);
        loadAndRenderLocalThemes();
      }
    });
  }
  }

  renderRecentThemes();
  if (currentThemeView === "all") {
    renderAllThemesGrid();
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
        createdAt: theme.createdAt || 0,
        preview: theme.preview,
        storagePath: theme.storagePath,
        source: "cloud",
        cloudId: theme.cloudId
      });
      if (token !== onlineRenderToken) return;
    }
  } else {
    const renderedKeys = new Set();
    const localList = getOnlineThemes();
    for (const theme of localList) {
      const key = getThemeUrlKey(theme.url || theme.src || "", theme.mediaType);
      if (key && renderedKeys.has(key)) continue;
      if (key) renderedKeys.add(key);
      await renderOnlineTheme(theme);
      if (token !== onlineRenderToken) return;
    }
  }

  renderRecentThemes();
  if (currentThemeView === "all") {
    renderAllThemesGrid();
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
    if (!(uploadMenu.contains(e.target) || uploadMenuBtn.contains(e.target))) {
      toggleUploadMenu(false);
    }
    if (allThemesFilterPanel && allThemesFilterBtn) {
      const insideFilter = allThemesFilterPanel.contains(e.target) || allThemesFilterBtn.contains(e.target);
      if (!insideFilter) {
        setAllThemesFilterPanel(false);
      }
    }
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
  if (viewDefaultBtn) {
    viewDefaultBtn.addEventListener("click", () => setThemeView("default"));
  }
  if (viewUploadsBtn) {
    viewUploadsBtn.addEventListener("click", () => setThemeView("uploads"));
  }
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", () => setThemeView("all"));
  }
  if (allThemesSort) {
    allThemesSort.addEventListener("change", () => {
      if (currentThemeView === "all") {
        renderAllThemesGrid();
        applySearchFilter(themeSearch?.value || "");
      }
    });
  }
  if (filterVideo) {
    filterVideo.checked = allThemesMediaFilter.video;
    filterVideo.addEventListener("change", () => {
      allThemesMediaFilter.video = !!filterVideo.checked;
      if (currentThemeView === "all") {
        renderAllThemesGrid();
        applySearchFilter(themeSearch?.value || "");
      }
    });
  }
  if (filterImage) {
    filterImage.checked = allThemesMediaFilter.image;
    filterImage.addEventListener("change", () => {
      allThemesMediaFilter.image = !!filterImage.checked;
      if (currentThemeView === "all") {
        renderAllThemesGrid();
        applySearchFilter(themeSearch?.value || "");
      }
    });
  }
  if (allThemesFilterBtn) {
    allThemesFilterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentThemeView !== "all") return;
      const next = !(allThemesFilterPanel && !allThemesFilterPanel.hidden);
      setAllThemesFilterPanel(next);
    });
  }
  setupDropZone(localPanelBlock, async (e) => {
    const files = Array.from(e.dataTransfer?.files || []);
    if (!files.length) return;
    await processLocalFiles(files);
  });
  setupDropZone(onlinePanelBlock, async (e) => {
    const droppedUrl = getDroppedUrl(e.dataTransfer);
    if (droppedUrl && onlineUrlInput) {
      onlineUrlInput.value = droppedUrl;
      await handleAddOnlineTheme();
      return;
    }
    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length) {
      await processLocalFiles(files);
      showToast({
        message: "Dropped files were added to Your Themes.",
        durationMs: 1800
      });
    }
  });
  setupDropZone(allThemesSection, async (e) => {
    const droppedUrl = getDroppedUrl(e.dataTransfer);
    if (droppedUrl && onlineUrlInput) {
      onlineUrlInput.value = droppedUrl;
      await handleAddOnlineTheme();
      return;
    }
    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length) {
      await processLocalFiles(files);
      if (currentThemeView === "all") {
        renderAllThemesGrid();
        applySearchFilter(themeSearch?.value || "");
      }
      showToast({
        message: "Dropped files were added to Your Themes.",
        durationMs: 1800
      });
    }
  });

  loadAndRenderLocalThemes();
  loadAndRenderOnlineThemes();
  setThemeView("default");
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

function openConfirm({ title, message, cancelLabel, okLabel }) {
  return new Promise((resolve) => {
    if (!confirmOverlay) return resolve(true);
    confirmTitle.textContent = title || "Confirm";
    confirmMessage.textContent = message || "";
    if (confirmCancel) confirmCancel.textContent = cancelLabel || "Cancel";
    if (confirmOk) confirmOk.textContent = okLabel || "Delete";
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
  if (authBody) {
    authBody.classList.remove("confirming");
  }
  loginNeedsConfirm = false;
  document.querySelectorAll(".auth-signup-only").forEach(el => {
    el.style.display = isSignup ? "grid" : "none";
  });
  if (authPassword) {
    authPassword.autocomplete = isSignup ? "new-password" : "off";
    authPassword.name = isSignup ? "new-password" : "password";
    if (!isSignup) {
      authPassword.setAttribute("data-lpignore", "true");
      authPassword.setAttribute("data-1p-ignore", "true");
      authPassword.readOnly = true;
      const unlock = () => {
        authPassword.readOnly = false;
      };
      authPassword.addEventListener("focus", unlock, { once: true });
    } else {
      authPassword.removeAttribute("data-lpignore");
      authPassword.removeAttribute("data-1p-ignore");
      authPassword.readOnly = false;
    }
  }
  if (authPasswordConfirm) {
    authPasswordConfirm.autocomplete = "new-password";
  }
  setMessage(authMessage, "", false);
  updateResendVisibility();
}

function setMessage(el, text, isError = false) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("error", isError);
}

function updateResendVisibility() {
  if (!authResendWrap) return;
  const isConfirming = authBody?.classList.contains("confirming");
  const show = isConfirming || loginNeedsConfirm;
  authResendWrap.style.display = show ? "grid" : "none";
}

function updateTimerHintVisibility() {
  if (!timerHint) return;
  const pending = localStorage.getItem("ambientTimerHintPending") === "true";
  const show = document.body.dataset.page === "timerBox" && pending;
  timerHint.classList.toggle("visible", show);
}

function queueReloadTo(pageId) {
  if (pageId) {
    localStorage.setItem("ambientForcePage", pageId);
  }
  setTimeout(() => window.location.reload(), 300);
}

function markGuestThemesPending() {
  localStorage.setItem("ambientGuestImportHandled", "false");
}

async function maybePromptGuestImport() {
  if (!currentUser || guestImportPrompting) return;
  if (localStorage.getItem("ambientGuestImportHandled") === "true") return;
  const localList = await loadLocalThemes();
  const onlineList = getOnlineThemes();
  if (!localList.length && !onlineList.length) return;

  guestImportPrompting = true;
  const ok = await openConfirm({
    title: "Add previous themes?",
    message: "We found themes added while you were a guest. Add them to your account?",
    cancelLabel: "No",
    okLabel: "Yes"
  });
  localStorage.setItem("ambientGuestImportHandled", "true");

  if (ok) {
    await migrateGuestThemes(localList, onlineList);
    showToast({
      message: "Previous themes added.",
      durationMs: 2000
    });
  }
  guestImportPrompting = false;
}

async function migrateGuestThemes(localList, onlineList) {
  if (!supabaseClient || !currentUser) return;

  const cloudLocalNames = new Set(
    getCloudThemesByKind("local").map(t => (t.name || "").toLowerCase())
  );
  const cloudOnlineUrls = new Set(
    getCloudThemesByKind("online").map(t => normalizeUrl(t.src || ""))
  );

  const sigSeen = new Set();
  for (const item of localList) {
    if (!item.blob) continue;
    const sig = item.sig || `${item.name}|${item.blob.size}|${item.blob.type}`;
    if (sigSeen.has(sig)) continue;
    const name = item.name || deriveNameFromFile(item.blob);
    if (cloudLocalNames.has(name.toLowerCase())) continue;
    await addLocalThemeFromFile(item.blob, false, {
      existingSigSet: sigSeen,
      cloudNameSet: cloudLocalNames
    });
    sigSeen.add(sig);
    cloudLocalNames.add(name.toLowerCase());
  }

  const remainingOnline = [];
  for (const item of onlineList) {
    const url = normalizeUrl(item.url || "");
    if (!url || cloudOnlineUrls.has(url)) continue;
    const mediaType = item.mediaType || getMediaTypeFromUrl(url);
    if (!mediaType) continue;
    const name = item.name || deriveNameFromUrl(url);
    const result = await saveCloudThemeRecord({
      kind: "online",
      mediaType,
      url,
      name
    });
    if (result?.data) {
      cloudOnlineUrls.add(url);
    } else {
      remainingOnline.push(item);
    }
  }

  setOnlineThemes(remainingOnline);
  await loadCloudThemes();
  loadAndRenderLocalThemes();
  loadAndRenderOnlineThemes();
}

function setOrientationLock(target) {
  if (!isTouchDevice) return;
  orientationLockTarget = target;
  document.body.dataset.orientationLock = target;
  if (orientationMessage) {
    orientationMessage.textContent =
      target === "landscape"
        ? "Rotate your device to landscape"
        : "Rotate your device to portrait";
  }
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock(target).catch(() => {});
  }
}

function syncOrientationLock() {
  const target = document.body.dataset.page === "timerBox" ? "landscape" : "portrait";
  setOrientationLock(target);
}

async function handleLogout() {
  if (!supabaseClient) return;
  if (profileMenu) profileMenu.classList.remove("active");
  closeMobileMenu();
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      showToast({
        message: error.message || "Logout failed.",
        type: "error",
        durationMs: 2000
      });
    }
  } finally {
    try {
      Object.keys(localStorage || {}).forEach((key) => {
        if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
          localStorage.removeItem(key);
        }
      });
    } catch {}
    await refreshAuthState();
    currentUser = null;
    updateProfileUI();
    localStorage.setItem("ambientLastPage", "selector");
    showPage("page1");
    queueReloadTo("page1");
  }
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
        emailRedirectTo: "https://pieex.github.io/AmbientTimer/",
        data: { display_name: displayName || email.split("@")[0] }
      }
    });
    if (error) {
      setMessage(authMessage, error.message, true);
    } else {
      if (authBody) authBody.classList.add("confirming");
      if (authConfirmBox) authConfirmBox.textContent = "Please check your email to confirm your account.";
      updateResendVisibility();
    }
  } else {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    const message = error?.message || "Signed in successfully.";
    setMessage(authMessage, message, !!error);
    loginNeedsConfirm = !!error && /confirm|confirmed/i.test(message);
    updateResendVisibility();
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
  if (profileMenu) profileMenu.classList.toggle("guest", !loggedIn);

  document.body.dataset.auth = loggedIn ? "true" : "false";
  if (homeUsername) homeUsername.textContent = loggedIn ? name : "";
  updateMobileMenuState();
}

async function initAuth() {
  supabaseClient = initSupabaseClient();
  document.body.dataset.page = "pageHome";
  const forcedPage = localStorage.getItem("ambientForcePage");
  if (forcedPage) {
    localStorage.removeItem("ambientForcePage");
    showPage(forcedPage);
  }
  const hasVisited = localStorage.getItem("ambientHasVisited") === "true";
  if (!hasVisited) {
    localStorage.setItem("ambientTimerHintPending", "true");
  } else {
    localStorage.setItem("ambientTimerHintPending", "false");
  }
  if (!localStorage.getItem("ambientGuestImportHandled")) {
    localStorage.setItem("ambientGuestImportHandled", "true");
  }
  if (forcedPage) {
    // Page already set above.
  } else if (!hasVisited) {
    showPage("pageHome");
    localStorage.setItem("ambientHasVisited", "true");
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
  document.querySelectorAll(".logo-img, .home-logo").forEach((img) => {
    img.setAttribute("draggable", "false");
    img.addEventListener("contextmenu", (e) => e.preventDefault());
    img.addEventListener("dragstart", (e) => e.preventDefault());
  });

  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.ctrlKey && e.code === "KeyU") {
      localStorage.removeItem("ambientHasVisited");
      localStorage.removeItem("ambientLastPage");
      localStorage.removeItem("ambientTimerHintPending");
      localStorage.removeItem("ambientGuestImportHandled");
      localStorage.removeItem(THEME_RECENT_KEY);
      localStorage.removeItem(THEME_USAGE_KEY);
      localStorage.removeItem(GUEST_SAVE_TOAST_SEEN_KEY);
      renderRecentThemes();
    }
  });

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

  window.addEventListener("pageshow", () => syncOrientationLock());
  window.addEventListener("resize", () => syncOrientationLock());
  window.addEventListener("orientationchange", () => syncOrientationLock());
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) syncOrientationLock();
  });

  if (authTabLogin) authTabLogin.addEventListener("click", () => setAuthMode("login"));
  if (authTabSignup) authTabSignup.addEventListener("click", () => setAuthMode("signup"));
  if (authCloseBtn) authCloseBtn.addEventListener("click", closeAuth);
  if (authSubmitBtn) authSubmitBtn.addEventListener("click", handleAuthSubmit);
  if (authGoogleBtn) authGoogleBtn.addEventListener("click", signInWithGoogle);
  if (authResendBtn) authResendBtn.addEventListener("click", async () => {
    if (!supabaseClient) return;
    const email = (authEmail.value || "").trim();
    if (!email) {
      setMessage(authMessage, "Enter your email to resend confirmation.", true);
      return;
    }
    if (!supabaseClient.auth.resend) {
      setMessage(authMessage, "Resend not supported.", true);
      return;
    }
    const { error } = await supabaseClient.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: "https://pieex.github.io/AmbientTimer/" }
    });
    if (error) {
      setMessage(authMessage, error.message, true);
      showToast({
        message: error.message || "Could not resend confirmation.",
        type: "error",
        durationMs: 2500
      });
    } else {
      setMessage(authMessage, "Confirmation email sent.", false);
      showToast({
        message: "Confirmation email sent.",
        durationMs: 2000
      });
    }
  });
  if (authPassword && authPasswordConfirm) {
    const syncFromAutofill = () => {
      if (authMode !== "signup") return;
      if (!authPassword.value) return;
      authPasswordConfirm.value = authPassword.value;
    };
    authPassword.addEventListener("animationstart", (e) => {
      if (e.animationName === "autoFillStart") {
        syncFromAutofill();
      }
    });
    authPassword.addEventListener("input", (e) => {
      if (e.inputType === "insertReplacementText") {
        syncFromAutofill();
      }
    });
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

  if (timerHintClose) {
    timerHintClose.addEventListener("click", (e) => {
      e.stopPropagation();
      localStorage.setItem("ambientTimerHintPending", "false");
      updateTimerHintVisibility();
    });
  }

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
      showToast({
        message: "Changes have been saved.",
        durationMs: 2000
      });
      try {
        await refreshAuthState();
      } finally {
        queueReloadTo(document.body.dataset.page || "pageSettings");
      }
    });
  }

  if (settingsPasswordBtn) {
    settingsPasswordBtn.addEventListener("click", async () => {
      if (!supabaseClient || !currentUser) return;
      const email = currentUser.email;
      if (!email) return;
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: "https://pieex.github.io/AmbientTimer/"
      });
      if (error) {
        setMessage(settingsMessage, error.message, true);
        showToast({
          message: error.message || "Could not send password email.",
          type: "error",
          durationMs: 2500
        });
      } else {
        setMessage(settingsMessage, "Password email sent.", false);
        showToast({
          message: "Password reset email has been sent.",
          durationMs: 2000
        });
      }
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

  setAuthMode(authMode);

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
  await maybePromptGuestImport();
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
  if (isLoggedIn()) return;
  if (localStorage.getItem(GUEST_SAVE_TOAST_SEEN_KEY) === "true") return;
  localStorage.setItem(GUEST_SAVE_TOAST_SEEN_KEY, "true");
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
  pauseStartedMs = null;
  timerEndMs = Date.now() + totalSeconds * 1000;
  setTimerDisplayPausedVisual(false);
  if (confirmedTheme?.mediaType) {
    setMediaMode(confirmedTheme.mediaType);
  }

  // Show timer page
  transitionTo("timerBox");

  // Fullscreen immersion
  document.documentElement.requestFullscreen().catch(() => {});
  setTimeout(() => setOrientationLock("landscape"), 250);

  updateDisplay();

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (paused) return;
    const remainingMs = timerEndMs - Date.now();
    remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "DONE";
      playAlarmStandard();
      return;
    }

    updateDisplay();
  }, 250);
}

function setTimerDisplayPausedVisual(isPaused) {
  if (!timerDisplay) return;
  timerDisplay.style.opacity = isPaused ? "0.45" : "1";
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
  if (!paused) {
    paused = true;
    pauseStartedMs = Date.now();
  } else {
    paused = false;
    if (pauseStartedMs) {
      timerEndMs += Date.now() - pauseStartedMs;
      pauseStartedMs = null;
    }
  }
  setTimerDisplayPausedVisual(paused);
});

document.addEventListener("keydown", (e) => {
  const target = e.target;
  const tag = target?.tagName?.toLowerCase();
  if (target?.isContentEditable || tag === "input" || tag === "textarea" || tag === "select") {
    return;
  }
  if (e.code === "Space") {
    e.preventDefault();
    if (!paused) {
      paused = true;
      pauseStartedMs = Date.now();
    } else {
      paused = false;
      if (pauseStartedMs) {
        timerEndMs += Date.now() - pauseStartedMs;
        pauseStartedMs = null;
      }
    }
    setTimerDisplayPausedVisual(paused);
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
    if (active) {
      setFadeMsForVideo(active, BG_SWITCH_FADE_MS);
      setActiveLayer(active);
      bgImages.forEach(image => image.classList.remove("active"));
      if (!active.currentSrc && !active.src) {
        active.src = targetSrc;
        active.preload = "auto";
        active.load();
      }
      active.play().catch(() => {
        active.load();
        active.play().catch(() => {});
      });
      startVideoWatchdog();
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
  const activeSrc = getActiveImageSrc();
  if (activeSrc && activeSrc === targetSrc && bgImages[activeImageIndex]?.classList.contains("active")) {
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
