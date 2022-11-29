import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Sidebar.css' ;

export const Sidebar = ({allUsers}) => {

  let navigate = useNavigate();
  const handleClick = (e) => {
    navigate(`/user/${e}`) ;
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
    </>
  )
}

