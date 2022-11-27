import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [resultData, setResultData] = useState([]);
    const [textError, setTextError] = useState("");
    const [successRegister, setSuccessRegister] = useState(null);
    const navigate = useNavigate();
  

    const handleSubmit = async (e) => {
        e.preventDefault();
        const registerFormData = new FormData();
        registerFormData.append("username", username)
        registerFormData.append("password", password)
    
        await axios({
            url: "http://localhost:1234/register",
            method: "POST",
            headers: {
                'Content-Type' : 'application/json' ,
            },
            mode: "cors",
            data: registerFormData ,
        })
            .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                setResultData(response.data);
                setSuccessRegister(true);
                localStorage.setItem('jwt', response.data.jwt);
                setTextError("");
                // navigate("/home");
            } 
            })
            .catch(function (error) {
            setSuccessRegister(false) ;
            setTextError("Echec de l'inscription");
            setResultData([]);
            });
    }

    return (
        <div className="auth-form-container">
            <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Full name</label>
            <input value={username} name="name" id="name" onChange={(e) => setUsername(e.target.value)} type="text" placeholder="full Name" />
            <label htmlFor="password">password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password" />
            <button type="submit">Log In</button>
        </form>
        <button className="link-btn">Already have an account ? <Link to="/connexion">Login here. </Link> </button>

        <h3> {textError} </h3>

    </div>
    )
}