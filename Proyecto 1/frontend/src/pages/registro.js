import { useState } from 'react'
import Navbar from '../components/Navbar'
import Head from 'next/head'

export default function Register () {
  const [username, setUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Autenticar usuario
  }

  return (
        <>
        <Head>
            <title>Registro </title>
        </Head>
        <Navbar/>
        <div className="flex flex-col bg-green-900 items-center justify-center h-screen">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4 underline decoration-bgred ">Registro</h2>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Nombre de Usuario</label>
          <input
            className="border w-full p-2 rounded-lg"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Nombre Completo</label>
          <input
            className="border w-full p-2 rounded-lg"
            type="email"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
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
          ¿Ya tienes una cuenta?{' '}
          <a className="text-blue-500" href="/login">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
        </>
  )
}
