import React, { useState } from 'react';
import './App.css';
import TransactionsList from './components/TransactionsList';
import IncomeInput from './components/Incomes';
import AuthForm from './components/AuthForm';

function App() {
  const [authState, setIsAuthenticated] = useState({
    isAuthenticated: false,
    username: '',
  });

  // Update this function to set the authentication state
  const handleLogin = ({isAuthenticated, username }) => {
    setIsAuthenticated({
      isAuthenticated:isAuthenticated,
      username: username,}); // Set the authentication status
  };

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
          <IncomeInput authState={authState}/>
          <TransactionsList />
        </div>
      )}
    </div>
  );
}

export default App;
