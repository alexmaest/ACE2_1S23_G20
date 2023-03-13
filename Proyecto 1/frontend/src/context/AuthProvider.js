import { createContext, useEffect, useState } from 'react'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})

  useEffect(() => {
    const account = JSON.parse(localStorage.getItem('account'))
    if (account) {
      setAuth(account)
    } else {
      setAuth({})
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('account', JSON.stringify(auth))
  }, [auth])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
