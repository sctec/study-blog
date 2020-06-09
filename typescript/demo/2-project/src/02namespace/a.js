"use strict";
var Shape;
(function (Shape) {
    var pi = Math.PI; //只能在Shape中使用。
    function cricle(r) {
        return pi * Math.pow(r, 2);
    } //要想全局使用，用export导出
    Shape.cricle = cricle;
})(Shape || (Shape = {}));
