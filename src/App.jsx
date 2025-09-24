import { Route, Routes } from "react-router-dom"
import { Header } from "./components/Header"
import { ScrollToTop } from "./components/ScrollToTop"
import { Home } from "./pages/Home"
import { About } from "./pages/About"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { MyPets } from "./pages/MyPets"
import { PetRegister } from "./pages/PetRegister"
import { PetEdit } from "./pages/PetEdit"
import { Adoptions } from "./pages/Adoptions"
import { FormAdoption } from "./pages/FormAdoption"
import { Match } from "./pages/Match"
import { Unauthorized } from "./pages/Unauthorized"
import { NotFound } from "./pages/NotFound"
import { Pets } from "./pages/Pets"
import { PetProfile } from "./pages/PetProfile"
import { Footer } from "./components/Footer"

function App() {

  return (
    <div className="font-inter flex flex-col min-h-screen overflow-x-hidden">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/pets/:id" element={<PetProfile />} />
          <Route path="/pets/add" element={<PetRegister />} />
          <Route path="/mypets" element={<MyPets />} />
          <Route path="/mypets/edit/:id" element={<PetEdit />} />
          <Route path="/mypets/adoptions/:petId" element={<Adoptions />} />
          <Route path="/pets/adopt/:petId" element={<FormAdoption />} />
          <Route path="/congratulations" element={<Match />} />
          <Route path="/401" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
