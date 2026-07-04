import { test, expect } from '@playwright/test';

const TS    = Date.now();
const EMAIL = `editor.test.${TS}@gmail.com`;
const NOMBRE = `Editor Test ${TS}`;

test.describe('Usuarios — gestión desde admin', () => {

    test('1. Crear editor y verificar en tabla', async ({ page }) => {
        await page.goto('/admin/usuarios');

        await page.getByLabel('Nombre completo').fill(NOMBRE);
        await page.getByLabel('Email').fill(EMAIL);
        // Rol EDITOR viene por defecto

        await page.getByRole('button', { name: /crear usuario/i }).click();

        // Mensaje de éxito
        await expect(
        page.getByText(/usuario creado/i)
        ).toBeVisible({ timeout: 10_000 });

        // Aparece en la tabla
        await expect(page.getByText(EMAIL)).toBeVisible();
    });

    test('2. No permite crear más de 3 editores', async ({ page }) => {
        await page.goto('/admin/usuarios');

        // Crear hasta llenar el límite (puede que ya haya algunos)
        for (let i = 0; i < 3; i++) {
        await page.getByLabel('Nombre completo').fill(`Editor Limite ${i}`);
        await page.getByLabel('Email').fill(`limite.${i}.${TS}@gmail.com`);
        await page.getByRole('button', { name: /crear usuario/i }).click();
        await page.waitForTimeout(800);
        }

        // Siguiente intento debe mostrar error de límite
        await page.getByLabel('Nombre completo').fill('Editor Extra');
        await page.getByLabel('Email').fill(`extra.${TS}@gmail.com`);
        await page.getByRole('button', { name: /crear usuario/i }).click();

        await expect(
        page.getByText(/límite máximo/i)
        ).toBeVisible({ timeout: 10_000 });
    });

    test('3. Eliminar usuario', async ({ page }) => {
        await page.goto('/admin/usuarios');

        const fila = page.locator('tr', { hasText: EMAIL });
        await fila.getByRole('button', { name: /eliminar/i }).click();
        await page.getByRole('button', { name: /confirmar/i }).click();

        await expect(page.getByText(EMAIL)).not.toBeVisible({ timeout: 10_000 });
    });

});