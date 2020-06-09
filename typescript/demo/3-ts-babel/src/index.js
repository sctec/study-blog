"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var A = /** @class */ (function () {
    function A() {
        this.a = 1;
    }
    return A;
}());
var _a = { x: 1, y: 2, a: 3, b: 4 }, x = _a.x, y = _a.y, z = __rest(_a, ["x", "y"]);
var n = __assign({ x: x, y: y }, z);
n = 1;
// 1
// namespace N {
//     export const n = 1
// }
// 2
// let s = <A>{}
// let s = {} as A
// s.a = 1
// 3
// const enum E { A, B }
// 4
// export = s
