package com.yasamin.portfolioalerts;

import android.content.Context;
import android.content.SharedPreferences;

final class SecretStore {
    private static final String PREFS="portfolio_alerts";
    private static final int STORAGE_VERSION=3;
    private final SharedPreferences prefs;
    SecretStore(Context context){prefs=context.getSharedPreferences(PREFS,Context.MODE_PRIVATE);}
    boolean migrate(){int current=prefs.getInt("storage_version",1);if(current>=STORAGE_VERSION)return false;prefs.edit().remove("token").remove("iv").putInt("storage_version",STORAGE_VERSION).putBoolean("live",false).apply();return true;}
    void clear(){prefs.edit().remove("cursor").putBoolean("live",false).apply();}
    long cursor(){return prefs.getLong("cursor",0);}
    void cursor(long value){prefs.edit().putLong("cursor",value).apply();}
    boolean live(){return prefs.getBoolean("live",false);}
    void live(boolean value){prefs.edit().putBoolean("live",value).apply();}
}
