import axios from 'axios';


let URL = 'http://localhost:8956';

const useHttpGet = async (endpoint,headers, datas) => {
   return await axios(`${URL}/${endpoint}`, {
        method: "GET",
        credentials: "include",
        withCredentials: true,
        mode: "cors",
        headers:headers,
        data: datas ? JSON.stringify(datas) : null,
    })
    .then(response =>{
        if (response.status >= 200 && response.status <= 299) {
            return response.data ;
        }
    })
};
  


const httpPost = async ( endpoint, datas) => {
    return await axios(`${URL}${endpoint}`,{
        method: "POST",
        credentials: "include",
        withCredentials: true,
        mode: "cors",
        headers: {
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        data: datas
    })
    .then(response =>{
        if (response.status >= 200 && response.status <= 299) {
            return response ;
        }
    })
};

  
export  { useHttpGet, httpPost};
  