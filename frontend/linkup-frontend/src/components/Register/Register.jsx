import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        country: '',
        gender: '',
        agree: false,
        password: ''
    });
            
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if any required field is empty
        if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.country || !formData.gender || !formData.agree) {
            setErrorMessage('Please fill out all the fields.');
            return;
        }
        try {
            await axios.post('http://localhost:5000/register', formData);
            setRegistrationSuccess(true); // Set registration success state
            navigate('/login?registrationSuccess=true'); // Pass success state to login component
        } catch (error) {
            console.error('Error registering user:', error);
            if (error.response && error.response.data === 'Email already registered') {
                setErrorMessage('Account already exists with this email');
            } else {
                setErrorMessage('Error registering user. Please try again.');
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <form onSubmit={handleSubmit}>
                    <h2 className="pb-4 fw-bold fs-1">Start your journey</h2>

                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" placeholder="Enter your name" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" placeholder="Enter your password" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number:</label>
                        <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="country">Country:</label>
                        <select id="country" name="country" onChange={handleChange}>
                            <option value="">Select your country</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="USA">USA</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Rest of the world">Rest of the world</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Gender:</label>
                        <select id="gender" name="gender" onChange={handleChange}>
                            <option value="">Select your gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <input type="checkbox" id="agree" name="agree" onChange={handleCheckboxChange} />
                        <label htmlFor="agree">By confirming, you agree with our Terms and conditions.</label>
                    </div>
                    {errorMessage && <p className="error-message text-center text-danger fw-bold fs-4">{errorMessage}</p>}
                    <button className="submit-btn btn btn-primary">Submit</button>
                </form>
                <p className="pt-4 text-center">Have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;
