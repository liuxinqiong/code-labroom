项目基本结构和一些有营养的细节
```shell
├── assets
    └── lib                # 第三方依赖包
    └── st.js              # 数据上报
    └── pre-load-handle.js # 预处理，设置cookie
├── common
    └── calc.js          # JS数据计算精度问题
    └── cookie.js        # 操作cookie相关
    └── directives.js    # 通用指令，图片懒加载，倒计时
    └── flexible.js      # 弹性设计
    └── router-before.js # 权限控制、标题设置、pv上报
    └── util.js          # 共用函数（总结）
    └── wx.tool.js       # 微信相关工具函数
    └── fask-click.js    # 移动端300ms延迟问题
├── components        # 通用组件
    └── loading.vue      # loading组件 
    └── pager.vue        # 分页组件 
    └── pull-refresh.vue # 下拉刷新组件 
    └── swiper.vue       # 滑动组件 
└── html  # 静态页面
└── img   # 图片文件
└── less  # less
└── scss  # scss
└── pages # 业务页面
└── store # vuex
└── tpl   # 上了年纪模版
└── js    # 上了年纪的JS
```

encodeURIComponent decodeURIComponent

getBoundingClientRect

$nextTick