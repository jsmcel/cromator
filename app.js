const LEGACY_STORAGE_KEY = "cromator-panini-state-v1";
const STORAGE_PREFIX = "cromator-panini-state-v2:";
const SESSION_KEY = "cromator-panini-session-v1";
const ALBUM_SIZE = 20;

const USERS = [
  { email: "diego@cromos.es", password: "mundial", name: "Diego" },
];

const DIEGO_OFFICIAL_MISSING_SEED = "diego-missing-official-181-20260704";
const DIEGO_OFFICIAL_REPEATS_SEED = "diego-repeats-clean-20260704";

const USER_MISSING_SEEDS = {
  "diego@cromos.es": {
    id: DIEGO_OFFICIAL_MISSING_SEED,
    declaredMissingTotal: 181,
    missing: {
      Alemania: [1, 16],
      Argelia: [9, 14],
      Arabia: [1, 5, 7, 11, 15, 18],
      Argentina: [2, 7, 9, 16],
      Australia: [7, 8, 11, 14, 19],
      Austria: [12, 14, 16],
      Bélgica: [10, 11],
      Bosnia: [2, 5, 9, 11, 18],
      Brasil: [7],
      "Cabo Verde": [8, 20],
      Canadá: [7, 8],
      Catar: [8, 11, 14, 17],
      Chequia: [4],
      Colombia: [4, 14],
      Congo: [6, 9, 11, 12, 15, 18, 19],
      Corea: [9, 10, 16, 17],
      "Costa de Marfil": [8, 13, 18, 19, 20],
      Croacia: [8, 11, 12, 18, 19],
      Curazao: [1, 8, 9, 14, 16],
      Ecuador: [8, 9, 18],
      Egipto: [8, 10, 14, 15, 16, 18],
      Escocia: [4, 5, 10, 16, 17],
      Francia: [3, 6, 19, 20],
      Ghana: [6, 20],
      Haití: [5, 7, 10, 14, 16, 18],
      Holanda: [8, 9, 10, 11, 14],
      Inglaterra: [7, 12, 13, 15, 16, 20],
      Irán: [8, 10, 12, 20],
      Iraq: [2, 4, 9, 11],
      Japón: [3, 11, 17],
      Jordania: [2, 6, 7, 8, 10, 14, 15],
      Marruecos: [8, 9],
      México: [19],
      Noruega: [1, 2, 3, 11, 16, 18],
      "Nueva Zelanda": [1, 8, 11, 12, 16, 18],
      Panamá: [4, 5, 14, 17, 19],
      Paraguay: [4, 5, 6, 10, 11, 17, 19],
      Portugal: [1, 2, 3, 4, 6, 11, 12],
      Senegal: [6, 9, 17],
      Sudáfrica: [5, 7, 10, 19],
      Suecia: [8, 16, 17, 18],
      Suiza: [5, 7, 19],
      Turquía: [5, 8, 15],
      Túnez: [8],
      Uruguay: [10, 14],
      USA: [3, 5, 11],
      Uzbekistán: [5, 18],
    },
  },
};

const USER_OFFICIAL_REPEAT_SEEDS = {
  "diego@cromos.es": {
    id: DIEGO_OFFICIAL_REPEATS_SEED,
    repeats: {
      "Especial FIFA": { 7: 1, 9: 1, 10: 1, 15: 1, 16: 1 },
      Alemania: { 4: 2, 5: 1, 6: 1, 8: 1, 9: 1, 11: 1, 13: 1, 14: 1 },
      Argelia: { 4: 1, 5: 1, 6: 1, 8: 1, 11: 1, 13: 2 },
      Argentina: { 12: 1 },
      Australia: { 1: 2, 2: 3, 3: 1, 4: 1, 5: 1, 6: 1 },
      Canadá: { 6: 1, 9: 1, 10: 1, 11: 1, 12: 2, 13: 1 },
      Catar: { 3: 1, 5: 2, 6: 2, 8: 1, 10: 2, 12: 1 },
      Chequia: { 2: 1, 3: 1, 6: 1, 7: 2 },
      Curazao: { 2: 1, 4: 1, 12: 1, 14: 1, 17: 1, 19: 1 },
      Ecuador: { 2: 1, 3: 1, 10: 1, 14: 1, 16: 2 },
      Ghana: { 1: 1, 7: 1, 8: 1, 10: 1, 15: 1, 16: 1, 17: 1 },
      Haití: { 1: 1, 8: 1, 9: 1, 11: 2, 15: 3, 16: 1, 17: 1, 19: 2 },
      Iraq: { 3: 1 },
      Jordania: { 1: 1, 5: 2, 17: 1, 18: 1 },
      Marruecos: { 2: 1, 6: 2, 12: 2, 16: 1, 17: 1, 19: 1 },
      México: { 20: 1 },
      Panamá: { 1: 1, 3: 1, 8: 1, 11: 1 },
      Congo: { 1: 1, 3: 1, 4: 1, 8: 1, 11: 1 },
      Senegal: { 1: 1, 3: 1, 5: 1, 10: 1, 12: 1, 15: 1 },
      Sudáfrica: { 2: 1, 3: 2, 7: 1, 9: 1, 13: 4, 15: 1, 16: 1, 19: 2, 20: 1 },
      Turquía: { 1: 1, 2: 1, 3: 1, 4: 2, 10: 1, 12: 1, 15: 1, 16: 1, 17: 1, 18: 1, 20: 1 },
      Túnez: { 2: 1, 3: 2, 7: 1, 9: 1, 13: 4, 15: 1, 16: 1, 19: 2, 20: 1 },
      Uruguay: { 8: 1, 15: 1, 16: 1, 17: 1 },
      Uzbekistán: { 6: 1, 11: 1, 12: 1, 15: 1, 16: 1 },
    },
  },
};

const INITIAL_COUNTRIES = [];

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
  progressLabel: $("#progressLabel"),
  progressFill: $("#progressFill"),
  crossCheckStatus: $("#crossCheckStatus"),
  incidentPanel: $("#incidentPanel"),
  incidentCount: $("#incidentCount"),
  incidentList: $("#incidentList"),
  saveState: $("#saveState"),
  countrySelect: $("#countrySelect"),
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

function currentCountry() {
  return state.countries.find((country) => country.name === selectedCountry);
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
  const totalStickers = state.countries.length * ALBUM_SIZE;
  const owned = totalStickers - missing;
  const percent = totalStickers ? Math.round((owned / totalStickers) * 100) : 0;

  els.missingTotal.textContent = missing;
  els.ownedTotal.textContent = owned;
  els.repeatTotal.textContent = repeats;
  els.progressLabel.textContent = `${percent}%`;
  els.progressFill.style.width = `${percent}%`;
  renderCrossCheck();
}

function renderBoard() {
  const country = currentCountry();
  els.stickerBoard.innerHTML = "";

  if (!country) {
    const empty = document.createElement("p");
    empty.className = "board-empty";
    empty.textContent = "Elige o añade un país para empezar.";
    els.stickerBoard.append(empty);
    return;
  }

  for (let number = 1; number <= ALBUM_SIZE; number += 1) {
    const repeatCount = country.repeats[number] || 0;
    const isMissing = country.missing.has(number);

    const tile = document.createElement("div");
    tile.className = [
      "sticker",
      isMissing ? "is-missing" : "is-owned",
      repeatCount ? "is-repeat" : "",
      onlyMissing && !isMissing ? "is-hidden" : "",
    ].filter(Boolean).join(" ");

    const main = document.createElement("button");
    main.type = "button";
    main.className = "sticker-main";
    main.title = isMissing
      ? `${country.name} ${number}: te falta · toca para marcar que lo tienes`
      : `${country.name} ${number}: lo tienes · toca para marcar que te falta`;
    main.setAttribute("aria-label", main.title);
    main.innerHTML = `<span class="num">${number}</span>`;
    main.addEventListener("click", () => toggleSticker(country, number));
    tile.append(main);

    if (!isMissing && repeatCount > 0) {
      const stepper = document.createElement("div");
      stepper.className = "rep-stepper";

      const minus = document.createElement("button");
      minus.type = "button";
      minus.className = "rep-minus";
      minus.textContent = "−";
      minus.title = `Quitar una repe de ${country.name} ${number}`;
      minus.setAttribute("aria-label", minus.title);
      minus.addEventListener("click", (event) => {
        event.stopPropagation();
        removeOneRepeat(country, number);
      });

      const count = document.createElement("span");
      count.className = "rep-count";
      count.textContent = String(repeatCount);

      const plus = document.createElement("button");
      plus.type = "button";
      plus.className = "rep-plus";
      plus.textContent = "＋";
      plus.title = `Añadir otra repe a ${country.name} ${number}`;
      plus.setAttribute("aria-label", plus.title);
      plus.addEventListener("click", (event) => {
        event.stopPropagation();
        addOneRepeat(country, number);
      });

      stepper.append(minus, count, plus);
      tile.append(stepper);
    } else if (!isMissing) {
      const add = document.createElement("button");
      add.type = "button";
      add.className = "sticker-rep";
      add.textContent = "＋";
      add.title = `Añadir una repe a ${country.name} ${number}`;
      add.setAttribute("aria-label", add.title);
      add.addEventListener("click", (event) => {
        event.stopPropagation();
        addOneRepeat(country, number);
      });
      tile.append(add);
    }

    els.stickerBoard.append(tile);
  }
}

function toggleSticker(country, number) {
  if (country.missing.has(number)) {
    country.missing.delete(number);
    saveAndRender(`${country.name} ${number}: ahora lo tienes`);
    return;
  }

  if (country.repeats[number]) {
    addIncident(state, "Faltantes mandan: repe quitado al marcar falta", [`${country.name} ${number}`]);
  }
  delete country.repeats[number];
  country.missing.add(number);
  saveAndRender(`${country.name} ${number}: te falta`);
}

function addOneRepeat(country, number) {
  if (country.missing.has(number)) {
    toast(`${country.name} ${number} te falta, primero márcalo como tuyo`);
    return;
  }

  const next = Math.min(99, (country.repeats[number] || 0) + 1);
  country.repeats[number] = next;
  saveAndRender(`${country.name} ${number}: ${next} ${next === 1 ? "repe" : "repes"}`);
}

function removeOneRepeat(country, number) {
  const current = country.repeats[number] || 0;
  if (current <= 0) return;

  const next = current - 1;
  if (next <= 0) {
    delete country.repeats[number];
  } else {
    country.repeats[number] = next;
  }

  saveAndRender(
    next > 0
      ? `${country.name} ${number}: ${next} ${next === 1 ? "repe" : "repes"}`
      : `${country.name} ${number}: sin repes`,
  );
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
      const owned = ALBUM_SIZE - missingNumbers.length;
      const percent = Math.round((owned / ALBUM_SIZE) * 100);
      const complete = missingNumbers.length === 0;
      const repeats = repeatText(country);

      node.classList.toggle("is-selected", country.name === selectedCountry);
      node.classList.toggle("is-complete", complete);
      node.querySelector(".country-name").textContent = country.name;

      const stats = node.querySelector(".country-stats");
      stats.textContent = complete ? "Completo" : `${missingNumbers.length} faltan`;
      stats.classList.toggle("is-complete", complete);

      node.querySelector(".country-bar-fill").style.width = `${percent}%`;

      node.querySelector(".mini-missing").textContent = complete
        ? `${owned}/${ALBUM_SIZE} · álbum de este país completo`
        : `Faltan: ${missingNumbers.join("-")}`;

      const repeatsEl = node.querySelector(".mini-repeats");
      repeatsEl.textContent = repeats || "";
      repeatsEl.classList.toggle("is-hidden", !repeats);

      node.querySelector(".country-main").addEventListener("click", () => {
        selectedCountry = country.name;
        render();
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
  const incidentTotal = incidentItemTotal();
  els.crossCheckStatus.classList.toggle("is-ok", !hasConflicts);
  els.crossCheckStatus.classList.toggle("is-warn", hasConflicts);
  els.crossCheckStatus.textContent = hasConflicts
    ? `Revisar: ${conflicts.length} repes estaban en faltantes`
    : incidentTotal
      ? `Cruce OK: ${incidentTotal} ${incidentTotal === 1 ? "incidencia registrada" : "incidencias registradas"}`
      : "Cruce OK: ningun repe esta en faltantes";
  renderIncidents();
}

function renderIncidents() {
  const incidents = state.meta?.incidents || [];
  els.incidentPanel.classList.toggle("is-hidden", incidents.length === 0);
  els.incidentCount.textContent = String(incidentItemTotal());
  els.incidentList.innerHTML = "";

  incidents.slice(0, 12).forEach((incident) => {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    const detail = document.createElement("span");

    title.textContent = incident.message;
    detail.textContent = incident.details?.length ? incident.details.join(", ") : "";

    item.append(title);
    if (detail.textContent) item.append(detail);
    els.incidentList.append(item);
  });
}

function incidentItemTotal() {
  const incidents = state.meta?.incidents || [];
  return incidents.reduce((total, incident) => total + Math.max(1, incident.details?.length || 0), 0);
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
  country.missing = new Set(parseNumberList(els.editMissingNumbers.value));
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
  const incidents = state.meta?.incidents || [];

  return [
    `Faltan total: ${missingTotal}`,
    "",
    ...lines,
    "",
    "Repes",
    ...(repeated.length ? repeated : ["Sin repes"]),
    "",
    "Incidencias",
    ...(incidents.length
      ? incidents.map((incident) => {
          const details = incident.details?.length ? `: ${incident.details.join(", ")}` : "";
          return `${incident.message}${details}`;
        })
      : ["Sin incidencias"]),
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

function resolveRepeatMissingConflicts(targetState) {
  const resolved = [];
  targetState.countries.forEach((country) => {
    Object.keys(country.repeats).forEach((number) => {
      const parsed = Number(number);
      if (country.missing.has(parsed)) {
        delete country.repeats[number];
        resolved.push(`${country.name} ${parsed}`);
      }
    });
  });

  if (resolved.length) {
    addIncident(targetState, `Faltantes mandan: ${resolved.length} repes quitados`, resolved);
  }

  return resolved.length;
}

function sanitizeRepeatMissingOverlap() {
  if (!state) return 0;
  return resolveRepeatMissingConflicts(state);
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
    meta: ensureMeta(state),
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
  resolveRepeatMissingConflicts(targetState);
}

function applyUserSeeds(targetState) {
  const email = normalizeEmail(activeUser?.email);
  const missingSeed = USER_MISSING_SEEDS[email];
  const repeatSeed = USER_OFFICIAL_REPEAT_SEEDS[email];
  const meta = ensureMeta(targetState);
  const shouldApplyMissing = missingSeed && !meta.seeds.includes(missingSeed.id);
  const shouldApplyRepeats = repeatSeed && !meta.seeds.includes(repeatSeed.id);

  if (!shouldApplyMissing && !shouldApplyRepeats) return;

  meta.incidents = [];
  targetState.countries = [];

  if (repeatSeed) {
    Object.entries(repeatSeed.repeats).forEach(([countryName, repeats]) => {
      const country = ensureCountryInState(targetState, countryName);
      Object.entries(repeats).forEach(([number, count]) => {
        setRepeatCount(country, Number(number), count);
      });
    });
    if (shouldApplyRepeats) meta.seeds.push(repeatSeed.id);
  }

  if (missingSeed) {
    Object.entries(missingSeed.missing).forEach(([countryName, numbers]) => {
      const country = ensureCountryInState(targetState, countryName);
      country.missing = new Set(numbers);
    });
    meta.declaredMissingTotal = missingSeed.declaredMissingTotal;
    if (shouldApplyMissing) meta.seeds.push(missingSeed.id);
  }
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

function setRepeatCount(country, number, count) {
  const parsedCount = Number(count);
  if (!number || number < 1 || number > ALBUM_SIZE || !Number.isFinite(parsedCount) || parsedCount <= 0) return;
  country.repeats[number] = Math.trunc(parsedCount);
}

function ensureMeta(targetState) {
  targetState.meta ||= {};
  targetState.meta.seeds ||= [];
  targetState.meta.incidents ||= [];
  return targetState.meta;
}

function addIncident(targetState, message, details = []) {
  const meta = ensureMeta(targetState);
  const cleanDetails = Array.from(new Set(details)).sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
  const key = `${message}|${cleanDetails.join(",")}`;

  if (meta.incidents.some((incident) => incident.key === key)) return;

  meta.incidents.unshift({
    key,
    message,
    details: cleanDetails,
  });
  meta.incidents = meta.incidents.slice(0, 50);
}
