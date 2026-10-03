package com.yasamin.portfolioalerts;

import org.json.JSONArray;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

final class ApiClient {
    static final String BASE="https://yasamin-portfolio.pwvzvxulmp0yw4u-ov3ihdw92l2.workers.dev";
    static final class Item { final String id,title,body,kind;final long createdAt;Item(JSONObject value){id=value.optString("id");title=value.optString("title","Portfolio activity");body=value.optString("body");kind=value.optString("kind");createdAt=value.optLong("createdAt");} }
    static final class Poll { final List<Item> items;final long serverTime;Poll(List<Item> i,long s){items=i;serverTime=s;} }
    static final class ApiException extends Exception { final int status;ApiException(int s,String m){super(m);status=s;} }

    static Poll poll(long after) throws Exception {
        JSONObject result=request("/api/mobile/events?after="+after);JSONArray rows=result.getJSONArray("items");List<Item> items=new ArrayList<>();for(int i=0;i<rows.length();i++)items.add(new Item(rows.getJSONObject(i)));return new Poll(items,result.getLong("serverTime"));
    }
    static String readable(Exception error){String message=error.getMessage();if(error instanceof ApiException&&message!=null&&!message.isEmpty())return message;if(message!=null&&(message.contains("Unable to resolve host")||message.contains("connect")||message.contains("timed out")))return "The dashboard is open, but the server is currently unreachable. Alerts will retry automatically.";return "The dashboard is open. Alerts will retry automatically.";}

    private static JSONObject request(String path) throws Exception {
        if(BuildConfig.MOBILE_APP_KEY.isEmpty())throw new ApiException(503,"This APK is missing its private read-only access key.");
        HttpURLConnection connection=(HttpURLConnection)new URL(BASE+path).openConnection();connection.setRequestMethod("GET");connection.setConnectTimeout(12_000);connection.setReadTimeout(20_000);connection.setRequestProperty("Accept","application/json");connection.setRequestProperty("Authorization","Bearer "+BuildConfig.MOBILE_APP_KEY);connection.setUseCaches(false);
        int status;String body;try{status=connection.getResponseCode();InputStream stream=status>=400?connection.getErrorStream():connection.getInputStream();body=stream==null?"":read(stream);}finally{connection.disconnect();}
        JSONObject json;try{json=body.isEmpty()?new JSONObject():new JSONObject(body);}catch(Exception ignored){json=new JSONObject();}if(status>=400)throw new ApiException(status,json.optString("error","The alert service is temporarily unavailable."));return json;
    }
    private static String read(InputStream input) throws Exception {try(input;ByteArrayOutputStream output=new ByteArrayOutputStream()){byte[] buffer=new byte[4096];int size;while((size=input.read(buffer))!=-1)output.write(buffer,0,size);return output.toString("UTF-8");}}
}
