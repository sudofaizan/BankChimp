const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = 80;
//start of google api config
const { google } = require('googleapis');
const fs = require('fs');

const credentials = JSON.parse(fs.readFileSync('credentials.json'));
console.log(credentials);
let TRANS_NAME = "NILL"
let TRANS_DATE = "NILL"
let TRANS_TYPE = "NILL"
let TRANS_AMOUNT = "NILL"
let TRANS_TIME = "NILL"
let values = [ 
    [TRANS_NAME, TRANS_DATE, TRANS_TIME, TRANS_AMOUNT]
];
const client = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SPREADSHEET_ID = '1mdcN_gJG46wzApj2p_ci55BSq_l4p-dwcJznqPRkt78';
const SHEET_NAME = 'Sheet2';

//end of google api config

// Middleware to parse JSON request bodies
app.use(express.json());


async function logTransaction() {
    
    try {
        const authClient = await client.getClient(); // Get the authenticated client
        const sheets = google.sheets({ version: 'v4', auth: authClient });
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:D`,
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });

        console.log('Transaction logged successfully');
    } catch (error) {
        console.error('Error logging transaction:', error);
    }
}

let lastline = 'nill';
async function getLastLine() {
    try {
        const authClient = await client.getClient();
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        // Step 1: Fetch all rows
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:Z`, // Adjust column range based on your data
        });

        const rows = response.data.values || [];
        if (rows.length === 0) {
            console.log('No data found in the spreadsheet.');
            return;
        }

        // Step 2: Access the last row
        const lastRow = rows[rows.length - 1];
        console.log('Last Row:', rows.length);
        lastline = rows.length;

        return rows.length;
    } catch (error) {
        console.error('Error retrieving last row:', error);
    }
}

app.post('/message', async (req, res) => {

    const TOKEN = req.headers.authorization;
    const TOKEN_ENV = process.env.API_TOKEN;
    if ( TOKEN !== `Bearer ${TOKEN_ENV}`)
    {
        console.log('ERROR:'+new Date().toUTCString()+` Invalid Token Used ${TOKEN}`) 
        return res.status(498).send('Invalid or missing Auth Token');
    }
    try {
        const { message } = req.body; // Accessing the parsed JSON body
        if (message.includes('debit'))
            {
                TRANS_TYPE="Debit"
                TRANS_AMOUNT = message.match(/INR (\d+\.\d{2})/)?.[1];
                TRANS_DATE = message.match(/\d{2}\-\d{2}\-\d{2}/)?.[0];
                TRANS_TIME = message.match(/\d{2}\:\d{2}\:\d{2}/)?.[0];   
                TRANS_NAME = message.match(/\W\d{12}\W(.+)\n/)?.[1];
                console.log('INFO: '+ new Date().toUTCString()+' Debit log, AMOUNT: '+TRANS_AMOUNT+' Name: '+TRANS_NAME);
                res.status(200).send("Success");
                lastline = await getLastLine();
                lastline=lastline+1;
                TRANS_SPECIAL_SHEET_FUNCTION=`=SUMIFS(E2:E, B2:B, B${lastline}, A2:A, A${lastline})`
                values = [
                    [TRANS_TYPE,TRANS_NAME,TRANS_DATE,TRANS_TIME,TRANS_AMOUNT,TRANS_SPECIAL_SHEET_FUNCTION]
                ];
                logTransaction();
            }
        if (message.includes('credit'))
            {                
                TRANS_TYPE="Credit"
                TRANS_AMOUNT = message.match(/INR (\d+\.\d{2})/)?.[1];
                TRANS_DATE = message.match(/\d{2}\-\d{2}\-\d{2}/)?.[0];
                TRANS_TIME = message.match(/\d{2}\:\d{2}\:\d{2}/)?.[0];
                TRANS_NAME = message.match(/-\s\w+\W(\w+)\W/)?.[1];
                console.log('INFO: '+ new Date().toUTCString()+' Credit log, AMOUNT: '+TRANS_AMOUNT+' Name: '+TRANS_NAME);
                res.status(200).send("Success");
                lastline = await getLastLine();
                lastline=lastline+1;
                TRANS_SPECIAL_SHEET_FUNCTION=`=SUMIFS(E2:E, B2:B, B${lastline}, A2:A, A${lastline})`
                values = [
                    [TRANS_TYPE,TRANS_NAME,TRANS_DATE,TRANS_TIME,TRANS_AMOUNT,TRANS_SPECIAL_SHEET_FUNCTION]
                ];
                logTransaction(); 
            }
        
    } catch (error) {
        console.error('Error logging transaction:', error);
        res.status(500).send({ error: 'Failed to log transaction' });
    }
});

app.get('/health/full', async (req, res) => {
    res.status(200).send("Health OK!");
    console.log('INFO: '+new Date().toUTCString()+' Healthcheck probe')
}); //Func for Healthcheck


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});