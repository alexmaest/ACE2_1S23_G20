import { useState } from 'react'
import Navbar from '../components/Navbar'
import Head from 'next/head'

export default function Login () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Autenticar usuario
  }

  return (
        <>
        <Head>
            <title>Login</title>
        </Head>
        <Navbar/>
        <div className="flex flex-col bg-blue-900 items-center justify-center h-screen">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4 underline decoration-bgred ">Iniciar sesión</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Nombre de Usuario</label>
          <input
            className="border w-full p-2 rounded-lg"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Contraseña</label>
          <input
            className="border w-full p-2 rounded-lg"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="bg-bgred hover:bg-bgred/90  text-white font-bold py-2 px-4 rounded w-full"
          type="submit"
        >
          Iniciar sesión
        </button>
        <p className="text-gray-500 text-sm mt-4">
          ¿No tienes una cuenta?{' '}
          <a className="text-blue-500" href="/registro">
            Regístrate
          </a>
        </p>
      </form>
    </div>
        </>
  )
}
