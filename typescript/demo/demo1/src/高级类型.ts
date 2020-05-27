
// interface DogInterface {
//     run(): void
// }
// interface CatInterface {
//     jump(): void
// }
// class Dog implements DogInterface {
//     run() { }
//     eat() { }
// }
// class Cat implements CatInterface {
//     jump() { }
//     eat() { }
// }
// enum Master { Boy, Girl }
// function getPet(master: Master) {
//     let pet = master === Master.Boy ? new Dog() : new Cat();
//     // pet.run()
//     // pet.jump()
//     pet.eat()
//     return pet
// }

// let test: string | number;
// test = 'ha';
// test.length
// test = 12;

// interface obj {
//     a: number,
//     b: string
// }
// let key: keyof obj;
// let value: obj['a'] //let value: number

// let obj = {
//     a: 1,
//     b: 2,
//     c: 3
// }

// function getValues<T, K extends keyof T>(obj: T, keys: K[]): T[k][] {
//     return keys.map(key => obj[key])
// }

// console.log(getValues(obj, ['a', 'b']))
// console.log(getValues(obj, ['d', 'e']))

// interface Obj {
//     a: string;
//     b: number;
// }
// type ReadonlyObj = Readonly<Obj>

// type PartialObj = Partial<Obj>

// type PickObj = Pick<Obj, 'a' | 'b'>

// type RecordObj = Record<'x' | 'y', Obj>
// type RecordObj = {
//     x: obj;
//     y: obj;
// }

// type s = 'a'|'b'|'c'
// let a = 1 | 2 | 3;
// a = 4
// console.log(a);

// let a:never;
// a = null; //Type 'null' is not assignable to type 'never'.

// let b: number;

// function error(message: string): never {
//     throw new Error(message);
// }
// b = error('this is error')
// console.log(b);

// let arr1: number[] = [1, 4, 6];
// arr1.push(4);

// interface Person {
//     readonly name: string,
//     age?: number;
//     [propName: string]: any;
// }
// let Tom: Person = {
//     name: "Tom",
//     age: 12,
//     sex: "男",
// }
// Tom.name = 'Bob'; //错误
// Tom.age = 13; //正确

// let a: 'a' | 'b' | 'c'
// a = 'c'
// a = 'd' //Type '"d"' is not assignable to type '"a" | "b" | "c"'.

// let a: 1 | 2 | 3
// a = 1 //OK
// a = 4 //Type '4' is not assignable to type '1 | 2 | 3'.

// let obj = {
//     a: 1,
//     b: 2,
//     c: 3
// }

// function getValues<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
//     return keys.map(key => obj[key])
// }

// console.log(getValues(obj, ['a', 'b'])) //正确
// // console.log(getValues(obj, ['d', 'e'])) //报错

// // interface obj {
// //     a: number,
// //     b: string
// // }
// // let key: keyof obj; // 'a' | 'b'

interface Obj {
    a: string;
    b: number;
}
type ReadonlyObj = Readonly<Obj>
// type ReadonlyObj{
//     readonly a: string;
//     readonly b: number;
// }
type PartialObj = Partial<Obj>
// type PartialObj{
//     a?: string | undefined;
//     b?: number | undefined;
// }
type PickObj = Pick<Obj, 'a'>
// type PickObj{
//     a: string;
// }