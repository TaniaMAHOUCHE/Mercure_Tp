import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AsyncStorage } from 'react-native';

export const Login = () => {

  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);
  const [result, setResult] = useState([]);
  const [errors, setErrors] = useState(null);
  const [successLogin , setSuccessLogin ] = useState(null);
  // const navigate = useNavigate();
  let navigation = useNavigation();
  const [textError, setTextError] = useState("") ;

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
    loginButton: {
      backgroundColor: 'grey',
      marginTop: 8,
      padding: 8,
      borderRadius: 8,
      width: 130,
      alignItems: "center"
    },
    loginText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    registerLink: {
      marginTop: 20,
      color: 'grey',
    },
    errorMessage: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
      marginTop: 16,
    },
  })

  useEffect(() => {

  }, [username, password]);

  
  const handleSubmit = async () => {

    const userData = new FormData();
    userData.append('username', username);
    userData.append('password', password);

    try {
      const response = await axios({
        method: 'POST',
        url: 'http://172.20.10.2:8956/login',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          username: username,
          password: password
        },
        mode: 'cors'
      });


      const data = response;

      if (response.status >= 200 && response.status <= 299) {
        alert("Vous êtes connecté !")
        // AsyncStorage.setItem('jwt', JSON.stringify(response.data.jwt));
        setErrors('');
        setSuccessLogin(true);
        setResult(data);
        setTextError('');
        navigation.navigate('Users');
      }
    
    } catch (error) {
      alert("Vous n'êtes pas connecté !");
      console.log("USER DATA",userData);
      console.error(error);
      console.log(error.response);
      setSuccessLogin(false);
      setTextError('Echec de la Connexion');
    }
  };



  return (
        
    <View style={styles.container}>
        <Text style={styles.title}>Se connecter</Text>
        <View>
            <Text label="username">Pseudo</Text>
            <TextInput style={styles.textInput} value={username} onChangeText={(value) => setUsername(value)} type="text" placeholder="pseudo" id="username" name="username" />
            <Text label="password">Mot de passe</Text>
            <TextInput style={styles.textInput} value={password} onChangeText={(value) => setPassword(value)} type="password" placeholder="Mot de passe" id="password" name="password" secureTextEntry={true}/>
            <TouchableOpacity type="submit" onPress={handleSubmit} style={styles.loginButton}>
              <Text style={styles.loginText}>Se connecter</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>S'inscrire ici</Text>
        </TouchableOpacity>

        <Text style={styles.errorMessage}> {textError} </Text>
    </View>
)
}

