import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Conversation.css';
import { useParams } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { ConversationBox } from '../../components/ConversationBox/ConversationBox';

export const Conversation = () => {

    const { Id } = useParams();
    const [successLogin , setsuccessLogin ] = useState(null);
    const [textError, setTextError] = useState("") ;
    const saved = localStorage.getItem("jwt");
    const initialValue = JSON.parse(saved);
    const [results  , setResults] = useState(null);

    const showDatas = async () => {

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
              eventSource.onmessage = event => {
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

    useEffect(() => {
        showDatas();
    },[]);


  const renderListUser = () => {
      if (successLogin) {
        return (
          <>
              <section id="sidebar"> <Sidebar style={{ textDecoration: 'none'}} allUsers={results} /> </section>
              <section id="conversation"> <ConversationBox allUsers={results} /> </section>
          </>
        ) 
      } else if (!successLogin){

        return <h5>{textError} </h5>

      } else {

        return <button> Chargement en cours ...</button>;

      }
    }

  return (

    <div id="chat-zone" style={{ textDecoration: 'none'}}>
        {renderListUser ()}
    </div>
 
  )
}
