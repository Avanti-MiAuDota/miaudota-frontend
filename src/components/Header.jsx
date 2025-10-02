import logo from "../assets/img/miaulogo.png"
import { MenuDesktop } from "./MenuDesktop"
import { MenuMobile } from "./MenuMobile"
import { Link } from "react-router-dom"

export const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="w-[80px] sm:w-[120px]">
        <Link to="/">
          <img className="w-full" src={logo} alt="Logo da MiAuDota" />
        </Link>
      </div>
      <div className="flex flex-row-reverse gap-4 items-center sm:flex-row">
        <div className="hidden sm:block">
          <MenuDesktop />
        </div>
        <div className="sm:hidden">
          <MenuMobile />
        </div>
        <Link className="bg-laranja py-2 px-3 text-light font-bold uppercase rounded-md hover:bg-azul" to="/login">Login</Link>
      </div>
    </header>
  )
}
