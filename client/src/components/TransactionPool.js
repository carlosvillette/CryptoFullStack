import React, {useState,useEffect} from "react";
import {Link} from "react-router-dom";
import Transaction from "./Transaction";

const   POLL_INTERVAL_MS =10000;

function TransactionPool() {
    const [transactionPoolMap,setTransactionPoolMap] = useState({});

    const fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`,{ // due to CORS issue
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        }).then(response => response.json())
            .then(json => setTransactionPoolMap( json));

    }

    useEffect(() => {
        let abortController = new AbortController();
        fetchTransactionPoolMap();
        const fetchPoolMapInterval = setInterval(
            () => fetchTransactionPoolMap(),
            POLL_INTERVAL_MS
        );
        return () => {
            clearInterval(fetchPoolMapInterval);
            abortController.abort();
        }
    },[])

        return (
            <div className='TransactionPool'>
                <div><Link to='/'>Home</Link></div>
                <h3>Transaction Pool</h3>
                {
                    Object.values(transactionPoolMap).map(transaction => {
                        return (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction  transaction={transaction}/>
                            </div>
                        )
                    })
                }
            </div>
        )

}

export default TransactionPool