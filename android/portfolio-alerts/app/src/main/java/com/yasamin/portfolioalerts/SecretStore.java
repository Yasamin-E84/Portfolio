package com.yasamin.portfolioalerts;

import android.content.Context;
import android.content.SharedPreferences;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

final class SecretStore {
    private static final String PREFS="portfolio_alerts", ALIAS="portfolio_alerts_token";
    private final SharedPreferences prefs;
    SecretStore(Context context){prefs=context.getSharedPreferences(PREFS,Context.MODE_PRIVATE);}

    private SecretKey key() throws Exception {
        KeyStore store=KeyStore.getInstance("AndroidKeyStore");store.load(null);
        SecretKey current=(SecretKey)store.getKey(ALIAS,null);if(current!=null)return current;
        KeyGenerator generator=KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES,"AndroidKeyStore");
        generator.init(new KeyGenParameterSpec.Builder(ALIAS,KeyProperties.PURPOSE_ENCRYPT|KeyProperties.PURPOSE_DECRYPT).setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).setKeySize(256).build());
        return generator.generateKey();
    }
    void putToken(String token) throws Exception {
        Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.ENCRYPT_MODE,key());
        prefs.edit().putString("token",Base64.encodeToString(cipher.doFinal(token.getBytes(StandardCharsets.UTF_8)),Base64.NO_WRAP)).putString("iv",Base64.encodeToString(cipher.getIV(),Base64.NO_WRAP)).apply();
    }
    String token(){try{String data=prefs.getString("token",null),iv=prefs.getString("iv",null);if(data==null||iv==null)return null;Cipher cipher=Cipher.getInstance("AES/GCM/NoPadding");cipher.init(Cipher.DECRYPT_MODE,key(),new GCMParameterSpec(128,Base64.decode(iv,Base64.NO_WRAP)));return new String(cipher.doFinal(Base64.decode(data,Base64.NO_WRAP)),StandardCharsets.UTF_8);}catch(Exception error){clear();return null;}}
    void clear(){prefs.edit().clear().apply();}
    long cursor(){return prefs.getLong("cursor",0);}
    void cursor(long value){prefs.edit().putLong("cursor",value).apply();}
    boolean live(){return prefs.getBoolean("live",false);}
    void live(boolean value){prefs.edit().putBoolean("live",value).apply();}
}
