import { Link } from "react-router-dom"

export const MenuDesktop = () => {
  return (
    <nav className="flex gap-4 items-center">
      <Link to="/">Home</Link>
      <Link to="/about">Sobre</Link>
      <Link className="bg-laranja py-2 px-3 text-light font-bold uppercase rounded-lg hover:bg-azul" to="/login">Login</Link>
    </nav>
  )
}
