const { DateTime } = luxon;

const HOME_TZ = "America/New_York";
const HOME_LABEL = "ET";
const FAVORITES_KEY = "et-time-buddy-favorites";
const COMPARISON_LIST_KEY = "et-time-buddy-comparison-list";
const CITY_LOOKUP_CACHE_KEY = "et-time-buddy-city-lookup-cache-v1";
const MAX_TYPEAHEAD_OPTIONS = 8;
const MAX_CITY_LOOKUP_CACHE_ENTRIES = 200;
const CITY_LOOKUP_TIMEOUT_MS = 8000;
const CITY_SUGGEST_DEBOUNCE_MS = 260;

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
  locationSuggestions: document.getElementById("locationSuggestions"),
  addBtn: document.getElementById("addBtn"),
  favoriteBtn: document.getElementById("favoriteBtn"),
  favoritesList: document.getElementById("favoritesList"),
  comparisonList: document.getElementById("comparisonList"),
  customTimeSection: document.getElementById("customTimeSection"),
  dateInput: document.getElementById("dateInput"),
  timeHourInput: document.getElementById("timeHourInput"),
  timeMinuteInput: document.getElementById("timeMinuteInput"),
  timeMeridiemSelect: document.getElementById("timeMeridiemSelect"),
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
let lastCopyText = "";
let locationSuggestions = [];
let activeSuggestionIndex = -1;
let citySuggestTimer = null;
let citySuggestSeq = 0;

initialize();

function initialize() {
  syncLocationInputWithFirst();

  const now = DateTime.now().setZone(HOME_TZ);
  elements.dateInput.value = now.toISODate();
  setTimePickerFromDateTime(now);

  bindEvents();
  renderComparisonList();
  renderFavorites();
  populateInputTzSelect();
  updateCopyButtonLabel();
  refresh();
  startTicker();
}

function bindEvents() {
  elements.addBtn.addEventListener("click", attemptAddFromInput);

  elements.locationInput.addEventListener("input", () => {
    renderLocationSuggestions(elements.locationInput.value.trim());
    renderFavoriteButtonState();
  });

  elements.locationInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSuggestionSelection(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSuggestionSelection(-1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const highlighted = getActiveSuggestion();
      if (highlighted) {
        elements.locationInput.value = formatSearchValue(highlighted);
        clearLocationSuggestions();
        attemptAddFromInput(highlighted);
        return;
      }
      attemptAddFromInput();
      return;
    }

    if (event.key === "Escape") {
      clearLocationSuggestions();
    }
  });

  elements.locationInput.addEventListener("blur", () => {
    window.setTimeout(clearLocationSuggestions, 120);
  });

  elements.locationInput.addEventListener("focus", () => {
    renderLocationSuggestions(elements.locationInput.value.trim());
  });

  elements.locationInput.addEventListener("change", () => {
    renderFavoriteButtonState();
  });

  elements.favoriteBtn.addEventListener("click", () => {
    const entry = getSelectionFromInput({ normalizeInput: true });
    if (entry && entry.tz) {
      toggleFavorite(entry.tz);
      renderFavorites();
      renderFavoriteButtonState();
    } else if (entry && entry.kind === "country-multi") {
      elements.copyFeedback.textContent = "Pick a city or exact timezone before favoriting a multi-timezone country.";
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
      updateCopyButtonLabel();
      populateInputTzSelect();
      refresh();
    });
  });

  [elements.dateInput, elements.timeHourInput, elements.timeMinuteInput, elements.timeMeridiemSelect, elements.inputTzSelect].forEach((el) => {
    if (el) el.addEventListener("input", refresh);
    if (el) el.addEventListener("change", refresh);
  });

  elements.copyAllBtn.addEventListener("click", () => {
    const success = getMode() === "pick" ? "Email subject copied." : "All times copied.";
    copyText(lastCopyText, success);
  });
}

async function attemptAddFromInput(selectedOverride = null) {
  clearLocationSuggestions();
  const inputValue = elements.locationInput.value.trim();
  let selected = selectedOverride || getSelectionFromInput({ normalizeInput: true });

  if (!selected && inputValue) {
    elements.copyFeedback.textContent = `Searching "${inputValue}"...`;
    const remote = await lookupCityByName(inputValue);
    if (remote?.entry) {
      selected = remote.entry;
      elements.locationInput.value = formatLocationValue(remote.entry);
    } else if (remote?.suggestions?.length) {
      showLocationSuggestions(remote.suggestions);
      elements.copyFeedback.textContent = remote.error || "Multiple matches found. Pick one from the list.";
      return;
    } else {
      elements.copyFeedback.textContent = remote?.error || `No timezone found for "${inputValue}".`;
      return;
    }
  }

  if (!selected) {
    const value = inputValue;
    elements.copyFeedback.textContent = value
      ? `No timezone found for "${value}". Try a city, country, or IANA zone (e.g. Europe/London).`
      : "Type a city, country, or timezone above, then click Add.";
    return;
  }

  const { entry, note } = resolveEntryForAdd(selected);
  const addStatus = addToComparisonList(entry);

  if (addStatus === "added") {
    renderComparisonList();
    populateInputTzSelect();
    saveComparisonList(comparisonZones);
    refresh();
    elements.locationInput.value = "";
    renderFavoriteButtonState();
    elements.copyFeedback.textContent = note || "";
    return;
  }

  if (addStatus === "home-zone") {
    elements.copyFeedback.textContent = `${entry.label} uses ${HOME_LABEL}, which is already shown.`;
    return;
  }

  elements.copyFeedback.textContent = `${entry.label} is already in your comparison list.`;
}

function resolveEntryForAdd(selected) {
  if (selected.kind === "country-multi") {
    const primaryTz = selected.zones[0];
    const primaryLabel = deriveLabelFromZone(primaryTz);
    return {
      entry: {
        label: `${selected.label} (${primaryLabel})`,
        tz: primaryTz
      },
      note: `${selected.label} has ${selected.zones.length} time zones. Added ${primaryTz}.`
    };
  }

  if (selected.kind === "country-single") {
    return {
      entry: {
        label: selected.label,
        tz: selected.tz
      },
      note: ""
    };
  }

  return {
    entry: selected,
    note: ""
  };
}

function getMatchingSearchEntries(query) {
  const normalizedQuery = query.toLowerCase();
  return getSearchableZones()
    .filter((entry) => getSearchTokens(entry).includes(normalizedQuery))
    .slice(0, MAX_TYPEAHEAD_OPTIONS);
}

async function lookupCityByName(query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return { entry: null, error: "Type a city name first." };
  }

  const cached = cityLookupCache[normalizedQuery];
  if (cached && cached.tz && isValidZone(cached.tz)) {
    return {
      entry: { label: cached.label, tz: cached.tz, kind: "zone" }
    };
  }

  try {
    const results = await fetchCityLookupResults(query, MAX_TYPEAHEAD_OPTIONS);
    const mapped = results
      .filter((item) => item?.timezone && isValidZone(item.timezone))
      .map((item) => mapLookupResultToEntry(item));

    const deduped = dedupeLookupEntries(mapped);
    if (!deduped.length) {
      return { entry: null, error: `No timezone found for "${query}".` };
    }

    if (deduped.length > 1) {
      return {
        entry: null,
        suggestions: deduped,
        error: `Multiple matches for "${query}". Choose the exact city below.`
      };
    }

    const entry = deduped[0];
    cityLookupCache[normalizedQuery] = { label: entry.label, tz: entry.tz, ts: Date.now() };
    pruneCityLookupCache();
    saveCityLookupCache(cityLookupCache);
    return { entry };
  } catch (_) {
    return { entry: null, error: "Could not reach city lookup service. Check your connection and try again." };
  }
}

async function fetchCityLookupResults(query, count = MAX_TYPEAHEAD_OPTIONS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CITY_LOOKUP_TIMEOUT_MS);
  try {
    const endpoint = "https://geocoding-api.open-meteo.com/v1/search";
    const url = `${endpoint}?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("lookup failed");
    const data = await response.json();
    return Array.isArray(data?.results) ? data.results : [];
  } finally {
    clearTimeout(timeoutId);
  }
}

function mapLookupResultToEntry(result) {
  return {
    label: formatRemoteLocationLabel(result),
    tz: result.timezone,
    kind: "zone",
    source: "Geocoding lookup"
  };
}

function dedupeLookupEntries(entries) {
  const seen = new Set();
  const deduped = [];
  entries.forEach((entry) => {
    const key = `${entry.label}|${entry.tz}`;
    if (seen.has(key)) return;
    seen.add(key);
    deduped.push(entry);
  });
  return deduped;
}

function formatRemoteLocationLabel(result) {
  const parts = [result.name];
  if (result.admin1 && result.admin1 !== result.name) parts.push(result.admin1);
  if (result.country) parts.push(result.country);
  return parts.join(", ");
}

function loadCityLookupCache() {
  try {
    const raw = localStorage.getItem(CITY_LOOKUP_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function saveCityLookupCache(cache) {
  localStorage.setItem(CITY_LOOKUP_CACHE_KEY, JSON.stringify(cache));
}

function pruneCityLookupCache() {
  const entries = Object.entries(cityLookupCache);
  if (entries.length <= MAX_CITY_LOOKUP_CACHE_ENTRIES) return;

  entries
    .sort((a, b) => (a[1]?.ts || 0) - (b[1]?.ts || 0))
    .slice(0, entries.length - MAX_CITY_LOOKUP_CACHE_ENTRIES)
    .forEach(([key]) => {
      delete cityLookupCache[key];
    });
}

function renderLocationSuggestions(query) {
  if (citySuggestTimer) {
    clearTimeout(citySuggestTimer);
    citySuggestTimer = null;
  }

  if (!query) {
    clearLocationSuggestions();
    return;
  }

  const localMatches = getMatchingSearchEntries(query);
  if (localMatches.length > 0) {
    locationSuggestions = localMatches;
    activeSuggestionIndex = 0;
    drawLocationSuggestions();
    return;
  }

  if (query.length < 2) {
    clearLocationSuggestions();
    return;
  }

  const currentSeq = ++citySuggestSeq;
  citySuggestTimer = setTimeout(async () => {
    try {
      const remoteResults = await fetchCityLookupResults(query, MAX_TYPEAHEAD_OPTIONS);
      if (currentSeq !== citySuggestSeq) return;

      const currentInput = elements.locationInput.value.trim().toLowerCase();
      if (currentInput !== query.toLowerCase()) return;

      locationSuggestions = remoteResults
        .filter((item) => item?.timezone && isValidZone(item.timezone))
        .map((item) => mapLookupResultToEntry(item))
        .slice(0, MAX_TYPEAHEAD_OPTIONS);

      activeSuggestionIndex = locationSuggestions.length ? 0 : -1;
      drawLocationSuggestions();
    } catch (_) {
      if (currentSeq !== citySuggestSeq) return;
      clearLocationSuggestions();
    }
  }, CITY_SUGGEST_DEBOUNCE_MS);
}

function showLocationSuggestions(entries) {
  locationSuggestions = entries.slice(0, MAX_TYPEAHEAD_OPTIONS);
  activeSuggestionIndex = locationSuggestions.length ? 0 : -1;
  drawLocationSuggestions();
}

function drawLocationSuggestions() {
  const container = elements.locationSuggestions;
  if (!container) return;

  container.innerHTML = "";
  if (!locationSuggestions.length) {
    container.classList.add("hidden");
    return;
  }

  container.classList.remove("hidden");
  locationSuggestions.forEach((entry, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "typeahead-option";
    if (index === activeSuggestionIndex) option.classList.add("active");
    option.textContent = formatSearchValue(entry);
    option.addEventListener("mousedown", (event) => event.preventDefault());
    option.addEventListener("click", () => {
      elements.locationInput.value = formatSearchValue(entry);
      attemptAddFromInput(entry);
      renderFavoriteButtonState();
      elements.locationInput.focus();
    });
    container.appendChild(option);
  });
}

function moveSuggestionSelection(direction) {
  if (!locationSuggestions.length) return;
  activeSuggestionIndex = (activeSuggestionIndex + direction + locationSuggestions.length) % locationSuggestions.length;
  const selected = getActiveSuggestion();
  if (selected) {
    elements.locationInput.value = formatSearchValue(selected);
    renderFavoriteButtonState();
  }
  drawLocationSuggestions();
}

function getActiveSuggestion() {
  if (activeSuggestionIndex < 0 || activeSuggestionIndex >= locationSuggestions.length) return null;
  return locationSuggestions[activeSuggestionIndex];
}

function clearLocationSuggestions() {
  if (citySuggestTimer) {
    clearTimeout(citySuggestTimer);
    citySuggestTimer = null;
  }
  citySuggestSeq += 1;
  locationSuggestions = [];
  activeSuggestionIndex = -1;
  const container = elements.locationSuggestions;
  if (!container) return;
  container.innerHTML = "";
  container.classList.add("hidden");
}

function getSelectionFromInput(options = {}) {
  const { normalizeInput = false } = options;
  const value = elements.locationInput.value.trim();
  if (!value) return null;

  const searchable = getSearchableZones();

  const exactFormat = searchable.find((entry) => formatSearchValue(entry) === value);
  if (exactFormat) return exactFormat;

  const byTz = searchable.find((entry) => entry.tz && entry.tz.toLowerCase() === value.toLowerCase());
  if (byTz) {
    if (normalizeInput) {
      elements.locationInput.value = formatSearchValue(byTz);
    }
    return byTz;
  }

  const valueLower = value.toLowerCase();
  const byLabelExact = searchable.find(
    (entry) => entry.label.toLowerCase() === valueLower
  );
  if (byLabelExact) {
    if (normalizeInput) {
      elements.locationInput.value = formatSearchValue(byLabelExact);
    }
    return byLabelExact;
  }

  const byLabelContains = searchable.find(
    (entry) => getSearchTokens(entry).includes(valueLower)
  );
  if (byLabelContains) {
    if (normalizeInput) {
      elements.locationInput.value = formatSearchValue(byLabelContains);
    }
    return byLabelContains;
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
  if (entry.tz === HOME_TZ) return "home-zone";
  if (comparisonZones.some((z) => z.tz === entry.tz)) return "duplicate";
  comparisonZones.push({
    label: entry.label,
    tz: entry.tz,
    source: entry.source || "Manual selection"
  });
  return "added";
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
    return parsed
      .filter((item) => item && item.tz && isValidZone(item.tz))
      .map((item) => ({
        label: item.label || getLabelForZone(item.tz),
        tz: item.tz,
        source: item.source || "Manual selection"
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
    const sourceSpan = document.createElement("span");
    sourceSpan.className = "comparison-source";
    sourceSpan.textContent = entry.source || "Manual selection";
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
    row.appendChild(sourceSpan);
    row.appendChild(tzSpan);
    row.appendChild(removeBtn);
    elements.comparisonList.appendChild(row);
  });
}

function populateInputTzSelect() {
  const previousValue = elements.inputTzSelect.value;
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

  if (options.some((opt) => opt.value === previousValue)) {
    elements.inputTzSelect.value = previousValue;
  }
}

function refresh() {
  const instant = getReferenceInstant();
  if (!instant || !instant.isValid) {
    elements.resultsList.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = "Invalid date/time.";
    elements.resultsList.appendChild(p);
    lastRenderedLines = [];
    lastCopyText = "";
    return;
  }

  const etDateTime = instant.setZone(HOME_TZ);
  const rows = [];
  const linesForCopy = [];
  const subjectTimeSegments = [];

  // ET row first
  const etAbbr = getOffsetAbbreviation(etDateTime);
  const etFormatted = formatLongWithAbbr(etDateTime);
  rows.push({
    label: HOME_LABEL,
    iana: HOME_TZ,
    formatted: etFormatted,
    abbr: etAbbr,
    difference: null,
    removable: false
  });
  linesForCopy.push(`${HOME_LABEL} (${HOME_TZ}): ${etFormatted} ${etAbbr}`);
  subjectTimeSegments.push(formatSubjectTimeSegment(etDateTime, etAbbr));

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
      difference,
      removable: true,
      source: entry.source || "Manual selection"
    });
    linesForCopy.push(`${entry.label} (${entry.tz}): ${formatted} ${abbr} — ${difference}`);
    subjectTimeSegments.push(formatSubjectTimeSegment(zoned, abbr));
  });

  lastRenderedLines = linesForCopy;
  lastCopyText = getMode() === "pick"
    ? formatPickModeSubject(instant, subjectTimeSegments)
    : linesForCopy.join("\n");
  renderResults(rows);
  renderFavoriteButtonState();
}

function getReferenceInstant() {
  if (getMode() === "now") {
    return DateTime.now();
  }
  if (!elements.dateInput.value) return null;
  const inputTz = elements.inputTzSelect.value || HOME_TZ;
  const selected = getSelectedTimeParts();
  if (!selected) return null;
  const { hour24, minute } = selected;
  const hour = String(hour24).padStart(2, "0");
  const isoLocal = `${elements.dateInput.value}T${hour}:${minute}`;
  return DateTime.fromISO(isoLocal, { zone: inputTz });
}

function getSelectedTimeParts() {
  const hourRaw = (elements.timeHourInput.value || "").trim();
  const minuteRaw = (elements.timeMinuteInput.value || "").trim();
  if (!hourRaw) return null;

  const hour12 = Number(hourRaw);
  const minuteNum = minuteRaw ? Number(minuteRaw) : 0;
  if (!Number.isInteger(hour12) || hour12 < 1 || hour12 > 12) return null;
  if (!Number.isInteger(minuteNum) || minuteNum < 0 || minuteNum > 59) return null;

  const meridiem = elements.timeMeridiemSelect.value || "AM";

  let hour24 = hour12 % 12;
  if (meridiem === "PM") hour24 += 12;
  const minute = String(minuteNum).padStart(2, "0");
  return { hour24, minute };
}

function setTimePickerFromDateTime(dateTime) {
  const hour = dateTime.toFormat("h");
  const minute = dateTime.toFormat("mm");
  const meridiem = dateTime.toFormat("a").toUpperCase();
  elements.timeHourInput.value = hour;
  elements.timeMinuteInput.value = minute;
  elements.timeMeridiemSelect.value = meridiem;
}

function getOffsetAbbreviation(dateTime) {
  const live = (dateTime.toFormat("z") || "").trim();
  if (isNamedAbbreviation(live)) return live;

  const short = dateTime.offsetNameShort || "";
  if (isNamedAbbreviation(short)) return short;

  const mapped = getMappedAbbreviation(dateTime.zoneName, dateTime.isInDST);
  if (mapped) return mapped;
  return short;
}

function isNamedAbbreviation(value) {
  if (!value) return false;
  if (value.startsWith("GMT")) return false;
  return /^[A-Z]{2,6}$/.test(value);
}

function getMappedAbbreviation(zoneName, isInDST) {
  const config = ZONE_ABBREVIATIONS[zoneName];
  if (!config) return "";
  if (isInDST && config.dst) return config.dst;
  return config.std || config.dst || "";
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
    const abbrSpan = document.createElement("span");
    abbrSpan.className = "result-abbr";
    abbrSpan.textContent = row.abbr || "—";
    header.appendChild(labelSpan);
    header.appendChild(ianaSpan);
    if (row.source) {
      const sourceSpan = document.createElement("span");
      sourceSpan.className = "result-source";
      sourceSpan.textContent = row.source;
      header.appendChild(sourceSpan);
    }
    header.appendChild(abbrSpan);

    if (row.removable) {
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "remove-btn";
      removeBtn.setAttribute("aria-label", `Remove ${row.label}`);
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", () => removeFromComparisonList(row.iana));
      header.appendChild(removeBtn);
    }

    const timeLine = document.createElement("p");
    timeLine.className = "result-time";
    timeLine.textContent = row.formatted;
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
