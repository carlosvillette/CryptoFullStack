import React, {useState,useEffect} from "react";
import {Link} from "react-router-dom";
import Transaction from "./Transaction";

function TransactionPool() {
    const [transactionPoolMap,setTransactionPoolMap] = useState({});

    const fetchTransactionPoolMap = () => {
        fetch('http://localhost:3000/api/transaction-pool-map',{
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        }).then(response => response.json())
            .then(json => setTransactionPoolMap( json));

    }

    useEffect(() => {
        let abortController = new AbortController();
        fetchTransactionPoolMap();
        return () => {
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