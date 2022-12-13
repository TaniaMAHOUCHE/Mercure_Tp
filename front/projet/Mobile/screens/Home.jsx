import axios from 'axios';
import React, { useEffect, useState, useContext, createContext } from 'react';
import { View, TouchableOpacity, FlatList, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AsyncStorage } from 'react-native';
import EventSource from 'react-native-event-source';
import queryString from 'query-string';
import UserContext from '../components/UserContext';

  
const Home = () => {
  
  const [user, setUser] = useContext(UserContext);
  const [successLogin , setsuccessLogin ] = useState(null);
  const [textError, setTextError] = useState("");
  const saved = AsyncStorage.getItem("jwt");
  const [results  , setResults] = useState([]);
  let navigation = useNavigation();

  const logOut = () => {
    AsyncStorage.removeItem('jwt');
    setUser(null);
  }


  const styles = StyleSheet.create({
    userList: {
      padding: 10,
    },
    userItem: {
      marginBottom: 10,
    },
    userName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    logoutButton: {
      backgroundColor: 'grey',
      marginTop: 8,
      marginLeft: 5,
      padding: 8,
      borderRadius: 8,
      width: 130,
      alignItems: "center"
    },
    logoutText: {
      fontSize: 16,
      color: '#FFFFFF',
    },
  });


  const showDatas = async () => {

    try {
      /** Met à jour le titre du document via l’API du navigateur */
      const response = await axios({
        method: "GET",
        url : "http://172.20.10.2:8956/user-list",
        credentials: "include",
        headers: {
            "Authorization" : `Bearer ${saved}`,
        },
        mode: "cors",
  
      });

      console.log("LIST USERS", response.data);
      
      if (response.status >= 200 && response.status <= 299) {
        setsuccessLogin(true);
        setTextError("");
        setResults(response.data);
      } 

    }

    catch( error) {
        setsuccessLogin(false) ;
        setTextError("Echec de la requête") ;
    };
  }

  useEffect(() => {

    showDatas();
    const query = queryString.parse('topic=https://example.com/my-private-topic');
    const queryString2 = queryString.stringify(query);
    const url = `http://172.20.10.2/.well-known/mercure?${queryString2}`;
    console.log(url);
    const eventSource = new EventSource(url, {withCredentials: true});
    console.log("EventSource", eventSource);
    eventSource.onmessage = ({event}) => {
        const results = JSON.parse(event.data);
        console.log("RESULTS", results);
    }
    
    return() => {
        eventSource.close();
    }
    },[]);



  const handleClick = (e) => {
    navigation.navigate(`/user/${e}`)
  }


  const renderListUser = () => {
    console.log("THERE", results.users);
    if (successLogin && results.users) {
      return (
        <View>
          <ScrollView style={styles.userList}>
            {results.users.map((user) => (
              <View key={user.id} style={styles.userItem}>
                <Text onPress={() => handleClick(user.id)} style={styles.userName}>{user.username}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      ) 
    } 
    // else if (results.users == "undefined") {
    //   <View>
    //     <Text>Veuillez vous connecter pour voir la liste des utilisateurs</Text>
    //   </View>
    // }
  }
  
  return (
  
    <View id="chat-zone">
        {renderListUser ()}
    </View>
  
  )
}

export default Home;