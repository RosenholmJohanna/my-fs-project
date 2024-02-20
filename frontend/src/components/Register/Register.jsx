import React, { useState } from 'react';
import { useDispatch, useSelector} from 'react-redux' //batch deprecated, enabled in reactDom 18
import user from '../../reducers/userReduser';


const BASE_URL = "http://localhost:8080";
const REGISTER_URL = (slug) => `${BASE_URL}/${slug}`;

const Register = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((store) => store.user.accessToken);
  //const username = useSelector((store) => store.user.username);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("register"); 

  const onFormSubmit =(event) => {
    event.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify({username: username, password: password})
    }
    fetch(REGISTER_URL(mode), options) 
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
    <p>Register</p>
          <form onSubmit={onFormSubmit}  onChange={()=>setMode("register")}>
            <label htmlFor="username">Username</label>
              <input 
                required
                type="text" 
                id="username" 
                value={username} 
                onChange={e => setUsername(e.target.value)}/>
                <label htmlFor="Password">Password</label>

              <input
                required 
                type="password" 
                id="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}/>
                <p>Choose a minimum of 3 characters</p>
                <label htmlFor="register"></label>
                <button type="submit">Submit</button>
          </form>
   
    </> 
  );
}

export default Register;