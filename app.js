const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const PORT = 80;

app.use(bodyParser.json());

// Load Google Sheets credentials
const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const client = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const sheets = google.sheets({ version: 'v4', auth: client });

const SPREADSHEET_ID = '1mdcN_gJG46wzApj2p_ci55BSq_l4p-dwcJznqPRkt78';
const SHEET_NAME = 'Sheet1'; // Replace with your sheet name

// POST endpoint to handle SMS data

app.post('/message', async (req, res) => {
  try {
    const { message } = req.body;

    // Split message into lines and extract fields
    const lines = message.split('\n').map(line => line.trim());
    if (lines.length < 5) {
      return res.status(400).send({ error: 'Invalid SMS format' });
    }

    // Extract details from the SMS
    const amount = lines[0].match(/INR (\d+\.\d+)/)?.[1]; // Extract numeric amount after INR
    const accountNumber = lines[1].match(/A\/c no\. (.+)/)?.[1];
    const [date, time] = lines[2].split(',').map(item => item.trim());
    const transactionDetails = lines[3].split('/'); // Extract parts of the transaction line
    const senderName = transactionDetails[transactionDetails.length - 1]; // Assuming name is at the end
    const alertMessage = lines[4];
    const bank = lines[5]?.trim() || 'Unknown Bank';

    if (!amount || !accountNumber || !date || !time || !senderName) {
      return res.status(400).send({ error: 'Unable to parse SMS fields' });
    }

    // Prepare the transaction data for saving
    const transactionData = {
      amount: amount,  // Only the numeric value of the amount
      date,
      time,
      sender_name: senderName,
    };

    // Prepare data to append to Google Sheet
    const values = [
      [
        transactionData.date,
        transactionData.time,
        transactionData.amount,
        transactionData.sender_name
      ]
    ];

    // Append data to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:A`, // Ensure data is appended at the end of the sheet
      valueInputOption: 'RAW',
      resource: { values }
    });

    console.log('Transaction logged successfully:', transactionData);
    res.send({ message: 'Transaction logged successfully', data: transactionData });
  } catch (error) {
    console.error('Error logging transaction:', error);
    res.status(500).send({ error: 'Failed to log transaction' });
  }
});

app.get('/health', async (req, res) => {
        res.status(200).send({ message: 'Health OK' });
}); 
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});