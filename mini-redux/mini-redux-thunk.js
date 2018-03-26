const thunk = (dispatch,getState) => next => action {
	if(typeof action === 'function'){
		// 此处如果return，表示中间件是互斥的，找到一个处理就完成任务，没必要再继续
		action(dispatch,getState);
	}

	// 这个必须return
	return next(action);
}

export default thunk;