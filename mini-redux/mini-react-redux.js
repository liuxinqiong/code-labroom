// 父组件 包裹整个应用
export class Provider extends React.Component{

	// context API
	static childContextType = {
		store:PropTypes.object
	}

	constructor(props,context){
		super(props,context);
		tihs.store = props.store;
	}

	// context API
	getChildContext(){
		return { store: this.store }
	}

	// render 子元素即可
	render(){
		return this.props.children;
	}
}

// 超级无敌重要的方法就是connect高阶组件
export const connect = (mapStateToProps = state => state, mapDispatchToProps = {}) => (WrapComponent) =>{
	return class ConnectComponent extends React.Component {

		// mapStateToProps：表示redux state 中哪些数据放置到组件的 props 中，mapStateToProps为函数的目的就是过滤state

		// mapDispatchToProps：表示redux哪些dispatch方法放置到组件的 props 中

		static contextType = {
			store:PropTypes.object
		}

		constructor(props, context) {
            super(props);
            this.state = {
                props: {}
            };
        }

		componentDidMount() {
			// 通过context得到store
            const { store } = this.context;
            // 注册 update 方法，保证数据同步
            store.subscribe(() => this.update());
            this.update();
        }

        update(){
        	 const { store } = this.context;
        	 const stateProps = mapStateToProps(store.getState());
        	 // 使Creators具备dispatch功能
        	 const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch);
        	 this.setState({
                props: {
                    ...this.state.props,//初始的props                    
                    ...stateProps,
                    ...dispatchProps
                }
            })
        }

		render(){
			return <WrapComponent {...this.state.props}></WrapComponent>
		}
	}
}