package com.yasamin.portfolioalerts;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;

final class NotificationHelper {
    static final String LIVE="portfolio_live",EVENTS="portfolio_events";
    static void channels(Context context){NotificationManager manager=context.getSystemService(NotificationManager.class);manager.createNotificationChannel(new NotificationChannel(LIVE,"Live portfolio connection",NotificationManager.IMPORTANCE_LOW));manager.createNotificationChannel(new NotificationChannel(EVENTS,"Portfolio activity",NotificationManager.IMPORTANCE_HIGH));}
    static Notification live(Context context){channels(context);return new Notification.Builder(context,LIVE).setSmallIcon(com.yasamin.portfolioalerts.R.drawable.ic_notebook).setContentTitle("Portfolio alerts are live").setContentText("Checking privately for new visits and messages").setOngoing(true).setContentIntent(open(context)).build();}
    static void show(Context context,ApiClient.Item item){if(Build.VERSION.SDK_INT>=33&&context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)return;channels(context);Notification notification=new Notification.Builder(context,EVENTS).setSmallIcon(com.yasamin.portfolioalerts.R.drawable.ic_notebook).setContentTitle(item.title).setContentText(item.body).setStyle(new Notification.BigTextStyle().bigText(item.body)).setAutoCancel(true).setContentIntent(open(context)).build();context.getSystemService(NotificationManager.class).notify(item.id.hashCode(),notification);}
    private static PendingIntent open(Context context){Intent intent=new Intent(context,MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);return PendingIntent.getActivity(context,7,intent,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);}
}
