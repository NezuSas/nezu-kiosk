import { expect, test } from "@playwright/test";

/** El recorrido completo de un cliente: portada → catálogo → solicitud → QR → teléfono → cierre en el tótem. */
test("el cliente arma su solicitud, la pasa al teléfono y el tótem confirma", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Tecnología que se adapta");
  await page.getByRole("button", { name: /Explorar/ }).click();

  await expect(page).toHaveURL(/\/categories$/);
  await expect(page.getByRole("heading", { name: "¿Qué quieres mejorar?" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Living/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Elevate/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Core/ })).toBeVisible();

  await page.getByRole("button", { name: /^Living/ }).click();
  await page.getByRole("button", { name: /Iluminación y escenas/ }).click();
  await expect(page).toHaveURL(/\/categories\/living\/iluminacion$/);

  const addButtons = page.getByRole("button", { name: "Añadir a mi solicitud" });
  await expect(addButtons).toHaveCount(3);
  await addButtons.nth(0).click();
  await addButtons.nth(0).click();
  await expect(page.getByRole("button", { name: "Añadido" })).toHaveCount(2);
  await expect(page.getByRole("button", { name: /Mi solicitud/ })).toContainText("2");

  await page.getByRole("button", { name: /Mi solicitud/ }).click();
  await expect(page).toHaveURL(/\/selection$/);
  await expect(page.getByRole("heading", { name: "Escenas por ambiente" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Rutinas y horarios" })).toBeVisible();

  await page.getByRole("button", { name: /Solicitar evaluación/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-phone-url] svg")).toBeVisible();
  const phoneUrl = await dialog.locator("[data-phone-url]").getAttribute("data-phone-url");
  expect(phoneUrl).toMatch(/\/phone\?session=.+&s=.+/);

  // El teléfono del cliente abre el enlace del QR y envía sus datos.
  const phone = await context.newPage();
  await phone.setViewportSize({ width: 390, height: 844 });
  await phone.goto(phoneUrl!);
  await expect(phone.getByText("Escenas por ambiente")).toBeVisible();
  await expect(phone.getByText("Rutinas y horarios")).toBeVisible();
  const whatsapp = phone.getByRole("link", { name: /WhatsApp/ });
  await expect(whatsapp).toHaveAttribute("href", /wa\.me\/593983643383/);
  await phone.getByLabel("Nombre").fill("Ana Pérez");
  await phone.getByLabel("Teléfono").fill("0991234567");
  await phone.getByLabel("Correo").fill("ana@ejemplo.com");
  await phone.getByLabel("Ciudad").fill("Cuenca");
  await phone.getByRole("button", { name: /Enviar y que me contacten/ }).click();
  await expect(phone.getByText("Listo")).toBeVisible();

  // El tótem recibe el aviso y cierra el recorrido.
  await expect(page).toHaveURL(/\/thanks$/);
  await expect(page.getByRole("heading", { name: "Recibimos tu solicitud" })).toBeVisible();
  await expect(page.getByText("0991234567")).toBeVisible();
  await page.getByRole("button", { name: /Volver al inicio/ }).click();
  await expect(page).toHaveURL(/\/$/);
  await phone.close();
});

test("el selector cambia toda la interfaz a inglés", async ({ page }) => {
  await page.goto("/categories");
  await page.getByRole("button", { name: "English" }).click();
  await expect(page.getByRole("heading", { name: "What would you like to improve?" })).toBeVisible();
  await expect(page.getByRole("button", { name: /My request/ })).toBeVisible();
  await page.getByRole("button", { name: "Español" }).click();
  await expect(page.getByRole("heading", { name: "¿Qué quieres mejorar?" })).toBeVisible();
});

test("las rutas antiguas redirigen y las desconocidas vuelven a la portada", async ({ page }) => {
  await page.goto("/cart");
  await expect(page).toHaveURL(/\/selection$/);
  await page.goto("/no-existe");
  await expect(page).toHaveURL(/\/$/);
});
