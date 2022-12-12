import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { httpPost } from "../../Service/Auth";

export const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [textError, setTextError] = useState("");
    const [successRegister, setSuccessRegister] = useState(null);
    const navigate = useNavigate();
  
    const { setUser } = useContext(UserContext);

    const cleanDataFromAPI = (element) => {
        if( element && element !== undefined && element !== null ) {
          return element ;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const registerFormData = new FormData();
        registerFormData.append("username", username)
        registerFormData.append("password", password)
    
        httpPost('/register',registerFormData)
            .then(response => {
                setTextError("");
                setSuccessRegister(true);
                localStorage.setItem('jwt', JSON.stringify(response.data.jwt));
                setUser(cleanDataFromAPI(response.data.username));
                navigate("/home");
            })
            .catch(function (error) {
                setSuccessRegister(false) ;
                setTextError("Echec de l'inscription");
                }
            );
    
    }

    return (
        <div className="auth-form-container">
            <h2>Inscription</h2>
            <form className="register-form auth" onSubmit={handleSubmit}>
                {/* <label htmlFor="name">Nom :</label> */}
                <input value={username} name="name" id="name" onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Pseudo" />
                {/* <label htmlFor="password">Mot de passe : </label> */}
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Mot de passe" id="password" name="password" />
                <button style={{ backgroundColor: '#4682B4', color: 'white', fontWeight: 'bold'}} type="submit">S'inscrire </button>
            </form>
            <p className="link-btn">Vous avez déjà un compte ?  <Link style={{ textDecoration: 'none', color: '#4682B4', fontWeight: 'bold'}} to="/"> Se connecter </Link> </p>
            <h3> {textError} </h3>
        </div>
    )
}