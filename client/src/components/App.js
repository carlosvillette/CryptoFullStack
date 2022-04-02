import React, {useState,useEffect} from "react";
import {Link} from "react-router-dom";
import logo from '../assets/block.png';

const App = () => {
    const [walletInfo,setWalletInfo] = useState({});

    useEffect(() => {
        const abortController = new AbortController();
        fetch(`${document.location.origin}/api/wallet-info`)//due to CORS issue
            .then(response => response.json())
            .then(json => setWalletInfo(json));

        return () => {
            abortController.abort();
        }
    }, []);

        const {address, balance} = walletInfo;

        return (
            <div className='App'>
                <img className='logo' src={logo}></img>
                <br />
                <div>
                    Welcome to the blockchain!
                </div>
                <br/>
                <div><Link to='/blocks'>Blocks</Link></div>
                <div><Link to='/conduct-transaction'>Conduct a Transaction</Link></div>
                <div><Link to='/transaction-pool'>Transaction Pool</Link></div>
                <div>
                    <br />
                    <div className='WalletInfo'>
                        <div>Address: {address}</div>
                        <div>Balance: {balance}</div>
                    </div>
                </div>
            </div>
        );

}

export default App;