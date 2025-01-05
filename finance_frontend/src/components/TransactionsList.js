import React, { useState, useEffect } from 'react';
import axios from 'axios'

const TransactionsList = () => {
    const [transactions, setTransactions] = useState([]);


    useEffect(() => {
        // Fetch data from Django API
        axios.get('http://localhost:8000/api/transactions/')
        .then(response => {
            setTransactions(response.data);
        })
        .catch(error => {
            console.error("There was an error fetching the transactions", error);
        });
    }, []);

    return (
        <div>
            <h2>Transaction List</h2>
            <ul>
                {transactions.map(transaction => (
                    <li key={transaction.id}>
                        {transaction.category}: ${transaction.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionsList;