import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import "./ConversationBox.css"
export const ConversationBox = ({allUsers}) => {

const {Id } = useParams() ;
/** variable qui indique le texte encours d'écriture  */
const [currentValue, setCurrentValue] = useState('');
/** variable qui stock l'id et le texte du message envoyé à l'instant */
const [conversation , setConversation] = useState(null);
/** Variable qui récupère la liste de tous les messages envoyés */
const [tabListsOfConversation , setTabListsOfConversation] = useState([]);

const titleName = allUsers.users.map((user) => {
  let userName ;
  if( String(user.id) === Id) {
    userName = user.username ;
  }
  return userName ;
}) ;

  const handleClick = () => {
    setConversation({
      'userID': Id,
      "userText": currentValue
    });
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
         <div className='send-text-area'>
            <div className='chat-input-zone'>
                  <textarea id="chat-input" placeholder="..."  value={currentValue}  onChange={e => setCurrentValue(e.target.value)} ></textarea>
            </div>
            <div className="btn-send" >
                  <button id="send-chat" onClick={handleClick} ></button>
            </div>
         </div>
      </div> 
    </div>
  )
};

