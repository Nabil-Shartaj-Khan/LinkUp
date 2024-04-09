import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Create.css";

const Create = () => {
    const [status, setStatus] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setErrorMessage("");
    };

    const handlePost = () => {
        if (status.trim() === "") {
            setErrorMessage("You can't post an empty status.");
        } else {
            console.log("Posted status:", status);
            navigate("/home");
        }
    };

    return (
        <div className="status-container">
            <h3 className="text-white ms-4 mt-3 fw-bold fs-1">Pray, <span className="text-info"> what sentiments</span> do you harbor?</h3>
            <textarea
                className={`status-input ${errorMessage ? 'error' : ''}`}
                placeholder="Type your status here..."
                value={status}
                onChange={handleStatusChange}
            />
            <p className="text-danger fs-3 mb-5">{errorMessage}</p>
            <button className="post-button" onClick={handlePost}>Post</button>
        </div>
    );
}

export default Create;
