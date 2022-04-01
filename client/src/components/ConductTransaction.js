import React, {useState} from "react";
import {FormGroup, FormControl, Button} from "react-bootstrap";
import {Link,useNavigate} from "react-router-dom";

const ConductTransaction = () => {
    const [recipient,setRecipient] = useState('');
    const [amount,setAmount] = useState(0);
    const navigate = useNavigate();

  const updateRecipient = event => {
      setRecipient(event.target.value);
  }

  const updateAmount = event => {
        setAmount(Number(event.target.value));
  }

  const conductTransaction = () => {


      fetch('http://localhost:3000/api/transact',{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({recipient, amount})
      }).then(response => response.json())
          .then(json => {
              alert(json.message || json.type);
              navigate('/transaction-pool');
          })
  }

        console.log('recipient', recipient);
        console.log('amount', amount);

      return (
          <div className='ConductTransaction'>
             <Link to='/'>Home</Link>
             <h3>Conduct a Transaction</h3>
             <FormGroup>
                 <FormControl
                    input = 'text'
                    placeholder='recipient'
                    value={recipient}
                    onChange={updateRecipient}
                 />
             </FormGroup>
              <FormGroup>
                  <FormControl
                      input = 'number'
                      placeholder='amount'
                      value={amount}
                      onChange={updateAmount}
                  />
              </FormGroup>
              <div>
                  <Button
                    bsstyle='primary'
                    onClick={conductTransaction}
                  >
                      Submit
                  </Button>
              </div>
          </div>
      )

}

export default ConductTransaction;