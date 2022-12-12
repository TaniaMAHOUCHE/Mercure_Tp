import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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
        navigation.navigate('Home');
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
        
    <View style={{backgroundColor: "#7439db"}}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Login</Text>
        <View>
            <Text label="username">username</Text>
            <TextInput value={username} onChangeText={(value) => setUsername(value)} type="text" placeholder="Username" id="username" name="username" />
            <Text label="password">password</Text>
            <TextInput value={password} onChangeText={(value) => setPassword(value)} type="password" placeholder="Mot de passe" id="password" name="password" />
            <TouchableOpacity type="submit" onPress={handleSubmit} >
              <Text>Log In</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text>Register here</Text>
        </TouchableOpacity>

        <Text  style={{ fontSize: 16, fontWeight: 'bold' }}> {textError} </Text>
    </View>
)
}

