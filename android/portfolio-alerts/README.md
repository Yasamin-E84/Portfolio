# Yasamin Portfolio Alerts

A private Android companion for the portfolio admin. It authenticates against the Cloudflare Worker, stores its 90-day device token with Android Keystore encryption, and shows notifications for visits, opened projects or media, contact actions, and messages.

- **Near-live alerts:** optional foreground service checks every 30 seconds and keeps a visible system notification while active.
- **Background fallback:** Android JobScheduler checks periodically when the live service is off or suspended. Android controls the exact execution time.
- **Privacy:** the APK contains no password or Worker secret. Sign-out revokes the device token on the server.

The app deliberately avoids Firebase and third-party notification SDKs. Fully dormant instant push would require a Firebase project and its private Android configuration.
