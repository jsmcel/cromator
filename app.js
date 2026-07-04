const STORAGE_KEY = "cromator-panini-state-v1";
const ALBUM_SIZE = 20;

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
  missingTotal: $("#missingTotal"),
  ownedTotal: $("#ownedTotal"),
  repeatTotal: $("#repeatTotal"),
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

let state = loadState();
let selectedCountry = state.countries[0]?.name || "Alemania";
let onlyMissing = false;
let searchTerm = "";
let toastTimer = null;

render();

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
  localStorage.removeItem(STORAGE_KEY);
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
  const serializable = {
    countries: state.countries.map((country) => ({
      name: country.name,
      missing: sortedNumbers(country.missing),
      repeats: country.repeats,
    })),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createInitialState();

  try {
    const parsed = JSON.parse(raw);
    return {
      countries: parsed.countries.map((country) => ({
        name: country.name,
        missing: new Set(country.missing || []),
        repeats: country.repeats || {},
      })),
    };
  } catch {
    return createInitialState();
  }
}

function createInitialState() {
  return {
    countries: INITIAL_COUNTRIES.map(([name, missing]) => ({
      name,
      missing: new Set(missing.filter((number) => number >= 1 && number <= ALBUM_SIZE)),
      repeats: {},
    })),
  };
}
