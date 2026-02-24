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
const BUSINESS_START_HOUR = 7;
const BUSINESS_END_HOUR = 19;

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

const ZONE_CODE_ALIAS_TO_TZ = {
  UTC: "Etc/UTC",
  GMT: "Etc/UTC"
};

const ZONE_CODE_PREFERRED_TZ = {
  IST: "Asia/Kolkata",
  CST: "America/Chicago"
};

let allTimeZonesCache = null;
let zoneCodeToZonesCache = null;

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
  tabConverter: document.getElementById("tabConverter"),
  tabGoldenHours: document.getElementById("tabGoldenHours"),
  converterView: document.getElementById("converterView"),
  goldenHoursView: document.getElementById("goldenHoursView"),
  locationInput: document.getElementById("locationInput"),
  locationSuggestions: document.getElementById("locationSuggestions"),
  favoriteBtn: document.getElementById("favoriteBtn"),
  favoritesMenu: document.getElementById("favoritesMenu"),
  favoritesMenuList: document.getElementById("favoritesMenuList"),
  comparisonList: document.getElementById("comparisonList"),
  customTimeSection: document.getElementById("customTimeSection"),
  advancedSettingsToggle: document.getElementById("advancedSettingsToggle"),
  advancedSettingsContent: document.getElementById("advancedSettingsContent"),
  dateInput: document.getElementById("dateInput"),
  timeHourInput: document.getElementById("timeHourInput"),
  timeMinuteInput: document.getElementById("timeMinuteInput"),
  timeMeridiemSelect: document.getElementById("timeMeridiemSelect"),
  inputTzSelect: document.getElementById("inputTzSelect"),
  resultsList: document.getElementById("resultsList"),
  copyAllBtn: document.getElementById("copyAllBtn"),
  copyFeedback: document.getElementById("copyFeedback"),
  businessLocationInput: document.getElementById("businessLocationInput"),
  businessLocationSuggestions: document.getElementById("businessLocationSuggestions"),
  businessAddLocationBtn: document.getElementById("businessAddLocationBtn"),
  businessDateInput: document.getElementById("businessDateInput"),
  businessLocationList: document.getElementById("businessLocationList"),
  businessSummary: document.getElementById("businessSummary"),
  businessTimeline: document.getElementById("businessTimeline"),
  businessWindows: document.getElementById("businessWindows")
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
let favoritesMenuOpen = false;
let activeView = "converter";
let selectedBusinessLocations = [];
let businessLocationSuggestions = [];
let activeBusinessLocationSuggestionIndex = -1;
let businessCitySuggestTimer = null;
let businessCitySuggestSeq = 0;

initialize();

function initialize() {
  syncLocationInputWithFirst();

  const now = DateTime.now().setZone(HOME_TZ);
  elements.dateInput.value = now.toISODate();
  elements.businessDateInput.value = now.toISODate();
  setTimePickerFromDateTime(now);

  bindEvents();
  const liveMode = getMode() === "now";
  elements.customTimeSection.classList.toggle("hidden", liveMode);
  elements.customTimeSection.setAttribute("aria-hidden", String(liveMode));
  setAdvancedSettingsOpen(false);
  setFavoritesMenuOpen(false);
  renderComparisonList();
  renderFavorites();
  populateInputTzSelect();
  setActiveView("converter");
  updateCopyButtonLabel();
  refresh();
  renderBusinessHours();
  if (liveMode) {
    startTicker();
  } else {
    stopTicker();
  }
}

function bindEvents() {
  if (elements.tabConverter) {
    elements.tabConverter.addEventListener("click", () => setActiveView("converter"));
  }

  if (elements.tabGoldenHours) {
    elements.tabGoldenHours.addEventListener("click", () => setActiveView("golden-hours"));
  }

  elements.locationInput.addEventListener("input", () => {
    renderLocationSuggestions(elements.locationInput.value.trim());
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

  if (elements.favoriteBtn) {
    elements.favoriteBtn.addEventListener("click", () => {
      setFavoritesMenuOpen(!favoritesMenuOpen);
    });
  }

  if (elements.advancedSettingsToggle) {
    elements.advancedSettingsToggle.addEventListener("click", () => {
      setAdvancedSettingsOpen(elements.advancedSettingsToggle.getAttribute("aria-expanded") !== "true");
    });
  }

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

  if (elements.businessLocationInput) {
    elements.businessLocationInput.addEventListener("input", () => {
      renderBusinessLocationSuggestions(elements.businessLocationInput.value.trim());
    });
  }

  if (elements.businessLocationInput) {
    elements.businessLocationInput.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveBusinessLocationSuggestionSelection(1);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveBusinessLocationSuggestionSelection(-1);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const highlighted = getActiveBusinessLocationSuggestion();
        if (highlighted) {
          elements.businessLocationInput.value = formatSearchValue(highlighted);
          clearBusinessLocationSuggestions();
          attemptAddBusinessLocation(highlighted);
          return;
        }
        attemptAddBusinessLocation();
        return;
      }

      if (event.key === "Escape") {
        clearBusinessLocationSuggestions();
      }
    });
  }

  if (elements.businessLocationInput) {
    elements.businessLocationInput.addEventListener("blur", () => {
      window.setTimeout(clearBusinessLocationSuggestions, 120);
    });
  }

  if (elements.businessLocationInput) {
    elements.businessLocationInput.addEventListener("focus", () => {
      renderBusinessLocationSuggestions(elements.businessLocationInput.value.trim());
    });
  }

  if (elements.businessAddLocationBtn) {
    elements.businessAddLocationBtn.addEventListener("click", () => {
      attemptAddBusinessLocation();
    });
  }

  if (elements.businessDateInput) {
    elements.businessDateInput.addEventListener("input", renderBusinessHours);
    elements.businessDateInput.addEventListener("change", renderBusinessHours);
  }

  elements.copyAllBtn.addEventListener("click", () => {
    const success = getMode() === "pick" ? "Email subject copied." : "All times copied.";
    copyText(lastCopyText, success);
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest(".comparison-info-wrap")) {
      closeAllComparisonInfoBubbles();
    }
    if (!event.target.closest(".favorites-menu-wrap")) {
      setFavoritesMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllComparisonInfoBubbles();
      setFavoritesMenuOpen(false);
    }
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
      ? `No timezone found for "${value}". Try a timezone code (e.g. IST), city, country, or IANA zone (e.g. Europe/London).`
      : "Type a timezone code, city, country, or IANA timezone above, then press Enter.";
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
    elements.copyFeedback.textContent = note || "";
    return;
  }

  if (addStatus === "home-zone") {
    elements.copyFeedback.textContent = `${entry.label} uses ${HOME_LABEL}, which is already shown.`;
    return;
  }

  if (addStatus === "invalid") {
    elements.copyFeedback.textContent = "Could not determine a valid timezone from that value.";
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
  const codeMatches = getZoneEntriesByCode(query, MAX_TYPEAHEAD_OPTIONS);
  const textMatches = getSearchableZones()
    .filter((entry) => getSearchTokens(entry).includes(normalizedQuery))
    .filter((entry) => !codeMatches.some((codeEntry) => codeEntry.tz === entry.tz));

  return [...codeMatches, ...textMatches].slice(0, MAX_TYPEAHEAD_OPTIONS);
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
  const selected = getSelectionFromValue(value);
  if (!selected) return null;
  if (normalizeInput) {
    elements.locationInput.value = formatSearchValue(selected);
  }
  return selected;
}

function getSelectionFromValue(value) {
  if (!value) return null;

  const searchable = getSearchableZones();

  const exactFormat = searchable.find((entry) => formatSearchValue(entry) === value);
  if (exactFormat) return exactFormat;

  const byTz = searchable.find((entry) => entry.tz && entry.tz.toLowerCase() === value.toLowerCase());
  if (byTz) return byTz;

  const byCode = getZoneEntryByCode(value);
  if (byCode) return byCode;

  const valueLower = value.toLowerCase();
  const byLabelExact = searchable.find(
    (entry) => entry.label.toLowerCase() === valueLower
  );
  if (byLabelExact) return byLabelExact;

  const byLabelContains = searchable.find(
    (entry) => getSearchTokens(entry).includes(valueLower)
  );
  if (byLabelContains) return byLabelContains;

  return null;
}

function syncLocationInputWithFirst() {
  if (comparisonZones.length) {
    elements.locationInput.value = formatLocationValue(comparisonZones[0]);
    elements.copyFeedback.textContent = "";
  } else {
    elements.locationInput.value = "";
    elements.copyFeedback.textContent = "Type a timezone code, city, country, or IANA timezone above, then press Enter.";
  }
}

function addToComparisonList(entry) {
  if (!entry || !entry.tz || !isValidZone(entry.tz)) return "invalid";
  if (entry.tz === HOME_TZ) return "home-zone";
  if (comparisonZones.some((z) => z.tz === entry.tz)) return "duplicate";
  comparisonZones.push({
    label: entry.label || getLabelForZone(entry.tz),
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
    elements.comparisonList.appendChild(document.createTextNode("No zones added. Use the selector above and press Enter to compare."));
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

    const infoWrap = document.createElement("div");
    infoWrap.className = "comparison-info-wrap";

    const infoBtn = document.createElement("button");
    infoBtn.type = "button";
    infoBtn.className = "comparison-info-btn";
    infoBtn.setAttribute("aria-label", `Show details for ${entry.label}`);
    infoBtn.setAttribute("aria-expanded", "false");
    const bubbleId = `comparison-info-${entry.tz.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;
    infoBtn.setAttribute("aria-controls", bubbleId);
    infoBtn.textContent = "ℹ";

    const infoBubble = document.createElement("div");
    infoBubble.className = "comparison-info-bubble";
    infoBubble.id = bubbleId;
    infoBubble.setAttribute("role", "tooltip");
    infoBubble.setAttribute("aria-hidden", "true");
    infoBubble.textContent = `${entry.source || "Manual selection"} • ${entry.tz}`;

    infoBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = infoBubble.classList.contains("is-open");
      closeAllComparisonInfoBubbles();
      if (!isOpen) {
        infoBubble.classList.add("is-open");
        infoBubble.setAttribute("aria-hidden", "false");
        infoBtn.setAttribute("aria-expanded", "true");
      }
    });

    infoWrap.appendChild(infoBtn);
    infoWrap.appendChild(infoBubble);

    const favoriteToggleBtn = document.createElement("button");
    favoriteToggleBtn.type = "button";
    favoriteToggleBtn.className = "comparison-fav-btn";
    const isFavorite = favorites.includes(entry.tz);
    favoriteToggleBtn.textContent = isFavorite ? "★" : "☆";
    favoriteToggleBtn.setAttribute(
      "aria-label",
      `${isFavorite ? "Remove" : "Add"} ${entry.label} ${isFavorite ? "from" : "to"} favorites`
    );
    favoriteToggleBtn.setAttribute("aria-pressed", String(isFavorite));
    favoriteToggleBtn.addEventListener("click", () => {
      toggleFavorite(entry.tz);
      renderComparisonList();
      renderFavorites();
    });

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.setAttribute("aria-label", `Remove ${entry.label}`);
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => removeFromComparisonList(entry.tz));
    row.appendChild(labelSpan);
    row.appendChild(infoWrap);
    row.appendChild(favoriteToggleBtn);
    row.appendChild(removeBtn);
    elements.comparisonList.appendChild(row);
  });
}

function closeAllComparisonInfoBubbles() {
  document.querySelectorAll(".comparison-info-bubble").forEach((bubble) => {
    bubble.classList.remove("is-open");
    bubble.setAttribute("aria-hidden", "true");
  });
  document.querySelectorAll(".comparison-info-btn").forEach((btn) => {
    btn.setAttribute("aria-expanded", "false");
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

  // ET row first
  const etAbbr = getOffsetAbbreviation(etDateTime);
  const etFormatted = formatLongWithAbbr(etDateTime);
  rows.push({
    label: HOME_LABEL,
    iana: HOME_TZ,
    formatted: etFormatted,
    abbr: etAbbr,
    difference: null,
    removable: false,
    dateTime: etDateTime
  });

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
      source: entry.source || "Manual selection",
      dateTime: zoned
    });
  });

  rows.sort(compareRowsByLocalDateTime);

  const linesForCopy = rows.map((row) => {
    if (row.difference == null) {
      return `${row.label} (${row.iana}): ${row.formatted} ${row.abbr}`;
    }
    return `${row.label} (${row.iana}): ${row.formatted} ${row.abbr} — ${row.difference}`;
  });
  const subjectEntries = rows.map((row) => ({ dateTime: row.dateTime, abbr: row.abbr }));
  const rowsForRender = rows.map(({ dateTime, ...rest }) => rest);

  lastRenderedLines = linesForCopy;
  lastCopyText = getMode() === "pick"
    ? formatPickModeSubject(subjectEntries)
    : linesForCopy.join("\n");
  renderResults(rowsForRender);
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

function formatPickModeSubject(entries) {
  const byDate = new Map();

  entries.forEach((entry) => {
    const dateKey = entry.dateTime.toFormat("yyyy-LL-dd");
    const group = byDate.get(dateKey) || [];
    group.push(entry);
    byDate.set(dateKey, group);
  });

  const orderedDates = Array.from(byDate.keys()).sort();
  const dayGroups = orderedDates.map((dateKey) => {
    const dayEntries = byDate.get(dateKey) || [];
    dayEntries.sort((a, b) => getMinuteOfDay(a.dateTime) - getMinuteOfDay(b.dateTime));

    const headerDate = dayEntries[0]?.dateTime;
    const dateLabel = headerDate ? formatMonthDayWithOrdinal(headerDate) : "";
    const segments = dayEntries.map((entry) => formatSubjectTimeSegment(entry.dateTime, entry.abbr));
    return `${dateLabel} @ ${segments.join(" // ")}`;
  });

  return dayGroups.join(" /// ");
}

function formatMonthDayWithOrdinal(dateTime) {
  const month = dateTime.toFormat("LLLL");
  const day = dateTime.day;
  return `${month} ${day}${getOrdinalSuffix(day)}`;
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

function getMinuteOfDay(dateTime) {
  return (dateTime.hour * 60) + dateTime.minute;
}

function compareRowsByLocalDateTime(a, b) {
  const yearDiff = a.dateTime.year - b.dateTime.year;
  if (yearDiff !== 0) return yearDiff;

  const monthDiff = a.dateTime.month - b.dateTime.month;
  if (monthDiff !== 0) return monthDiff;

  const dayDiff = a.dateTime.day - b.dateTime.day;
  if (dayDiff !== 0) return dayDiff;

  const minuteDiff = getMinuteOfDay(a.dateTime) - getMinuteOfDay(b.dateTime);
  if (minuteDiff !== 0) return minuteDiff;

  return a.label.localeCompare(b.label);
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
    elements.favoritesMenuList.classList.add("empty");
    elements.favoritesMenuList.textContent = "No favorites yet. Use the row star (☆) to save a timezone.";
    return;
  }

  elements.favoritesMenuList.classList.remove("empty");
  elements.favoritesMenuList.innerHTML = "";

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
      refresh();
      setFavoritesMenuOpen(false);
    });
    elements.favoritesMenuList.appendChild(button);
  });
}

function setFavoritesMenuOpen(open) {
  if (!elements.favoriteBtn || !elements.favoritesMenu) return;
  favoritesMenuOpen = Boolean(open);
  elements.favoriteBtn.setAttribute("aria-expanded", String(favoritesMenuOpen));
  elements.favoritesMenu.classList.toggle("hidden", !favoritesMenuOpen);
}

function setAdvancedSettingsOpen(open) {
  if (!elements.advancedSettingsToggle || !elements.advancedSettingsContent) return;
  const isOpen = Boolean(open);
  elements.advancedSettingsToggle.setAttribute("aria-expanded", String(isOpen));
  elements.advancedSettingsContent.classList.toggle("hidden", !isOpen);
}

function setActiveView(view) {
  activeView = view === "golden-hours" ? "golden-hours" : "converter";
  const isConverter = activeView === "converter";
  if (elements.converterView) elements.converterView.classList.toggle("hidden", !isConverter);
  if (elements.goldenHoursView) elements.goldenHoursView.classList.toggle("hidden", isConverter);
  if (elements.tabConverter) {
    elements.tabConverter.classList.toggle("active", isConverter);
    elements.tabConverter.setAttribute("aria-pressed", String(isConverter));
  }
  if (elements.tabGoldenHours) {
    elements.tabGoldenHours.classList.toggle("active", !isConverter);
    elements.tabGoldenHours.setAttribute("aria-pressed", String(!isConverter));
  }
}

async function attemptAddBusinessLocation(selectedOverride = null) {
  clearBusinessLocationSuggestions();
  if (!elements.businessLocationInput) return;
  const inputValue = elements.businessLocationInput.value.trim();
  let selected = selectedOverride || getSelectionFromValue(inputValue);

  if (!selected && inputValue) {
    elements.businessSummary.textContent = `Searching "${inputValue}"...`;
    const remote = await lookupCityByName(inputValue);
    if (remote?.entry) {
      selected = remote.entry;
      elements.businessLocationInput.value = formatLocationValue(remote.entry);
    } else if (remote?.suggestions?.length) {
      showBusinessLocationSuggestions(remote.suggestions);
      elements.businessSummary.textContent = remote.error || "Multiple matches found. Pick one from the list.";
      return;
    } else {
      elements.businessSummary.textContent = remote?.error || `No timezone found for "${inputValue}".`;
      return;
    }
  }

  if (!selected) {
    elements.businessSummary.textContent = inputValue
      ? `No timezone found for "${inputValue}". Try a city, timezone code, country, or IANA timezone.`
      : "Type a city or timezone above, then press Enter.";
    return;
  }

  const entry = resolveBusinessLocationEntry(selected);
  if (!entry) {
    elements.businessSummary.textContent = "That country has multiple timezones. Pick a city or specific timezone.";
    return;
  }

  const status = addBusinessLocation(entry);
  if (status === "added") {
    elements.businessLocationInput.value = "";
    renderBusinessHours();
    return;
  }
  if (status === "duplicate") {
    elements.businessSummary.textContent = `${entry.label} is already selected.`;
    return;
  }
  elements.businessSummary.textContent = "Could not determine a valid timezone from that value.";
}

function resolveBusinessLocationEntry(selected) {
  if (!selected) return null;
  if (selected.kind === "country-multi") return null;
  if (selected.kind === "country-single") {
    return {
      label: selected.label,
      tz: selected.tz,
      source: "Country selection"
    };
  }
  return {
    label: selected.label || getLabelForZone(selected.tz),
    tz: selected.tz,
    source: selected.source || "Manual selection"
  };
}

function addBusinessLocation(entry) {
  if (!entry || !entry.tz || !isValidZone(entry.tz)) return "invalid";
  if (selectedBusinessLocations.some((item) => item.tz === entry.tz)) return "duplicate";
  selectedBusinessLocations.push({
    label: entry.label || getLabelForZone(entry.tz),
    tz: entry.tz,
    source: entry.source || "Manual selection"
  });
  return "added";
}

function removeBusinessLocation(tz) {
  selectedBusinessLocations = selectedBusinessLocations.filter((entry) => entry.tz !== tz);
  renderBusinessHours();
}

function renderBusinessLocationList() {
  if (!elements.businessLocationList) return;
  if (!selectedBusinessLocations.length) {
    elements.businessLocationList.classList.add("empty");
    elements.businessLocationList.innerHTML = "";
    elements.businessLocationList.appendChild(document.createTextNode("Select at least two locations."));
    return;
  }

  elements.businessLocationList.classList.remove("empty");
  elements.businessLocationList.innerHTML = "";
  selectedBusinessLocations.forEach((entry) => {
    const chip = document.createElement("div");
    chip.className = "business-location-chip";

    const text = document.createElement("span");
    text.textContent = entry.label;
    chip.appendChild(text);

    const note = document.createElement("small");
    note.textContent = entry.tz;
    chip.appendChild(note);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.setAttribute("aria-label", `Remove ${entry.label}`);
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => removeBusinessLocation(entry.tz));
    chip.appendChild(removeBtn);

    elements.businessLocationList.appendChild(chip);
  });
}

function renderBusinessLocationSuggestions(query) {
  if (businessCitySuggestTimer) {
    clearTimeout(businessCitySuggestTimer);
    businessCitySuggestTimer = null;
  }

  if (!query) {
    clearBusinessLocationSuggestions();
    return;
  }

  const localMatches = getMatchingSearchEntries(query);
  if (localMatches.length > 0) {
    businessLocationSuggestions = localMatches;
    activeBusinessLocationSuggestionIndex = 0;
    drawBusinessLocationSuggestions();
    return;
  }

  if (query.length < 2) {
    clearBusinessLocationSuggestions();
    return;
  }

  const currentSeq = ++businessCitySuggestSeq;
  businessCitySuggestTimer = setTimeout(async () => {
    try {
      const remoteResults = await fetchCityLookupResults(query, MAX_TYPEAHEAD_OPTIONS);
      if (currentSeq !== businessCitySuggestSeq) return;
      if (!elements.businessLocationInput) return;
      const currentInput = elements.businessLocationInput.value.trim().toLowerCase();
      if (currentInput !== query.toLowerCase()) return;

      businessLocationSuggestions = remoteResults
        .filter((item) => item?.timezone && isValidZone(item.timezone))
        .map((item) => mapLookupResultToEntry(item))
        .slice(0, MAX_TYPEAHEAD_OPTIONS);

      activeBusinessLocationSuggestionIndex = businessLocationSuggestions.length ? 0 : -1;
      drawBusinessLocationSuggestions();
    } catch (_) {
      if (currentSeq !== businessCitySuggestSeq) return;
      clearBusinessLocationSuggestions();
    }
  }, CITY_SUGGEST_DEBOUNCE_MS);
}

function showBusinessLocationSuggestions(entries) {
  businessLocationSuggestions = entries.slice(0, MAX_TYPEAHEAD_OPTIONS);
  activeBusinessLocationSuggestionIndex = businessLocationSuggestions.length ? 0 : -1;
  drawBusinessLocationSuggestions();
}

function drawBusinessLocationSuggestions() {
  const container = elements.businessLocationSuggestions;
  if (!container) return;

  container.innerHTML = "";
  if (!businessLocationSuggestions.length) {
    container.classList.add("hidden");
    return;
  }

  container.classList.remove("hidden");
  businessLocationSuggestions.forEach((entry, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "typeahead-option";
    if (index === activeBusinessLocationSuggestionIndex) option.classList.add("active");
    option.textContent = formatSearchValue(entry);
    option.addEventListener("mousedown", (event) => event.preventDefault());
    option.addEventListener("click", () => {
      if (elements.businessLocationInput) {
        elements.businessLocationInput.value = formatSearchValue(entry);
      }
      attemptAddBusinessLocation(entry);
      elements.businessLocationInput?.focus();
    });
    container.appendChild(option);
  });
}

function moveBusinessLocationSuggestionSelection(direction) {
  if (!businessLocationSuggestions.length || !elements.businessLocationInput) return;
  activeBusinessLocationSuggestionIndex = (activeBusinessLocationSuggestionIndex + direction + businessLocationSuggestions.length) % businessLocationSuggestions.length;
  const selected = getActiveBusinessLocationSuggestion();
  if (selected) {
    elements.businessLocationInput.value = formatSearchValue(selected);
  }
  drawBusinessLocationSuggestions();
}

function getActiveBusinessLocationSuggestion() {
  if (activeBusinessLocationSuggestionIndex < 0 || activeBusinessLocationSuggestionIndex >= businessLocationSuggestions.length) return null;
  return businessLocationSuggestions[activeBusinessLocationSuggestionIndex];
}

function clearBusinessLocationSuggestions() {
  if (businessCitySuggestTimer) {
    clearTimeout(businessCitySuggestTimer);
    businessCitySuggestTimer = null;
  }
  businessCitySuggestSeq += 1;
  businessLocationSuggestions = [];
  activeBusinessLocationSuggestionIndex = -1;
  const container = elements.businessLocationSuggestions;
  if (!container) return;
  container.innerHTML = "";
  container.classList.add("hidden");
}

function renderBusinessHours() {
  renderBusinessLocationList();
  if (!elements.businessSummary || !elements.businessTimeline || !elements.businessWindows) return;

  const locations = selectedBusinessLocations.slice();
  if (locations.length < 2) {
    elements.businessSummary.textContent = "Add at least two locations to see overlap.";
    elements.businessTimeline.innerHTML = "";
    elements.businessWindows.innerHTML = "";
    return;
  }

  const dateValue = elements.businessDateInput?.value;
  const baseDate = dateValue
    ? DateTime.fromISO(`${dateValue}T00:00`, { zone: HOME_TZ })
    : DateTime.now().setZone(HOME_TZ).startOf("day");

  const slots = [];
  for (let hour = 0; hour < 24; hour += 1) {
    const etHourStart = baseDate.plus({ hours: hour });
    const openCount = locations.reduce((count, location) => {
      const localStart = etHourStart.setZone(location.tz);
      const localEnd = etHourStart.plus({ hours: 1 }).setZone(location.tz);
      const inBusinessHours = isFullSlotInsideBusinessHours(localStart, localEnd);
      return count + (inBusinessHours ? 1 : 0);
    }, 0);
    slots.push({ etHourStart, openCount, total: locations.length });
  }

  drawBusinessTimeline(slots, locations);
  drawBusinessWindows(slots, locations);

  const fullHours = slots.filter((slot) => slot.openCount === slot.total).length;
  if (fullHours > 0) {
    elements.businessSummary.textContent = `${fullHours} fully overlapping hour(s) found on ${baseDate.toFormat("LLL d, yyyy")} (ET view).`;
    return;
  }

  const best = Math.max(...slots.map((slot) => slot.openCount));
  elements.businessSummary.textContent = `No full overlap found. Best availability is ${best}/${locations.length} locations at once.`;
}

function drawBusinessTimeline(slots, locations) {
  elements.businessTimeline.innerHTML = "";
  slots.forEach((slot) => {
    const cell = document.createElement("div");
    cell.className = "timeline-hour";
    if (slot.openCount === 0) {
      cell.classList.add("level-none");
    } else if (slot.openCount === slot.total) {
      cell.classList.add("level-full");
    } else {
      cell.classList.add("level-partial");
    }

    const etLine = document.createElement("div");
    etLine.className = "hour-line et-line";
    etLine.textContent = `ET: ${formatHourRange(slot.etHourStart, slot.etHourStart.plus({ hours: 1 }))}`;
    cell.appendChild(etLine);

    locations.forEach((location) => {
      const start = slot.etHourStart.setZone(location.tz);
      const end = slot.etHourStart.plus({ hours: 1 }).setZone(location.tz);
      const localLine = document.createElement("div");
      localLine.className = "hour-line";
      localLine.textContent = `${getTimelineLabel(location.label)}: ${formatHourRange(start, end)}`;
      cell.appendChild(localLine);
    });

    elements.businessTimeline.appendChild(cell);
  });
}

function drawBusinessWindows(slots, locations) {
  elements.businessWindows.innerHTML = "";
  const windows = getFullOverlapWindows(slots);
  if (!windows.length) return;

  windows.forEach((window) => {
    const card = document.createElement("div");
    card.className = "business-window-card";

    const title = document.createElement("div");
    title.className = "business-window-title";
    title.textContent = `${formatTimeRange(window.start, window.end)} ET`;
    card.appendChild(title);

    const locals = document.createElement("div");
    locals.className = "business-window-locals";
    locals.textContent = locations
      .map((location) => `${location.label}: ${formatTimeRange(window.start.setZone(location.tz), window.end.setZone(location.tz))}`)
      .join(" • ");
    card.appendChild(locals);
    elements.businessWindows.appendChild(card);
  });
}

function getFullOverlapWindows(slots) {
  const windows = [];
  let start = null;
  slots.forEach((slot) => {
    const isFull = slot.openCount === slot.total;
    if (isFull && !start) {
      start = slot.etHourStart;
    }
    if (!isFull && start) {
      windows.push({ start, end: slot.etHourStart });
      start = null;
    }
  });

  if (start && slots.length) {
    const last = slots[slots.length - 1];
    windows.push({ start, end: last.etHourStart.plus({ hours: 1 }) });
  }
  return windows;
}

function formatTimeRange(start, end) {
  return `${start.toFormat("h:mm a")} - ${end.toFormat("h:mm a")}`;
}

function isFullSlotInsideBusinessHours(localStart, localEnd) {
  if (!localStart || !localEnd) return false;
  if (localStart.weekday > 5 || localEnd.weekday > 5) return false;
  if (!localStart.hasSame(localEnd, "day")) return false;

  const startMinutes = (localStart.hour * 60) + localStart.minute;
  const endMinutes = (localEnd.hour * 60) + localEnd.minute;
  const minStart = BUSINESS_START_HOUR * 60;
  const maxEnd = BUSINESS_END_HOUR * 60;

  return startMinutes >= minStart && endMinutes <= maxEnd;
}

function formatHourRange(start, end) {
  return `${start.toFormat("ha")} - ${end.toFormat("ha")}`;
}

function getTimelineLabel(label) {
  if (!label) return "";
  return label.split(",")[0].trim();
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

function getZoneEntryByCode(rawValue) {
  const entries = getZoneEntriesByCode(rawValue, 1);
  return entries[0] || null;
}

function getZoneEntriesByCode(rawValue, limit = MAX_TYPEAHEAD_OPTIONS) {
  const code = rawValue.trim().toUpperCase();
  if (!/^[A-Z]{2,6}$/.test(code)) return [];

  const entries = [];
  const seenTz = new Set();
  const pushTz = (tz) => {
    if (!tz || seenTz.has(tz) || !isValidZone(tz)) return;
    seenTz.add(tz);
    entries.push(makeZoneCodeEntry(code, tz));
  };

  pushTz(ZONE_CODE_PREFERRED_TZ[code]);
  pushTz(ZONE_CODE_ALIAS_TO_TZ[code]);

  const codeMap = getZoneCodeToZonesMap();
  const matches = codeMap.get(code);
  if (Array.isArray(matches)) {
    matches.forEach((tz) => pushTz(tz));
  }

  return entries.slice(0, limit);
}

function makeZoneCodeEntry(code, tz) {
  return {
    label: code,
    tz,
    kind: "zone",
    source: `Timezone code (${code})`
  };
}

function getZoneCodeToZonesMap() {
  if (zoneCodeToZonesCache) return zoneCodeToZonesCache;

  const map = new Map();
  const pushCode = (code, tz) => {
    if (!code || !tz) return;
    const normalized = String(code).trim().toUpperCase();
    if (!/^[A-Z]{2,6}$/.test(normalized)) return;
    if (!isValidZone(tz)) return;
    const current = map.get(normalized) || [];
    if (!current.includes(tz)) current.push(tz);
    map.set(normalized, current);
  };

  Object.entries(ZONE_ABBREVIATIONS).forEach(([tz, config]) => {
    pushCode(config?.std, tz);
    pushCode(config?.dst, tz);
  });

  getAllTimeZones().forEach((entry) => {
    const zoned = DateTime.now().setZone(entry.tz);
    if (!zoned.isValid) return;
    pushCode(getOffsetAbbreviation(zoned), entry.tz);
    pushCode(zoned.offsetNameShort, entry.tz);
  });

  zoneCodeToZonesCache = map;
  return map;
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
