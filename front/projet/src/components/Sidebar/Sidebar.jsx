import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css' ;
import { UserContext } from '../../Context/UserContext';


export const Sidebar = ({allUsers}) => {
  const { user, setUser } = useContext(UserContext);

  let navigate = useNavigate();
  const handleClick = (e) => {
    navigate(`/user/${e}`) ;
  }

  const logout = () => {
      localStorage.removeItem('jwt');
      setUser("");
  }

  return (
    <>
    <div id="search-component">
        {/* <input id="search-name" type="search" name="search" ></input> */}
    </div>
    <div className="userlist-container">
        <ul className="username-only">
          {allUsers.users.map((user, id) => (
              <li key={id} onClick={() => handleClick(user.id)} >
                <p>{user.username}</p>
              </li>
          ))}
        </ul>
    </div>
    <button id="logout" onClick={logout}> Déconnexion </button>
    </>
  )
}

