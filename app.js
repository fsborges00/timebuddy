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

const CITY_ALIASES = [
  { label: "Charlotte", tz: "America/New_York" },
  { label: "Miami", tz: "America/New_York" },
  { label: "Atlanta", tz: "America/New_York" },
  { label: "Boston", tz: "America/New_York" },
  { label: "Washington", tz: "America/New_York" },
  { label: "Dallas", tz: "America/Chicago" },
  { label: "Houston", tz: "America/Chicago" },
  { label: "Seattle", tz: "America/Los_Angeles" },
  { label: "San Francisco", tz: "America/Los_Angeles" },
  { label: "Las Vegas", tz: "America/Los_Angeles" },
  { label: "Salt Lake City", tz: "America/Denver" },
  { label: "Montreal", tz: "America/Toronto" },
  { label: "Dublin", tz: "Europe/Dublin" },
  { label: "Lisbon", tz: "Europe/Lisbon" },
  { label: "Zurich", tz: "Europe/Zurich" },
  { label: "Vienna", tz: "Europe/Vienna" },
  { label: "Prague", tz: "Europe/Prague" },
  { label: "Oslo", tz: "Europe/Oslo" },
  { label: "Stockholm", tz: "Europe/Stockholm" },
  { label: "Helsinki", tz: "Europe/Helsinki" },
  { label: "Cape Town", tz: "Africa/Johannesburg" },
  { label: "Beijing", tz: "Asia/Shanghai" },
  { label: "Shanghai", tz: "Asia/Shanghai" },
  { label: "Delhi", tz: "Asia/Kolkata" },
  { label: "Bengaluru", tz: "Asia/Kolkata" },
  { label: "Melbourne", tz: "Australia/Melbourne" },
  { label: "Brisbane", tz: "Australia/Brisbane" },
  { label: "Rio de Janeiro", tz: "America/Sao_Paulo" },
  { label: "Brasilia", tz: "America/Sao_Paulo" }
];

const COUNTRY_TIMEZONES = [
  {
    country: "United States",
    zones: [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Phoenix",
      "America/Los_Angeles",
      "America/Anchorage",
      "Pacific/Honolulu"
    ]
  },
  {
    country: "Canada",
    zones: [
      "America/St_Johns",
      "America/Halifax",
      "America/Toronto",
      "America/Winnipeg",
      "America/Edmonton",
      "America/Vancouver"
    ]
  },
  {
    country: "Australia",
    zones: [
      "Australia/Perth",
      "Australia/Darwin",
      "Australia/Adelaide",
      "Australia/Brisbane",
      "Australia/Sydney"
    ]
  },
  {
    country: "Brazil",
    zones: [
      "America/Sao_Paulo",
      "America/Manaus",
      "America/Cuiaba",
      "America/Belem",
      "America/Rio_Branco"
    ]
  },
  {
    country: "Mexico",
    zones: [
      "America/Mexico_City",
      "America/Cancun",
      "America/Chihuahua",
      "America/Tijuana"
    ]
  },
  {
    country: "Spain",
    zones: ["Europe/Madrid", "Atlantic/Canary"]
  },
  {
    country: "Portugal",
    zones: ["Europe/Lisbon", "Atlantic/Azores"]
  },
  {
    country: "Russia",
    zones: [
      "Europe/Kaliningrad",
      "Europe/Moscow",
      "Europe/Samara",
      "Asia/Yekaterinburg",
      "Asia/Omsk",
      "Asia/Krasnoyarsk",
      "Asia/Irkutsk",
      "Asia/Yakutsk",
      "Asia/Vladivostok",
      "Asia/Kamchatka"
    ]
  },
  {
    country: "Indonesia",
    zones: ["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"]
  },
  {
    country: "New Zealand",
    zones: ["Pacific/Auckland", "Pacific/Chatham"]
  },
  {
    country: "United Kingdom",
    zones: ["Europe/London"]
  },
  {
    country: "Japan",
    zones: ["Asia/Tokyo"]
  },
  {
    country: "India",
    zones: ["Asia/Kolkata"]
  },
  {
    country: "China",
    zones: ["Asia/Shanghai"]
  },
  {
    country: "Germany",
    zones: ["Europe/Berlin"]
  },
  {
    country: "France",
    zones: ["Europe/Paris"]
  },
  {
    country: "Italy",
    zones: ["Europe/Rome"]
  },
  {
    country: "South Africa",
    zones: ["Africa/Johannesburg"]
  },
  {
    country: "United Arab Emirates",
    zones: ["Asia/Dubai"]
  }
];

const ZONE_ABBREVIATIONS = {
  "America/New_York": { std: "EST", dst: "EDT" },
  "Europe/London": { std: "GMT", dst: "BST" },
  "America/Sao_Paulo": { std: "BRT", dst: "BRST" },
  "Asia/Tokyo": { std: "JST" },
  "America/Los_Angeles": { std: "PST", dst: "PDT" },
  "America/Denver": { std: "MST", dst: "MDT" },
  "America/Chicago": { std: "CST", dst: "CDT" },
  "America/Phoenix": { std: "MST" },
  "Europe/Berlin": { std: "CET", dst: "CEST" },
  "Asia/Dubai": { std: "GST" },
  "Australia/Sydney": { std: "AEST", dst: "AEDT" },
  "Europe/Paris": { std: "CET", dst: "CEST" },
  "Europe/Madrid": { std: "CET", dst: "CEST" },
  "Europe/Rome": { std: "CET", dst: "CEST" },
  "Europe/Amsterdam": { std: "CET", dst: "CEST" },
  "Asia/Kolkata": { std: "IST" },
  "Asia/Singapore": { std: "SGT" },
  "Asia/Hong_Kong": { std: "HKT" },
  "Asia/Seoul": { std: "KST" },
  "Asia/Bangkok": { std: "ICT" },
  "Africa/Johannesburg": { std: "SAST" },
  "Africa/Nairobi": { std: "EAT" },
  "America/Mexico_City": { std: "CST" },
  "America/Toronto": { std: "EST", dst: "EDT" },
  "America/Vancouver": { std: "PST", dst: "PDT" },
  "America/Anchorage": { std: "AKST", dst: "AKDT" },
  "Pacific/Honolulu": { std: "HST" },
  "America/Argentina/Buenos_Aires": { std: "ART" },
  "America/Lima": { std: "PET" },
  "America/Bogota": { std: "COT" },
  "America/Santiago": { std: "CLT", dst: "CLST" },
  "Pacific/Auckland": { std: "NZST", dst: "NZDT" },
  "Australia/Perth": { std: "AWST" },
  "Europe/Istanbul": { std: "TRT" },
  "Africa/Cairo": { std: "EET", dst: "EEST" },
  "Atlantic/Reykjavik": { std: "GMT" },
  "Europe/Dublin": { std: "GMT", dst: "IST" },
  "Europe/Lisbon": { std: "WET", dst: "WEST" },
  "Europe/Zurich": { std: "CET", dst: "CEST" },
  "Europe/Vienna": { std: "CET", dst: "CEST" },
  "Europe/Prague": { std: "CET", dst: "CEST" },
  "Europe/Oslo": { std: "CET", dst: "CEST" },
  "Europe/Stockholm": { std: "CET", dst: "CEST" },
  "Europe/Helsinki": { std: "EET", dst: "EEST" },
  "Asia/Shanghai": { std: "CST" },
  "Australia/Melbourne": { std: "AEST", dst: "AEDT" },
  "Australia/Brisbane": { std: "AEST" }
};

let allTimeZonesCache = null;

function getAllTimeZones() {
  if (allTimeZonesCache) return allTimeZonesCache;
  try {
    const zones = Intl.supportedValuesOf("timeZone");
    allTimeZonesCache = zones.map((tz) => ({
      label: deriveLabelFromZone(tz),
      tz
    }));
    return allTimeZonesCache;
  } catch (_) {
    allTimeZonesCache = LOCATIONS.slice();
    return allTimeZonesCache;
  }
}

function deriveLabelFromZone(tz) {
  const part = tz.split("/").pop() || tz;
  return part.replace(/_/g, " ");
}

function getSearchableZones() {
  const all = getAllTimeZones();
  const baseZones = [...LOCATIONS, ...CITY_ALIASES];
  const baseZoneSet = new Set(baseZones.map((e) => e.tz));
  const zoneEntries = [
    ...baseZones.map((entry) => ({ ...entry, kind: "zone" })),
    ...all
      .filter((e) => !baseZoneSet.has(e.tz))
      .map((entry) => ({ ...entry, kind: "zone" }))
  ];

  const countryEntries = COUNTRY_TIMEZONES.map((entry) => {
    const zones = entry.zones.filter((tz) => isValidZone(tz));
    if (zones.length <= 1) {
      return {
        kind: "country-single",
        label: entry.country,
        country: entry.country,
        tz: zones[0] || null,
        zones
      };
    }
    return {
      kind: "country-multi",
      label: entry.country,
      country: entry.country,
      zones
    };
  }).filter((entry) => entry.kind === "country-multi" || entry.tz);

  return [
    ...zoneEntries,
    ...countryEntries
  ];
}

function isValidZone(tz) {
  return DateTime.now().setZone(tz).isValid;
}

function getLabelForZone(tz) {
  const inLoc = LOCATIONS.find((e) => e.tz === tz);
  if (inLoc) return inLoc.label;
  return deriveLabelFromZone(tz);
}

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
let cityLookupCache = loadCityLookupCache();
let ticker = null;
let lastRenderedLines = [];

initialize();

function initialize() {
  fillDatalist();
  syncLocationInputWithFirst();

  const now = DateTime.now().setZone(HOME_TZ);
  elements.dateInput.value = now.toISODate();
  setTimePickerFromDateTime(now);

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

function updateCopyButtonLabel() {
  elements.copyAllBtn.textContent = getMode() === "pick" ? "Copy email subject" : "Copy all times";
}

function formatPickModeSubject(instant, segments) {
  const inputTz = elements.inputTzSelect.value || HOME_TZ;
  const dateInInputZone = instant.setZone(inputTz);
  return `${formatLongDateWithOrdinal(dateInInputZone)} @ ${segments.join(" // ")}`;
}

function formatLongDateWithOrdinal(dateTime) {
  const weekday = dateTime.toFormat("cccc");
  const month = dateTime.toFormat("LLLL");
  const day = dateTime.day;
  return `${weekday}, ${month} ${day}${getOrdinalSuffix(day)}`;
}

function getOrdinalSuffix(day) {
  if (day >= 11 && day <= 13) return "th";
  const last = day % 10;
  if (last === 1) return "st";
  if (last === 2) return "nd";
  if (last === 3) return "rd";
  return "th";
}

function formatSubjectTimeSegment(dateTime, abbr) {
  const minute = dateTime.toFormat("mm");
  const timePart = minute === "00" ? dateTime.toFormat("h") : dateTime.toFormat("h:mm");
  const meridiem = dateTime.toFormat("a").toUpperCase();
  return `${timePart}${meridiem} ${abbr}`;
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
  const favoriteEntries = favorites
    .filter((tz) => isValidZone(tz))
    .map((tz) => ({ label: getLabelForZone(tz), tz }));

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
    return parsed.filter((tz) => typeof tz === "string" && isValidZone(tz));
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

function formatSearchValue(entry) {
  if (entry.kind === "country-multi") {
    return `${entry.label} (country: ${entry.zones.length} time zones)`;
  }
  if (entry.kind === "country-single") {
    return `${entry.label} (country)`;
  }
  return formatLocationValue(entry);
}

function getSearchTokens(entry) {
  const parts = [entry.label];
  if (entry.country) parts.push(entry.country);
  if (entry.tz) parts.push(entry.tz);
  if (entry.zones) parts.push(...entry.zones);
  return parts.join(" ").toLowerCase();
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
