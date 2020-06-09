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



