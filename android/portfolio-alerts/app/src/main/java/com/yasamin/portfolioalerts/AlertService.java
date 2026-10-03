package com.yasamin.portfolioalerts;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class AlertService extends Service {
    private static final long MAX_LIVE_SESSION_MS=4L*60L*60L*1000L;
    private volatile boolean running,foregroundReady;private ExecutorService executor;
    static boolean start(Context context){SecretStore store=new SecretStore(context);if(!store.live())return false;try{Intent intent=new Intent(context,AlertService.class);if(Build.VERSION.SDK_INT>=26)context.startForegroundService(intent);else context.startService(intent);return true;}catch(Throwable error){store.live(false);return false;}}
    static void stop(Context context){try{new SecretStore(context).live(false);context.stopService(new Intent(context,AlertService.class));}catch(Throwable ignored){}}
    @Override public void onCreate(){super.onCreate();executor=Executors.newSingleThreadExecutor();try{startForeground(41,NotificationHelper.live(this));foregroundReady=true;}catch(Throwable error){new SecretStore(this).live(false);stopSelf();}}
    @Override public int onStartCommand(Intent intent,int flags,int startId){SecretStore store=new SecretStore(this);if(!foregroundReady||!store.live()){stopSelf();return START_NOT_STICKY;}if(running)return START_NOT_STICKY;running=true;executor.execute(()->{long deadline=System.currentTimeMillis()+MAX_LIVE_SESSION_MS;try{while(running&&System.currentTimeMillis()<deadline){sync(this);Thread.sleep(30_000);}}catch(InterruptedException ignored){Thread.currentThread().interrupt();}finally{running=false;store.live(false);stopSelf();}});return START_NOT_STICKY;}
    public void onTimeout(int startId,int foregroundServiceType){stopSafely();}
    private void stopSafely(){running=false;new SecretStore(this).live(false);stopForeground(STOP_FOREGROUND_REMOVE);stopSelf();}
    static boolean sync(Context context){SecretStore store=new SecretStore(context);try{ApiClient.Poll poll=ApiClient.poll(store.cursor());for(ApiClient.Item item:poll.items)NotificationHelper.show(context,item);store.cursor(poll.serverTime);return true;}catch(ApiClient.ApiException error){if(error.status==401||error.status==403){store.live(false);context.stopService(new Intent(context,AlertService.class));}return false;}catch(Throwable error){return false;}}
    @Override public void onDestroy(){running=false;if(executor!=null)executor.shutdownNow();super.onDestroy();}
    @Override public IBinder onBind(Intent intent){return null;}
}
