import { prisma } from "@/lib/prisma";

export async function getPublishedRevistas() {
  return prisma.revista.findMany({
    where: { publicada: true },
    orderBy: { anio: "desc" },
    include: {
      _count: { select: { contenidos: true } },
    },
  });
}

export async function getRevistaByAnio(anio: number) {
  return prisma.revista.findFirst({
    where: { anio, publicada: true },
    include: {
      contenidos: { orderBy: { createdAt: "asc" } },
    },
  });
}
