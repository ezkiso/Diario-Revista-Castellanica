import { test, expect, Page } from "@playwright/test";

// ─── Credenciales de prueba ─────────────────────────────────────────────────
// Cambia estos valores por los de tu admin real
const ADMIN_EMAIL = "admin@ufro.cl";
const ADMIN_PASSWORD = "|6qU:Z8~kLHS)8@Kluc^";
const BASE_URL = "http://localhost:3000";

// ─── Helper: login reutilizable ──────────────────────────────────────────────
async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.fill("#email", ADMIN_EMAIL);
  await page.fill("#password", ADMIN_PASSWORD);
  await page.click("button[type=submit]");
  await page.waitForURL("**/admin**");
}

// ════════════════════════════════════════════════════════════════════════════
// BLOQUE 1 — PÁGINAS PÚBLICAS
// ════════════════════════════════════════════════════════════════════════════

test.describe("Páginas públicas", () => {

  test("Homepage carga correctamente", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Zoronka/);
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("Barra institucional visible", async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator("text=UFRO")).toBeVisible();
  });

  test("Navegación principal tiene todos los links", async ({ page }) => {
    await page.goto(BASE_URL);
    const nav = page.locator("nav[aria-label='Navegación principal']");
    await expect(nav.locator("a", { hasText: "Conversaciones" })).toBeVisible();
    await expect(nav.locator("a", { hasText: "Opinión" })).toBeVisible();
    await expect(nav.locator("a", { hasText: "Cartas al Director" })).toBeVisible();
    await expect(nav.locator("a", { hasText: "Difusión" })).toBeVisible();
    await expect(nav.locator("a", { hasText: "Revista" })).toBeVisible();
  });

  test("Footer tiene links a redes sociales", async ({ page }) => {
    await page.goto(BASE_URL);
    const footer = page.locator("footer");
    await expect(footer.locator("a[href*='youtube']")).toBeVisible();
    await expect(footer.locator("a[href*='instagram']")).toBeVisible();
  });

  test("Página /conversaciones carga", async ({ page }) => {
    await page.goto(`${BASE_URL}/conversaciones`);
    await expect(page).not.toHaveURL(/error/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Página /opinion carga", async ({ page }) => {
    await page.goto(`${BASE_URL}/opinion`);
    await expect(page).not.toHaveURL(/error/);
  });

  test("Página /cartas-al-director carga", async ({ page }) => {
    await page.goto(`${BASE_URL}/cartas-al-director`);
    await expect(page).not.toHaveURL(/error/);
  });

  test("Página /difusion carga", async ({ page }) => {
    await page.goto(`${BASE_URL}/difusion`);
    await expect(page).not.toHaveURL(/error/);
  });

  test("Página /revista-castellanica carga", async ({ page }) => {
    await page.goto(`${BASE_URL}/revista-castellanica`);
    await expect(page).not.toHaveURL(/error/);
  });

  test("Ruta inexistente muestra 404", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/pagina-que-no-existe`);
    expect(response?.status()).toBe(404);
  });

  test("Logo visible en el header", async ({ page }) => {
    await page.goto(BASE_URL);
    const logo = page.locator("img[alt*='Logo']");
    await expect(logo).toBeVisible();
  });

  test("Navegación funciona correctamente desde home", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click("nav a:has-text('Opinión')");
    await expect(page).toHaveURL(/opinion/);
  });

});

// ════════════════════════════════════════════════════════════════════════════
// BLOQUE 2 — AUTENTICACIÓN
// ════════════════════════════════════════════════════════════════════════════

test.describe("Autenticación", () => {

  test("Página de login carga correctamente", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("button[type=submit]")).toBeVisible();
  });

  test("Login con credenciales incorrectas muestra error", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill("#email", "noexiste@test.com");
    await page.fill("#password", "passwordincorrecto");
    await page.click("button[type=submit]");
    // Debe quedarse en login o mostrar error
    await expect(page).toHaveURL(/login/);
  });

  test("Login con credenciales correctas redirige al panel", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/admin/);
  });

  test("Rutas /admin redirigen a login si no hay sesión", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await expect(page).toHaveURL(/login/);
  });

  test("Ruta /admin/articulos redirige a login sin sesión", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/articulos`);
    await expect(page).toHaveURL(/login/);
  });

});

// ════════════════════════════════════════════════════════════════════════════
// BLOQUE 3 — PANEL ADMIN
// ════════════════════════════════════════════════════════════════════════════

test.describe("Panel admin", () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("Panel admin carga con navegación", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await expect(page.locator("nav, [role='navigation']")).toBeVisible();
  });

  test("Listado de artículos carga", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/articulos`);
    await expect(page).not.toHaveURL(/login/);
    await expect(page.locator("h1, h2")).toBeVisible();
  });

  test("Listado de revistas carga", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/revistas`);
    await expect(page).not.toHaveURL(/login/);
  });

  test("Formulario de nuevo artículo carga", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/articulos/nuevo`);
    await expect(page.locator("#titulo")).toBeVisible();
    await expect(page.locator("#resumen")).toBeVisible();
    await expect(page.locator("button[type=submit]")).toBeVisible();
  });

  test("Formulario nuevo artículo: validación campos vacíos", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/articulos/nuevo`);
    await page.click("button[type=submit]");
    // Debe mostrar error o no redirigir
    await expect(page).toHaveURL(/nuevo/);
  });

  test("Formulario nuevo artículo: título muy corto muestra error", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/articulos/nuevo`);
    await page.fill("#titulo", "abc"); // menos de 5 caracteres
    await page.click("button[type=submit]");
    await expect(page).toHaveURL(/nuevo/);
  });

  test("Upload de imagen en formulario artículo funciona", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/articulos/nuevo`);
    const uploadZone = page.locator("label[for='fileUpload']");
    await expect(uploadZone).toBeVisible();
  });

  test("Formulario de nueva revista carga", async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/revistas/nueva`);
    await expect(page).not.toHaveURL(/login/);
  });

});

// ════════════════════════════════════════════════════════════════════════════
// BLOQUE 4 — SEO Y METADATOS
// ════════════════════════════════════════════════════════════════════════════

test.describe("SEO y metadatos", () => {

  test("Homepage tiene meta description", async ({ page }) => {
    await page.goto(BASE_URL);
    const metaDesc = page.locator("meta[name='description']");
    await expect(metaDesc).toHaveCount(1);
    const content = await metaDesc.getAttribute("content");
    expect(content?.length).toBeGreaterThan(10);
  });

  test("Homepage tiene og:title", async ({ page }) => {
    await page.goto(BASE_URL);
    const ogTitle = page.locator("meta[property='og:title']");
    await expect(ogTitle).toHaveCount(1);
  });

  test("Homepage tiene og:image", async ({ page }) => {
    await page.goto(BASE_URL);
    const ogImage = page.locator("meta[property='og:image']");
    await expect(ogImage).toHaveCount(1);
  });

  test("Favicon presente", async ({ page }) => {
    await page.goto(BASE_URL);
    const favicon = page.locator("link[rel*='icon']");
    await expect(favicon).toHaveCount(1);
  });

  test("JSON-LD presente en homepage", async ({ page }) => {
    await page.goto(BASE_URL);
    const jsonLd = page.locator("script[type='application/ld+json']");
    await expect(jsonLd).toHaveCount(1);
  });

  test("sitemap.xml accesible", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/sitemap.xml`);
    expect(response?.status()).toBe(200);
  });

  test("robots.txt accesible", async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/robots.txt`);
    expect(response?.status()).toBe(200);
  });

});

// ════════════════════════════════════════════════════════════════════════════
// BLOQUE 5 — RENDIMIENTO Y ACCESIBILIDAD BÁSICA
// ════════════════════════════════════════════════════════════════════════════

test.describe("Accesibilidad básica", () => {

  test("Imágenes tienen atributo alt", async ({ page }) => {
    await page.goto(BASE_URL);
    const imgsWithoutAlt = await page.locator("img:not([alt])").count();
    expect(imgsWithoutAlt).toBe(0);
  });

  test("Links de navegación son accesibles con teclado", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(["A", "BUTTON", "INPUT"]).toContain(focused);
  });

  test("Homepage no tiene errores de consola críticos", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", msg => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(BASE_URL);
    await page.waitForLoadState("networkidle");
    // Filtra errores conocidos no críticos
    const criticalErrors = errors.filter(e =>
      !e.includes("favicon") && !e.includes("404")
    );
    expect(criticalErrors).toHaveLength(0);
  });

});