package com.yasamin.portfolioalerts;

import org.json.JSONArray;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

final class ApiClient {
    static final String BASE="https://yasamin-portfolio.pwvzvxulmp0yw4u-ov3ihdw92l2.workers.dev";
    static final class Login { final String token;final long serverTime;Login(String t,long s){token=t;serverTime=s;} }
    static final class Item { final String id,title,body,kind;final long createdAt;Item(JSONObject value){id=value.optString("id");title=value.optString("title","Portfolio activity");body=value.optString("body");kind=value.optString("kind");createdAt=value.optLong("createdAt");} }
    static final class Poll { final List<Item> items;final long serverTime;Poll(List<Item> i,long s){items=i;serverTime=s;} }
    static final class ApiException extends Exception { final int status;ApiException(int s,String m){super(m);status=s;} }

    static Login login(String email,String password,String device) throws Exception {
        JSONObject payload=new JSONObject().put("email",email).put("password",password).put("deviceName",device);
        JSONObject result=request("POST","/api/mobile/login",null,payload);
        return new Login(result.getString("token"),result.getLong("serverTime"));
    }
    static Poll poll(String token,long after) throws Exception {
        JSONObject result=request("GET","/api/mobile/events?after="+after,token,null);JSONArray rows=result.getJSONArray("items");List<Item> items=new ArrayList<>();for(int i=0;i<rows.length();i++)items.add(new Item(rows.getJSONObject(i)));return new Poll(items,result.getLong("serverTime"));
    }
    static void revoke(String token) throws Exception {request("DELETE","/api/mobile/events",token,null);}

    private static JSONObject request(String method,String path,String token,JSONObject payload) throws Exception {
        HttpURLConnection connection=(HttpURLConnection)new URL(BASE+path).openConnection();connection.setRequestMethod(method);connection.setConnectTimeout(12_000);connection.setReadTimeout(20_000);connection.setRequestProperty("Accept","application/json");connection.setUseCaches(false);
        if(token!=null)connection.setRequestProperty("Authorization","Bearer "+token);
        if(payload!=null){byte[] data=payload.toString().getBytes(StandardCharsets.UTF_8);connection.setDoOutput(true);connection.setRequestProperty("Content-Type","application/json");connection.setFixedLengthStreamingMode(data.length);try(OutputStream output=connection.getOutputStream()){output.write(data);}}
        int status=connection.getResponseCode();InputStream stream=status>=400?connection.getErrorStream():connection.getInputStream();String body=stream==null?"":read(stream);connection.disconnect();
        if(status==204)return new JSONObject();JSONObject json=body.isEmpty()?new JSONObject():new JSONObject(body);if(status>=400)throw new ApiException(status,json.optString("error","Request failed"));return json;
    }
    private static String read(InputStream input) throws Exception {try(input;ByteArrayOutputStream output=new ByteArrayOutputStream()){byte[] buffer=new byte[4096];int size;while((size=input.read(buffer))!=-1)output.write(buffer,0,size);return output.toString(StandardCharsets.UTF_8.name());}}
}
