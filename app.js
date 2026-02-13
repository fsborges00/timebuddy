const { DateTime } = luxon;

const HOME_TZ = "America/New_York";
const FAVORITES_KEY = "et-time-buddy-favorites";

const LOCATIONS = [
  { label: "New York", tz: "America/New_York" },
  { label: "London", tz: "Europe/London" },
  { label: "São Paulo", tz: "America/Sao_Paulo" },
  { label: "Tokyo", tz: "Asia/Tokyo" },
  { label: "Los Angeles", tz: "America/Los_Angeles" },
  { label: "Denver", tz: "America/Denver" },
  { label: "Chicago", tz: "America/Chicago" },
  { label: "Phoenix", tz: "America/Phoenix" },
  { label: "Berlin", tz: "Europe/Berlin" },
  { label: "Dubai", tz: "Asia/Dubai" },
  { label: "Sydney", tz: "Australia/Sydney" },
  { label: "Paris", tz: "Europe/Paris" },
  { label: "Madrid", tz: "Europe/Madrid" },
  { label: "Rome", tz: "Europe/Rome" },
  { label: "Amsterdam", tz: "Europe/Amsterdam" },
  { label: "Mumbai", tz: "Asia/Kolkata" },
  { label: "Singapore", tz: "Asia/Singapore" },
  { label: "Hong Kong", tz: "Asia/Hong_Kong" },
  { label: "Seoul", tz: "Asia/Seoul" },
  { label: "Bangkok", tz: "Asia/Bangkok" },
  { label: "Johannesburg", tz: "Africa/Johannesburg" },
  { label: "Nairobi", tz: "Africa/Nairobi" },
  { label: "Mexico City", tz: "America/Mexico_City" },
  { label: "Toronto", tz: "America/Toronto" },
  { label: "Vancouver", tz: "America/Vancouver" },
  { label: "Anchorage", tz: "America/Anchorage" },
  { label: "Honolulu", tz: "Pacific/Honolulu" },
  { label: "Buenos Aires", tz: "America/Argentina/Buenos_Aires" },
  { label: "Lima", tz: "America/Lima" },
  { label: "Bogotá", tz: "America/Bogota" },
  { label: "Santiago", tz: "America/Santiago" },
  { label: "Auckland", tz: "Pacific/Auckland" },
  { label: "Perth", tz: "Australia/Perth" },
  { label: "Istanbul", tz: "Europe/Istanbul" },
  { label: "Cairo", tz: "Africa/Cairo" },
  { label: "Reykjavík", tz: "Atlantic/Reykjavik" }
];

const elements = {
  locationInput: document.getElementById("locationInput"),
  locationsList: document.getElementById("locationsList"),
  favoriteBtn: document.getElementById("favoriteBtn"),
  favoritesList: document.getElementById("favoritesList"),
  customTimeSection: document.getElementById("customTimeSection"),
  dateInput: document.getElementById("dateInput"),
  timeInput: document.getElementById("timeInput"),
  remoteTime: document.getElementById("remoteTime"),
  etTime: document.getElementById("etTime"),
  difference: document.getElementById("difference"),
  copyRemoteBtn: document.getElementById("copyRemoteBtn"),
  copyEtBtn: document.getElementById("copyEtBtn"),
  copyFeedback: document.getElementById("copyFeedback")
};

let currentRemote = LOCATIONS[1];
let favorites = loadFavorites();
let ticker = null;
let lastRendered = { remoteText: "", etText: "" };

initialize();

function initialize() {
  fillDatalist();
  elements.locationInput.value = formatLocationValue(currentRemote);

  const now = DateTime.now().setZone(HOME_TZ);
  elements.dateInput.value = now.toISODate();
  elements.timeInput.value = now.toFormat("HH:mm");

  bindEvents();
  renderFavorites();
  renderFavoriteButtonState();
  refresh();
  startTicker();
}

function bindEvents() {
  elements.locationInput.addEventListener("change", () => {
    selectLocationFromInput();
    refresh();
  });

  elements.favoriteBtn.addEventListener("click", () => {
    toggleFavorite(currentRemote.tz);
    renderFavorites();
    renderFavoriteButtonState();
  });

  document.querySelectorAll('input[name="mode"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const nowMode = getMode() === "now";
      elements.customTimeSection.classList.toggle("hidden", nowMode);
      elements.customTimeSection.setAttribute("aria-hidden", String(nowMode));
      if (nowMode) {
        startTicker();
      } else {
        stopTicker();
      }
      refresh();
    });
  });

  [elements.dateInput, elements.timeInput].forEach((input) => {
    input.addEventListener("input", refresh);
  });

  document.querySelectorAll('input[name="inputBasis"]').forEach((radio) => {
    radio.addEventListener("change", refresh);
  });

  elements.copyRemoteBtn.addEventListener("click", () => {
    copyText(lastRendered.remoteText, "Remote time copied.");
  });

  elements.copyEtBtn.addEventListener("click", () => {
    copyText(lastRendered.etText, "ET time copied.");
  });
}

function fillDatalist() {
  elements.locationsList.innerHTML = "";
  LOCATIONS.forEach((entry) => {
    const option = document.createElement("option");
    option.value = formatLocationValue(entry);
    elements.locationsList.appendChild(option);
  });
}

function selectLocationFromInput() {
  const value = elements.locationInput.value.trim();
  const exact = LOCATIONS.find((entry) => formatLocationValue(entry) === value);

  if (exact) {
    currentRemote = exact;
  } else {
    const byTz = LOCATIONS.find((entry) => entry.tz.toLowerCase() === value.toLowerCase());
    if (byTz) {
      currentRemote = byTz;
      elements.locationInput.value = formatLocationValue(byTz);
    } else {
      elements.locationInput.value = formatLocationValue(currentRemote);
    }
  }

  renderFavoriteButtonState();
}

function refresh() {
  const { remoteDateTime, etDateTime } = computeDateTimes();

  if (!remoteDateTime || !etDateTime || !remoteDateTime.isValid || !etDateTime.isValid) {
    elements.remoteTime.textContent = "Invalid date/time";
    elements.etTime.textContent = "Invalid date/time";
    elements.difference.textContent = "—";
    return;
  }

  const remoteLabel = `${currentRemote.label} (${currentRemote.tz})`;
  const etLabel = `ET (${HOME_TZ})`;

  const remoteFormatted = formatLong(remoteDateTime);
  const etFormatted = formatLong(etDateTime);

  elements.remoteTime.textContent = remoteFormatted;
  elements.etTime.textContent = etFormatted;
  elements.difference.textContent = describeOffsetDifference(remoteDateTime, etDateTime);

  lastRendered.remoteText = `${remoteLabel}: ${remoteFormatted}`;
  lastRendered.etText = `${etLabel}: ${etFormatted}`;
  renderFavoriteButtonState();
}

function computeDateTimes() {
  if (getMode() === "now") {
    const instant = DateTime.now();
    return {
      remoteDateTime: instant.setZone(currentRemote.tz),
      etDateTime: instant.setZone(HOME_TZ)
    };
  }

  if (!elements.dateInput.value || !elements.timeInput.value) {
    return { remoteDateTime: null, etDateTime: null };
  }

  const isoLocal = `${elements.dateInput.value}T${elements.timeInput.value}`;
  const basis = document.querySelector('input[name="inputBasis"]:checked')?.value || "remote";

  if (basis === "remote") {
    const remoteDateTime = DateTime.fromISO(isoLocal, { zone: currentRemote.tz });
    return {
      remoteDateTime,
      etDateTime: remoteDateTime.setZone(HOME_TZ)
    };
  }

  const etDateTime = DateTime.fromISO(isoLocal, { zone: HOME_TZ });
  return {
    remoteDateTime: etDateTime.setZone(currentRemote.tz),
    etDateTime
  };
}

function formatLong(dateTime) {
  return dateTime.toLocaleString({
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function describeOffsetDifference(remoteDateTime, etDateTime) {
  const deltaMinutes = remoteDateTime.offset - etDateTime.offset;

  if (deltaMinutes === 0) {
    return "Remote and ET are at the same local time.";
  }

  const absolute = Math.abs(deltaMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  const sign = deltaMinutes > 0 ? "+" : "-";
  const relation = deltaMinutes > 0 ? "ahead of" : "behind";
  const hourText = `${hours}h`;
  const minuteText = minutes ? ` ${minutes}m` : "";

  return `Remote is ${sign}${hourText}${minuteText} ${relation} ET`;
}

function getMode() {
  return document.querySelector('input[name="mode"]:checked')?.value || "now";
}

function startTicker() {
  stopTicker();
  ticker = setInterval(refresh, 1000);
}

function stopTicker() {
  if (ticker) {
    clearInterval(ticker);
    ticker = null;
  }
}

function renderFavorites() {
  const favoriteEntries = LOCATIONS.filter((entry) => favorites.includes(entry.tz));

  if (favoriteEntries.length === 0) {
    elements.favoritesList.classList.add("empty");
    elements.favoritesList.textContent = "No favorites yet.";
    return;
  }

  elements.favoritesList.classList.remove("empty");
  elements.favoritesList.innerHTML = "";

  favoriteEntries.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "favorite-chip";
    button.textContent = `★ ${entry.label}`;
    button.title = `${entry.label} (${entry.tz})`;
    button.addEventListener("click", () => {
      currentRemote = entry;
      elements.locationInput.value = formatLocationValue(entry);
      renderFavoriteButtonState();
      refresh();
    });
    elements.favoritesList.appendChild(button);
  });
}

function renderFavoriteButtonState() {
  const active = favorites.includes(currentRemote.tz);
  elements.favoriteBtn.classList.toggle("active", active);
  elements.favoriteBtn.textContent = active ? "★" : "☆";
}

function toggleFavorite(tz) {
  if (favorites.includes(tz)) {
    favorites = favorites.filter((item) => item !== tz);
  } else {
    favorites = [tz, ...favorites];
  }
  saveFavorites(favorites);
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((tz) => LOCATIONS.some((entry) => entry.tz === tz));
  } catch {
    return [];
  }
}

function saveFavorites(items) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
}

function formatLocationValue(entry) {
  return `${entry.label} (${entry.tz})`;
}

async function copyText(text, successMessage) {
  if (!text) {
    elements.copyFeedback.textContent = "Nothing to copy yet.";
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    elements.copyFeedback.textContent = successMessage;
  } catch {
    elements.copyFeedback.textContent = "Copy failed. Your browser may block clipboard access.";
  }
}
