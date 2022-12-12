import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AsyncStorage } from 'react-native';

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resultData, setResultData] = useState([]);
  const [textError, setTextError] = useState("");
  const [successRegister, setSuccessRegister] = useState(null);
  let navigation = useNavigation();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "silver",
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
      marginBottom: 16,
    },
    textInput: {
      backgroundColor: '#fff',
      padding: 8,
      marginBottom: 15,
      marginTop: 10,
      borderRadius: 10
    },
    signinButton: {
      backgroundColor: 'grey',
      marginTop: 8,
      padding: 8,
      borderRadius: 8,
      width: 130,
      alignItems: "center"
    },
    signinText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    loginLink: {
      marginTop: 20,
      color: 'grey',
    },
    errorMessage: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
      marginTop: 16,
    },
  });

  const handleSubmit = async () => {
      
    const registerFormData = new FormData();
    registerFormData.append("username", username);
    registerFormData.append("password", password);


    try {
      const response = await axios({
          method: "POST",
          url: 'http://172.20.10.2:8956/register',
          credentials: "include",
          headers: {
              'Content-Type' : 'application/json' ,
          },
          mode: "cors",
          data: {
            username: username,
            password: password
          },
      });

      const data = response;

        if (response.status >= 200 && response.status <= 299) {
          alert("Vous êtes inscrit(e) !");
          setTextError("");
          setSuccessRegister(true);
          setResultData(data);
          // AsyncStorage.setItem('jwt', JSON.stringify(response.data.jwt));
          navigation.navigate('Home');
        } 
        } catch(error) {
            alert("Vous n'êtes pas inscrit(e) !");
            setSuccessRegister(false) ;
            setTextError("Echec de l'inscription");
        };

    }
  

    return (

      <View style={styles.container}>
          <Text style={styles.title}>S'inscrire</Text>
        <View>
            <Text label="name">Pseudo</Text>
            <TextInput style={styles.textInput} value={username} name="name" id="name" onChangeText={(value) => setUsername(value)} type="text" placeholder="Pseudo" />
            <Text label="password">Mot de passe</Text>
            <TextInput style={styles.textInput} value={password} onChangeText={(value) => setPassword(value)} type="password" placeholder="mot de passe" id="password" name="password" secureTextEntry={true}/>
            <TouchableOpacity type="submit" onPress={handleSubmit} style={styles.signinButton}>
              <Text style={styles.signinText}>S'inscrire</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Vous avez déjà un compte ? Connectez-vous ici</Text>
        </TouchableOpacity>

        <Text style={styles.errorMessage}> {textError} </Text>

    </View>
    )
}
