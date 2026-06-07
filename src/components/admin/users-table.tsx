"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type User = {
  id: string;
  email: string;
  nombre: string;
  rol: "ADMIN" | "EDITOR";
  createdAt: Date;
};

type UsersTableProps = {
  users: User[];
  currentUserId: string;
};

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${deletingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Error al eliminar usuario");
        return;
      }

      setShowDialog(false);
      setDeletingId(null);
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (userId: string) => {
    setDeletingId(userId);
    setShowDialog(true);
    setError(null);
  };

  const userToDelete = users.find((u) => u.id === deletingId);

  return (
    <>
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Rol</th>
              <th className="text-left p-3">Creado</th>
              <th className="text-left p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-muted/30">
                <td className="p-3 font-medium">{user.nombre}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      user.rol === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.rol === "ADMIN" ? "Administrador" : "Editor"}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">
                  {format(user.createdAt, "d MMM yyyy", { locale: es })}
                </td>
                <td className="p-3">
                  {user.id !== currentUserId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(user.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  {user.id === currentUserId && (
                    <span className="text-xs text-muted-foreground italic">
                      (Tú)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete && (
                <>
                  Estás a punto de eliminar al usuario <strong>{userToDelete.nombre}</strong> (
                  {userToDelete.email}). Esta acción no se puede deshacer.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
