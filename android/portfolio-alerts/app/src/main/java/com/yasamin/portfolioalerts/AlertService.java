package com.yasamin.portfolioalerts;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class AlertService extends Service {
    private volatile boolean running;private ExecutorService executor;
    static void start(Context context){Intent intent=new Intent(context,AlertService.class);if(Build.VERSION.SDK_INT>=26)context.startForegroundService(intent);else context.startService(intent);}
    static void stop(Context context){new SecretStore(context).live(false);context.stopService(new Intent(context,AlertService.class));}
    @Override public void onCreate(){super.onCreate();startForeground(41,NotificationHelper.live(this));executor=Executors.newSingleThreadExecutor();}
    @Override public int onStartCommand(Intent intent,int flags,int startId){if(running)return START_STICKY;running=true;new SecretStore(this).live(true);executor.execute(()->{while(running){sync(this);try{Thread.sleep(30_000);}catch(InterruptedException ignored){Thread.currentThread().interrupt();break;}}});return START_STICKY;}
    static boolean sync(Context context){SecretStore store=new SecretStore(context);String token=store.token();if(token==null)return false;try{ApiClient.Poll poll=ApiClient.poll(token,store.cursor());for(ApiClient.Item item:poll.items)NotificationHelper.show(context,item);store.cursor(poll.serverTime);return true;}catch(ApiClient.ApiException error){if(error.status==401){store.clear();context.stopService(new Intent(context,AlertService.class));}return false;}catch(Exception error){return false;}}
    @Override public void onDestroy(){running=false;if(executor!=null)executor.shutdownNow();super.onDestroy();}
    @Override public IBinder onBind(Intent intent){return null;}
}
