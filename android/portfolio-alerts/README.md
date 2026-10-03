# Yasamin Portfolio Alerts

A private Android companion for Yasamin's phone. It opens directly, uses a dedicated read-only app key for the alert feed, and shows notifications for visits, opened projects or media, contact actions, and messages.

- **Near-live alerts:** an optional foreground session checks every 30 seconds for up to four hours, then stops safely before Android's data-sync timeout.
- **Background fallback:** Android JobScheduler checks periodically when the live service is off or suspended. Android controls the exact execution time.
- **Reliable reopening:** there is no login state or encrypted session that can block startup after the app has been closed.
- **Crash-isolated launch:** the dashboard is drawn before notifications, network access or Android job scheduling begin; every background boundary catches device-specific failures.
- **Privacy:** the APK contains no admin email or password. Its dedicated key can only read the mobile alert feed and can be rotated independently.

The app deliberately avoids Firebase and third-party notification SDKs. Fully dormant instant push would require a Firebase project and its private Android configuration.
