Google Calendar integration (setup)
----------------------------------

This project can optionally push appointments to Google Calendar.
Steps (summary):
1. Go to Google Cloud Console -> Create a project -> APIs & Services -> Credentials.
2. Enable Calendar API.
3. Create OAuth 2.0 Client ID (for web application) OR create a Service Account and give it access to the calendar (share the calendar with the service account email).
4. Download the JSON credentials and place as `config/google_credentials.json` (or set path in .env).
5. Set GOOGLE_CALENDAR_ID in .env (usually your email or calendar id).
6. The server code will attempt to use the credentials to insert events. If you used OAuth client you will need to perform one-time auth flow (instructions in the code comments).

Important: For production, prefer Service Account for server-to-server calendar insertion and share the calendar with the service account email.
