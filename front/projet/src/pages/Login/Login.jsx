import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useEffect } from 'react';
import { httpPost } from '../../Service/Auth';
// import { UserContext } from '../../App';
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

        console.log(response.data)
        localStorage.setItem('jwt', JSON.stringify(response.data.jwt));


        const url = new URL('http://localhost:9090/.well-known/mercure');
        url.searchParams.append('topic', 'https://example.com/my-private-topic');
        const eventSource = new EventSource(url, {withCredentials: true});
        eventSource.onmessage = ({event}) => {
            const results = JSON.parse(event.data);
        }

        // if (cleanDataFromAPI( response.data.mercure) ) {
        //   let fromAPI =  cleanDataFromAPI( response.data.mercure)  ;
        //   let cleanUPcookie = fromAPI.replace('mercureAuthorization=', '') ;
        //   setCookie("mercureAuthorization", cleanUPcookie , {
        //     path: "/"
        //   });
        // }
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
        <h2>Login</h2>
        <form className="login-form auth" onSubmit={handleSubmit}>
            <label htmlFor="username">Nom utilisateur : </label>
            <input value={username} onChange={(e) => setUsername(e.target.value)}type="text" placeholder="Nom utilisateur" id="username" name="username" />
            <label htmlFor="password">Mot de passe : </label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="mot de passe" id="password" name="password" />
            <button type="submit">Se connecter</button>
        </form>
        <p className="link-btn">Vous n'avez pas encore de compte ? <Link to="/inscription"> S'inscrire</Link> </p>

        <h3> {textError} </h3>
    </div>
)
}

