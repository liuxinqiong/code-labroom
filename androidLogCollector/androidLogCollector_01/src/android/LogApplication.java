package cordova.plugins.androidLogCollector;

import com.qihoo.linker.logcollector.LogCollector;
import com.qihoo.linker.logcollector.upload.HttpParameters;

import android.app.Application;

public class LogApplication extends Application {

	// post method , upload logfile url,replace your site . support http or
	// https
	private static final String UPLOAD_URL = "http://120.76.244.22/account";

	@Override
	public void onCreate() {
		super.onCreate();

		// upload logfile , post params.
		HttpParameters params = new HttpParameters();
		params.add("key1", "value1");
		params.add("key2", "value2");
		params.add("key3", "value3");
		// .......
		// replace your key and value;

		boolean isDebug = true;
		// set debug mode , you can see debug log , and also you can get logfile in sdcard; 

		LogCollector.setDebugMode(isDebug);
		LogCollector.init(getApplicationContext(), UPLOAD_URL, null);// params can be null
		LogCollector.upload(false);//boolean isWifiOnly; 
	}
}
