import React, { useEffect, useState } from 'react'
import axios from 'axios';

export const Home = () => {

    const [result, setResult] = useState([]);
    const [errors, setErrors] = useState(null);
    const [successLogin , setsuccessLogin ] = useState(null);
    const [textError, setTextError] = useState("") ;
    const saved = localStorage.getItem("jwt");
    const initialValue = JSON.parse(saved);

    const seeDatas = async () =>  {

        await axios("http://localhost:1234/user-list", {
            method: "GET",
            credentials: "include",
            headers: {
                "Authorization" : `Bearer ${initialValue}`,
            },
            mode: "cors",
    
        })
        .then( (response) => {
            if (response.status >= 200 && response.status <= 299) {
            setErrors("");
            setsuccessLogin(true) ;
            setResult(response.data);
            setTextError("") ;
            } 
        })
        .catch( (error) => {
            setsuccessLogin(false) ;
            setTextError("Echec de la requête") ;
        });
        
    }


    useEffect(() => {
        // Met à jour le titre du document via l’API du navigateur
        seeDatas();
      },[]);


  return (
    <div>
        { console.log( result )}

    

    </div>
  )
}
