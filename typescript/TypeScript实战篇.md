### TypeScript+React实战

#### 环境搭建

**手动配置**

在0-helloword 的基础上搭建

```shell
cnpm i react react-dom
cnpm install -D @types/react @types/react-dom //安装声明文件
```

修改tsconfig.json配置文件

```json
"jsx": "react",                    
/* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
/*
preseve:生成的代码保留jsx格式，扩展名也是jsx
react-native:生成的代码保留jsx格式，但扩展名是js
react:生成的代码不保留jsx格式。
*/
```

**脚手架配置**

```shell
npx create-react-app 6-ts-react-app --typescript
cd 6-ts-react-app
cnpm i antd react-router-dom axios
cnpm i @types/react-router-dom babel-plugin-import customize-cra http-proxy-middleware http-server react-app-rewired -D
//babel-plugin-import:实现antd组件的按需加载
//customize-cra react-app-rewired 可以实现脚手架的自定义
//http-proxy-middleware http-server 可以帮助搭建 mock server
```



#### 主要区别

使用typescript开发react应用的主要区别在与：在组件中需要为传入的参数指定类型；



#### 高阶组件和Hooks

























