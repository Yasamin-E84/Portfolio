package com.yasamin.portfolioalerts;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.text.InputType;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Switch;
import android.widget.TextView;
import java.text.DateFormat;
import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class MainActivity extends Activity {
    private final ExecutorService executor=Executors.newSingleThreadExecutor();private SecretStore store;private LinearLayout root,feed;private TextView status;
    private final int paper=Color.rgb(16,21,18),panel=Color.rgb(24,32,27),ink=Color.rgb(233,226,210),muted=Color.rgb(155,167,159),accent=Color.rgb(155,197,165);
    @Override public void onCreate(Bundle state){super.onCreate(state);store=new SecretStore(this);NotificationHelper.channels(this);if(Build.VERSION.SDK_INT>=33&&checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS},91);render();}
    private TextView text(String value,int size){TextView view=new TextView(this);view.setText(value);view.setTextColor(ink);view.setTextSize(size);view.setPadding(0,8,0,8);return view;}
    private EditText input(String hint,int type){EditText field=new EditText(this);field.setHint(hint);field.setHintTextColor(muted);field.setTextColor(ink);field.setInputType(type);field.setSingleLine(true);field.setBackgroundColor(panel);field.setPadding(22,16,22,16);field.setLayoutParams(new LinearLayout.LayoutParams(-1,-2));return field;}
    private Button button(String label){Button value=new Button(this);value.setText(label);value.setTextColor(paper);value.setBackgroundColor(accent);value.setAllCaps(false);return value;}
    private void shell(){ScrollView scroll=new ScrollView(this);root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setPadding(42,54,42,54);root.setBackgroundColor(paper);scroll.addView(root);setContentView(scroll);}
    private void render(){if(store.token()==null)loginView();else dashboard();}
    private void loginView(){shell();TextView title=text("Portfolio Alerts",34);root.addView(title);TextView note=text("Private activity notifications for Yasamin. Sign in with the same portfolio admin account.",16);note.setTextColor(muted);root.addView(note);EditText email=input("Admin email",InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);EditText password=input("Password",InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_VARIATION_PASSWORD);root.addView(email);space();root.addView(password);space();status=text("",14);status.setTextColor(muted);root.addView(status);Button signIn=button("Sign in");root.addView(signIn);signIn.setOnClickListener(view->{signIn.setEnabled(false);status.setText("Signing in…");executor.execute(()->{try{ApiClient.Login login=ApiClient.login(email.getText().toString(),password.getText().toString(),Build.MANUFACTURER+" "+Build.MODEL);store.putToken(login.token);store.cursor(login.serverTime);store.live(true);AlertJobService.schedule(this);runOnUiThread(()->{AlertService.start(this);render();});}catch(Exception error){runOnUiThread(()->{status.setText(error.getMessage());signIn.setEnabled(true);});}});});}
    private void dashboard(){shell();root.addView(text("Portfolio Alerts",34));TextView note=text("Visits, opened work, contact actions and messages from your live portfolio.",15);note.setTextColor(muted);root.addView(note);space();Switch live=new Switch(this);live.setText("Near-live alerts (checks every 30 seconds)");live.setTextColor(ink);live.setChecked(store.live());root.addView(live);live.setOnCheckedChangeListener((CompoundButton button,boolean checked)->{store.live(checked);if(checked)AlertService.start(this);else AlertService.stop(this);});status=text("Ready",14);status.setTextColor(muted);root.addView(status);LinearLayout actions=new LinearLayout(this);actions.setOrientation(LinearLayout.HORIZONTAL);Button refresh=button("Check now");Button signOut=button("Sign out");actions.addView(refresh,new LinearLayout.LayoutParams(0,-2,1));actions.addView(signOut,new LinearLayout.LayoutParams(0,-2,1));root.addView(actions);feed=new LinearLayout(this);feed.setOrientation(LinearLayout.VERTICAL);root.addView(feed);refresh.setOnClickListener(v->syncNow());signOut.setOnClickListener(v->{String token=store.token();AlertService.stop(this);AlertJobService.cancel(this);store.clear();if(token!=null)executor.execute(()->{try{ApiClient.revoke(token);}catch(Exception ignored){}});render();});AlertJobService.schedule(this);if(store.live())AlertService.start(this);syncNow();}
    private void syncNow(){status.setText("Checking…");String token=store.token();long after=store.cursor();executor.execute(()->{try{ApiClient.Poll poll=ApiClient.poll(token,after);store.cursor(poll.serverTime);runOnUiThread(()->{status.setText("Updated "+DateFormat.getTimeInstance(DateFormat.SHORT).format(new Date()));feed.removeAllViews();if(poll.items.isEmpty()){TextView empty=text("No new activity since the last check.",14);empty.setTextColor(muted);feed.addView(empty);}else for(ApiClient.Item item:poll.items)addItem(item);});}catch(ApiClient.ApiException error){runOnUiThread(()->{status.setText(error.getMessage());if(error.status==401){store.clear();render();}});}catch(Exception error){runOnUiThread(()->status.setText("Connection unavailable. The app will retry."));}});}
    private void addItem(ApiClient.Item item){LinearLayout card=new LinearLayout(this);card.setOrientation(LinearLayout.VERTICAL);card.setPadding(22,16,22,16);card.setBackgroundColor(panel);TextView title=text(item.title,18);title.setTextColor(accent);TextView body=text(item.body,14);body.setTextColor(ink);TextView time=text(DateFormat.getDateTimeInstance(DateFormat.SHORT,DateFormat.SHORT).format(new Date(item.createdAt*1000)),12);time.setTextColor(muted);card.addView(title);card.addView(body);card.addView(time);LinearLayout.LayoutParams params=new LinearLayout.LayoutParams(-1,-2);params.setMargins(0,18,0,0);feed.addView(card,params);}
    private void space(){View view=new View(this);root.addView(view,new LinearLayout.LayoutParams(1,18));}
    @Override protected void onDestroy(){executor.shutdownNow();super.onDestroy();}
}
