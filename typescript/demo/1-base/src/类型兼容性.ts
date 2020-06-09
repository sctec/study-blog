// type Handler = (a: any, b: string) => void
//
// function hof(handler: Handler) {
//     return handler;
// }

// let handler1 = (a:number)=>{};
// hof(handler1); //正确
// let handler2 = (a:number,b:number,c:number)=>{};
// hof(handler2); //错误

// //可选参数和剩余参数
// let a = (p1: number, p2: number) => {
// };
// let b = (p1: number, p2?: number) => {
// };
// let c = (...args: number[]) => {
// };
// // a = b; //正确
// // a = c; //正确
// b = c; //错误
// b = a; //错误
// c = a;
// c = b;

// //参数类型
// type Handler = (a: any, b: string) => void
//
// function hof(handler: Handler) {
//     return handler;
// }
// let handler3 = (a: number) => {};
// hof(handler3);

// interface Point3D {
//     x: number;
//     y: number;
//     z: number;
// }
//
// interface Point2D {
//     x: number;
//     y: number;
// }
//
// let p3d = (point: Point3D) => {};
// let p2d = (point: Point2D) => {};
// p3d = p2d; //正确
// p2d = p3d; //错误

// let f = () => ({name: 'Alice'});
// let g = () => ({name: 'pillar', age: 'sex'});
// f = g; //正确
// g = f; //错误

