import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/admin/users/[id] - Eliminar usuario (solo ADMIN)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Verificar que sea ADMIN
    if (session.user.rol !== "ADMIN") {
      return NextResponse.json(
        { error: "Solo administradores pueden eliminar usuarios" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Prevenir que un usuario se elimine a sí mismo
    if (user.id === session.user.id) {
      return NextResponse.json(
        { error: "No puedes eliminar tu propio usuario" },
        { status: 400 }
      );
    }

    // Verificar si el usuario tiene artículos
    const articulosCount = await prisma.articulo.count({
      where: { autorId: id },
    });

    if (articulosCount > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar este usuario porque tiene ${articulosCount} artículo(s) asociado(s). Primero debes eliminar o reasignar los artículos.` },
        { status: 400 }
      );
    }

    // Eliminar usuario
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Usuario eliminado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return NextResponse.json(
      { error: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}
