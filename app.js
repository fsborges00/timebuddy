const { DateTime } = luxon;

const HOME_TZ = "America/New_York";
const HOME_LABEL = "ET";
const FAVORITES_KEY = "et-time-buddy-favorites";
const COMPARISON_LIST_KEY = "et-time-buddy-comparison-list";

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
  addBtn: document.getElementById("addBtn"),
  favoriteBtn: document.getElementById("favoriteBtn"),
  favoritesList: document.getElementById("favoritesList"),
  comparisonList: document.getElementById("comparisonList"),
  customTimeSection: document.getElementById("customTimeSection"),
  dateInput: document.getElementById("dateInput"),
  timeInput: document.getElementById("timeInput"),
  inputTzSelect: document.getElementById("inputTzSelect"),
  resultsList: document.getElementById("resultsList"),
  copyAllBtn: document.getElementById("copyAllBtn"),
  copyFeedback: document.getElementById("copyFeedback")
};

let comparisonZones = loadComparisonList();
let favorites = loadFavorites();
let ticker = null;
let lastRenderedLines = [];

initialize();

function initialize() {
  fillDatalist();
  syncLocationInputWithFirst();

  const now = DateTime.now().setZone(HOME_TZ);
  elements.dateInput.value = now.toISODate();
  elements.timeInput.value = now.toFormat("HH:mm");

  bindEvents();
  renderComparisonList();
  renderFavorites();
  populateInputTzSelect();
  refresh();
  startTicker();
}

function bindEvents() {
  elements.addBtn.addEventListener("click", () => {
    const entry = getSelectionFromInput();
    if (entry) {
      addToComparisonList(entry);
      renderComparisonList();
      populateInputTzSelect();
      saveComparisonList(comparisonZones);
      refresh();
    }
  });

  elements.locationInput.addEventListener("change", () => {
    renderFavoriteButtonState();
  });

  elements.favoriteBtn.addEventListener("click", () => {
    const entry = getSelectionFromInput();
    if (entry) {
      toggleFavorite(entry.tz);
      renderFavorites();
      renderFavoriteButtonState();
    }
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
      populateInputTzSelect();
      refresh();
    });
  });

  [elements.dateInput, elements.timeInput, elements.inputTzSelect].forEach((el) => {
    if (el) el.addEventListener("input", refresh);
    if (el) el.addEventListener("change", refresh);
  });

  elements.copyAllBtn.addEventListener("click", () => {
    const text = lastRenderedLines.join("\n");
    copyText(text, "All times copied.");
  });
}

function getSelectionFromInput() {
  const value = elements.locationInput.value.trim();
  const exact = LOCATIONS.find((entry) => formatLocationValue(entry) === value);
  if (exact) return exact;
  const byTz = LOCATIONS.find((entry) => entry.tz.toLowerCase() === value.toLowerCase());
  if (byTz) {
    elements.locationInput.value = formatLocationValue(byTz);
    return byTz;
  }
  return null;
}

function syncLocationInputWithFirst() {
  if (comparisonZones.length) {
    elements.locationInput.value = formatLocationValue(comparisonZones[0]);
  } else {
    elements.locationInput.value = formatLocationValue(LOCATIONS[1]);
  }
  renderFavoriteButtonState();
}

function addToComparisonList(entry) {
  if (comparisonZones.some((z) => z.tz === entry.tz)) return;
  comparisonZones.push({ label: entry.label, tz: entry.tz });
}

function removeFromComparisonList(tz) {
  comparisonZones = comparisonZones.filter((z) => z.tz !== tz);
  saveComparisonList(comparisonZones);
  renderComparisonList();
  populateInputTzSelect();
  refresh();
}

function loadComparisonList() {
  try {
    const raw = localStorage.getItem(COMPARISON_LIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && item.tz && LOCATIONS.some((e) => e.tz === item.tz)).map((item) => ({
      label: LOCATIONS.find((e) => e.tz === item.tz).label,
      tz: item.tz
    }));
  } catch {
    return [];
  }
}

function saveComparisonList(list) {
  localStorage.setItem(COMPARISON_LIST_KEY, JSON.stringify(list));
}

function renderComparisonList() {
  if (comparisonZones.length === 0) {
    elements.comparisonList.classList.add("empty");
    elements.comparisonList.innerHTML = "";
    elements.comparisonList.appendChild(document.createTextNode("No zones added. Use the selector above and \"+ Add\" to compare."));
    return;
  }

  elements.comparisonList.classList.remove("empty");
  elements.comparisonList.innerHTML = "";

  comparisonZones.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "comparison-row";
    const labelSpan = document.createElement("span");
    labelSpan.className = "comparison-label";
    labelSpan.textContent = entry.label;
    const tzSpan = document.createElement("span");
    tzSpan.className = "comparison-iana";
    tzSpan.textContent = entry.tz;
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.setAttribute("aria-label", `Remove ${entry.label}`);
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => removeFromComparisonList(entry.tz));
    row.appendChild(labelSpan);
    row.appendChild(tzSpan);
    row.appendChild(removeBtn);
    elements.comparisonList.appendChild(row);
  });
}

function populateInputTzSelect() {
  const options = [];
  options.push({ value: HOME_TZ, label: `${HOME_LABEL} (${HOME_TZ})` });
  comparisonZones.forEach((z) => {
    options.push({ value: z.tz, label: `${z.label} (${z.tz})` });
  });

  elements.inputTzSelect.innerHTML = "";
  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    elements.inputTzSelect.appendChild(option);
  });
}

function refresh() {
  const instant = getReferenceInstant();
  if (!instant || !instant.isValid) {
    elements.resultsList.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = "Invalid date/time.";
    elements.resultsList.appendChild(p);
    lastRenderedLines = [];
    return;
  }

  const etDateTime = instant.setZone(HOME_TZ);
  const rows = [];
  const linesForCopy = [];

  // ET row first
  const etAbbr = getOffsetAbbreviation(etDateTime);
  const etFormatted = formatLongWithAbbr(etDateTime);
  rows.push({
    label: HOME_LABEL,
    iana: HOME_TZ,
    formatted: etFormatted,
    abbr: etAbbr,
    difference: null
  });
  linesForCopy.push(`${HOME_LABEL} (${HOME_TZ}): ${etFormatted} ${etAbbr}`);

  // Each comparison zone
  comparisonZones.forEach((entry) => {
    const zoned = instant.setZone(entry.tz);
    const abbr = getOffsetAbbreviation(zoned);
    const formatted = formatLongWithAbbr(zoned);
    const difference = describeOffsetDifference(zoned, etDateTime);
    rows.push({
      label: entry.label,
      iana: entry.tz,
      formatted,
      abbr,
      difference
    });
    linesForCopy.push(`${entry.label} (${entry.tz}): ${formatted} ${abbr} — ${difference}`);
  });

  lastRenderedLines = linesForCopy;
  renderResults(rows);
  renderFavoriteButtonState();
}

function getReferenceInstant() {
  if (getMode() === "now") {
    return DateTime.now();
  }
  if (!elements.dateInput.value || !elements.timeInput.value) return null;
  const inputTz = elements.inputTzSelect.value || HOME_TZ;
  const isoLocal = `${elements.dateInput.value}T${elements.timeInput.value}`;
  return DateTime.fromISO(isoLocal, { zone: inputTz });
}

function getOffsetAbbreviation(dateTime) {
  try {
    const abbr = dateTime.toFormat("ZZZZ");
    if (abbr && typeof abbr === "string") return abbr;
  } catch (_) {}
  return "";
}

function formatLongWithAbbr(dateTime) {
  return dateTime.toFormat("ccc, LLL d, yyyy, h:mm a");
}

function describeOffsetDifference(remoteDateTime, etDateTime) {
  const deltaMinutes = remoteDateTime.offset - etDateTime.offset;
  if (deltaMinutes === 0) return "Same as ET";
  const absolute = Math.abs(deltaMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  const sign = deltaMinutes > 0 ? "+" : "-";
  const relation = deltaMinutes > 0 ? "ahead of ET" : "behind ET";
  const hourText = `${hours}h`;
  const minuteText = minutes ? ` ${minutes}m` : "";
  return `${sign}${hourText}${minuteText} ${relation}`;
}

function renderResults(rows) {
  elements.resultsList.innerHTML = "";
  rows.forEach((row) => {
    const card = document.createElement("div");
    card.className = "result-row";
    const header = document.createElement("div");
    header.className = "result-row-header";
    const labelSpan = document.createElement("span");
    labelSpan.className = "result-label";
    labelSpan.textContent = row.label;
    const ianaSpan = document.createElement("span");
    ianaSpan.className = "result-iana";
    ianaSpan.textContent = row.iana;
    header.appendChild(labelSpan);
    header.appendChild(ianaSpan);
    const timeLine = document.createElement("p");
    timeLine.className = "result-time";
    timeLine.textContent = row.abbr ? `${row.formatted} ${row.abbr}` : row.formatted;
    card.appendChild(header);
    card.appendChild(timeLine);
    if (row.difference != null) {
      const diffLine = document.createElement("p");
      diffLine.className = "result-difference";
      diffLine.textContent = row.difference;
      card.appendChild(diffLine);
    }
    elements.resultsList.appendChild(card);
  });
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
      elements.locationInput.value = formatLocationValue(entry);
      addToComparisonList(entry);
      renderComparisonList();
      populateInputTzSelect();
      saveComparisonList(comparisonZones);
      renderFavoriteButtonState();
      refresh();
    });
    elements.favoritesList.appendChild(button);
  });
}

function renderFavoriteButtonState() {
  const entry = getSelectionFromInput();
  const active = entry && favorites.includes(entry.tz);
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
