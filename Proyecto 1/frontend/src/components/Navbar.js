import { Navbar, Dropdown } from 'flowbite-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function NavBar () {
  const { data: session } = useSession()

  return (
    <Navbar fluid={true} rounded={false} className="bg-red-500">
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-md font-semibold dark:text-white text-green-500">
          G20 Pomodoro
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="/" className=" text-green-500">
          Inicio
        </Navbar.Link>
      <Dropdown
        label="Penalizaciones"
        inline={true}
      >
        <Link href='/tiempoReal'>
          <Dropdown.Item>
            Tiempo Real
          </Dropdown.Item>
        </Link>
        <Link href='/reportes'>
          <Dropdown.Item>
            Reportes
          </Dropdown.Item>
        </Link>
      </Dropdown>
        {session?.user
          ? (
            <>
              <p>{session.user.name}</p>
              <button className="text-red-500" onClick={() => signOut()}>
                Sign Out
              </button>
            </>
            )
          : (
            <>
              <button onClick={() => signIn()}>Sign In</button>
              <Navbar.Link href="/registro">Registro</Navbar.Link>
            </>
            )}
      </Navbar.Collapse>
    </Navbar>
  )
}
