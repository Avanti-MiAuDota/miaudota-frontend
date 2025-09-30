import logo from "../assets/img/miaulogo.png"
import { MenuDesktop } from "./MenuDesktop"
import { MenuMobile } from "./MenuMobile"
import { Link } from "react-router-dom"

export const Header = () => {
  return (
    <header className="mb-2 flex justify-between items-center p-4 bg-light">
      <div className="w-[80px] sm:w-[120px]">
        <Link to="/">
          <img className="w-full" src={logo} alt="Logo da MiAuDota" />
        </Link>
      </div>
      <div className="hidden sm:block">
        <MenuDesktop />
      </div>
      <div className="sm:hidden">
        <MenuMobile />
      </div>
    </header>
  )
}
