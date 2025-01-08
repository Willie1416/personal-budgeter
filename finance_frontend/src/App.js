import React, { useState } from 'react';
import './App.css';
import TransactionsList from './components/TransactionsList';
import IncomeInput from './components/Incomes';
import AuthForm from './components/AuthForm';

function App() {
  const [authState, setIsAuthenticated] = useState({
    isAuthenticated: false,
    username: '',
    token: '',
  });

  // Toggle between an income transaction and expense transactions
  const [inputMode, setInputMode] = useState('transaction');

  // Update this function to set the authentication state
  const handleLogin = ({isAuthenticated, username, token }) => {
    setIsAuthenticated({
      isAuthenticated:isAuthenticated,
      username: username,
      token: token}); // Set the authentication status
  };

  const toggleInput = () => {
    setInputMode((prevMode) => (prevMode === 'transaction' ? 'income': 'transaction'));
  }

  return (
    <div className='App'>
      {!authState.isAuthenticated ? (
        <div>
          <h1>Personal Finance Tracker - Login/Register</h1>
          <AuthForm setAuthTokens={handleLogin} />
        </div>
      ) : (
        <div>
          <h1>Personal Finance Tracker</h1>
          <h2>Welcome, {authState.username}!</h2>

          {/*Button to toggle between Transction and Income input*/}
          <button onClick={toggleInput}>
            {inputMode === 'transaction' ? 'switch to Income Input' : 'Switch to Transaction Input'}
          </button>

          {inputMode === 'transaction' ? (
            <div>
              <h3>Input Transaction</h3>
              <TransactionsList authState={authState} />
            </div>
          ) : (
            <div>
              <h3> Input Income</h3>
              <IncomeInput authState={authState}/>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
