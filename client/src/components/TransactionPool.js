import React, {useState,useEffect} from "react";
import {Button} from "react-bootstrap";
import {Link,useNavigate} from "react-router-dom";
import Transaction from "./Transaction";

const   POLL_INTERVAL_MS =10000;

function TransactionPool() {
    const [transactionPoolMap,setTransactionPoolMap] = useState({});
    const navigate = useNavigate();

    const fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`,{ // due to CORS issue
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        }).then(response => response.json())
            .then(json => setTransactionPoolMap( json));

    }

    const fetchMineTransactions = () => {
        fetch(`${document.location.origin}/api/mine-transactions`)
            .then(response => {
                if (response.status === 200) {
                    alert('success');
                    navigate('/blocks');
                } else {
                    alert('mine-transactions block request did not complete.')
                }
            });
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
                <hr />
                <Button
                    bsstyle='danger'
                    bssize='small'
                    onClick={fetchMineTransactions}
                >
                    Mine the Transaction
                </Button>
            </div>
        )

}

export default TransactionPool