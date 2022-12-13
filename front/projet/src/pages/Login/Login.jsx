import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useEffect } from 'react';
import { httpPost } from '../../Service/Auth';
import { UserContext } from '../../Context/UserContext';


export const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState([]);
  const [errors, setErrors] = useState(null);
  const [successLogin , setsuccessLogin ] = useState(null);
  const navigate = useNavigate();
  const [textError, setTextError] = useState("") ;
  // const [cookies, setCookie, removeCookie] = useCookies(["mercureAuthorization"]);


  const { user, setUser } = useContext(UserContext);

  const cleanDataFromAPI = (element) => {
    if( element && element !== undefined && element !== null ) {
      return element ;
    }
  }

const handleSubmit = (e) => {
  e.preventDefault()
  const userData = new FormData() ;
  userData.append('username',username);
  userData.append('password',password);

  httpPost('/login',userData)
    .then(response => {
        setErrors("");
        setsuccessLogin(true) ;
        setTextError("") ;
        localStorage.setItem('jwt', JSON.stringify(response.data.jwt));
        setUser(cleanDataFromAPI(response.data.username));
        navigate("/home");
      }
    )
    .catch(function (error) {
      setsuccessLogin(false) ;
      setTextError("Echec de la Connexion");
      }
  );
}

  return (
        
    <div className="auth-form-container">
      <h2>Connexion</h2>
      <form className="login-form auth" onSubmit={handleSubmit}>
          <input value={username} onChange={(e) => setUsername(e.target.value)}type="text" placeholder="Pseudo" id="username" name="name" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mot de passe" id="password" name="password" />
          <button style={{ backgroundColor: '#4682B4', color: 'white', fontWeight: 'bold'}} type="submit">Se connecter</button>
      </form>
      <p className="link-btn">Vous n'avez pas encore de compte ? <Link style={{ textDecoration: 'none', color: '#4682B4', fontWeight: 'bold'}} to="/inscription"> S'inscrire</Link> </p>

      <h3> {textError} </h3>
    </div>
)
}

