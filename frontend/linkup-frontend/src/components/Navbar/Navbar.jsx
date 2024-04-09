import React from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css"

const Navbar = () => {
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (confirmed) {
            localStorage.removeItem('token');
            window.location.reload();
            navigate("/")
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">LinkUp</Link>
            </div>
            <div className="navbar-right">
                <ul className="navbar-links">
                    {token ? (
                        <li><Link to="/home">Home</Link></li>
                    ) : (
                        <li><Link to="/">Home</Link></li>
                    )}
                    <li>
                        {token ? (
                            <Link to="/" onClick={handleLogout}>Logout</Link>
                        ) : (
                            <Link to="/login">Login/Register</Link>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
