# Yasamin Portfolio Alerts

A private Android companion for the portfolio admin. It authenticates against the Cloudflare Worker, stores its 90-day device token with Android Keystore encryption, and shows notifications for visits, opened projects or media, contact actions, and messages.

- **Near-live alerts:** an optional foreground session checks every 30 seconds for up to four hours, then stops safely before Android's data-sync timeout.
- **Background fallback:** Android JobScheduler checks periodically when the live service is off or suspended. Android controls the exact execution time.
- **Session recovery:** invalidated Android Keystore entries and expired server sessions return to a clean login instead of blocking startup.
- **Privacy:** the APK contains no password or Worker secret. Sign-out revokes the device token on the server.

The app deliberately avoids Firebase and third-party notification SDKs. Fully dormant instant push would require a Firebase project and its private Android configuration.
