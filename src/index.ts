require('dotenv').config();
import express from 'express';
import { burnTokens, mintTokens, sendNativeTokens } from './mintTokens';

const app = express();
const HELIUS_RESPONSE = {
    "nativeTransfers": [ { 
       "amount": 10000000, 
       "fromUserAccount": "F1hLtC1BCc3FuATdBfHrAfxE4eJbXH2o3R54izrii1Fi", 
       "toUserAccount": "95a7YAwLAT2dzbKjn4wHp96QTHqqEeVsRcvMesEf2fr5" 
   } ] }

const VAULT = "b7aXLq81gY1SSdRwn1jUCyQeB282GJwrzBVCsJ3nFK2"

app.post('/helius', async(req, res) => {
    const incomingTx = HELIUS_RESPONSE.nativeTransfers.find(x => x.toUserAccount === VAULT);
    if(!incomingTx){
        res.json({message: "Processed"})
        return
    }
    const fromAddress = incomingTx.fromUserAccount;
    const toAddress = VAULT;
    const amount = incomingTx.amount;
    const type = "received_native_sol";

    if (type === "received_native_sol") {
        await mintTokens(fromAddress, amount);
    } else {
        // What could go wrong here?
        await burnTokens(fromAddress, toAddress, amount);
        await sendNativeTokens(fromAddress, toAddress, amount);
    }

    res.send('Transaction successful');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});