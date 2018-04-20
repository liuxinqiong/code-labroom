const createHashHistory = () => {
    const globalHistory = window.history
    const history = {
        length: globalHistory.length,
        hash: "",
        pathname: "/",
        search: "",
        state: undefined
    }
    return history
}

// 添加 /
const decodePath = path =>
    path.charAt(0) === "/" ? path : "/" + path

const getHashPath = () => {
    //如果url存在#，则去掉#，返回路径
    //比如："http://localhost:8080/#/"，返回'/'
    const href = window.location.href
    const hashIndex = href.indexOf("#")
    return hashIndex === -1 ? "" : href.substring(hashIndex + 1)
}

const getDOMLocation = () => {
    //getHashPath截取url的路由，如果存在#，则去掉#
    let path = decodePath(getHashPath())
    //创建location
    return createLocation(path)
}

const createPath = location => {
    const {
        pathname,
        search,
        hash
    } = location
    let path = pathname || "/"
    if (search && search !== "?")
        path += search.charAt(0) === "?" ? search : `?${search}`
    if (hash && hash !== "#") path += hash.charAt(0) === "#" ? hash : `#${hash}`
    return path
}

const createHref = location =>
    "#" + encodePath(createPath(location))


//更新history对象的值，length、location和action
const setState = nextState => {
    Object.assign(history, nextState)
    history.length = globalHistory.length
    transitionManager.notifyListeners(history.location, history.action)
}
//notifyListeners函数用来通知history的更新
const notifyListeners = (...args) => {
    listeners.forEach(listener => listener(...args))
}
//更新路由
const pushHashPath = path => (window.location.hash = path)

//push核心代码
const push = (path, state) => {
    //更新action为'PUSH'
    const action = "PUSH"
    //更新location对象
    const location = createLocation(
        path,
        undefined,
        undefined,
        history.location
    )
    //更新路由前的确认操作，confirmTransitionTo函数内部会处理好路由切换的状态判断，如果ok，则执行最后一个参数，它是回调函数。
    transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        ok => {
            //如果不符合路由切换的条件，就不更新路由
            if (!ok) return
            //获取location中的路径pathname，比如'/home'
            const path = createPath(location)
            const encodedPath = encodePath(path)
            //比较当前的url中的路由和push函数传入的路由是否相同，不相同则hashChanged为true。
            const hashChanged = getHashPath() !== encodedPath
            if (hashChanged) {
                //路由允许更新
                ignorePath = path
                //更新路由
                pushHashPath(encodedPath)
                const prevIndex = allPaths.lastIndexOf(createPath(history.location))
                const nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1)
                nextPaths.push(path)
                allPaths = nextPaths
                //setState更新history对象。               
                setState({
                    action,
                    location
                })
            } else {
                //push的路由和当前路由一样，会发出一个警告“Hash history cannot PUSH the same path; a new entry will not be added to the history stack”
                setState()
            }
        }
    )
}

//更新路由
const replaceHashPath = path => {
    const hashIndex = window.location.href.indexOf("#")
    window.location.replace(
        window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + "#" + path
    )
}
//replace核心代码
const replace = (path, state) => {
    const action = "REPLACE"
    const location = createLocation(
        path,
        undefined,
        undefined,
        history.location
    )
    transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        ok => {
            if (!ok) return
            const path = createPath(location)
            const encodedPath = encodePath(path)
            const hashChanged = getHashPath() !== encodedPath
            //到这里为止，前面的代码和push函数的实现都是一样的

            if (hashChanged) {
                ignorePath = path
                //更新路由
                replaceHashPath(encodedPath)
            }
            const prevIndex = allPaths.indexOf(createPath(history.location))
            if (prevIndex !== -1) allPaths[prevIndex] = path
            setState({
                action,
                location
            })
        }
    )
}

const go = n => globalHistory.go(n)

const goBack = () => go(-1)

const goForward = () => go(1)

const listen = listener => {
    const unlisten = transitionManager.appendListener(listener)
    checkDOMListeners(1)
    return () => {
        checkDOMListeners(-1)
        unlisten()
    }
}

//监听hashchange的改变，handleHashChange函数用来判断是哪种类型的路由更新，replace、push等各种hash改变都实现了一个函数，具体看源码。
const checkDOMListeners = delta => {
    listenerCount += delta
    if (listenerCount === 1) {
        //注册监听函数
        window.addEventListener('hashchange', handleHashChange)
    } else if (listenerCount === 0) {
        //移除监听函数
        window.removeEventListener('hashchange', handleHashChange)
    }
}

//appendListener函数实现
let listeners = []
const appendListener = fn => {
    let isActive = true
    const listener = (...args) => {
        if (isActive) fn(...args)
    }
    listeners.push(listener)
    return () => {
        isActive = false
        listeners = listeners.filter(item => item !== listener)
    }
}

export default createHashHistory;