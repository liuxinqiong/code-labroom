package cordova.plugins.androidLogCollector;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONException;

public class AndroidLogCollector extends CordovaPlugin {
	

	
	public static CallbackContext cbCtx = null;
	
	@Override
	public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {
		// TODO Auto-generated method stub
		if ("openLogger".equalsIgnoreCase(action)) {
			cbCtx = callbackContext;
			cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                	try{
                		LogApplication logApplication=(LogApplication)cordova.getActivity().getApplication();
                    	logApplication.onCreate();
                    	cbCtx.success(); // Thread-safe.
                	}catch (Exception e) {
						// TODO: handle exception
                		cbCtx.error("open error"); 
					}
                }
            });
		}
		return true;
	}
}
