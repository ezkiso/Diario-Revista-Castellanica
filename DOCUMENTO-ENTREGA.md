# Documento de entrega

## 1. Identificación del proyecto

**Nombre:** Diario Castellano UFRO  
**Institución:** Universidad de La Frontera  
**Unidad:** Carrera de Pedagogía en Castellano y Comunicación  
**Tipo de solución:** Portal editorial web con panel de administración  
**Versión de entrega:** 1.0.0  
**Fecha de entrega:** septiembre de 2026  
**URL de producción:** https://diario-revista-castellanica.vercel.app

## 2. Propósito

El sistema permite publicar y consultar contenidos editoriales de la Carrera de Pedagogía en Castellano y Comunicación. La solución reúne un sitio público para lectores y un panel privado para que el equipo autorizado gestione artículos, revistas y usuarios.

## 3. Alcance funcional entregado

### Sitio público

- Página de inicio con artículo destacado y publicaciones recientes.
- Secciones de conversaciones, opinión, cartas al director y difusión.
- Vista individual de cada artículo con URL amigable.
- Archivo de la Revista Castellánica por año.
- Vista de cada edición con sus contenidos.
- Diseño responsive para computador, tablet y teléfono.
- Metadatos SEO, URL canónicas, Open Graph y datos estructurados para artículos y revistas.

### Panel de administración

- Inicio de sesión con correo y contraseña.
- Dashboard con totales de artículos, publicaciones, borradores y revistas.
- Creación, edición y eliminación de artículos.
- Clasificación de artículos por tipo.
- Edición de resumen, contenido enriquecido, fecha de publicación e imagen destacada.
- Estado de artículo: borrador o publicado.
- Creación y edición de revistas.
- Carga de portada y contenidos de revista.
- Estado de revista: borrador o publicada.
- Gestión de usuarios para el rol ADMIN.
- Cierre de sesión.

## 4. Roles de acceso

| Rol | Permisos |
|---|---|
| ADMIN | Acceso al dashboard, artículos, revistas y gestión de usuarios. |
| EDITOR | Acceso al dashboard, artículos y revistas. |
| Visitante | Acceso únicamente al contenido público. |

## 5. Tecnologías utilizadas

- Next.js 15 con App Router.
- React 19 y TypeScript.
- Tailwind CSS y componentes basados en Shadcn/UI.
- Prisma ORM.
- PostgreSQL serverless en Neon.
- Auth.js v5 con sesiones JWT.
- bcrypt para contraseñas.
- TipTap para edición de contenido enriquecido.
- Zod para validación de datos.
- Vercel para despliegue.
- Vercel Blob para imágenes.
- Redis/Upstash opcional para rate limiting distribuido.
- Playwright para pruebas end-to-end.

## 6. Arquitectura y datos

La aplicación se entrega como un monolito full-stack Next.js. Las páginas públicas y administrativas utilizan Server Components; las operaciones de escritura se realizan mediante Server Actions o endpoints protegidos.

La base de datos PostgreSQL contiene las entidades principales:

- `User`: usuarios, credenciales y rol.
- `Articulo`: artículos, autor, categoría, contenido y estado de publicación.
- `Revista`: ediciones, año, descripción, portada y estado.
- `ContenidoRevista`: textos asociados a una edición.

La descripción técnica detallada está disponible en [ARCHITECTURE.md](./ARCHITECTURE.md).

## 7. Seguridad implementada

- Protección del panel `/admin` mediante middleware.
- Contraseñas almacenadas con hash bcrypt.
- Sesiones JWT con duración configurada de ocho horas.
- Validación de entradas con Zod.
- Sanitización del HTML del editor antes de almacenarlo.
- Protección de Server Actions y endpoints administrativos.
- Control de permisos para la sección de usuarios.
- Rate limiting para intentos de login y carga de imágenes.
- Restricción de imágenes a formatos permitidos y máximo de 5 MB.
- Headers de seguridad configurados en Next.js.
- Panel administrativo marcado para no indexación.
- Redirección posterior al login hacia `/admin` o hacia un callback interno válido.

## 8. Requisitos de operación

- Node.js 20 o superior.
- Proyecto de PostgreSQL en Neon o instancia PostgreSQL compatible.
- Proyecto Vercel para producción.
- Token de Vercel Blob para carga persistente de imágenes.
- `AUTH_SECRET` configurado en todos los entornos.
- Redis recomendado para producción con múltiples instancias.

Las variables de entorno y el procedimiento de despliegue están documentados en [README-PRODUCTION.md](./README-PRODUCTION.md).

## 9. Instalación y ejecución local

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

La aplicación local queda disponible en `http://localhost:3000`.

Variables mínimas requeridas:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
AUTH_SECRET="secreto-seguro"
AUTH_URL="http://localhost:3000"
ADMIN_EMAIL="correo-del-administrador"
ADMIN_PASSWORD="contraseña-segura"
ADMIN_NAME="Administrador"
BLOB_READ_WRITE_TOKEN="token-de-vercel-blob"
```

## 10. Despliegue realizado

- **Proveedor:** Vercel.
- **Dominio de producción:** `diario-revista-castellanica.vercel.app`.
- **Base de datos:** Neon PostgreSQL.
- **Región configurada:** São Paulo (`gru1`).
- **Despliegue:** automático desde el repositorio conectado.

Las credenciales de producción no forman parte de este documento. Deben entregarse por un canal seguro al responsable designado.

## 11. Pruebas y criterios de aceptación

El proyecto incluye pruebas end-to-end con Playwright para:

- Acceso protegido al panel.
- Inicio de sesión correcto e incorrecto.
- Creación y eliminación de usuarios.
- Límite de usuarios editores.
- Operaciones de artículos.
- Validación de tokens de recuperación.
- Respuestas no autorizadas de endpoints administrativos.

Comandos disponibles:

```bash
npx tsc --noEmit
npm run test:e2e
npm run build
```

Criterios de aceptación de la entrega:

- [ ] El sitio público carga desde la URL de producción.
- [ ] Un visitante puede consultar artículos y revistas publicadas.
- [ ] Un usuario autorizado puede iniciar sesión y llegar directamente a `/admin`.
- [ ] Un EDITOR puede gestionar artículos y revistas.
- [ ] Un ADMIN puede gestionar usuarios.
- [ ] Los borradores no aparecen en el sitio público.
- [ ] Las imágenes se almacenan correctamente.
- [ ] El cierre de sesión devuelve al sitio público.
- [ ] Las variables de entorno de producción están configuradas en Vercel.
- [ ] La base de datos de producción tiene el esquema actualizado.

## 12. Mantenimiento y transferencia

Para nuevas publicaciones, el responsable editorial debe utilizar la [Guía de usuario](./GUIA-USUARIO.md).

Para cambios técnicos, revisar en este orden:

1. [README.md](./README.md), para instalación y comandos.
2. [README-PRODUCTION.md](./README-PRODUCTION.md), para producción.
3. [ARCHITECTURE.md](./ARCHITECTURE.md), para arquitectura y seguridad.
4. `prisma/schema.prisma`, para el modelo de datos.

Antes de modificar el esquema de base de datos, crear una migración y verificarla primero en un entorno de prueba. No modificar ni compartir las variables secretas del entorno de producción.

## 13. Entrega de archivos

La entrega incluye:

- Código fuente de la aplicación.
- Esquema y migraciones de Prisma.
- Semilla de datos inicial.
- Configuración de Next.js, Tailwind, Vercel y TypeScript.
- Pruebas end-to-end.
- Documentación de arquitectura, producción y uso.

**Estado:** entregado para operación y mantenimiento.
