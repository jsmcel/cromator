const LEGACY_STORAGE_KEY = "cromator-panini-state-v1";
const STORAGE_PREFIX = "cromator-panini-state-v2:";
const SESSION_KEY = "cromator-panini-session-v1";
const ALBUM_SIZE = 20;

const USERS = [
  { email: "diego@cromos.es", password: "mundial", name: "Diego" },
];

const DIEGO_REPEATS_SEED = "diego-repes-20260704";
const USER_REPEAT_SEEDS = {
  "diego@cromos.es": {
    id: DIEGO_REPEATS_SEED,
    repeats: {
      "Especial FIFA": [7, 9, 10, 15, 16],
      Alemania: [4, 9],
      Argentina: [12],
      Australia: [1, 1, 2, 2, 5, 6, 7, 13, 15, 18, 20],
      Bosnia: [13],
      Canadá: [19],
      Catar: [1, 3, 5, 6, 8, 10, 12, 16, 17, 18, 19],
      Chequia: [1, 8, 11, 13],
      Curazao: [3, 7, 9, 11],
      España: [3, 4, 5, 7, 9, 11, 17, 19],
      USA: [2, 4, 8, 10, 14, 15],
      Inglaterra: [1, 6, 7, 8, 10, 15, 17],
      Haití: [4, 12, 13, 17, 20],
      Noruega: [2, 4, 5, 7, 9, 10, 12, 15, 20],
      "Nueva Zelanda": [2, 3, 7, 8, 15, 16, 18, 19, 20],
      Uzbekistán: [12, 14, 17, 18],
      Uruguay: [8, 15, 16, 17],
    },
  },
};

const INITIAL_COUNTRIES = [
  ["Alemania", [1, 16]],
  ["Argelia", [9]],
  ["Arabia", [7, 11, 15, 18]],
  ["Argentina", [2, 7, 9, 16]],
  ["Australia", [7, 8, 11, 14, 19]],
  ["Bélgica", [10, 11]],
  ["Bosnia", [2, 5, 9, 11, 18]],
  ["Brasil", [6, 7]],
  ["Cabo Verde", []],
  ["Canadá", []],
  ["Chequia", [4]],
  ["Colombia", [10, 16, 17]],
  ["Costa de Marfil", []],
  ["Curazao", [1, 8, 18]],
  ["España", [6, 20]],
  ["Inglaterra", [9, 11]],
  ["Marruecos", [8]],
  ["Nueva Zelanda", [1, 4, 5, 6]],
  ["Suiza", [10, 14]],
  ["Uruguay", [10, 14]],
  ["USA", [3, 5, 11]],
  ["Uzbekistán", [5, 18]],
];

const $ = (selector) => document.querySelector(selector);

const els = {
  authView: $("#authView"),
  appShell: $("#appShell"),
  loginForm: $("#loginForm"),
  loginEmail: $("#loginEmail"),
  loginPassword: $("#loginPassword"),
  loginError: $("#loginError"),
  currentUserName: $("#currentUserName"),
  logoutButton: $("#logoutButton"),
  missingTotal: $("#missingTotal"),
  ownedTotal: $("#ownedTotal"),
  repeatTotal: $("#repeatTotal"),
  crossCheckStatus: $("#crossCheckStatus"),
  saveState: $("#saveState"),
  countrySelect: $("#countrySelect"),
  stickerNumber: $("#stickerNumber"),
  repeatCount: $("#repeatCount"),
  markOwned: $("#markOwned"),
  markMissing: $("#markMissing"),
  addRepeat: $("#addRepeat"),
  selectedCountryTitle: $("#selectedCountryTitle"),
  onlyMissingToggle: $("#onlyMissingToggle"),
  exportData: $("#exportData"),
  correctionForm: $("#correctionForm"),
  editCountryName: $("#editCountryName"),
  editMissingNumbers: $("#editMissingNumbers"),
  deleteCountry: $("#deleteCountry"),
  stickerBoard: $("#stickerBoard"),
  countryList: $("#countryList"),
  countrySearch: $("#countrySearch"),
  addCountryForm: $("#addCountryForm"),
  newCountryName: $("#newCountryName"),
  importForm: $("#importForm"),
  importText: $("#importText"),
  clearImport: $("#clearImport"),
  resetData: $("#resetData"),
  quickForm: $("#quickForm"),
};

let activeUser = loadSession();
let state = null;
let selectedCountry = "";
let onlyMissing = false;
let searchTerm = "";
let toastTimer = null;

if (activeUser) {
  startApp();
} else {
  showLogin();
}

els.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  login();
});

els.logoutButton.addEventListener("click", () => {
  activeUser = null;
  state = null;
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
});

els.countrySelect.addEventListener("change", () => {
  selectedCountry = els.countrySelect.value;
  render();
});

els.stickerNumber.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    markOwned();
  }
});

els.quickForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

els.markOwned.addEventListener("click", markOwned);
els.markMissing.addEventListener("click", markMissing);
els.addRepeat.addEventListener("click", saveRepeats);

els.correctionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveCorrection();
});

els.deleteCountry.addEventListener("click", deleteSelectedCountry);

els.onlyMissingToggle.addEventListener("click", () => {
  onlyMissing = !onlyMissing;
  els.onlyMissingToggle.setAttribute("aria-pressed", String(onlyMissing));
  renderBoard();
});

els.exportData.addEventListener("click", async () => {
  const text = buildExportText();
  try {
    await navigator.clipboard.writeText(text);
    toast("Listado copiado");
  } catch {
    window.prompt("Listado", text);
  }
});

els.countrySearch.addEventListener("input", () => {
  searchTerm = normalize(els.countrySearch.value);
  renderCountryList();
});

els.addCountryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = cleanCountryName(els.newCountryName.value);
  if (!name) return;
  ensureCountry(name);
  selectedCountry = name;
  els.newCountryName.value = "";
  saveAndRender("País añadido");
});

els.importForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const parsed = parseMissingList(els.importText.value);
  if (!parsed.length) {
    toast("No he encontrado líneas con país y números");
    return;
  }

  parsed.forEach(({ country, numbers }) => {
    const item = ensureCountry(country);
    numbers.forEach((number) => item.missing.add(number));
  });

  selectedCountry = parsed[0].country;
  saveAndRender(`${parsed.length} países importados`);
});

els.clearImport.addEventListener("click", () => {
  els.importText.value = "";
  els.importText.focus();
});

els.resetData.addEventListener("click", () => {
  const ok = window.confirm("¿Volver a la lista inicial?");
  if (!ok) return;
  localStorage.removeItem(userStorageKey(activeUser.email));
  state = createInitialState();
  selectedCountry = state.countries[0].name;
  saveAndRender("Lista reiniciada");
});

function markOwned() {
  const country = currentCountry();
  const number = readStickerNumber();
  if (!country || !number) return;

  country.missing.delete(number);
  saveAndRender(`${country.name} ${number} marcado como conseguido`);
  focusNumber();
}

function markMissing() {
  const country = currentCountry();
  const number = readStickerNumber();
  if (!country || !number) return;

  delete country.repeats[number];
  country.missing.add(number);
  saveAndRender(`${country.name} ${number} marcado como falta`);
  focusNumber();
}

function saveRepeats() {
  const country = currentCountry();
  const number = readStickerNumber();
  if (!country || !number) return;

  const count = clampNumber(Number(els.repeatCount.value), 0, 99);
  country.missing.delete(number);

  if (count === 0) {
    delete country.repeats[number];
  } else {
    country.repeats[number] = count;
  }

  saveAndRender(`${country.name} ${number}: ${count} repes`);
  focusNumber();
}

function currentCountry() {
  return state.countries.find((country) => country.name === selectedCountry);
}

function readStickerNumber() {
  const number = clampNumber(Number(els.stickerNumber.value), 1, 999);
  if (!number) {
    toast("Mete un número");
    els.stickerNumber.focus();
    return null;
  }
  return number;
}

function focusNumber() {
  els.stickerNumber.select();
  els.stickerNumber.focus();
}

function render() {
  if (!state) return;
  state.countries.sort((a, b) => a.name.localeCompare(b.name, "es"));
  if (!currentCountry()) selectedCountry = state.countries[0]?.name || "";

  renderSelect();
  renderCounters();
  renderCorrectionForm();
  renderBoard();
  renderCountryList();
}

function renderSelect() {
  const value = selectedCountry;
  els.countrySelect.innerHTML = "";

  state.countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.name;
    option.textContent = country.name;
    els.countrySelect.append(option);
  });

  els.countrySelect.value = value;
}

function renderCounters() {
  const missing = state.countries.reduce((total, country) => total + country.missing.size, 0);
  const repeats = state.countries.reduce((total, country) => {
    return total + Object.values(country.repeats).reduce((sum, count) => sum + count, 0);
  }, 0);
  const owned = state.countries.length * ALBUM_SIZE - missing;

  els.missingTotal.textContent = missing;
  els.ownedTotal.textContent = owned;
  els.repeatTotal.textContent = repeats;
  renderCrossCheck();
}

function renderBoard() {
  const country = currentCountry();
  els.stickerBoard.innerHTML = "";
  if (!country) return;

  els.selectedCountryTitle.textContent = country.name;

  for (let number = 1; number <= ALBUM_SIZE; number += 1) {
    const tile = document.createElement("button");
    const repeatCount = country.repeats[number] || 0;
    const isMissing = country.missing.has(number);

    tile.type = "button";
    tile.className = [
      "sticker",
      isMissing ? "is-missing" : "is-owned",
      repeatCount ? "is-repeat" : "",
      onlyMissing && !isMissing ? "is-hidden" : "",
    ].filter(Boolean).join(" ");
    tile.title = `${country.name} ${number}`;
    tile.innerHTML = `<span class="num">${number}</span>${repeatCount ? `<span class="badge">${repeatCount}</span>` : ""}`;
    tile.addEventListener("click", () => {
      els.stickerNumber.value = number;
      els.repeatCount.value = repeatCount || 1;
      focusNumber();
    });
    tile.addEventListener("dblclick", () => {
      if (country.missing.has(number)) {
        country.missing.delete(number);
      } else {
        country.missing.add(number);
      }
      saveAndRender(`${country.name} ${number} actualizado`);
    });

    els.stickerBoard.append(tile);
  }
}

function renderCorrectionForm() {
  const country = currentCountry();
  if (!country) return;

  els.editCountryName.value = country.name;
  els.editMissingNumbers.value = sortedNumbers(country.missing).join("-");
}

function renderCountryList() {
  els.countryList.innerHTML = "";
  const template = $("#countryCardTemplate");

  state.countries
    .filter((country) => !searchTerm || normalize(country.name).includes(searchTerm))
    .forEach((country) => {
      const node = template.content.firstElementChild.cloneNode(true);
      const missingNumbers = sortedNumbers(country.missing);
      const repeats = repeatText(country);

      node.classList.toggle("is-selected", country.name === selectedCountry);
      node.querySelector(".country-name").textContent = country.name;
      node.querySelector(".country-stats").textContent = `${missingNumbers.length} faltan`;
      node.querySelector(".mini-missing").textContent = missingNumbers.length
        ? `Faltan: ${missingNumbers.join("-")}`
        : "Completo";
      node.querySelector(".mini-repeats").textContent = repeats || "Sin repes";
      node.querySelector(".country-main").addEventListener("click", () => {
        selectedCountry = country.name;
        render();
        els.stickerNumber.focus();
      });

      els.countryList.append(node);
    });
}

function repeatText(country) {
  const entries = Object.entries(country.repeats)
    .filter(([, count]) => count > 0)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([number, count]) => `${number}x${count}`);

  return entries.length ? `Repes: ${entries.join(", ")}` : "";
}

function sortedNumbers(set) {
  return Array.from(set).sort((a, b) => a - b);
}

function renderCrossCheck() {
  const conflicts = findRepeatMissingConflicts();
  const hasConflicts = conflicts.length > 0;
  els.crossCheckStatus.classList.toggle("is-ok", !hasConflicts);
  els.crossCheckStatus.classList.toggle("is-warn", hasConflicts);
  els.crossCheckStatus.textContent = hasConflicts
    ? `Revisar: ${conflicts.length} repes estaban en faltantes`
    : "Cruce OK: ningun repe esta en faltantes";
}

function saveCorrection() {
  const country = currentCountry();
  if (!country) return;

  const newName = cleanCountryName(els.editCountryName.value);
  if (!newName) {
    toast("El país no puede quedar vacío");
    return;
  }

  const duplicate = state.countries.find((item) => {
    return item !== country && normalize(item.name) === normalize(newName);
  });
  if (duplicate) {
    toast("Ya existe ese país");
    return;
  }

  country.name = newName;
  country.missing = new Set(withoutRepeatedNumbers(parseNumberList(els.editMissingNumbers.value), country));
  selectedCountry = newName;
  saveAndRender("Corrección guardada");
}

function deleteSelectedCountry() {
  const country = currentCountry();
  if (!country) return;

  const ok = window.confirm(`¿Borrar ${country.name}?`);
  if (!ok) return;

  state.countries = state.countries.filter((item) => item !== country);
  selectedCountry = state.countries[0]?.name || "";
  saveAndRender("País borrado");
}

function saveAndRender(message) {
  sanitizeRepeatMissingOverlap();
  saveState();
  render();
  flashSaved();
  if (message) toast(message);
}

function flashSaved() {
  els.saveState.classList.remove("flash");
  void els.saveState.offsetWidth;
  els.saveState.classList.add("flash");
}

function toast(message) {
  clearTimeout(toastTimer);
  document.querySelector(".toast")?.remove();

  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.append(node);

  toastTimer = setTimeout(() => node.remove(), 1800);
}

function buildExportText() {
  const lines = state.countries.map((country) => {
    const missing = sortedNumbers(country.missing);
    return `${country.name}: ${missing.length ? missing.join("-") : "completo"}`;
  });

  const repeated = state.countries
    .map((country) => {
      const text = repeatText(country);
      return text ? `${country.name}: ${text.replace("Repes: ", "")}` : "";
    })
    .filter(Boolean);

  const missingTotal = state.countries.reduce((total, country) => total + country.missing.size, 0);

  return [
    `Faltan total: ${missingTotal}`,
    "",
    ...lines,
    "",
    "Repes",
    ...(repeated.length ? repeated : ["Sin repes"]),
  ].join("\n");
}

function parseMissingList(text) {
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^[*\-\s]+/, "").trim())
    .map((line) => {
      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (!match) return null;

      const country = cleanCountryName(match[1]);
      const numbers = match[2]
        .match(/\d+/g)
        ?.map(Number)
        .filter((number) => number >= 1 && number <= ALBUM_SIZE);

      if (!country || !numbers?.length) return null;
      return { country, numbers: Array.from(new Set(numbers)) };
    })
    .filter(Boolean);
}

function parseNumberList(text) {
  const numbers = String(text || "")
    .match(/\d+/g)
    ?.map(Number)
    .filter((number) => number >= 1 && number <= ALBUM_SIZE);

  return Array.from(new Set(numbers || [])).sort((a, b) => a - b);
}

function withoutRepeatedNumbers(numbers, country) {
  const repeated = new Set(Object.keys(country.repeats).map(Number));
  return numbers.filter((number) => !repeated.has(number));
}

function addRepeat(country, number, amount = 1) {
  if (!number || number < 1 || number > ALBUM_SIZE) return;
  country.missing.delete(number);
  country.repeats[number] = (country.repeats[number] || 0) + amount;
}

function findRepeatMissingConflicts() {
  if (!state) return [];
  const conflicts = [];
  state.countries.forEach((country) => {
    Object.keys(country.repeats).forEach((number) => {
      const parsed = Number(number);
      if (country.missing.has(parsed)) {
        conflicts.push(`${country.name} ${parsed}`);
      }
    });
  });
  return conflicts;
}

function sanitizeRepeatMissingOverlap() {
  if (!state) return 0;
  let removed = 0;
  state.countries.forEach((country) => {
    Object.keys(country.repeats).forEach((number) => {
      const parsed = Number(number);
      if (country.missing.delete(parsed)) removed += 1;
    });
  });
  return removed;
}

function ensureCountry(name) {
  const cleanName = cleanCountryName(name);
  let country = state.countries.find((item) => normalize(item.name) === normalize(cleanName));

  if (!country) {
    country = { name: cleanName, missing: new Set(), repeats: {} };
    state.countries.push(country);
  }

  return country;
}

function cleanCountryName(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (letter) => letter.toLocaleUpperCase("es"));
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(value)) return null;
  const int = Math.trunc(value);
  if (int < min || int > max) return null;
  return int;
}

function saveState() {
  if (!activeUser) return;
  const serializable = {
    meta: state.meta || { seeds: [] },
    countries: state.countries.map((country) => ({
      name: country.name,
      missing: sortedNumbers(country.missing),
      repeats: country.repeats,
    })),
  };
  localStorage.setItem(userStorageKey(activeUser.email), JSON.stringify(serializable));
}

function loadState() {
  if (!activeUser) return createInitialState();

  const key = userStorageKey(activeUser.email);
  migrateLegacyState(key);
  const raw = localStorage.getItem(key);
  if (!raw) return createInitialState();

  try {
    const parsed = JSON.parse(raw);
    const loaded = {
      meta: parsed.meta || { seeds: [] },
      countries: parsed.countries.map((country) => ({
        name: country.name,
        missing: new Set(country.missing || []),
        repeats: country.repeats || {},
      })),
    };
    applyUserSeeds(loaded);
    sanitizeState(loaded);
    return loaded;
  } catch {
    return createInitialState();
  }
}

function createInitialState() {
  const initial = {
    meta: { seeds: [] },
    countries: INITIAL_COUNTRIES.map(([name, missing]) => ({
      name,
      missing: new Set(missing.filter((number) => number >= 1 && number <= ALBUM_SIZE)),
      repeats: {},
    })),
  };
  applyUserSeeds(initial);
  sanitizeState(initial);
  return initial;
}

function login() {
  const email = normalizeEmail(els.loginEmail.value);
  const password = els.loginPassword.value;
  const user = USERS.find((item) => item.email === email && item.password === password);

  if (!user) {
    els.loginError.textContent = "Usuario o contraseña incorrectos";
    els.loginPassword.select();
    return;
  }

  activeUser = { email: user.email, name: user.name };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(activeUser));
  els.loginPassword.value = "";
  els.loginError.textContent = "";
  startApp();
}

function startApp() {
  state = loadState();
  sanitizeRepeatMissingOverlap();
  saveState();
  selectedCountry = state.countries[0]?.name || "Alemania";
  onlyMissing = false;
  searchTerm = "";
  els.countrySearch.value = "";
  els.onlyMissingToggle.setAttribute("aria-pressed", "false");
  els.currentUserName.textContent = activeUser.name || activeUser.email;
  els.authView.classList.add("is-hidden");
  els.appShell.classList.remove("is-hidden");
  render();
  els.stickerNumber.focus();
}

function showLogin() {
  els.appShell.classList.add("is-hidden");
  els.authView.classList.remove("is-hidden");
  els.loginEmail.focus();
}

function loadSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    if (!session?.email) return null;
    const known = USERS.find((user) => user.email === session.email);
    return known ? { email: known.email, name: known.name } : null;
  } catch {
    return null;
  }
}

function userStorageKey(email) {
  return `${STORAGE_PREFIX}${normalizeEmail(email)}`;
}

function migrateLegacyState(key) {
  if (localStorage.getItem(key) || !localStorage.getItem(LEGACY_STORAGE_KEY)) return;
  localStorage.setItem(key, localStorage.getItem(LEGACY_STORAGE_KEY));
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function sanitizeState(targetState) {
  targetState.countries.forEach((country) => {
    Object.keys(country.repeats).forEach((number) => {
      country.missing.delete(Number(number));
    });
  });
}

function applyUserSeeds(targetState) {
  const seed = USER_REPEAT_SEEDS[normalizeEmail(activeUser?.email)];
  if (!seed) return;

  targetState.meta ||= { seeds: [] };
  targetState.meta.seeds ||= [];
  if (targetState.meta.seeds.includes(seed.id)) return;

  Object.entries(seed.repeats).forEach(([countryName, numbers]) => {
    const country = ensureCountryInState(targetState, countryName);
    numbers.forEach((number) => addRepeat(country, number));
  });

  targetState.meta.seeds.push(seed.id);
}

function ensureCountryInState(targetState, name) {
  const cleanName = cleanCountryName(name);
  let country = targetState.countries.find((item) => normalize(item.name) === normalize(cleanName));
  if (!country) {
    country = { name: cleanName, missing: new Set(), repeats: {} };
    targetState.countries.push(country);
  }
  return country;
}
