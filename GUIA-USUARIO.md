# Guía de usuario

## 1. Acceso al sitio

El sitio público está disponible en:

https://diario-revista-castellanica.vercel.app

Desde la página principal se pueden consultar las publicaciones destacadas, los artículos recientes y la edición más reciente de la Revista Castellánica.

## 2. Navegación pública

El sitio permite:

- Leer el artículo destacado desde la portada.
- Revisar las publicaciones recientes.
- Filtrar el contenido por sección: conversaciones, opinión, cartas al director y difusión.
- Abrir un artículo completo seleccionando su título o imagen.
- Consultar el archivo de la Revista Castellánica.
- Seleccionar un año para revisar una edición y sus contenidos.

Solo se muestran artículos y revistas marcados como publicados por el equipo editorial.

## 3. Iniciar sesión en el panel

1. Visita `https://diario-revista-castellanica.vercel.app/admin`.
2. El sistema te dirigirá al formulario de inicio de sesión si no existe una sesión activa.
3. Ingresa tu correo y contraseña.
4. Selecciona **Ingresar**.
5. Si las credenciales son correctas, entrarás directamente al dashboard de administración.

No compartas tu contraseña. Si no puedes ingresar, verifica primero que el correo esté escrito correctamente y solicita apoyo al administrador del sistema.

## 4. Dashboard

El dashboard muestra:

- Total de artículos.
- Artículos publicados.
- Artículos guardados como borrador.
- Total de revistas.
- Últimas publicaciones modificadas.

También ofrece accesos directos para crear un artículo o una revista.

## 5. Crear un artículo

1. En el panel, abre **Artículos**.
2. Selecciona **Nuevo artículo**.
3. Completa el título.
4. Escribe un resumen breve y claro.
5. Selecciona una imagen destacada o ingresa una URL de imagen.
6. Elige el tipo de artículo:
   - Conversaciones.
   - Opinión.
   - Carta al director.
   - Difusión.
7. Define la fecha y hora de publicación.
8. Escribe el contenido en el editor.
9. Activa **Publicado** cuando el artículo esté listo para aparecer en el sitio.
10. Selecciona **Crear artículo**.

Si no activas **Publicado**, el artículo queda guardado como borrador y solo estará disponible en el panel.

### Contenido enriquecido

El editor permite aplicar formato al texto, crear encabezados y listas, insertar enlaces, citas e imágenes según las herramientas disponibles en la barra del editor. Revisa el resultado antes de publicar.

### Imagen destacada

Puedes subir una imagen desde el equipo o ingresar una URL. La imagen debe ser válida y no superar 5 MB. Se aceptan formatos de imagen habituales como PNG, JPG, WebP y GIF.

## 6. Editar o retirar un artículo

1. Abre **Artículos**.
2. Selecciona el título del artículo.
3. Modifica los campos necesarios.
4. Para ocultarlo sin eliminarlo, desactiva **Publicado**.
5. Selecciona **Actualizar**.

El estado **Borrador** conserva el contenido dentro del panel, pero evita que aparezca en la portada y en las secciones públicas.

## 7. Crear una revista

1. Abre **Revistas**.
2. Selecciona **Nueva revista**.
3. Completa el nombre, año y descripción.
4. Sube una portada o ingresa su URL.
5. Agrega los textos de la edición si corresponde.
6. Revisa la información.
7. Activa **Publicada** cuando la edición esté lista.
8. Selecciona **Crear revista**.

También es posible crear una revista junto con sus contenidos desde el formulario de nueva revista. Cada contenido debe incluir título, autor y texto.

## 8. Administrar contenidos de una revista

1. En **Revistas**, selecciona la edición correspondiente.
2. Agrega un nuevo contenido con su título, autor y texto.
3. Puedes incluir una imagen para el contenido.
4. Guarda el contenido.
5. Edita o elimina contenidos desde la vista de la edición.

Una revista no debe marcarse como publicada hasta que sus datos y contenidos hayan sido revisados.

## 9. Gestionar usuarios

La sección **Usuarios** está disponible únicamente para el rol ADMIN.

Para crear un usuario:

1. Abre **Usuarios**.
2. Ingresa el nombre completo y correo.
3. Define una contraseña de al menos 12 caracteres que incluya mayúsculas, minúsculas, números y símbolos.
4. Selecciona el rol EDITOR.
5. Selecciona **Crear usuario**.

El rol ADMIN tiene acceso a la gestión de usuarios. El rol EDITOR puede administrar artículos y revistas, pero no puede crear ni gestionar usuarios.

El sistema restringe la creación de administradores para mantener un único administrador principal.

## 10. Cerrar sesión

1. Abre el menú lateral del panel.
2. Selecciona **Cerrar sesión**.
3. El sistema te devolverá al sitio público.

Cierra siempre la sesión al terminar, especialmente si utilizas un equipo compartido.

## 11. Buenas prácticas editoriales

- Revisa ortografía, nombres propios y enlaces antes de publicar.
- Usa títulos informativos y resúmenes breves.
- Mantén una imagen destacada relacionada con el contenido.
- Guarda como borrador mientras el artículo esté en revisión.
- Verifica la fecha de publicación.
- Después de publicar, abre el artículo en el sitio público para comprobar su presentación.
- No subas información privada, contraseñas ni documentos que no deban ser públicos.

## 12. Problemas frecuentes

### El panel vuelve al formulario de login

Verifica que las credenciales sean correctas y vuelve a iniciar sesión. Si el problema continúa, cierra las pestañas del sitio y abre nuevamente la URL de producción.

### El artículo no aparece en la portada

Comprueba que el artículo esté marcado como **Publicado**, que la fecha sea correcta y que los cambios se hayan guardado correctamente.

### No puedo subir una imagen

Comprueba que el archivo sea una imagen válida y que pese menos de 5 MB. Si el problema continúa, informa al administrador técnico para revisar el almacenamiento de imágenes.

### No aparece la sección Usuarios

La sección solo está disponible para usuarios con rol ADMIN. Un usuario EDITOR debe solicitar la creación o modificación de cuentas al administrador.

### Perdí mi contraseña

Solicita al administrador del sistema que revise o restablezca tu acceso. No envíes contraseñas por correo ni por canales públicos.

## 13. Contacto de soporte

Para problemas de contenido, contacta al responsable editorial. Para problemas de acceso, despliegue, base de datos o almacenamiento, contacta al responsable técnico de la aplicación.

La documentación técnica se encuentra en:

- [Documento de entrega](./DOCUMENTO-ENTREGA.md)
- [Guía de producción](./README-PRODUCTION.md)
- [Arquitectura](./ARCHITECTURE.md)
