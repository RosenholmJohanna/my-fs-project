import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import './App.css'
import Login from './components/login/Login';
import Register from './components/Register/Register';
import user from './reducers/userReduser';


const reducer = combineReducers({
  user: user.reducer
});
const store = configureStore({reducer});

const App = () => {

  return (
    <Provider store = {store}>
      <Login />
      <Register />
    </Provider>
  )
}

export default App
