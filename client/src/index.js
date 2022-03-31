import React from "react";
import {render} from 'react-dom';
import {BrowserRouter as Router, Routes ,Route} from "react-router-dom";
import history from "./history";
import App from "./components/App";
import Blocks from "./components/Blocks";
import ConductTransaction from "./components/ConductTransaction";
import TransactionPool from "./components/TransactionPool";
import './index.css';

render(
    <Router history={history} forceRefresh={true}>
        <Routes>
            <Route path='/' element={<App/>}/>
            <Route path='/blocks' element={<Blocks/>}/>
            <Route path='/conduct-transaction' element={<ConductTransaction/>}/>
            <Route path='/transaction-pool' element={<TransactionPool/>}/>
        </Routes>
    </Router>,
    document.getElementById('root')
);