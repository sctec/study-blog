"use strict";
var a = {
    x: 1,
    y: 2,
    foo: function (bar) {
        return bar;
    }
};
//命名空间和类进行声明合并。相当于给类添加了静态属性。
var C = /** @class */ (function () {
    function C() {
    }
    return C;
}());
(function (C) {
    C.state = 1;
})(C || (C = {}));
console.log(C.state);
//命名空间和函数进行声明合并。
function Lib() { }
(function (Lib) {
    Lib.version = '1.0';
})(Lib || (Lib = {}));
console.log(Lib.version);
//命名空间和枚举进行声明合并。相当于给枚举类型新增了方法。
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Yellow"] = 1] = "Yellow";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
(function (Color) {
    function mix() { }
    Color.mix = mix;
})(Color || (Color = {}));
console.log(Color);
//命名空间与函数、类、枚举合并时，必须放在后面。
