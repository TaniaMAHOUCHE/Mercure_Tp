import React, { useState } from 'react';
import { useParams } from "react-router-native";
// import "./ConversationBox.css"
import { View, TouchableOpacity, TextInput, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const ConversationBox = ({allUsers}) => {

console.log("HERE", allUsers);

const { Id } = useParams();
/** variable qui indique le texte encours d'écriture  */
const [currentValue, setCurrentValue] = useState('');
/** variable qui stock l'id et le texte du message envoyé à l'instant */
const [conversation , setConversation] = useState(null);
/** Variable qui récupère la liste de tous les messages envoyés */
const [tabListsOfConversation , setTabListsOfConversation] = useState([]);

const styles = StyleSheet.create({
  conversationZoneContainer : {
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",  
    backgroundColor:"red"
  },
  headerConversation : {
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",  
  },
  title : {
    margin: 0,
    textAlign: "center",
    color:"black,"
  }

})

console.log(Id);

const titleName = allUsers.users.map((user) => {
  let userName ;
  if( user.id === Id) {
    userName = user.username ;
  }
  console.log(user);
  return userName ;
}) ;
console.log(titleName);

  const handleClick = () => {
    setConversation({
      'userID': Id,
      "userText": currentValue
    });
    if(conversation !== null && conversation !== "" ){
      setTabListsOfConversation(tabListsOfConversation => tabListsOfConversation.concat(conversation))
    }
    setCurrentValue('') ;
    console.log("ID",Id);
  }

  return (
    <View style={styles.conversationZoneContainer}>
      <View>
         <View style={styles.headerConversation}>
            <Text style={styles.title}>{titleName}</Text>
         </View>
         <View>

         </View>
         <View>
            <View>
                  <TextInput id="chat-input" placeholder="..."  value={currentValue}  onChangeText={(value) => setCurrentValue(value)} ></TextInput>
            </View>
            <View>
                  <TouchableOpacity id="send-chat" onPress={handleClick} ></TouchableOpacity>
            </View>
            <Text>Hiya</Text>
         </View>
      </View> 
    </View>
  )
};

