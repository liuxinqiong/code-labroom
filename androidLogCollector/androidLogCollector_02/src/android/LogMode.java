package cordova.plugins.androidLogCollector;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONException;


import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
 



public class LogMode extends CordovaPlugin{

	// Flag indicates if the service is bind
    private boolean isBind = false;
	
    // Flag indicates if the plugin is enabled or disabled
    private boolean isDisabled = true;
    
    // Flag indicates if the app is in background or foreground
    private boolean inBackground = false;
    
    @SuppressWarnings("unused")
	private LogService logService;//get object and use service's function
    
    // Used to (un)bind the service to with the activity
    private final ServiceConnection connection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
        	LogService.LogBinder binder =
                    (LogService.LogBinder) service;

            logService = binder.getService();
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            // Nothing to do here
        }
    };
    
	@Override
	public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {
		// TODO Auto-generated method stub

        if (action.equalsIgnoreCase("enable")) {
            enableMode();
            return true;
        }

        if (action.equalsIgnoreCase("disable")) {
            disableMode();
            return true;
        }

        return false;
	}
	
	@Override
	public void onPause(boolean multitasking) {
		// TODO Auto-generated method stub
		super.onPause(multitasking);
		inBackground = true;
        startService();
	}
	
	@Override
	public void onResume(boolean multitasking) {
		// TODO Auto-generated method stub
		super.onResume(multitasking);
		inBackground = false;
        stopService();
	}
	
	@Override
	public void onDestroy() {
		// TODO Auto-generated method stub
		super.onDestroy();
		stopService();
	}
	
	private void enableMode(){
		isDisabled = false;

        if (inBackground) {
            startService();
        }
	}
	
	private void disableMode(){
		stopService();
        isDisabled = true;
	}
	
	private void startService(){
		Activity context = cordova.getActivity();

        if (isDisabled || isBind)
            return;

        Intent intent = new Intent(
                context, LogService.class);

        try {
            context.bindService(intent,
                    connection, Context.BIND_AUTO_CREATE);

            context.startService(intent);
        } catch (Exception e) {
             
        }

        isBind = true;
	}
	
	private void stopService(){
		Activity context = cordova.getActivity();

        Intent intent = new Intent(
                context, LogService.class);

        if (!isBind)
            return;

        context.unbindService(connection);
        context.stopService(intent);

        isBind = false;
	}
	
	
}	
