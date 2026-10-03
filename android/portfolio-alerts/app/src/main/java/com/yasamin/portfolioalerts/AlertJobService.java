package com.yasamin.portfolioalerts;

import android.app.job.JobInfo;
import android.app.job.JobParameters;
import android.app.job.JobScheduler;
import android.app.job.JobService;
import android.content.ComponentName;
import android.content.Context;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class AlertJobService extends JobService {
    private ExecutorService executor;
    static boolean schedule(Context context){try{JobScheduler scheduler=context.getSystemService(JobScheduler.class);JobInfo info=new JobInfo.Builder(84,new ComponentName(context,AlertJobService.class)).setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY).setPeriodic(15*60*1000L).setPersisted(true).build();return scheduler!=null&&scheduler.schedule(info)==JobScheduler.RESULT_SUCCESS;}catch(Throwable error){return false;}}
    static void cancel(Context context){try{JobScheduler scheduler=context.getSystemService(JobScheduler.class);if(scheduler!=null)scheduler.cancel(84);}catch(Throwable ignored){}}
    @Override public boolean onStartJob(JobParameters params){try{executor=Executors.newSingleThreadExecutor();executor.execute(()->{try{AlertService.sync(this);}catch(Throwable ignored){}finally{jobFinished(params,false);}});return true;}catch(Throwable error){return false;}}
    @Override public boolean onStopJob(JobParameters params){if(executor!=null)executor.shutdownNow();return true;}
}
