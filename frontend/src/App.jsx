import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
  <BrowserRouter> 
    <Provider store = {store}>
      <Routes>
        <Route path='/login' element={<Login/>}></Route> 
        <Route path='/register' element={<Register/>}></Route> 
      </Routes>  
    </Provider>
  </BrowserRouter> 
  )
}

export default App
