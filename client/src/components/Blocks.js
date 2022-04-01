import React, {useState,useEffect} from "react";
import {Link} from "react-router-dom";
import Block from "./Block";
const Blocks = () => {
    const [blocks,setBlocks] = useState([]);

    useEffect( () => {
        fetch('http://localhost:3000/api/blockchain')
            .then(response => response.json())
            .then(json => setBlocks(json));
    }, [blocks.length])

        console.log('blocks', blocks);
        return (
            <div>
                <div><Link to='/'>Home</Link></div>
                <div><Link to='/conduct-transaction'>Conduct a Transaction</Link></div>
                <h3>Blocks</h3>
                {
                    blocks.map(block => {
                        return (
                            <Block key={block.hash} block={block} />
                        );
                    })
                }
            </div>
        );

};

export default Blocks;