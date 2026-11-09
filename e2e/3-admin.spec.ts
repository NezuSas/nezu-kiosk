import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1280, height: 1000 } });

test("la administración pide el token y muestra la caja y el panel", async ({ page, request }) => {
  // El tótem envía sus eventos en lotes cada pocos segundos; aquí los mandamos directamente para no esperar.
  await request.post("/api/events", {
    data: { kioskId: "e2e", events: [{ name: "service_added", ref: "living-escenas" }, { name: "service_added", ref: "living-escenas" }, { name: "handoff_opened" }] },
  });
  await page.goto("/admin/");
  await expect(page.getByRole("heading", { name: "Administración del kiosko" })).toBeVisible();
  await expect(page.locator("#app")).toBeHidden();

  await page.locator("#token").fill("token-equivocado");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.locator("#status")).toContainText("Token incorrecto");

  await page.locator("#token").fill("e2e-token");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.locator("#app")).toBeVisible();
  await expect(page.locator("#status")).toContainText("Conectado");

  await expect(page.locator(".tile")).toHaveCount(4);
  await expect(page.locator("#days tbody tr")).toHaveCount(7);
  await expect(page.locator("#pending .empty")).toBeVisible();
  // Los recorridos anteriores dejaron solicitudes y eventos hoy.
  const lastRow = page.locator("#days tbody tr").last();
  await expect(lastRow.locator("td").nth(1)).not.toHaveText("0");
  await expect(page.locator("#top li").first()).toContainText("living-escenas");
});

test("la caja puede confirmar una sesión a mano", async ({ page }) => {
  await page.goto("/admin/");
  await page.locator("#token").fill("e2e-token");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.locator("#app")).toBeVisible();

  await page.getByText("Confirmar una sesión a mano").click();
  const form = page.locator("#manual-form");
  await form.locator("[name=sessionId]").fill("sesion-manual");
  await form.locator("[name=reference]").fill("AUTH-0001");
  await form.locator("[name=amount]").fill("45.5");
  await form.getByRole("button", { name: "Confirmar" }).click();
  await expect(page.locator(".flash").first()).toContainText("Cobro registrado");
  await expect(page.locator(".tile").nth(1).locator(".n")).not.toHaveText("0");
});
