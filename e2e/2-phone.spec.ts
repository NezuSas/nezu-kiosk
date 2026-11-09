import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

const summary = Buffer.from(
  JSON.stringify({ items: [{ serviceId: "core-plc", name: "PLC por Modbus TCP", quantity: 1, lineName: "Control y supervisión", categoryName: "Core" }] }),
  "utf8"
)
  .toString("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/, "");

test("un enlace sin sesión explica qué hacer", async ({ page }) => {
  await page.goto("/phone");
  await expect(page.getByText(/Este enlace venció/)).toBeVisible();
});

test("el mensaje de WhatsApp lleva lo elegido y los datos del cliente", async ({ page }) => {
  await page.goto(`/phone?session=prueba-wa&s=${summary}`);
  await page.getByLabel("Nombre").fill("Luis");
  await page.getByLabel("Ciudad").fill("Quito");
  const href = decodeURIComponent((await page.getByRole("link", { name: /WhatsApp/ }).getAttribute("href")) ?? "");
  expect(href).toContain("PLC por Modbus TCP (Control y supervisión)");
  expect(href).toContain("Soy Luis, Quito.");
});

test("la solicitud llega al servidor aunque ningún tótem esté esperando", async ({ page, request }) => {
  await page.goto(`/phone?session=prueba-sin-totem&s=${summary}`);
  await page.getByLabel("Nombre").fill("Eva");
  await page.getByLabel("Teléfono").fill("0998887766");
  await page.getByRole("button", { name: /Enviar y que me contacten/ }).click();
  await expect(page.getByText("Listo")).toBeVisible();

  const stats = await request.get("/api/stats", { headers: { Authorization: "Bearer e2e-token" } });
  expect(stats.ok()).toBeTruthy();
  const body = await stats.json();
  const today = body.days.at(-1);
  expect(today.leads).toBeGreaterThanOrEqual(2); // la del recorrido del tótem y esta
});
