import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


export const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState([]);
  const [errors, setErrors] = useState(null);
  const [successLogin , setsuccessLogin ] = useState(null);
  const navigate = useNavigate();
  const [textError, setTextError] = useState("") ;


  


  const handleSubmit = async (e) => {
    e.preventDefault()

    const userData = new FormData() ;
    userData.append('username',username);
    userData.append('password',password);
    await axios("http://localhost:8956/login", {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type' : 'application/json' ,
        },
        mode: "cors",
        data: userData,

    })
    .then( (response) => {
        if (response.status >= 200 && response.status <= 299) {
        setErrors("");
        setsuccessLogin(true) ;
        setResult(response.data);
        // Pour mettre mon Token dans mon local storage.
        localStorage.setItem('jwt', JSON.stringify(response.data.jwt));
        setTextError("") ;
        navigate("/home");
        } 
    })
    .catch( (error) => {
      setsuccessLogin(false) ;
      setTextError("Echec de la Connexion") ;
    });


};



  return (
        
    <div className="auth-form-container">
        <h2>Login</h2>
        <form className="login-form auth" onSubmit={handleSubmit}>
            <label htmlFor="username">username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)}type="text" placeholder="username..." id="username" name="username" />
            <label htmlFor="password">password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password..." id="password" name="password" />
            <button type="submit">Log In</button>
        </form>
        <p className="link-btn">Don't have an account ? <Link to="/inscription"> Register here.</Link> </p>

        <h3> {textError} </h3>
    </div>
)
}

