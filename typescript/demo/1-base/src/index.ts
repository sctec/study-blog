// import './dataType'
// import './类型兼容性'
import './高级类型'
let hello: string = 'Hello World';


// enum Message {
//     Success = '恭喜你，成功了',
//     Fail = '抱歉，失败了'
// }
//
// console.log(Message['Success']);
// interface Result {
//     [x: string]: any,
//     [y: number]: number
// }
//
// let res = {
//     12: 23,
//     "tom": 'red'
// };

// type Add = (x: number, y: number) => number;
// let add: Add = (a, b) => a + b;
// console.log(add(2, 3));

// abstract class Animal {
//     public name: string;
//
//     constructor(name: string) {
//         this.name = name;
//     }
//
//     abstract sayHello(): string;
// }
//
// class Child extends Animal {
//     sayHello(): string {
//         return `name is ${this.name}`;
//     }
// }
//
// class People extends Animal {
//     sayHello(): string {
//         return "this is people";
//     }
// }
//
// let c = new Child('Tom');
// let p = new People('Bob');
// console.log(c.sayHello()); // name is Tom
// console.log(p.sayHello()); // this is people

// class Workflow {
//     step1() {
//         console.log('step1');
//         return this
//     }
//
//     step2() {
//         console.log('step2');
//         return this
//     }
// }
//
// new Workflow().step1().step2();
// //step1
// //step2
//
// class MyFlow extends Workflow {
//     next() {
//         console.log('next');
//         return this
//     }
// }
//
// new MyFlow().step1().next().step2();
// //step1
// //next
// //step2

// class Person {
//     private name: string;
//     age: number;
//
//     constructor(name: string, age: number) {
//         this.name = name;
//         this.age = age;
//     }
// }
//
// interface IChild extends Person {
//     sex: string;
// }
//
// class Child extends Person implements IChild {
//     // private name: string;
//     age: number;
//     sex: string;
//
//     constructor(age: number, sex: string) {
//         super(age,sex);
//         // this.age = age;
//         // this.sex = sex;
//         // this.name = name;
//     }
// }
//
// let c1 = new Child(12, 'male');
// class Person {
//     name: string;
//
//     constructor(name: string) {
//         this.name = name
//     }
// }
//
// let p1 = new Person("haha");


// class Auto {
//     state = 1
//     // private state2 = 1
// }
//
// interface AutoInterface extends Auto {
//
// }
//
// class C implements AutoInterface {
//     state1 = 1
// }
//
// let c = new C();
// console.log(c.state);
//
// class Bus extends Auto implements AutoInterface {
//
// }


// // 接口兼容性
// interface X {
//     a: any;
//     b: any;
// }
//
// interface Y {
//     a: any;
//     b: any;
//     c: any;
// }
//
// let x: X = {a: 1, b: 2};
// let y: Y = {a: 1, b: 2, c: 3};
// x = y;









document.querySelectorAll('.app')[0].innerHTML = hello;