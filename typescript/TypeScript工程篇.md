### 命名空间

**了解**。被ES6模块系统取代了。所以不要在模块中使用命名空间，而要在全局环境中使用命名空间。

#### 原理

命名空间最后被编译成为立即执行函数,这个函数创建了一个闭包，命名空间中的私有成员会被挂载在全局变量上。

#### 三斜线指令

与 `namespace` 类似，三斜线指令也是 ts 在早期版本中为了描述模块之间的依赖关系而创造的语法。随着 ES6 的广泛应用，现在已经不建议再使用 ts 中的三斜线指令来声明模块之间的依赖关系了。但是在声明文件中，它还是有一定的用武之地。

#### 基本使用

下面代码运行有错，仅了解。

```tsx
//a.ts
namespace Shape {
    const pi = Math.PI //只能在Shape中使用。
    export function cricle(r: number) {
        return pi * r ** 2
    }//要想全局使用，用export导出
}
    
//b.ts
/// <reference path="a.ts" />
namespace Shape {
    export function square(x: number) {
        return x * x
    }
}

console.log(Shape.cricle(2))
console.log(Shape.square(2))

//命名空间别名问题：
// 这里的import与模块中的import不一样。
import cricle = Shape.cricle
console.log(cricle(2))
```



### 声明合并

如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型。

#### 函数的合并

就是函数的重载。

```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```



#### 接口的合并

接口甚至可以不在一个文件中。

**接口中属性的合并**

接口中的属性在合并时会简单的合并到一个接口中。合并的属性的类型必须是唯一的：

```ts
interface Alarm {
    price: number;
}
interface Alarm {
    weight: number;
}
```

相当于：

```ts
interface Alarm {
    price: number;
    weight: number;
}
```

**接口中方法的合并**

接口中的方法（函数）重载时要注意函数声明顺序。在接口内部按书写顺序，接口之间，后面的排在前面。例外：如果函数的参数是一个字符串字面量类型，这个声明就会提升到整个函数声明的最顶端。

```ts
interface A {
    x: number;
    foo(bar: number): number; // 5
    foo(bar: 'a'): string; // 2
}

interface A {
    y: number;
    foo(bar: string): string; // 3
    foo(bar: string[]): string[]; // 4
    foo(bar: 'b'): string; // 1
}
```

相当于：

```ts
interface A {
    x: number;
    y: number;
    foo(bar: 'b'): string; // 1
    foo(bar: 'a'): string; // 2
    foo(bar: string): string; // 3
    foo(bar: string[]): string[]; // 4
    foo(bar: number): number; // 5
}
```



#### 类的合并

类的合并与接口的合并规则一致。



#### 命名空间声明合并   

在命名空间中导出成员是不可以重复定义的。命名空间与函数、类、枚举合并时，必须放在后面。

```typescript
//命名空间和类进行声明合并。相当于给类添加了静态属性。
class C {}
namespace C {
    export let state = 1
}
console.log(C.state)


//命名空间和函数进行声明合并。
function Lib() {}
namespace Lib {
    export let version = '1.0'
}
console.log(Lib.version)


//命名空间和枚举进行声明合并。相当于给枚举类型新增了方法。
enum Color {
    Red,
    Yellow,
    Blue
}
namespace Color {
    export function mix() {}
}
console.log(Color)
```



### 声明文件

在ts中使用一个外部类库的时候，首先看外部类库有没有声明文件。当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

在使用非ts编写的类库的时候，必须为这个类库编写一个声明文件，对外暴露它的API。有时候，这些类库的声明文件是包含在源码中的；但有时候是单独提供的，需要额外安装。大多数类库的声明文件，社区已经为我们编写好了，只需要安装一个类型声明包。

以使用jQuery库来举例：

```shell
cnpm install jquery
cnpm install @types/jquery -D  //安装类型声明包
```

**全局类库**

>global-lib.js

```javascript
//全局类库
function globalLib(options) {
    console.log(options);
}

globalLib.version = '1.0.0';

globalLib.doSomething = function () {
    console.log('globalLib do something');
};
```

> global-lib.d.ts

```typescript
//全局类库的声明文件
declare function globalLib(options: globalLib.Options): void;

declare namespace globalLib {
    const version: string;
    function doSomething(): void;
    interface Options {
        [key: string]: any
    }
}

//declare 为外部变量提供类型声明。
```

> index.ts

```typescript
globalLib({ x: 1 })
globalLib.doSomething()
```



**模块类库**

> module-lib.js

```typescript
//模块类库
const version = '1.0.0';

function doSomething() {
    console.log('moduleLib do something');
}

function moduleLib(options) {
    console.log(options);
}

moduleLib.version = version;
moduleLib.doSomething = doSomething;

module.exports = moduleLib;
```

> module-lib.d.ts

```typescript
//模块类库的声明文件
declare function moduleLib(options: Options): void

interface Options {
    [key: string]: any
}

declare namespace moduleLib {
    const version: string
    function doSomething(): void
}

export = moduleLib
```

> index.ts

```typescript
//使用
import moduleLib from './module-lib'
moduleLib({ y: 2 })
moduleLib.doSomething()
```



**UMD类库**

> umd-lib.js

```typescript
//umd类库
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.umdLib = factory();
    }
}(this, function() {
    return {
        version: '1.0.0',
        doSomething() {
            console.log('umdLib do something');
        }
    }
}));
```

> umd-lib.d.ts

```typescript
//umd类库的声明文件
declare namespace umdLib {
    const version: string
    function doSomething(): void
}

//在umd类库中必须要加这句话。
export as namespace umdLib

export = umdLib
```

> index.ts

```typescript
//使用 umd 类库
import umdLib from './umd-lib'
umdLib.doSomething()
```

umd 类库也可以全局使用

不建议这样使用，如果要这样使用，需要在tsconfig.json文件中将  `"allowUmdGlobalAccess": true,`

> index.html

```html
<body>
    <div class="app"></div>
    <script src="src/04libs/umd-lib.js"></script>
</body>
```

> index.ts

```typescript
umdLib.doSomething()
```



给模块类库添加自定义的方法。

**模块化插件**

```shell
cnpm i moment
```

```typescript
//index.ts
import m from 'moment'
declare module 'moment' {
    export function myFunction(): void
}
m.myFunction = () => { }
```



**全局插件**

给全局变量添加方法。这样做会对全局命名空间造成污染，不建议这样做。

```shell
cnpm i global
```

```typescript
declare global {
    namespace globalLib {
        function doAnything(): void
    }
}
globalLib.doAnything = () => { }
```

声明文件的依赖可以分为两种：模块依赖、路径依赖。

```typescript
/// <reference types="sizzle" /> //模块依赖
/// <reference path="JQueryStatic.d.ts" /> //路径依赖
```



### 配置tsconfig.json

可以将tsconfig.json 公共的部分抽离出去 ===> tsconfig.base.json

**关于文件的配置**

> tsconfig.base.json

```json
{
    //编译器关于文件的选项
    "files": [ //编译器需要编译的单个文件的列表。
      "src/05tsconfig/a.ts"
    ],
    //编译器需要编译的文件或目录。
    "include": [ //支持通配符
      // "src/05tsconfig" //编译器会编译 src/05tsconfig 目录下的所有文件
      "src/05tsconfig" //只会编译 src/05tsconfig 一级目录下的文件
      // "src/05tsconfig/*/*" //只会编译 src/05tsconfig 二级目录下的文件
    ],
    //编译器需要排除的文件和文件夹：默认排除node_modules 和 声明文件
    "exclude": [
      "src/05tsconfig/lib"
    ]
  }
```

> tsconfig.json

```json
{
  //通过 extends 导入基础的配置
  "extends": "./tsconfig.base.json",
  //可以覆盖 base 中的配置
  "exclude": [],
  "compileOnSave": true //保存文件的时候让编译器自动编译，但vscode中不支持，需要切换编译器
}
```

**与编译有关的选项**

```typescript
// 'strictBindCallApply'
function add(x: number, y: number) {
    return x + y
}
add.call(undefined, 1, '2'); //false 不会报错，true会报错

// "noImplicitThis" 不允许 this 有隐式的 any 类型
class A {
    a: number = 1
    getA() {
        return function(){
            console.log(this.a);  //false 不会报错，true会报错
        }
    }
}
let a = new A().getA()
a()

//
```

**工程引用**



## TypeScript工具体系

### 编译工具

**TypeScript 与 Babel**

使用了TypeScript，为什么还需要Babel?

|       | 编译能力                   | 类型检查 | 插件     |
| ----- | -------------------------- | -------- | -------- |
| TSC   | ts(x)、js(x)-> es3/5/6/... | 有       | 无       |
| Babel | ts(x)、js(x)-> es3/5/6/... | 无       | 非常丰富 |



**只是用babel编译**

可以不安装typescript ，只用babel将ts文件编译为js文件。但是当有语法错误，仍可编译成功，没有错误提示。详见3-ts-babel 文件夹。如果要引入类型检查，就需要安装typescript。`tsc --init`：在tsconfig.json文件中，使用`"noEmit": true,`这样    只使用typescript做类型检查，不会输出任何文件。

> package.json

```json
"scripts": {
    "build": "babel src --out-dir dist --extensions \".ts,.tsx\"",
    "type-check": "tsc --watch"
},
```

有四种语法在babel中是无法编译的：1是命名空间，2是关于类型断言的写法，3是常量枚举，4是默认导出。

```typescript
// 1
namespace N {
export const n = 1
}

// 2
// let s = <A>{} //不能用
let s = {} as A //改用
s.a = 1

// 3
const enum E { A, B }

// 4
export = s
```

**如何选择TypeScript编译工具**

1. 如果没有使用过Babel, 首选TypeScript自身的编译器(可配合ts-loader使用)
2. 如果项目中已经使用了Babel,安装@bable/ preset-typescript ( 可配合tsc做类型检查)
3. 两种编译工具不要混用



### 代码检查工具

TypeScript官方转向ESLint的原因:
1. TSLint执行规则的方式存在一些架构问题，从而影响了性能，而修复这些问题会
破坏现有的规则;
2. ESLint 的性能更好，并且社区用户通常拥有ESLint的规则配置(比如针对React和Vue的规则)，而不会 拥有TSLint的规则配置。

![](.\image\ESLint01.png)

![](.\image\ESLint02.png)

**babel-eslint 与 typescript-eslint**

babel-eslint: 支持TypeScript没有的额外的语法检查，抛弃TypeScript, 不支持类型检查
typescript-estlint: 基于TypeScript的AST,支持创建基于类型信息的规则( tsconfig.json )

**建议:**
两者底层机制不一一样，不要一起使用 。

Babel体系建议使用babel-eslint,否则可以使用typescript-eslint。

### 单元测试

#### 使用Jest进行单元测试

babel-jest

没有类型检查，需要启动类型检查脚本。

```shell
cnpm intall babel-jest jest @types/test
cnpm run test
//启动以后会执行 xxx.test.ts 文件
```

执行类型检查脚本

```shell
//需要安装声明文件 @types/node
cnpm run type-check
```





















