import React, { createContext, useContext, useState } from 'react'
import UserApi from '../service/UserApi'
const StateContext = createContext({
  message: {},
  user: {},
  NumberQuestions:null,
  login: (data) => { },
  register: (data) => { },
  forgotPassword: (data) => { },
  resetPassword: (data) => { },
  sendEmailVerification: () => { },
  setToken: (token) => { },
  getUser: () => { },
  setUser: () => { },
  setNumberQuestions:()=>{}
})
export default function UserContext({ children }) {
  const [user, setUser] = useState({})   
  const [NumberQuestions,_setNumberQuestions]=useState(0)
  const [token, _setToken] = useState(window.localStorage.getItem('token') || '')
  const login = async (data) => {
    await UserApi.getCsrf()
    return await UserApi.login(data)
  }
  const register = async (data) => {
    await UserApi.getCsrf()
    return await UserApi.register(data)
  }
  const forgotPassword = async (data) => {
    await UserApi.getCsrf()
    return await UserApi.forgotPassword(data)
  }
  const resetPassword = async (data) => {
    await UserApi.getCsrf()
    return await UserApi.resetPassword(data)
  }
  const sendEmailVerification = async () => {
    await UserApi.getCsrf()
    return await UserApi.sendEmailVerification()
  }
  const setToken = (token) => {
    if (token) {
      window.localStorage.setItem('token', token)
    } else {
      window.localStorage.removeItem('token', token)
    }
    _setToken(token)
  }

  const getUser = async () => {
    return await UserApi.getUser()
  }
  const logout = async () => {
    return await UserApi.logout()
  }
  const setNumberQuestions=(value)=>{
    _setNumberQuestions(value)
  }
  window.addEventListener('storage', (event) => {
    if (event.key === 'token' && !event.newValue) {
        // Si le token est supprimé dans un autre onglet, déconnecter l'utilisateur
        window.location.href = '/login';
    }
});
  return (
    <StateContext.Provider value={{
      token,user,
      login,register,
      forgotPassword,resetPassword,
      sendEmailVerification,
      setToken,setUser,
      getUser,logout,
      NumberQuestions,setNumberQuestions
    }}>
      {children}
    </StateContext.Provider>
  )
}
export const useUserContext = () => useContext(StateContext)
