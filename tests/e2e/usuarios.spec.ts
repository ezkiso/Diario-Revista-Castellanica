import { test, expect } from '@playwright/test';

const TS     = Date.now();
const EMAIL  = `editor.test.${TS}@gmail.com`;
const NOMBRE = `Editor Test ${TS}`;

test.describe('Usuarios — gestión desde admin', () => {

    test('1. Crear editor y verificar en tabla', async ({ page }) => {
        await page.goto('/admin/usuarios');

        await page.getByLabel('Nombre completo').fill(NOMBRE);
        await page.getByLabel('Email').fill(EMAIL);

        // Click en el botón submit del formulario
        await page.locator('form button[type="submit"]').first().click();

        // Esperar cualquier mensaje de respuesta del formulario
        await expect(
        page.locator('p[role="alert"]').first()
        ).toBeVisible({ timeout: 10_000 });

        // Verificar que es un mensaje de éxito (texto verde)
        const alerta = page.locator('p[role="alert"]').first();
        await expect(alerta).not.toHaveClass(/destructive/);

        // Email aparece en la tabla
        await expect(page.getByText(EMAIL)).toBeVisible();
    });

    test('2. No permite crear más de 3 editores', async ({ page }) => {
        await page.goto('/admin/usuarios');

        // Crear 4 usuarios — el 4to debe fallar
        for (let i = 0; i < 4; i++) {
        await page.getByLabel('Nombre completo').fill(`Editor Limite ${i} ${TS}`);
        await page.getByLabel('Email').fill(`limite.${i}.${TS}@gmail.com`);
        await page.locator('form button[type="submit"]').first().click();
        await page.waitForTimeout(1000);
        }

        // Debe mostrar error
        const alerta = page.locator('p[role="alert"]').first();
        await expect(alerta).toBeVisible({ timeout: 10_000 });
        await expect(alerta).toHaveClass(/destructive/);
    });

    test('3. Eliminar usuario', async ({ page }) => {
        await page.goto('/admin/usuarios');

        const fila = page.locator('tr', { hasText: EMAIL });
        await expect(fila).toBeVisible({ timeout: 10_000 });

        await fila.locator('button').last().click();

        const dialog = page.getByRole('alertdialog');
        await expect(dialog).toBeVisible();
        await dialog.getByRole('button').last().click();

        // Esperar que el dialog cierre completamente
        await expect(dialog).not.toBeVisible({ timeout: 10_000 });

        // Verificar que el email ya no está en la tabla — solo en <td>
        await expect(
            page.locator('td', { hasText: EMAIL })
        ).not.toBeVisible({ timeout: 10_000 });
    });

});