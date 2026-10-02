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
    static void schedule(Context context){JobScheduler scheduler=context.getSystemService(JobScheduler.class);JobInfo info=new JobInfo.Builder(84,new ComponentName(context,AlertJobService.class)).setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY).setPeriodic(15*60*1000L).setPersisted(true).build();scheduler.schedule(info);}
    static void cancel(Context context){context.getSystemService(JobScheduler.class).cancel(84);}
    @Override public boolean onStartJob(JobParameters params){executor=Executors.newSingleThreadExecutor();executor.execute(()->{AlertService.sync(this);jobFinished(params,false);});return true;}
    @Override public boolean onStopJob(JobParameters params){if(executor!=null)executor.shutdownNow();return true;}
}
