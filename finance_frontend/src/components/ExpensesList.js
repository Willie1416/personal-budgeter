import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';  // Import styles
import './IncomeInput.css';  // Make sure to import the CSS
import axios from 'axios'

const ExpensesList = ({ authState }) => {

    const [expenses, setExpenses] = useState([]);
    const [currentExpenses, setCurrentExpenses] = useState({
        amount: '',
        category: '',
        date: null
    });

    const [calendarOpen, setCalendarOpen] = useState(false)


    useEffect(() => {
        const fetchExpenses = async () => { 
            try {
                const token = authState.token
                if (!token){
                    throw new Error('No token found');
                }

                const response = await axios.get('http://localhost:8000/get_expenses/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      params: { username: authState.username }  // Send username as a query parameter 
                });
                setExpenses(response.data);
            } catch(error){
                console.error('Error fetching expenses', error);
                alert('Failed to retrieve expenses');
            }
        };

        if (authState.isAuthenticated){
            fetchExpenses();
        }


    }, [authState]);

     // Handle the income change from input from user
     const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCurrentExpenses({
            ...currentExpenses,
            [name]: value
        });
    };

    const handleCategoryChange = (e) => {
        const {name, value} = e.target;
        setCurrentExpenses({
            ...currentExpenses,
            [name]: value
        });
    }

    // Handle the date change from input from user
    const handleDateChange = (date) => {
        setCurrentExpenses({
            ...currentExpenses,
            date: date
        });
        setCalendarOpen(false); // Close calendar after selecting date
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (currentExpenses.amount && currentExpenses.category && currentExpenses.date) {
            try {
                // Retrieve token from localStorage
                const token = authState.token;

                if (!token) {
                    throw new Error('No token found');
                }

                // Create new income object
                const newExpense = {
                    username: authState.username, // Include username
                    amount: currentExpenses.amount,
                    category: currentExpenses.category,
                    date: currentExpenses.date.toISOString().split('T')[0] // Format date
                };
                
                // Add income with token in headers
                const response = await axios.post('http://localhost:8000/expense/', 
                    newExpense, 
                    { 
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                setExpenses([...expenses, newExpense]); // Update income list
                setCurrentExpenses({ amount: "", category: "", date: null }); // Reset form
                alert('Expense added successfully');
                console.log(response);
            } catch (error) {
                console.error('Error saving Expense', error);
                alert('Failed to add Expense. Please try again.');
            }
        } else {
            alert("Please fill out the amount, category, and date");
        }
    };


    return(
        <div className="income-input-container">
        <h2>Enter Your Expenses</h2>
        <div className="form-container">
            <div className="form-field">
                <label>Amount:</label>
                <input
                    type="number"
                    name="amount"
                    value={currentExpenses.amount}
                    onChange={handleInputChange}
                    placeholder="Amount in USD"
                />
            </div>

            <div className="form-field">
                <label>Category:</label>
                <input
                    type="text"
                    name="category"
                    value={currentExpenses.category}
                    onChange={handleCategoryChange}
                    placeholder="Enter the category"
                />
            </div>
            <div className="form-field">
                <label>Date:</label>
                <div className="date-picker-container">
                    <input
                        type="text"
                        value={currentExpenses.date ? currentExpenses.date.toLocaleDateString() : ""}
                        onFocus={() => setCalendarOpen(true)}
                        onClick={() => setCalendarOpen(true)} // Toggle calendar on input click
                        placeholder="Select Date"
                    />
                    {calendarOpen && (
                        <DayPicker
                            selected={currentExpenses.date}
                            onDayClick={handleDateChange}
                        />
                    )}
                </div>
            </div>

            <button className="add-button" onClick={handleAddExpense}>Add Expense</button>
        </div>

        <h3>Expenses List</h3>
        <ul>
            {expenses.map((expense, index) => (
                <li key={index}>
                    {expense.date}: {expense.category} ${expense.amount}
                </li>
            ))}
        </ul>
    </div>
    );
};

export default ExpensesList;