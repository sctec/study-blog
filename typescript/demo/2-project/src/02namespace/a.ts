namespace Shape {
    const pi = Math.PI //只能在Shape中使用。
    export function cricle(r: number) {
        return pi * r ** 2
    }//要想全局使用，用export导出
}