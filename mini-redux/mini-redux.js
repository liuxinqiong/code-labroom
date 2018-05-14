// 保险箱
export function createStore(reducer,enhancer){

	if(enhancer){
		return enhancer(createStore)(reducer);
	}

	// 当前状态
	let currentState = {};
	// 监听器
	let currentListeners = [];


	function getState(){
		return currentState;
	}

	function subscribe(listener){
		currentListeners.push(listener);
	}

	function dispatch(action){
		// 更新state
		currentState = reducer(currentState,action);
		// 所有监听执行一次
		currentListeners.forEach(v=>v());
		return action;
	}

	// 初始化，取个奇葩名字来命中default
	dispatch({type:'@@MINI/MINI-REDUX'});

	return {
		getState,
		subscribe,
		dispatch
	}

}

// 中间件原理
export function applyMiddleware(...middlewares){
	return createStore => (...args) =>{
		// 1. 得到原本的store
		const store = createStore(...args);
		// 在redux 中间件中需要两个方法
		const midApi = {
			dispatch:store.dispatch,
			getState:store.getState
		}
		// 2. 执行中间件，使中间件有默认方法
		const  middlewareChain = middlewares.map(middleware => middlewares(midApi))

		// 3. 使用中间件加工原本的store，得到新的dispatch
		dispatch = compose(...middlewareChain)(store.dispatch);

		// 4. 返回新的dispatch
		return {
			...store,
            dispatch
		}
	}
}


export function compose(...funcs){
	if(funcs.length == 0){
		return arg => arg;
	}
	if(funcs.length == 1){
		return funcs[0]
	}
	return funcs.reduce((ret,item)=>(...args) => ret(item(...args)))
}

function bindActionCreator(creator,dispatch){
	return (...args) => dispatch(creator(...args))
}

// 使mapDispatchToProps带有自动dispatch功能
export function bindActionCreators(creators, dispatch){
	return Object.keys(creators).reduce((ret,item)=>{
		ret[item] = bindActionCreator(creators[item], dispatch);
        return ret;
	},{})
}
