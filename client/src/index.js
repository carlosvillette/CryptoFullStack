import React from "react";
import {render} from 'react-dom';
import {BrowserRouter as Router, Routes ,Route} from "react-router-dom";
import history from "./history";
import App from "./components/App";
import Blocks from "./components/Blocks";
import ConductTransaction from "./components/ConductTransaction";
import './index.css';

render(
    <Router history={history}>
        <Routes>
            <Route path='/' element={<App/>}/>
            <Route path='/blocks' element={<Blocks/>}/>
            <Route path='/conduct-transaction' element={<ConductTransaction/>}/>
        </Routes>
    </Router>,
    document.getElementById('root')
);