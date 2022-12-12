import React, { useEffect, useState } from 'react'
import axios from 'axios';
// import './Conversation.css';
import { useParams } from '@react-navigation/native';
// import { Sidebar } from '../../components/Sidebar/Sidebar';
import { View, TouchableOpacity, FlatList, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AsyncStorage } from 'react-native';
import { ConversationBox } from '../components/ConversationBox';

export const Conversation = (props) => {

    // const { Id } = useParams();
    const [successLogin , setsuccessLogin ] = useState(null);
    const [textError, setTextError] = useState("") ;
    const saved = AsyncStorage.getItem("jwt");
    const [results  , setResults] = useState([]);
    const [jwt , setJwt ] = useState("");

    
    const showDatas = async () => {

      
      try {
        const promise = new Promise((resolve, reject) => {
          resolve(saved);
        });
        promise.then((value) => {
          setJwt(value);
          console.log(value); // "JWT"
        });

        const response = await axios({
          method: "GET",
          url : "http://172.20.10.2:8956/user-list",
          credentials: "include",
          headers: {
              "Authorization" : `Bearer ${jwt}`,
          },
          mode: "cors",
    
        });

        console.log(response.data.users);
        setResults(response.data)
        if (response.status >= 200 && response.status <= 299) {
            setsuccessLogin(true) ;
            setTextError("") ;
            setResults(response.data);
          } 
        console.log("RESULTS", results);

        
      }

      catch(error) {
        console.error(error);
        setsuccessLogin(false) ;
        setTextError("Echec de la requête") ;
      };
    }

    useEffect(() => {
        showDatas();
        console.log("RESULTS", results);
    },[]);


  const renderListUser = () => {
      if (successLogin) {
        return (
          <View>
              <ConversationBox allUsers={results} />
          </View>
        ) 
      } else if (!successLogin){

        return <Text>{textError} </Text>

      } else {

        return <Text> Chargement en cours ...</Text>;

      }
    }

  return (

    <View id="chat-zone">
        {renderListUser ()}
    </View>
 
  )
}
