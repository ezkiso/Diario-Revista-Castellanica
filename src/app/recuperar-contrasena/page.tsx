'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function RecuperarContrasenaPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [enviado, setEnviado] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await fetch('/api/recuperar-contrasena', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setError(data.error || 'Error al enviar email');
            return;
        }

        setEnviado(true);
    }

    if (enviado) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-sm space-y-6 text-center">
                    <div>
                        <h1 className="text-3xl font-serif font-bold">Email enviado</h1>
                        <p className="text-muted-foreground mt-2">
                            Si el email existe en nuestro sistema, recibirás un enlace para recuperar tu contraseña.
                        </p>
                    </div>
                    <Button onClick={() => router.push('/admin/login')} className="w-full">
                        Volver al login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold">Recuperar contraseña</h1>
                    <p className="text-muted-foreground mt-2">
                        Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Enviando...' : 'Enviar enlace'}
                    </Button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => router.push('/admin/login')}
                        className="text-sm text-muted-foreground hover:underline"
                    >
                        Volver al login
                    </button>
                </div>
            </div>
        </div>
    );
}
