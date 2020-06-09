import React from 'react';
import { Button } from 'antd'

interface Greeting {
    name: string;
    firstName: string;
    lastName: string;
}

const Hello = (props: Greeting) => <Button>Hello {props.name}</Button>

// //不好，不要用
// //React.FC：函数组件的缩写。使用的优点：在函数的参数中隐含声明了children属性。它的默认属性必须是可选属性。
// const Hello: React.FC<Greeting> = ({
//     name,
//     firstName,
//     lastName,
//     children
// }) => <Button>Hello {name}</Button>



//Hello的默认属性。
Hello.defaultProps = {
    firstName: '',
    lastName: ''
}

export default Hello;
