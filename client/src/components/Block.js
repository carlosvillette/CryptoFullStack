import React, {useState} from "react";
import {Button} from "react-bootstrap";
import Transaction from "./Transaction";

const Block = props => {
    const  [displayTransaction,setDisplayTransaction] = useState(false);

    const toggleTransaction = () => {
        setDisplayTransaction(!displayTransaction);
    };

    const DisplayTransactions = () => {
        const {data} = props.block;

        const stringifiedData = JSON.stringify(data);

        const dataDisplay = !displayTransaction ?
            `${stringifiedData.substring(0,35)}...` :
            stringifiedData;

        if (displayTransaction) {
            return (
                <div>
                    {
                        data.map(transaction => (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction}/>
                            </div>
                        ))
                    }
                    <br/>
                    <Button
                        bsstyle='danger'
                        bssize='small'
                        onClick={toggleTransaction}
                    >
                        Show Less
                    </Button>
                </div>
            );
        }

        return (
            <div>
                <div>Data: {dataDisplay}</div>
                <Button
                    bsstyle='danger'
                    bssize='small'
                    onClick={toggleTransaction}
                >
                    Show More
                </Button>
            </div>
        );
    }

        const {timestamp, hash} = props.block;

        const hashDisplay = `${hash.substring(0,15)}...`;

        return (
            <div className='Block'>
                <div>Hash: {hashDisplay}</div>
                <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
                <DisplayTransactions/>
            </div>
        )

}



export default Block