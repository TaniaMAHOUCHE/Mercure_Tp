import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import "./ConversationBox.css";
import axios from 'axios';
import { useEffect } from 'react';

export const ConversationBox = ({allUsers}) => {

const {Id } = useParams() ;
/** variable qui indique le texte encours d'écriture  */
const [currentValue, setCurrentValue] = useState('');
/** variable qui stock l'id et le texte du message envoyé à l'instant */
const [conversation , setConversation] = useState(null);
/** Variable qui récupère la liste de tous les messages envoyés */
const [tabListsOfConversation , setTabListsOfConversation] = useState([]);

const saved = localStorage.getItem("jwt");
const initialValue = JSON.parse(saved);


const titleName = allUsers.users.map((user) => {
  let userName ;
  if( String(user.id) === Id) {
    userName = user.username ;
  }
  return userName ;
}) ;


useEffect(() => {

  const url = new URL('http://localhost:9090/.well-known/mercure');
  url.searchParams.append('topic', 'https://example.com/my-private-topic');
  const eventSource = new EventSource(url, {withCredentials: true});


  eventSource.onmessage = (event) => {
      console.log('Donne mercure : ' , JSON.parse(event.data))
  }

})

  const handleSubmit = async (e) => {
    e.preventDefault() ;   
    setConversation({
      'userID': Id,
      "userText": currentValue
    });

    await axios(`http://localhost:8956/message/${Id}`, {
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
          "Authorization" : `Bearer ${initialValue}`,
      },
      mode: "cors",
  
    })
    // .then( (response) => {
    //         if (response.status >= 200 && response.status <= 299) {

    //         } 
    // }) 
    // .catch( (error) => {
    // });


    if(conversation !== null && conversation !== "" ){
      setTabListsOfConversation(tabListsOfConversation => tabListsOfConversation.concat(conversation))
    }
    setCurrentValue('') ;
  }

  return (
    <div className='conversation-zone-container'>
      <div>
         <div className='header-conversation'>
            <h3>{titleName}</h3>
         </div>

         <div className='main-area-conversation'>
         </div>
         
         <div>
            <form onSubmit={handleSubmit} className='send-text-area' >
                <div className='chat-input-zone'>
                      <textarea id="chat-input" placeholder="..."  value={currentValue}  onChange={e => setCurrentValue(e.target.value)} ></textarea>
                </div>

                <div className="btn-send" >
                      <button id="send-chat" ></button>
                </div>
            </form>
         </div>
      </div> 
    </div>
  )
};

