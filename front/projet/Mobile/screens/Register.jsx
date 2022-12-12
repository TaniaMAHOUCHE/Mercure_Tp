import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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
  

  const handleSubmit = async () => {
      
    const registerFormData = new FormData();
    registerFormData.append("username", username)
    registerFormData.append("password", password)

    try {
      const response = await axios({
          method: "POST",
          url: 'http://192.168.222.202:8956/register',
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

      <View>
          <Text>Register</Text>
        <View onSubmit={handleSubmit}>
            <Text label="name">Username</Text>
            <TextInput value={username} name="name" id="name" onChangeText={(value) => setUsername(value)} type="text" placeholder="Username" />
            <Text label="password">password</Text>
            <TextInput value={password} onChangeText={(value) => setPassword(value)} type="password" placeholder="********" id="password" name="password" />
            <TouchableOpacity type="submit" onPress={handleSubmit}>
              <Text>Sign up</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text>Already have an account ?</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: 'bold' }}> {textError} </Text>

    </View>
    )
}
