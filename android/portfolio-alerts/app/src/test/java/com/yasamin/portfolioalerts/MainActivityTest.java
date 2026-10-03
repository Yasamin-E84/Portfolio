package com.yasamin.portfolioalerts;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import android.app.Activity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.Robolectric;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.android.controller.ActivityController;
import org.robolectric.annotation.Config;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {34, 35})
public final class MainActivityTest {
    @Test public void opensAgainWithoutLoginOrStoredSession() {
        ActivityController<MainActivity> first=launch();
        assertDashboard(first.get());
        first.pause().stop().destroy();

        ActivityController<MainActivity> second=launch();
        assertDashboard(second.get());
        second.pause().stop().destroy();
    }

    private ActivityController<MainActivity> launch(){return Robolectric.buildActivity(MainActivity.class).create().start().resume().visible();}
    private void assertDashboard(Activity activity){View root=activity.getWindow().getDecorView();assertTrue(containsText(root,"Portfolio Alerts"));assertTrue(containsText(root,"Check now"));assertFalse(containsType(root,EditText.class));}
    private boolean containsText(View view,String wanted){if(view instanceof TextView&&wanted.contentEquals(((TextView)view).getText()))return true;if(view instanceof ViewGroup)for(int index=0;index<((ViewGroup)view).getChildCount();index++)if(containsText(((ViewGroup)view).getChildAt(index),wanted))return true;return false;}
    private boolean containsType(View view,Class<?> type){if(type.isInstance(view))return true;if(view instanceof ViewGroup)for(int index=0;index<((ViewGroup)view).getChildCount();index++)if(containsType(((ViewGroup)view).getChildAt(index),type))return true;return false;}
}
