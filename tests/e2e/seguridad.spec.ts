import { test, expect } from '@playwright/test';

test.describe('Seguridad — acceso y rate limiting', () => {

    test('1. /admin sin sesión redirige a login', async ({ page }) => {
        // Navegación sin storageState (sin sesión)
        await page.goto('/admin');
        await expect(page).toHaveURL(/\/admin\/login/);
    });

    test('2. /admin/articulos sin sesión redirige a login', async ({ page }) => {
        await page.goto('/admin/articulos');
        await expect(page).toHaveURL(/\/admin\/login/);
    });

    test('3. API /api/admin/users sin sesión da 401', async ({ request }) => {
        const res = await request.get('/api/admin/users');
        expect(res.status()).toBe(401);
    });

    test('4. API /api/admin/users POST sin sesión da 401', async ({ request }) => {
        const res = await request.post('/api/admin/users', {
        data: { email: 'hack@test.com', nombre: 'Hacker', rol: 'EDITOR' },
        });
        expect(res.status()).toBe(401);
    });

    test('5. Login con credenciales incorrectas falla', async ({ page }) => {
        await page.goto('/admin/login');
        await page.getByLabel('Email').fill('admin@ufro.cl');
        await page.locator('input[type="password"]').fill('password_incorrecta');
        await page.getByRole('button', { name: 'Ingresar' }).click();

        // Debe seguir en login, no redirigir a /admin
        await expect(page).toHaveURL(/\/admin\/login/);
    });

    test.skip('6. Rate limiting login — bloquea tras 5 intentos fallidos', async ({ request }) => {
        // 5 intentos fallidos vía API
        for (let i = 0; i < 5; i++) {
            await request.post('/api/auth/callback/credentials', {
            data: {
                email: 'admin@ufro.cl',
                password: `wrong_pass_${i}`,
                csrfToken: 'fake',
                callbackUrl: '/admin',
                json: 'true',
            },
            });
        }

        // 6° intento — debe devolver 429
        const res = await request.post('/api/auth/callback/credentials', {
            data: {
            email: 'admin@ufro.cl',
            password: 'otro_intento',
            csrfToken: 'fake',
            callbackUrl: '/admin',
            json: 'true',
            },
        });

        expect(res.status()).toBe(429);
        });

    test('7. Token de recuperación inválido da error', async ({ request }) => {
        const res = await request.post('/api/nueva-contrasena', {
        data: { token: 'token_falso_12345', password: 'NuevaPass123!' },
        });
        expect(res.status()).toBe(400);
        const data = await res.json();
        expect(data.error).toMatch(/inválido|utilizado/i);
    });

    test('8. Token de configurar cuenta inválido da error', async ({ request }) => {
        const res = await request.post('/api/configurar-cuenta', {
        data: { token: 'token_falso_99999', password: 'NuevaPass123!' },
        });
        expect(res.status()).toBe(400);
        const data = await res.json();
        expect(data.error).toMatch(/inválido|utilizado/i);
    });

});