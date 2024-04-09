import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const registrationSuccess = queryParams.get('registrationSuccess');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');



    //handling function for logging in
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post('http://localhost:5000/login', data);
            const { token, username } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            navigate('/home');
            window.location.reload();
        } catch (error) {
            console.error('Error logging in:', error);
            if (error.response && error.response.status === 401) {
                setErrorMessage('Invalid email or password. Please try again.');
            } else {
                setErrorMessage('Error logging in. Please try again.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-credential">
                <h2 className="text-center py-3 fw-bold fs-1">Login</h2>
                {registrationSuccess && (
                    <p className="registration-success-message text-center text-success fw-bold fs-4">
                        Account created successfully. Please login now.
                    </p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" placeholder="Enter your password" required />
                    </div>
                    {errorMessage && <p className="error-message text-center text-danger fw-bold fs-4">{errorMessage}</p>}
                    <button type="submit" className="fw-bold btn btn-outline-primary">Login</button>
                </form>
                <p className="pt-2">Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    );
};

export default Login;
