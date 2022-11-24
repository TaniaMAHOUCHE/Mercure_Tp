import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';


export const Loginn = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(email);
    // }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email);
        const formData = new FormData();
        formData.append("email", email)
        formData.append("pass", pass)
      
           await axios({
              url: "http://localhost:1234/user/login",
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
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="email..." id="email" name="email" />
                <label htmlFor="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="password..." id="password" name="password" />
                <button type="submit">Log In</button>
            </form>
            {/* <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button> */}
            <button className="link-btn">Don't have an account?<Link to="/inscription">Register here.</Link> </button>
        </div>
    )
}


