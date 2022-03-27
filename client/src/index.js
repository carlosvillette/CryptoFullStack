import React from "react";
import {render} from 'react-dom';
import {BrowserRouter as Router, Routes ,Route} from "react-router-dom";
import history from "./history";
import App from "./components/App";
import Blocks from "./components/Blocks";
import './index.css';

render(
    <Router history={history}>
        <Routes>
            <Route path='/' element={<App/>}/>
            <Route path='/blocks' element={<Blocks/>}/>
        </Routes>
    </Router>,
    document.getElementById('root')
);