import React from 'react';
import ReactDOM from 'react-dom';

// import Hello from './components/demo/Hello';
import HelloClass from './components/demo/HelloClass';

ReactDOM.render(
    // <Hello name="TypeScript" />,
    <HelloClass name="TypeScript" />,
    document.querySelectorAll('.app')[0]
);
