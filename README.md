Psykeros - Sitio web completo (Express + EJS + SQLite)
=====================================================

Contenido
--------
Este proyecto contiene:
- Frontend responsive (EJS templates): index, services, about, doctor profile, blog, gallery, testimonials, contact, client portal.
- Backend: Node.js + Express, SQLite para almacenamiento local, autenticación para portal de clientes/admin.
- Integración opcional con Google Calendar (requiere credenciales de Google Cloud).
- Sistema de reservas de citas con sincronización a Google Calendar si configuras credenciales.
- Botones WhatsApp y Facebook integrados.
- i18n (español / inglés) con selector de idioma.
- CMS básico para crear posts del blog, testimonios y ver citas (panel admin minimal).

Instalación local (desarrollo)
-----------------------------
1. Asegúrate de tener Node.js (v18+) y npm instalados.
2. Descomprime el archivo y entra a la carpeta del proyecto:
   ```bash
   cd psykeros_website
   npm install
   ```
3. Copia `.env.example` a `.env` y edítalo con tus valores:
   ```bash
   cp .env.example .env
   ```
4. Inicializa la base de datos (crea tablas y usuario admin):
   ```bash
   npm run init-db
   ```
5. Levanta la app en modo desarrollo:
   ```bash
   npm run dev
   ```
6. Abre `http://localhost:3000`

Despliegue en Amazon Linux 2023 (guía rápida)
--------------------------------------------
Estas instrucciones suponen acceso SSH a una instancia EC2 con Amazon Linux 2023.

1. Actualiza el sistema y instala Node.js 18 LTS y Git:
   ```bash
   sudo yum update -y
   curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs git
   ```
2. (Opcional) Instala PM2 para gestionar la app:
   ```bash
   sudo npm install -g pm2
   ```
3. Sube el proyecto (git clone o SFTP). Dentro de la carpeta del proyecto:
   ```bash
   npm install --production
   cp .env.example .env
   # Edita .env con tus valores y credenciales SMTP / Google Calendar
   npm run init-db
   pm2 start server.js --name psykeros
   pm2 save
   ```
4. Configura nginx como proxy (opcional) y asegúrate de abrir el puerto 80/443 en el Security Group.
5. Para SSL usa certbot con nginx (letsencrypt) o el método que prefieras.

Notas importantes
-----------------
- Google Calendar: genera un "OAuth 2.0 Client ID" o credenciales de servicio y coloca el JSON en `config/google_credentials.json` y configura `GOOGLE_CALENDAR_ID`. Las instrucciones para autorización están en `README_GOOGLE_CAL.md`.
- Datos sensibles: usa variables de entorno y nunca subas credenciales a repositorios públicos.
- Las imágenes en `public/assets/images/` son de ejemplo y puedes reemplazarlas.

Archivos principales
--------------------
- server.js               -> servidor Express
- views/                  -> plantillas EJS
- public/                 -> assets estáticos (css, js, images)
- db/psykeros.db          -> base de datos SQLite (se crea al ejecutar init-db)
- scripts/init_db.js      -> crea tablas y admin
- config/i18n/*.json      -> traducciones

Soporte
-------
Si quieres que yo ajuste o genere más contenido (posts de blog de ejemplo, más páginas, o convertirlo a Next.js/React), dime y lo hago.
