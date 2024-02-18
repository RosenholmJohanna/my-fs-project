import React, { useState } from 'react';
import { useDispatch, useSelector} from 'react-redux' //batch deprecated, enabled in reactDom 18
import user from '../../reducers/userReduser';

const BASE_URL = "http://localhost:8080";
const LOGIN_URL = (slug) => `${BASE_URL}/${slug}`;


const Login = () => {
  const accessToken = useSelector((store) => store.user.accessToken);
 // const userId = useSelector((store) => store.user.id) 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const dispatch = useDispatch();
  

  const onFormSubmit =(event) => {
    event.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify({username: username, password: password})
    }
     fetch(LOGIN_URL(mode), options) // --> URL
      .then(response => response.json())
      .then(data => {
        if(data.success) { 
            dispatch(user.actions.setUsername(data.response.username)); 
            dispatch(user.actions.setId(data.response.id))
            dispatch(user.actions.setAccessToken(data.response.accessToken));
            dispatch(user.actions.setSavedQuestion(data.response.motivation));
            dispatch(user.actions.setError(null));
          
        } else {
            dispatch(user.actions.setUsername(null)); 
            dispatch(user.actions.setId(null))
            dispatch(user.actions.setAccessToken(null));
            dispatch(user.actions.setError(data.response));
          
          }
      })
    }

  return (
    <>
     <form onSubmit={onFormSubmit} onChange={()=>setMode("login")}>
        <label htmlFor="username">Username</label>
         <input 
          placeholder="username"
          required=""
          type="username" 
          id="username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} />
          <label htmlFor="Password">Password</label>
          
         <input
          placeholder="password"
          required=""
          type="password" 
          id="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} />
          <label htmlFor="login"></label>
           <button>Submit</button> 
        </form>
    </>
    );
}

export default Login