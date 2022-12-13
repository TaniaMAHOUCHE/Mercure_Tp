import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import "./ConversationBox.css"
import axios from 'axios';


export const ConversationBox = ({allUsers}) => {

const {Id } = useParams() ;
/** variable qui stock l'id et le texte du message envoyé à l'instant */
const [conversation, setConversation] = useState({ topic: Id, message: "" });
/** Variable qui récupère la liste de tous les messages envoyés */
const [tabListsOfConversation , setTabListsOfConversation] = useState([]);
const [dataMercure, setDataMercure] = useState({ user: "", message: ""});


const saved = localStorage.getItem("jwt");
const initialValue = JSON.parse(saved);


const clean = () => {

  handleInputChange('', 'message')

}


const titleName = allUsers.users.map((user) => {
  let userName ;
  if( String(user.id) === Id) {
    userName = user.username ;
  }
  return userName ;
});


useEffect(() => {

  const url = new URL('http://localhost:9090/.well-known/mercure');
  url.searchParams.append('topic', 'https://example.com/my-private-topic/{id}');
  const eventSource = new EventSource(url, {withCredentials: true});


  eventSource.onmessage = (event) => {
      const result = JSON.parse(event.data) ;
      setDataMercure({
        user: result.desti,
        message: result.data
      });
  }

  return() => {
    eventSource.close();
  } 
})

  const handleSubmit = async (e) => {
    e.preventDefault() ;   
    await axios(`http://localhost:8956/publish-post/${Id}`, {
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
          "Authorization" : `Bearer ${initialValue}`,
      },
      mode: "cors",
      data:conversation
  
    })

    if(conversation.message !== null && conversation.message !== "" ){
      setTabListsOfConversation(tabListsOfConversation => tabListsOfConversation.concat(conversation.message))
    }

    setConversation({
      ...conversation,
      message: ''
    });
  }

  const handleInputChange = (e, prop) => {
    setConversation({
      ...conversation,
      [prop]: e.target.value
    });
  };

const addMessage = () => {
  const titleName = tabListsOfConversation.map((txt , index ) => {
    return( 
      <div key={index}className="messages">
            <p>{txt}</p>
      </div>
    );
 
  });

  return titleName ;
}
  

  return (
    <div className='conversation-zone-container'>
      <div>
         <div className='header-conversation'>
            <h3>{titleName}</h3>
         </div>

         <div className='main-area-conversation'>

         {addMessage()}
         </div>
         
         <div>
            <form onSubmit={handleSubmit} className='send-text-area' >
                <div className='chat-input-zone'>
                      <textarea 
                        id="chat-input" 
                        placeholder="..."  
                        value={conversation.message} 
                        onChange={(e) => handleInputChange(e, 'message')} >
                      </textarea>
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

