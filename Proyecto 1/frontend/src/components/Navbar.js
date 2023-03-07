import { Navbar } from 'flowbite-react'

export default function NavBar () {
  return (
    <Navbar
  fluid={true}
  rounded={false}
  className='bg-red-500'
    >
  <Navbar.Brand href="/">
    <span className="self-center whitespace-nowrap text-md font-semibold dark:text-white text-green-500">
      G20 Pomodoro
    </span>
  </Navbar.Brand>
  <Navbar.Toggle/>
  <Navbar.Collapse>
    <Navbar.Link
      href="/"
      className=' text-green-500'
    >
      Inicio
    </Navbar.Link>
    <Navbar.Link href="/penalizaciones">
      Penalizaciones
    </Navbar.Link>
    <Navbar.Link href="/login">
      Login
    </Navbar.Link>
    <Navbar.Link href="/registro">
      Registro
    </Navbar.Link>
  </Navbar.Collapse>
</Navbar>
  )
}
