import { Link } from "react-router-dom"

export const MenuDesktop = ({ user }) => {
  return (
    <nav className="flex gap-4 items-center">
      <Link className="link-nav font-semibold" to="/">Home</Link>
      <Link className="link-nav font-semibold" to="/about">Sobre</Link>
      
      {!user && (
        <Link className="link-nav font-semibold" to="/register">Cadastro</Link>
      )}
    </nav>
  )
}