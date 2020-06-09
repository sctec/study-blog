interface A {
    x: number;
    // y: string;
    foo(bar: number): number; // 5
    foo(bar: 'a'): string; // 2
}

interface A {
    y: number;
    foo(bar: string): string; // 3
    foo(bar: string[]): string[]; // 4
    foo(bar: 'b'): string; // 1
}

let a: A = {
    x: 1,
    y: 2,
    foo(bar: any) {
        return bar
    }
}

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


//命名空间与函数、类、枚举合并时，必须放在后面。