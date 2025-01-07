import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';  // Import styles
import './IncomeInput.css';  // Make sure to import the CSS
import axios from 'axios'




// Component to Add income
const IncomeInput = ({ authState }) => {

    // Initialize the incomes and the new income to be inputted
    const [incomes, setIncomes] = useState([]);
    const [currentIncome, setCurrentIncome] = useState({
        amount: "",
        date: null
    });
    const [calendarOpen, setCalendarOpen] = useState(false); // Control calendar visibility

    useEffect(() => {
        // Fetch incomes when the component mounts
        const fetchIncomes = async () => {
          try {

            const token = authState.token;  // Get token from localStorage
            if (!token) {
                throw new Error('No token found in localStorage');
            }
            // Make the request with the user's token in the header
            const response = await axios.get('http://localhost:8000/get_income/', {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`

              },
              params: { username: authState.username }  // Send username as a query parameter
            });
            console.log(response.data)
            setIncomes(response.data); // Update state with the retrieved incomes
          } catch (error) {
            console.error('Error fetching incomes', error);
            alert('Failed to retrieve incomes');
          }
        };
    
        if (authState.isAuthenticated) {
          fetchIncomes(); // Fetch the incomes if the user is authenticated
        }
      }, [authState]);

    // Handle the income change from input from user
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCurrentIncome({
            ...currentIncome,
            [name]: value
        });
    };

    // Handle the date change from input from user
    const handleDateChange = (date) => {
        setCurrentIncome({
            ...currentIncome,
            date: date
        });
        setCalendarOpen(false); // Close calendar after selecting date
    };

    // Handle adding the new income to the list
    const handleAddIncome = async (e) => {
        e.preventDefault();

        if (currentIncome.amount && currentIncome.date) {
            try {
                // Retrieve token from localStorage
                const token = authState.token;

                if (!token) {
                    throw new Error('No token found in localStorage');
                }

                // Create new income object
                const newIncome = {
                    username: authState.username, // Include username
                    amount: currentIncome.amount,
                    date: currentIncome.date.toISOString().split('T')[0] // Format date
                };

                // Add income with token in headers
                const response = await axios.post('http://localhost:8000/income/', 
                    newIncome, 
                    { 
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                setIncomes([...incomes, newIncome]); // Update income list
                setCurrentIncome({ amount: "", date: null }); // Reset form
                alert('Income added successfully');
                console.log(response);
            } catch (error) {
                console.error('Error saving income', error);
                alert('Failed to add income. Please try again.');
            }
        } else {
            alert("Please fill out the amount and date");
        }
    };

    return(
        <div className="income-input-container">
        <h2>Enter Your Incomes</h2>
        <div className="form-container">
            <div className="form-field">
                <label>Amount:</label>
                <input
                    type="number"
                    name="amount"
                    value={currentIncome.amount}
                    onChange={handleInputChange}
                    placeholder="Amount in USD"
                />
            </div>

            <div className="form-field">
                <label>Date:</label>
                <div className="date-picker-container">
                    <input
                        type="text"
                        value={currentIncome.date ? currentIncome.date.toLocaleDateString() : ""}
                        onFocus={() => setCalendarOpen(true)}
                        onClick={() => setCalendarOpen(true)} // Toggle calendar on input click
                        placeholder="Select Date"
                    />
                    {calendarOpen && (
                        <DayPicker
                            selected={currentIncome.date}
                            onDayClick={handleDateChange}
                        />
                    )}
                </div>
            </div>

            <button className="add-button" onClick={handleAddIncome}>Add Income</button>
        </div>

        <h3>Incomes List</h3>
        <ul>
            {incomes.map((income, index) => (
                <li key={index}>
                    {income.date}: ${income.amount}
                </li>
            ))}
        </ul>
    </div>
    );
};


export default IncomeInput