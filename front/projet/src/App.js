import React, { useEffect, useMemo, useState }  from "react";
import { Routes,Route } from 'react-router-dom';import './App.css';
import { Conversation } from "./pages/Conversation/Conversation";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { UserContext } from "./Context/UserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {

  const [user, setUser] = useState('');

  // variable qui va être utiliser pour alimenter le Context
  const valueUser = useMemo(() => ({ user, setUser }), [user]);

  return (
    <div className="App">
      <main >

        <div className="app-flex">
        <UserContext.Provider value={valueUser}>
            <Routes>
                <Route index path="/" element={<Login/>}/>
                <Route path="inscription" element={<Register/>}/>
                <Route element={<ProtectedRoute user={user} />}>
                  <Route path="home" element={<Home/>} />
                  <Route path="/user/:Id" element={< Conversation/>}/>
                </Route>
            </Routes>
        </UserContext.Provider>

        </div>
      </main >
    </div>
  );
}

export default App;


