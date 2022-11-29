import React  from "react";
import {  Link, Route,  Routes } from 'react-router-dom';
import './App.css';
import { Conversation } from "./pages/Conversation/Conversation";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";


function App() {

  return (
    <div className="App">
      <nav>
          <ul className="router-element">
              <li> <Link to="/home">Home</Link></li>
              <li> <Link to="/connexion">Connexion</Link> </li> 
              <li> <Link to="/inscription">Inscription</Link></li> 
              <li> <Link to="/deconnexion">Désinscription</Link></li> 
          </ul>
      </nav>
      <main >

        <div className="app-flex">
          <Routes>
              <Route index element={< Login/>}/>
              <Route path="connexion" element={<Login/>}/>
              <Route path="inscription" element={<Register/>}/>
              <Route path="home" element={<Home/>} />
              <Route path="/user/:Id" element={< Conversation/>}/>
          </Routes>
        </div>
        
      </main >

    </div>
  );
}

export default App;


