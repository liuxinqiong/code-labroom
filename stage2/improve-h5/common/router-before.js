export default (router) => {
    // 权限认证
    router.beforeEach(transition => {
        
    })

    // 设置title
    router.beforeEach(transition => {
        wxTool.setTitle(transition.to.title || '')
        transition.next()
    })

    // 记录PV

    // ……
}