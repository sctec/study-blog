// function add(x: number, y: number) {
//     return x + y
// }
// add.call(undefined, 1, '2');

class A {
    a: number = 1
    getA() {
        return function(){
            console.log(this.a);
        }
    }
}
let a = new A().getA()
a()