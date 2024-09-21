import React, { useState } from "react";
import axios from "axios";
import './Homepage.css'; // Import the CSS file for styling

const Registration = ({ onRegister }) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async () => {
        try {
            const response = await axios.post("/api/register", { email, name });
            setMessage(response.data.message);
            onRegister();
        } catch (error) {
            console.error("Registration error:", error);
            setMessage("Registration failed. Please try again.");
        }
    };

    return (
        <div className="registration-container">
            <h2>Register</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="input-field"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-field"
            />
            <button onClick={handleRegister} className="register-button">Register</button>
            <p>{message}</p>
        </div>
    );
};

export default Registration;
