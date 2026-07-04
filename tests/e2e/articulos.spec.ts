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
        await page.goto('/');
        const link = page.getByRole('link', { name: TITULO_ORIGINAL });
        await expect(link).toBeVisible();
        await link.click();

        await expect(page.getByRole('heading', { level: 1 })).toContainText(TITULO_ORIGINAL);
        await expect(page.getByText(RESUMEN)).toBeVisible();

        // Verificar que resumen aparece ANTES de la imagen
        const resumenEl = page.getByText(RESUMEN);
        const imagenEl  = page.locator('article img').first();
        const resumenY  = (await resumenEl.boundingBox())?.y ?? 0;
        const imagenY   = (await imagenEl.boundingBox())?.y ?? 0;
        expect(resumenY).toBeLessThan(imagenY);
    });

    test('3. Editar artículo — cambiar título', async ({ page }) => {
        await page.goto('/admin/articulos');

        // Click en el título del artículo para ir a la página de edición
        await page.getByRole('link', { name: TITULO_ORIGINAL }).click();

        const inputTitulo = page.getByLabel('Título');
        await inputTitulo.clear();
        await inputTitulo.fill(TITULO_EDITADO);
        await page.getByRole('button', { name: /actualizar/i }).click();

        await page.waitForURL('/admin/articulos');
        await expect(page.getByText(TITULO_EDITADO)).toBeVisible();
        await expect(page.getByText(TITULO_ORIGINAL)).not.toBeVisible();
        });

        test('4. Eliminar artículo', async ({ page }) => {
        await page.goto('/admin/articulos');

        // Ir a la página de edición del artículo editado
        await page.getByRole('link', { name: TITULO_EDITADO }).click();

        // Click en eliminar dentro de la página del artículo
        await page.getByRole('button', { name: /eliminar/i }).click();

        // Confirmar en el AlertDialog
        await page.getByRole('button', { name: /eliminar/i }).click();

        await page.waitForURL('/admin/articulos');
        await expect(page.getByText(TITULO_EDITADO)).not.toBeVisible();
    });

});7