import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Head from 'next/head'
import Link from 'next/link'

export default function Register () {
  const userRef = useRef()
  const errorRef = useRef()

  const [username, setUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setError('')
  }, [username, fullname, password])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Autenticar usuario
    if (username === '' || fullname === '' || password === '') {
      setError('Todos los campos son obligatorios')
    }

    fetch('http://localhost:3555/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        fullname,
        password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          window.location.href = '/login'
        }
      })
  }

  return (
    <>
      <Head>
        <title>Registro</title>
      </Head>
      <Navbar />
      <div className="flex flex-col bg-green-900 items-center justify-center h-screen">
        <form
          className="bg-white p-6 rounded-lg shadow-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
          onSubmit={handleSubmit}
        >
          <p
            ref={errorRef}
            className={error ? 'bg-red-400 border-red-900' : 'hidden'}
            aria-live="assertive"
          >
            {error}
          </p>
          <h2 className="text-xl font-bold mb-4 underline decoration-bgred ">
            Registro
          </h2>
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Nombre de Usuario
            </label>
            <input
              className="border w-full p-2 rounded-lg"
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Nombre Completo</label>
            <input
              className="border w-full p-2 rounded-lg"
              type="text"
              id="fullname"
              autoComplete="off"
              onChange={(e) => setFullname(e.target.value)}
              value={fullname}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-2">Contraseña</label>
            <input
              className="border w-full p-2 rounded-lg"
              type="password"
              id="password"
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          <button
            className="bg-bgred hover:bg-bgred/90  text-white font-bold py-2 px-4 rounded w-full"
            type="submit"
          >
            Registrarse
          </button>
          <p className="text-gray-500 text-sm mt-4">
            ¿Ya tienes una cuenta?{' '}
            <Link className="text-blue-500" href="/login">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}
