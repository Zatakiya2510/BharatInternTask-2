const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/moneyTrackerDB')
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

const transactionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.post('/addTransaction', (req, res) => {
    const { name, amount, type } = req.body;
    const newTransaction = new Transaction({
        name,
        amount,
        type
    });
    newTransaction.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.error('Error adding transaction:', err);
            res.sendStatus(500);
        });
});


app.get('/getTransactions', (req, res) => {
    Transaction.find({})
        .exec()
        .then(transactions => {
            res.send(transactions);
        })
        .catch(err => {
            console.error('Error fetching transactions:', err);
            res.sendStatus(500);
        });
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
