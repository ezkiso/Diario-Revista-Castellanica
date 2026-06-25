'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Suspense } from 'react';

function NuevaContrasenaForm() {
    const params    = useSearchParams();
    const router    = useRouter();
    const token     = params.get('token') ?? '';

    const [password, setPassword]   = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [error, setError]         = useState('');
    const [loading, setLoading]     = useState(false);
    const [listo, setListo]         = useState(false);

    async function handleSubmit() {
        setError('');

        if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.'); return;
        }
        if (password !== confirmar) {
        setError('Las contraseñas no coinciden.'); return;
        }

        setLoading(true);
        const res = await fetch('/api/nueva-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) { setError(data.error); return; }

        setListo(true);
        setTimeout(() => router.push('/admin/login'), 3000);
    }

    if (!token) return (
        <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Link inválido.</p>
        </div>
    );

    if (listo) return (
        <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
            <h1 className="text-2xl font-serif font-bold">¡Contraseña actualizada!</h1>
            <p className="text-muted-foreground">Redirigiendo al login...</p>
        </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
            <div>
            <h1 className="text-3xl font-serif font-bold">Nueva contraseña</h1>
            <p className="text-muted-foreground mt-1">Elige una contraseña segura.</p>
            </div>

            <div className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="password">Nueva contraseña</Label>
                <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                />
            </div>
            <div className="space-y-1">
                <Label htmlFor="confirmar">Confirmar contraseña</Label>
                <Input
                id="confirmar"
                type="password"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                placeholder="Repite tu contraseña"
                />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-ufro-purple text-white py-2 rounded hover:opacity-90 transition disabled:opacity-50"
            >
                {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
            </div>
        </div>
        </div>
    );
}

export default function NuevaContrasenaPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Cargando...</p></div>}>
            <NuevaContrasenaForm />
        </Suspense>
    );
}