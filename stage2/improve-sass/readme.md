较新项目：vue + vuex + vue-router + elementui

项目基本结构和一些有营养的细节
```shell
├── assets                # 静态资源
    └── logo.png          
├── common                # 通用函数
    └── util.js           # 封装ajax、本地存储、cookie操作……
    └── access.js         # 权限常量（本地维护一份，服务端维护一份，待优化项）
├── components            # 通用组件
└── filter                # 过滤器
└── layout                # 过滤器
└── pages                 # 页面（业务）组件
└── router                # 路由集合
└── service               # API集合
└── vuex                  # 数据集中管理
    └── modules           # 数据分模块管理
    └── index.js          # 良好习惯，使用index表示入口文件
    └── mutation-types.js # 类型常量
    └── store.js          # 说啥好呢
```

优秀点
* 使用 index 标识入口，方便快速了解
* service 层将 url 集中管理，减少冗余，同时可以降低组件复杂度
* 使用 webpack 提供的 require.context api 动态有规律组件和函数
* 路由嵌套，好处让我想想哈
* 右侧管理菜单、位置导航依赖路由自动生成

缺点
* 权限控制待优化

路由结构
```shell
└── router-view（login page）              # 数据集中管理
└── router-view（/）                       # 根目录
    └── router-view（/level1）             # 一级菜单
        └── router-view（/level1/level2）  # 二级菜单
```

路由分析
1. 感觉复杂化了，可以简化一层（root-view）
2. 采用 Abstract 组件（router-view）方式构造嵌套路由是有目的的，用于形象的生成左侧菜单