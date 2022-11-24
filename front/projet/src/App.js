import React, { useState } from "react";
import { Link, Route,  Routes } from 'react-router-dom';
import './App.css';
import { Loginn } from "./Loginn";
import { Register } from "./Register";
import { Home } from "./Home";


function App() {
  const [currentForm, setCurrentForm] = useState('login');
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  return (
    // <div className="App">
    //   {
    //     currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm} />
    //   }
    // </div>
    <div className="App">
      <ul>
        <li><Link to="/connexion">Connexion</Link></li>
        <li><Link to="/inscription">Inscription</Link></li>
        <li><Link to="/home">Home</Link></li>
      </ul>

      <Routes>
          <Route index element={<Home/>}/>
          <Route path="home" element={<Home/>}/>
          <Route path="connexion" element={<Loginn/>}/>
          <Route path="inscription" element={<Register/>}/>
      </Routes>

    </div>
  );
}

export default App;


// // import './App.css';
// import Login from './Login';
// // import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

// function App() {
//   return (
//     // <Router>
//       <div className="container">
//           <Login />
//       </div>
//       // <p>hellooooaaaaaaaaabbbbccc</p>
//     // </Router>
//   );
// }

// export default App;