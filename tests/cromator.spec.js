const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const appUrl = `file:///${path.resolve(__dirname, "..", "index.html").replace(/\\/g, "/")}`;
const marioUrl = `${appUrl}?instance=mario`;

async function loginMario(page) {
  await page.goto(marioUrl);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await page.fill("#loginPassword", "jorge");
  await page.click("button.primary");
}

async function marioStoredSummary(page) {
  return page.evaluate(() => {
    const raw = localStorage.getItem("cromator-mario-state-v2:cromosmario");
    const state = JSON.parse(raw);
    const first = state.countries.find((country) => country.name === "001-020");
    const m21 = state.countries.find((country) => country.name === "M21-M40");
    const last = state.countries.find((country) => country.name === "M41-M44");
    return {
      countries: state.countries.length,
      missingTotal: state.countries.reduce((total, country) => total + country.missing.length, 0),
      repeatTotal: state.countries.reduce((total, country) => {
        return total + Object.values(country.repeats).reduce((sum, count) => sum + count, 0);
      }, 0),
      firstMissing: first.missing,
      firstRepeats: first.repeats,
      m21Missing: m21.missing,
      lastMissing: last.missing,
      lastRepeats: last.repeats,
      incidents: state.meta.incidents,
      worldState: localStorage.getItem("cromator-panini-state-v2:diego@cromos.es"),
    };
  });
}

test("Diego carga 181 faltantes y muestra incidencias del cruce", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appUrl);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();

  await page.fill("#loginPassword", "mundial");
  await page.click("button.primary");
  await expect(page.locator("#appShell")).toBeVisible();

  await expect(page.locator("#missingTotal")).toHaveText("181");
  await expect(page.locator("#crossCheckStatus")).toContainText("Cruce OK");
  await expect(page.locator("#crossCheckStatus")).toContainText("incidencias registradas");
  await expect(page.locator("#incidentPanel")).toBeVisible();

  const data = await page.evaluate(() => {
    const raw = localStorage.getItem("cromator-panini-state-v2:diego@cromos.es");
    const state = JSON.parse(raw);
    const conflicts = [];
    state.countries.forEach((country) => {
      const missing = new Set(country.missing);
      Object.keys(country.repeats).forEach((number) => {
        if (missing.has(Number(number))) conflicts.push(`${country.name} ${number}`);
      });
    });
    const pick = (name) => state.countries.find((country) => country.name === name);

    return {
      visibleIncidentCount: Number(document.querySelector("#incidentCount").textContent),
      missingTotal: state.countries.reduce((total, country) => total + country.missing.length, 0),
      conflicts,
      incidents: state.meta.incidents,
      countries: state.countries.length,
      australia: pick("Australia"),
      haiti: pick("Haití"),
      norway: pick("Noruega"),
    };
  });

  const incidentCount = data.incidents.reduce((total, incident) => total + Math.max(1, incident.details.length), 0);

  expect(data.countries).toBe(49);
  expect(data.missingTotal).toBe(181);
  expect(data.conflicts).toEqual([]);
  expect(data.incidents).toHaveLength(1);
  expect(incidentCount).toBeGreaterThan(0);
  expect(data.visibleIncidentCount).toBe(incidentCount);
  expect(data.australia.missing).toEqual([7, 8, 11, 14, 19]);
  expect(data.australia.repeats["2"]).toBe(3);
  expect(data.haiti.repeats["15"]).toBe(3);
  expect(data.norway.missing).toEqual([1, 2, 3, 11, 16, 18]);
});

test("el manifiesto cubre 49 bloques de 20 cromos con archivo local", async () => {
  const app = fs.readFileSync(path.resolve(__dirname, "..", "app.js"), "utf8");
  const match = app.match(/const STICKER_PHOTO_MANIFEST = (\{[\s\S]*?\n\});/);
  expect(match).toBeTruthy();

  const manifest = Function(`return (${match[1]});`)();
  expect(Object.keys(manifest)).toHaveLength(49);

  const missing = [];
  for (const [country, stickers] of Object.entries(manifest)) {
    expect(Object.keys(stickers)).toHaveLength(20);
    for (let number = 1; number <= 20; number += 1) {
      const imagePath = stickers[number];
      if (!imagePath || !fs.existsSync(path.resolve(__dirname, "..", imagePath))) {
        missing.push(`${country} ${number}`);
      }
    }
  }

  expect(missing).toEqual([]);
});

test("el toggle de fotos solo muestra imagenes mapeadas en cromos que no faltan", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appUrl);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();

  await page.fill("#loginPassword", "mundial");
  await page.click("button.primary");
  await page.selectOption("#countrySelect", "Alemania");

  await expect(page.locator(".sticker-photo")).toHaveCount(0);

  await page.click("#photoToggle");

  const ownedWithPhoto = page.locator('[aria-label^="Alemania 3: lo tienes"]');
  await expect(ownedWithPhoto.locator(".sticker-photo")).toHaveAttribute("src", "stickers/alemania/3.webp");

  const ownedBox = await ownedWithPhoto.boundingBox();
  const photoBox = await ownedWithPhoto.locator(".sticker-photo").boundingBox();
  expect(ownedBox).toBeTruthy();
  expect(photoBox).toBeTruthy();
  expect(photoBox.width).toBeLessThanOrEqual(ownedBox.width * 0.72);
  expect(photoBox.height).toBeLessThanOrEqual(ownedBox.height * 0.76);
  expect(photoBox.width).toBeGreaterThan(24);
  expect(photoBox.height).toBeGreaterThan(24);

  const missingWithMappedPhoto = page.locator('[aria-label^="Alemania 16: te falta"]');
  await expect(missingWithMappedPhoto.locator(".sticker-photo")).toHaveCount(0);

  await page.click("#photoToggle");
  await expect(page.locator(".sticker-photo")).toHaveCount(0);
});

test("con fotos activadas ningun cromo faltante muestra imagen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appUrl);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();

  await page.fill("#loginPassword", "mundial");
  await page.click("button.primary");
  await page.click("#photoToggle");

  const countries = await page.locator("#countrySelect option").evaluateAll((options) => {
    return options.map((option) => option.value);
  });

  for (const country of countries) {
    await page.selectOption("#countrySelect", country);
    const counts = await page.locator("#stickerBoard").evaluate((board) => ({
      missingPhotos: board.querySelectorAll(".sticker.is-missing .sticker-photo").length,
      ownedPhotos: board.querySelectorAll(".sticker.is-owned .sticker-photo").length,
      owned: board.querySelectorAll(".sticker.is-owned").length,
    }));

    expect(counts.missingPhotos, `${country} no debe tener fotos en faltantes`).toBe(0);
    expect(counts.ownedPhotos, `${country} debe mostrar foto en todos los que tienes`).toBe(counts.owned);
  }
});

test("Mario carga los faltantes y repes oficiales de cromosmario", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loginMario(page);

  await expect(page.locator("#loginEmail")).toHaveValue("cromosmario");
  await expect(page.locator("#loginEmail")).toHaveAttribute("type", "text");
  await expect(page.locator("#currentUserName")).toHaveText("Jorge");
  await expect(page.locator("#missingTotal")).toHaveText("26");
  await expect(page.locator("#ownedTotal")).toHaveText("198");
  await expect(page.locator("#repeatTotal")).toHaveText("75");
  await expect(page.locator("#incidentPanel")).toBeHidden();
  await expect(page.locator("#photoToggle")).toBeHidden();
  await expect(page.locator(".sticker-photo")).toHaveCount(0);

  const countries = await page.locator("#countrySelect option").evaluateAll((options) => {
    return options.map((option) => option.value);
  });
  expect(countries).toEqual([
    "001-020",
    "021-040",
    "041-060",
    "061-080",
    "081-100",
    "101-120",
    "121-140",
    "141-160",
    "161-180",
    "M1-M20",
    "M21-M40",
    "M41-M44",
  ]);

  await page.selectOption("#countrySelect", "M41-M44");
  await expect(page.locator(".sticker")).toHaveCount(4);
  await expect(page.locator(".sticker-main .num")).toHaveText(["M41", "M42", "M43", "M44"]);

  const stored = await marioStoredSummary(page);

  expect(stored.countries).toBe(12);
  expect(stored.missingTotal).toBe(26);
  expect(stored.repeatTotal).toBe(75);
  expect(stored.firstMissing).toEqual([1, 7, 20]);
  expect(stored.firstRepeats["6"]).toBe(5);
  expect(stored.m21Missing).toEqual([23, 24, 30, 31, 35, 40]);
  expect(stored.lastMissing).toEqual([]);
  expect(stored.lastRepeats).toEqual({ 42: 1, 44: 2 });
  expect(stored.incidents).toEqual([]);
  expect(stored.worldState).toBeNull();
});

test("Mario puede importar una exportacion completa de otro movil", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await loginMario(page);

  const exported = await page.evaluate(() => buildExportText());

  expect(exported).toContain("IMPORTAR EN CROMATOR");
  expect(exported).toContain("Faltan total: 26");
  expect(exported).toContain("Repes total: 75");
  expect(exported).toContain("001-020: 001-007-020");
  expect(exported).toContain("M41-M44: M42x1, M44x2");

  await page.evaluate(() => {
    const raw = localStorage.getItem("cromator-mario-state-v2:cromosmario");
    const state = JSON.parse(raw);
    state.countries.forEach((country) => {
      country.missing = [];
      country.repeats = {};
    });
    localStorage.setItem("cromator-mario-state-v2:cromosmario", JSON.stringify(state));
  });
  await page.reload();
  await expect(page.locator("#appShell")).toBeVisible();
  await expect(page.locator("#missingTotal")).toHaveText("0");
  await expect(page.locator("#repeatTotal")).toHaveText("0");

  await page.locator("details.tools-band summary").click();
  await page.fill("#importText", exported);
  await page.click("#importForm button.primary");

  await expect(page.locator("#missingTotal")).toHaveText("26");
  await expect(page.locator("#repeatTotal")).toHaveText("75");
  const stored = await marioStoredSummary(page);
  expect(stored.firstMissing).toEqual([1, 7, 20]);
  expect(stored.firstRepeats["6"]).toBe(5);
  expect(stored.m21Missing).toEqual([23, 24, 30, 31, 35, 40]);
  expect(stored.lastRepeats).toEqual({ 42: 1, 44: 2 });
  expect(stored.incidents).toEqual([]);
});
