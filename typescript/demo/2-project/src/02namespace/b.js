"use strict";
/// <reference path="a.ts" />
var Shape;
(function (Shape) {
    function square(x) {
        return x * x;
    }
    Shape.square = square;
})(Shape || (Shape = {}));
console.log(Shape.cricle(2));
console.log(Shape.square(2));
//命名空间别名问题：
// 这里的import与模块中的import不一样。
var cricle = Shape.cricle;
console.log(cricle(2));
