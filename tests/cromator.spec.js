const { test, expect } = require("@playwright/test");
const path = require("path");

const appUrl = `file:///${path.resolve(__dirname, "..", "index.html").replace(/\\/g, "/")}`;

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

  expect(data.countries).toBe(48);
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
