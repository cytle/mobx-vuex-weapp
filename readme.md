# 微信火排队
<!-- If you'd like to use a logo instead uncomment this code and remove the text above this line

  ![Logo](URL to logo img file goes here)

-->
![火小二前端出品](https://img.shields.io/badge/火小二前端-火-red.svg)
[![微信小程序](https://img.shields.io/badge/微信小程序-v-green.svg)](https://mp.weixin.qq.com/debug/wxadoc/introduction/#产品定位及功能介绍)

By [火小二前端团队](http://git.2dfire-inc.com/groups/static).

## Description
**微信火排队** 火排队微信小程序客户端(可能也有火排队h5

## Installation

用下面的命令安装npm依赖

```console
npm install
```

安装wept或者用官方工具运行结果
```console
npm install wept -g
```

跑dev环境

```console
npm run dev:wechat
```

用下面命令运行小程序或者官方工具打开dist目录
```console
cd shells/wechat && wept dist
```

## TODOS

- xux项目(参考src/xux/readme.md)

## Contributing

1. Clone it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Eslint it (`npm run lint`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create new Pull Request

## weUi

1. 用法参考 https://github.com/weui/weui-wxss


### 项目结构

```
.
├── package.json
├── readme.md
├── shells
│   ├── alias.js                                    // webpack alias
│   └── wechat
│       ├── dist                                    // 如果要运行,用微信开发者工具打开这个文件夹
│       │   ├── app.js
│       │   ├── app.json
│       │   ├── app.wxss
│       │   ├── images                              // 图片资源
│       │   ├── logics                              // 逻辑打包文件
│       │   │   ├── app.js                          // app -> src/app.js
│       │   │   └── utils.js                        // 辅助方法 -> src/utils/index.js
│       │   ├── pages                               // 微信页面,原生写法
│       │   │   ├── detail
│       │   │   ├── history
│       │   │   ├── index
│       │   │   ├── main
│       │   │   ├── search
│       │   │   └── shop
│       │   └── utils
│       │       └── xuxPage.js                      // 对Page扩增了些东西,微信中mapState等这里取
│       ├── webpack.config.js                       // 微信打包配置
│       └── wept.json                               // wept配置
└── src
    ├── apis                                        // 写api的地方,写法参考已经有的文件
    ├── app.js                                      // 绑定环境(request,storage)
    ├── config                                      // 配置(api等)
    │   └── index.js
    ├── store                                       // store,主要逻辑
    │   ├── index.js                                // 主store,其它模块在此引入
    │   ├── main.js                                 // 次store(module)名字自定
    │   └── tickets.js
    ├── utils                                       // 辅助方法
    │   ├── array.js
    │   ├── format.js
    │   ├── function.js
    │   ├── index.js
    │   ├── object.js
    │   ├── request.js
    │   ├── string.js
    │   └── validate.js
    └── xux                                         // 基础
        ├── createComponentHelper.js                // 创建mapState等store辅助方法
        ├── index.js                                //
        ├── readme.md
        ├── store.js                                // Xux.Store
        └── util.js                                 // Xux库辅助方法
```
