package org.grg.common.base.aopMonitor;



import java.lang.annotation.Annotation;
import java.lang.reflect.Method;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.grg.common.base.util.JsonUtil;
import org.springframework.core.LocalVariableTableParameterNameDiscoverer;
import org.springframework.core.ParameterNameDiscoverer;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class Test {
	
	private static Logger log = Logger.getLogger(Test.class);

  
    @Pointcut("execution(public * module..*.controller.*.*(..)")  
    public void recordLog() {  
    }  
  
  
    @Around("recordLog()")  
    public Object aroundLogCalls(ProceedingJoinPoint jp) throws Throwable {  
    	Object[] args = jp.getArgs();
		
    	//获取HttpRequest
		HttpServletRequest request = getHttpRequest(jp);
		if(request==null){
			return jp.proceed();
		}
		final Method method = ((MethodSignature) jp.getSignature()).getMethod();
		int paramIndex  = 0;
		//获取参数列表的注解
		
		JsonToObj jsonToObj;
		for (Object obj : args) {
			//判断参数是否需要转换
			jsonToObj = getAnnotation(method,paramIndex);
			//没有注解跳过
			if(jsonToObj==null){
				paramIndex++;
				continue;
			}
			//获取参数key
			String paramKey = getParamKey(method,jsonToObj,paramIndex);
			//转化对象
			args[paramIndex] = tranObj(paramKey,request,obj);	//转换	
					
			paramIndex++;
		}
		
		return jp.proceed(args);
    }  
    //获取参数列表名
    private String[] getParameterNames(Method method) {
    	ParameterNameDiscoverer parameterNameDiscoverer =   
                new LocalVariableTableParameterNameDiscoverer(); 
		return parameterNameDiscoverer.getParameterNames(method);
	}


	//转换请求对象
    private Object tranObj(String paramKey,HttpServletRequest request,Object obj) {

    	String paramJson = request.getParameter(paramKey);
    	if(paramJson!=null){
			return JsonUtil.customjson2Object(paramJson, obj.getClass());
		}
    	return obj;
   
	}

    //获取请求对象
	private HttpServletRequest getHttpRequest(ProceedingJoinPoint jp) {
    	Object[] args = jp.getArgs();
    	for (Object obj : args) {
			if(obj instanceof HttpServletRequest){
				return (HttpServletRequest)obj;
				
			}
		}
    	return null;
	}

    //获取参数KEY
	private String getParamKey(Method method , JsonToObj jsonToObj,int paramIndex) {
		String paramKey = jsonToObj.key();
		if(paramKey!=null&&!"".equals(paramKey))
			return paramKey;
		//获取参数名列表	
		String[] parameterNames =  getParameterNames(method);
		paramKey =  parameterNames[paramIndex];;
		return paramKey;
	}


	//获取注解
    private JsonToObj getAnnotation(Method method,int paramIndex) {
    	Annotation[][] getAnnotations = method.getParameterAnnotations();
    	Annotation[] annotations = getAnnotations[paramIndex];
    	JsonToObj result = null;
    	String className = JsonToObj.class.getName();
		for (Annotation annotation : annotations) {
			if(annotation.annotationType().getName().equals(className)){
				result = (JsonToObj)annotation;
				break;
			}
		}
		return result;
	}
    

    //使用方法
    public void test(@JsonToObj String s1,@JsonToObj(key="fly")String s2) {
    	

	}



}
