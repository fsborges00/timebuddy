const { DateTime } = luxon;

const HOME_TZ = "America/New_York";
const FAVORITES_KEY = "et-time-buddy-favorites";
const COMPARE_ZONES_KEY = "et-time-buddy-compare-zones";

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
  addZoneBtn: document.getElementById("addZoneBtn"),
  favoritesList: document.getElementById("favoritesList"),
  comparisonList: document.getElementById("comparisonList"),
  customTimeSection: document.getElementById("customTimeSection"),
  dateInput: document.getElementById("dateInput"),
  timeInput: document.getElementById("timeInput"),
  inputZoneSelect: document.getElementById("inputZoneSelect"),
  resultsList: document.getElementById("resultsList"),
  copyFeedback: document.getElementById("copyFeedback")
};

let selectedEntry = LOCATIONS[1];
let favorites = loadFavorites();
let comparisonZones = loadComparisonZones();
let ticker = null;

initialize();

function initialize() {
  fillDatalist();
  elements.locationInput.value = formatLocationValue(selectedEntry);

  const now = DateTime.now().setZone(HOME_TZ);
  elements.dateInput.value = now.toISODate();
  elements.timeInput.value = now.toFormat("HH:mm");

  bindEvents();
  renderFavorites();
  renderFavoriteButtonState();
  renderComparisonList();
  renderInputZoneOptions();
  refresh();
  startTicker();
}

function bindEvents() {
  elements.locationInput.addEventListener("change", selectEntryFromInput);

  elements.favoriteBtn.addEventListener("click", () => {
    toggleFavorite(selectedEntry.tz);
    renderFavoriteButtonState();
    renderFavorites();
  });

  elements.addZoneBtn.addEventListener("click", () => {
    selectEntryFromInput();
    addComparisonZone(selectedEntry.tz);
  });

  document.querySelectorAll('input[name="mode"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const nowMode = getMode() === "now";
      elements.customTimeSection.classList.toggle("hidden", nowMode);
      elements.customTimeSection.setAttribute("aria-hidden", String(nowMode));

      if (nowMode) startTicker();
      else stopTicker();

      refresh();
    });
  });

  [elements.dateInput, elements.timeInput, elements.inputZoneSelect].forEach((input) => {
    input.addEventListener("input", refresh);
    input.addEventListener("change", refresh);
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

function selectEntryFromInput() {
  const value = elements.locationInput.value.trim();
  const exact = LOCATIONS.find((entry) => formatLocationValue(entry) === value);
  const byTz = LOCATIONS.find((entry) => entry.tz.toLowerCase() === value.toLowerCase());

  selectedEntry = exact || byTz || selectedEntry;
  elements.locationInput.value = formatLocationValue(selectedEntry);
  renderFavoriteButtonState();
}

function addComparisonZone(tz) {
  if (tz === HOME_TZ || comparisonZones.includes(tz)) return;

  comparisonZones = [...comparisonZones, tz];
  saveComparisonZones(comparisonZones);
  renderComparisonList();
  renderInputZoneOptions();
  refresh();
}

function removeComparisonZone(tz) {
  comparisonZones = comparisonZones.filter((item) => item !== tz);
  saveComparisonZones(comparisonZones);
  renderComparisonList();
  renderInputZoneOptions();
  refresh();
}

function renderComparisonList() {
  const entries = comparisonZones.map(findLocationByTz).filter(Boolean);

  if (entries.length === 0) {
    elements.comparisonList.classList.add("empty");
    elements.comparisonList.textContent = "No zones added yet. ET is always shown below.";
    return;
  }

  elements.comparisonList.classList.remove("empty");
  elements.comparisonList.innerHTML = "";

  entries.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "compare-row";

    const left = document.createElement("div");
    left.className = "compare-row-meta";

    const title = document.createElement("div");
    title.className = "compare-row-title";
    title.textContent = entry.label;

    const zone = document.createElement("div");
    zone.className = "compare-row-zone";
    zone.textContent = entry.tz;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "danger-btn";
    remove.textContent = "×";
    remove.title = `Remove ${entry.label}`;
    remove.addEventListener("click", () => removeComparisonZone(entry.tz));

    left.append(title, zone);
    row.append(left, remove);
    elements.comparisonList.appendChild(row);
  });
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
    button.addEventListener("click", () => addComparisonZone(entry.tz));
    elements.favoritesList.appendChild(button);
  });
}

function renderInputZoneOptions() {
  const zones = [HOME_TZ, ...comparisonZones];
  const current = elements.inputZoneSelect.value || HOME_TZ;

  elements.inputZoneSelect.innerHTML = "";
  zones.forEach((tz) => {
    const option = document.createElement("option");
    option.value = tz;

    if (tz === HOME_TZ) {
      option.textContent = `ET (${HOME_TZ})`;
    } else {
      const location = findLocationByTz(tz);
      const label = location ? location.label : tz;
      option.textContent = `${label} (${tz})`;
    }

    elements.inputZoneSelect.appendChild(option);
  });

  if (zones.includes(current)) elements.inputZoneSelect.value = current;
  else elements.inputZoneSelect.value = HOME_TZ;
}

function refresh() {
  const baseInstant = getBaseInstant();

  if (!baseInstant || !baseInstant.isValid) {
    elements.resultsList.innerHTML = `<p class="empty-note">Invalid date/time.</p>`;
    return;
  }

  const etDateTime = baseInstant.setZone(HOME_TZ);
  const compareEntries = comparisonZones.map(findLocationByTz).filter(Boolean);

  elements.resultsList.innerHTML = "";

  elements.resultsList.appendChild(
    createResultRow({
      label: "ET",
      tz: HOME_TZ,
      dateTime: etDateTime,
      differenceText: "Home reference",
      isHome: true
    })
  );

  compareEntries.forEach((entry) => {
    const remote = baseInstant.setZone(entry.tz);
    elements.resultsList.appendChild(
      createResultRow({
        label: entry.label,
        tz: entry.tz,
        dateTime: remote,
        differenceText: describeOffsetDifference(remote, etDateTime),
        isHome: false
      })
    );
  });

  if (compareEntries.length === 0) {
    const note = document.createElement("p");
    note.className = "empty-note";
    note.textContent = "Add zones to compare against ET.";
    elements.resultsList.appendChild(note);
  }
}

function createResultRow({ label, tz, dateTime, differenceText, isHome }) {
  const row = document.createElement("article");
  row.className = `result-row${isHome ? " home" : ""}`;

  const heading = document.createElement("div");
  heading.className = "result-row-heading";
  heading.innerHTML = `<strong>${label}</strong> <span class="result-zone">${tz}</span>`;

  const time = document.createElement("div");
  time.className = "result-time";
  time.textContent = `${formatLong(dateTime)} (${dateTime.offsetNameShort})`;

  const diff = document.createElement("div");
  diff.className = "result-diff";
  diff.textContent = differenceText;

  const copy = document.createElement("button");
  copy.type = "button";
  copy.textContent = `Copy ${label} time`;
  copy.addEventListener("click", () => {
    copyText(`${label} (${tz}): ${formatLong(dateTime)} (${dateTime.offsetNameShort})`, `${label} time copied.`);
  });

  row.append(heading, time, diff, copy);
  return row;
}

function getBaseInstant() {
  if (getMode() === "now") {
    return DateTime.now();
  }

  if (!elements.dateInput.value || !elements.timeInput.value) {
    return null;
  }

  const isoLocal = `${elements.dateInput.value}T${elements.timeInput.value}`;
  const inputTz = elements.inputZoneSelect.value || HOME_TZ;
  return DateTime.fromISO(isoLocal, { zone: inputTz });
}

function describeOffsetDifference(remoteDateTime, etDateTime) {
  const deltaMinutes = remoteDateTime.offset - etDateTime.offset;

  if (deltaMinutes === 0) return "Same local time as ET";

  const absolute = Math.abs(deltaMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  const sign = deltaMinutes > 0 ? "+" : "-";
  const relation = deltaMinutes > 0 ? "ahead of ET" : "behind ET";

  if (minutes === 0) return `${sign}${hours}h ${relation}`;
  return `${sign}${hours}h ${minutes}m ${relation}`;
}

function formatLong(dateTime) {
  return dateTime.toFormat("ccc, LLL d, yyyy, h:mm a");
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

function renderFavoriteButtonState() {
  const active = favorites.includes(selectedEntry.tz);
  elements.favoriteBtn.classList.toggle("active", active);
  elements.favoriteBtn.textContent = active ? "★" : "☆";
}

function toggleFavorite(tz) {
  if (favorites.includes(tz)) favorites = favorites.filter((item) => item !== tz);
  else favorites = [tz, ...favorites];

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

function loadComparisonZones() {
  try {
    const raw = localStorage.getItem(COMPARE_ZONES_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((tz) => tz !== HOME_TZ && LOCATIONS.some((entry) => entry.tz === tz));
  } catch {
    return [];
  }
}

function saveComparisonZones(zones) {
  localStorage.setItem(COMPARE_ZONES_KEY, JSON.stringify(zones));
}

function findLocationByTz(tz) {
  return LOCATIONS.find((entry) => entry.tz === tz);
}

function formatLocationValue(entry) {
  return `${entry.label} (${entry.tz})`;
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    elements.copyFeedback.textContent = successMessage;
  } catch {
    elements.copyFeedback.textContent = "Copy failed. Your browser may block clipboard access.";
  }
}
