import React  from "react";
import {  Route,  Routes } from 'react-router-dom';
import './App.css';
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { Home } from "./pages/Home/Home";


function App() {

  return (
    <div className="App">
      {/* <ul>
        <li><Link to="/connexion">Connexion</Link></li>
        <li><Link to="/inscription">Inscription</Link></li>
        <li><Link to="/home">Home</Link></li>
      </ul> */}

      <Routes>
          <Route index element={< Login/>}/>
          <Route path="connexion" element={<Login/>}/>
          <Route path="inscription" element={<Register/>}/>
          <Route path="home" element={<Home/>}/>
      </Routes>

    </div>
  );
}

export default App;


