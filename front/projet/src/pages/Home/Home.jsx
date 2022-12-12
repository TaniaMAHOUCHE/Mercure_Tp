import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export const Home = () => {


  const [successLogin , setsuccessLogin ] = useState(null);
  const [textError, setTextError] = useState("") ;
  const saved = localStorage.getItem("jwt");
  const initialValue = JSON.parse(saved);
  const [results  , setResults] = useState(null);
  let navigate = useNavigate();




  useEffect(() => {

    const showDatas = async () => {

      /** Met à jour le titre du document via l’API du navigateur */
     await axios("http://localhost:8956/user-list", {
        method: "GET",
        credentials: "include",
        withCredentials: true,
        headers: {
            "Authorization" : `Bearer ${initialValue}`,
        },
        mode: "cors",

    })
    .then( (response) => {
        if (response.status >= 200 && response.status <= 299) {
            setsuccessLogin(true) ;
            setTextError("") ;
            setResults(response.data) ;

            const url = new URL('http://localhost:9090/.well-known/mercure');
            url.searchParams.append('topic', 'https://example.com/my-private-topic');
            
            const eventSource = new EventSource(url, {withCredentials: true});
            eventSource.onmessage = ({event}) => {
                const results = JSON.parse(event.data);
            }
    
          return() => {
              eventSource.close();
          }
        } 
    }) 
    .catch( (error) => {
        setsuccessLogin(false) ;
        setTextError("Echec de la requête") ;
    });
}
    showDatas();

  },[]);



  const handleClick = (e) => {
    navigate(`/user/${e}`)
  }


  const renderListUser = () => {
      if (successLogin) {
        return (
          <>
            <ul className="username-only">
              {results.users.map((user ,index) => (
                <li key={user.id}  onClick={() => handleClick(user.id)} >
                  <p> <Link to={`${user.id}`} > {user.username}{" "}</Link> </p>
                </li>
              ))}
            </ul>
          </>
        ) 
      }
    }

return (

  <div id="chat-zone">
      {renderListUser ()}
  </div>

)

}