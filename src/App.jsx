import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; // Importação adicionada
import { Header } from "./components/Header";
import { ScrollToTop } from "./components/ScrollToTop";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { PetForm } from "./pages/PetForm";
import { Adoptions } from "./pages/Adoptions";
import { AdoptionForm } from "./pages/AdoptionForm";
import { Match } from "./pages/Match";
import { Unauthorized } from "./pages/Unauthorized";
import { NotFound } from "./pages/NotFound";
import { Pets } from "./pages/Pets";
import { PetProfile } from "./pages/PetProfile";
import { Footer } from "./components/Footer";
import { Adoption } from "./pages/Adoption";
import { useAuth } from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import { CustomLoader } from "./components/CustomLoader";
import { PrivateRoute } from "./components/PrivateRoute";
import { UserProfile } from "./pages/UserProfile";

function App() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <div className="font-inter flex flex-col min-h-screen overflow-x-hidden bg-light">
      <Toaster />
      
      <ScrollToTop />
      <Header user={user} />
      <main className="flex-grow max-w-[1200px] w-full mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/pets" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pets/add" element={<PrivateRoute><PetForm /></PrivateRoute>} />
          <Route path="/pets/edit/:id" element={<PrivateRoute><PetForm /></PrivateRoute>} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/pets/:id" element={<PetProfile />} />
          <Route path="/pets/:petId/adoptions" element={<Adoptions />} />
          <Route path="/adoptions/:adoptionId" element={<Adoption />} />
          <Route path="/pets/adopt/:petId" element={<AdoptionForm />} />
          {/* <Route path="/adoptions/edit/:adoptionId" element={<PrivateRoute><AdoptionForm /></PrivateRoute>} /> */}
          <Route path="/congratulations" element={<Match />} />
          <Route path="/forbidden" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/profile/:id" element={<UserProfile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App;
