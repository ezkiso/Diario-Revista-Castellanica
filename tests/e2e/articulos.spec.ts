import { test, expect, Page } from '@playwright/test';

const TS              = Date.now();
const TITULO_ORIGINAL = `[E2E] Artículo de prueba ${TS}`;
const TITULO_EDITADO  = `[E2E] Artículo editado ${TS}`;
const RESUMEN         = `Resumen de prueba generado automáticamente ${TS}.`;
const CONTENIDO       = `Contenido de prueba para verificar que TipTap persiste correctamente.`;

async function irANuevoArticulo(page: Page) {
    await page.goto('/admin/articulos/nuevo');
    await expect(page).toHaveURL('/admin/articulos/nuevo');
}

async function llenarFormulario(page: Page, titulo: string) {
    await page.getByLabel('Título').fill(titulo);
    await page.getByLabel('Resumen').fill(RESUMEN);

    const editor = page.locator('.ProseMirror');
    await editor.click();
    await page.keyboard.type(CONTENIDO);

    // Activar publicado
    const toggle = page.getByRole('switch', { name: /publicado/i });
    const isChecked = await toggle.isChecked();
    if (!isChecked) await toggle.click();
}

test.describe('Artículos — CRUD completo', () => {

    test('1. Crear artículo y verificar en lista', async ({ page }) => {
        await irANuevoArticulo(page);
        await llenarFormulario(page, TITULO_ORIGINAL);
        await page.getByRole('button', { name: /crear artículo/i }).click();

        await page.waitForURL('/admin/articulos');
        await expect(page.getByText(TITULO_ORIGINAL)).toBeVisible();
    });

    test('2. Resumen visible en página pública', async ({ page }) => {
  // Ir al artículo directo desde el panel — obtener el link
    await page.goto('/admin/articulos');
    const link = page.getByRole('link', { name: TITULO_ORIGINAL });
    await expect(link).toBeVisible({ timeout: 10_000 });

    // Obtener el href del link de edición para construir el slug
    const editHref = await link.getAttribute('href'); // /admin/articulos/[id]
    const id = editHref?.split('/').pop();

    // Ir a la página de edición para obtener el slug
    await page.goto(`/admin/articulos/${id}`);
    const slugInput = page.getByLabel('Slug');
    const slug = await slugInput.inputValue();

    // Navegar al artículo público
    await page.goto(`/articulo/${slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(TITULO_ORIGINAL);
    await expect(page.getByText(RESUMEN)).toBeVisible();
    });

    test('3. Editar artículo — cambiar título', async ({ page }) => {
    await page.goto('/admin/articulos');
    await page.getByRole('link', { name: TITULO_ORIGINAL }).click();

    const inputTitulo = page.getByLabel('Título');
    await inputTitulo.clear();
    await inputTitulo.fill(TITULO_EDITADO);
    await page.getByRole('button', { name: /actualizar/i }).click();

    await page.waitForURL('/admin/articulos');
    await expect(page.getByText(TITULO_EDITADO)).toBeVisible();
    });

    test('4. Eliminar artículo', async ({ page }) => {
        await page.goto('/admin/articulos');
        await page.getByRole('link', { name: TITULO_EDITADO }).click();

        await page.getByRole('button', { name: /eliminar/i }).first().click();

        // Esperar que aparezca el AlertDialog
        const dialog = page.getByRole('alertdialog');
        await expect(dialog).toBeVisible({ timeout: 5_000 });

        // Click en el último botón del dialog (el de confirmar)
        await dialog.getByRole('button').last().click();

        await page.waitForURL('/admin/articulos');
        await expect(page.getByText(TITULO_EDITADO)).not.toBeVisible();
    });

});7