import React, { useState } from "react";
import axios from "axios";
import './Homepage.css'; // Import the CSS file for styling

const Registration = ({ onRegister }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async () => {
        // Check if the name is "root" and email matches the expected format
        if (name !== "root" || email !== `${name}root@gmail.com`) {
            setMessage("Name must be 'root' and email must be in the format: name + 'root@gmail.com'");
            return;
        }

        try {
            const response = await axios.post("/api/register", { email, username: name });
            setMessage(response.data.message);
            onRegister(); // Notify the homepage about the successful registration
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
                placeholder="Enter your name (must be 'root')"
                className="input-field"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (must be 'name + root@gmail.com')"
                className="input-field"
            />
            <button onClick={handleRegister} className="register-button">Register</button>
            <p>{message}</p>
            <p className="input-description">
                Please enter your name as "root" and your email as "nameroot@gmail.com".
            </p>
        </div>
    );
};

export default Registration;
