import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import NavigationBar, {
  NavigationButton,
  NavigationLink,
  NavigationLinkContainer,
  NavigationLogo,
} from "./components/Navigation";
import {
  FaCreditCard,
  FaDoorOpen,
  FaListCheck,
  FaReceipt,
  FaShop,
  FaTags,
  FaTruck,
  FaUser,
} from "react-icons/fa6";
import { toast } from "sonner";
import Footer from "./components/Footer";
import SectionHero from "./components/SectionHero";
import { NavigationWebsiteLink } from "./components/Navigation";
import { useLogoutMutation } from "./redux/api/auth";

function App() {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      navigate("/login");
      toast.success("Déconnexion réussie");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <main className="sgi-gradient-bg flex min-h-screen flex-col">
      <NavigationBar>
        <NavigationLogo />
        <div className="flex flex-1 flex-wrap items-center gap-0.5">
          <NavigationLinkContainer to="/markets">
            <FaShop />
            <NavigationLink>Marchés</NavigationLink>
          </NavigationLinkContainer>
          <NavigationLinkContainer to="/orders">
            <FaReceipt />
            <NavigationLink>Commandes</NavigationLink>
          </NavigationLinkContainer>
          <NavigationLinkContainer to="/cards" hideForAreaAdmin>
            <FaCreditCard />
            <NavigationLink>Cartes</NavigationLink>
          </NavigationLinkContainer>
          <NavigationLinkContainer to="/promo-codes" hideForAreaAdmin>
            <FaTags />
            <NavigationLink>Codes</NavigationLink>
          </NavigationLinkContainer>
          <NavigationLinkContainer to="/agents">
            <FaListCheck />
            <NavigationLink>Vendeur</NavigationLink>
          </NavigationLinkContainer>
          <NavigationLinkContainer to="/shippers" hideForAreaAdmin>
            <FaTruck />
            <NavigationLink>Livreurs</NavigationLink>
          </NavigationLinkContainer>
          <NavigationLinkContainer to="/users" hideForAreaAdmin>
            <FaUser />
            <NavigationLink>Utilisateurs</NavigationLink>
          </NavigationLinkContainer>
        </div>
        <NavigationWebsiteLink />
        <NavigationButton onClick={handleLogout}>
          <FaDoorOpen />
          <span className="hidden sm:inline">Déconnexion</span>
        </NavigationButton>
      </NavigationBar>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6">
        <SectionHero />
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}

export default App;
