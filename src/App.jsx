import { Navigate, Route, Routes } from "react-router-dom"
import { Header } from "./components/Header"
import { ScrollToTop } from "./components/ScrollToTop"
import { About } from "./pages/About"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
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
import { Adoption } from "./pages/Adoption"

function App() {

  return (
    <div className="font-inter flex flex-col min-h-screen overflow-x-hidden">
      <ScrollToTop />
      <Header />
      <main className="flex-grow bg-light">
        <Routes>
          <Route path="/" element={<Navigate to="/pets" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/pets/:id" element={<PetProfile />} />
          <Route path="/pets/add" element={<PetRegister />} />
          <Route path="/pets/edit/:id" element={<PetEdit />} />
          <Route path="/pets/:petId/adoptions" element={<Adoptions />} />
          <Route path="/adoptions/:adoptionId" element={<Adoption />} />
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
