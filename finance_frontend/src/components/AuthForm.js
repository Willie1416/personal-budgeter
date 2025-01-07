// src/components/AuthForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';  // Create a separate CSS file for styling

const AuthForm = ({ setAuthTokens }) => {
    const [isLogin, setIsLogin] = useState(true);  // Toggle between login and register
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError(null);  // Reset error message when toggling
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Confirms user enter correct password when creating an account
        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            if (isLogin) {
                // Login request
                const response = await axios.post('http://localhost:8000/login/', {
                    username: username,
                    password: password
                },{
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                 
                const token = response.data.access; // Assuming JWT token is in `access`
                console.log("AuthForm:", token);

                // Save the token to local storage or state (for subsequent requests)
                localStorage.setItem('authToken', token);
                setAuthTokens({ isAuthenticated: true, username: username, token: token });
            } else {
                await axios.post('http://localhost:8000/register/', {
                    username: username,
                    password: password
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                alert("User registered successfully! You can now log in.");
                setIsLogin(true);  // Switch to login after successful registration
            }
        } catch (err) {
            setError('Error, please check your credentials or try again.');
        }
    };

    return (
        <div className="auth-form-container">
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {!isLogin && (
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                )}
                <button type="submit" className="btn-primary">
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>

            <button className="toggle-btn" onClick={toggleForm}>
                {isLogin ? 'Don’t have an account? Register' : 'Already have an account? Login'}
            </button>
        </div>
    );
};

export default AuthForm;
