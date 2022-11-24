import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';


export const Loginn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(username);
    // }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(username);
        const formData = new FormData();
        formData.append("username", username)
        formData.append("password", password)
      
           await axios({
              url: "http://localhost:1234/login",
              method: "POST",
              headers: {
                  'Content-Type' : 'application/json' ,
              },
              mode: "cors",
              data: formData ,
          })
            .then((response) => {
              if (response.status >= 200 && response.status <= 299) {
                const dataFromAPI = response.data;
                console.log(dataFromAPI);
                // setResultData(dataFromAPI);
                // setSuccessRegister(true);
                // setTextError("");
                // navigate("/home");
              } 
            })
            .catch(error=>{
                console.log("error");
            //   setSuccessRegister(false) ;
            //   setTextError("Echec de l'inscription");
            //   setResultData([]);
            });
      }

    return (
        
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)}type="text" placeholder="username..." id="username" name="username" />
                <label htmlFor="password">password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password..." id="password" name="password" />
                <button type="submit">Log In</button>
            </form>
            {/* <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button> */}
            <button className="link-btn">Don't have an account?<Link to="/inscription">Register here.</Link> </button>
        </div>
    )
}


