import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Boost from './pages/Boost';
import Publish from './pages/Publish';
import Checkout from './pages/Checkout';
import Subscription from './pages/Subscription';
import MyListings from './pages/MyListings';
import Invoices from './pages/Invoices';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import HelpCenter from './pages/HelpCenter';
import SecurityTrust from './pages/SecurityTrust';
import ReportListing from './pages/ReportListing';
import TermsOfService from './pages/TermsOfService';
import SearchPage from './pages/SearchPage';
import ListingsPage from './pages/ListingsPage';
import PropertyDetail from './pages/PropertyDetail';
import FavoritesPage from './pages/FavoritesPage';
import VisitsPage from './pages/VisitsPage';
import ReceivedVisitsPage from './pages/ReceivedVisitsPage';
import { MessagesPage } from './pages/MessagesPage';
import AgenciesPage from './pages/AgenciesPage';
import ValuesPage from './pages/ValuesPage';
import PartnerPage from './pages/PartnerPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import LegalNotices from './pages/LegalNotices';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import { FavoritesProvider } from './context/FavoritesContext';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/comment-ca-marche" element={<HowItWorks />} />
            <Route path="/nous-contacter" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/centre-d-aide" element={<HelpCenter />} />
            <Route path="/securite-et-confiance" element={<SecurityTrust />} />
            <Route path="/signaler-une-annonce" element={<ReportListing />} />
            <Route path="/conditions-generales" element={<TermsOfService />} />
            <Route path="/recherche" element={<SearchPage />} />
            <Route path="/annonces" element={<ListingsPage />} />
            <Route path="/annonces/:id" element={<PropertyDetail />} />
            <Route path="/agences" element={<AgenciesPage />} />
            <Route path="/valeurs" element={<ValuesPage />} />
            <Route path="/partenaire" element={<PartnerPage />} />
            <Route path="/confidentialite" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/mentions-legales" element={<LegalNotices />} />
          </Route>

          <Route path="/inscription" element={<Register />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Rôles spécifiques */}
              <Route element={<ProtectedRoute allowedRoles={['SEEKER']} />}>
                <Route path="/dashboard/seeker" element={<Dashboard />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
                <Route path="/dashboard/owner" element={<Dashboard />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['AGENCY']} />}>
                <Route path="/dashboard/agency" element={<Dashboard />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['OWNER', 'AGENCY']} />}>
                <Route path="demandes-visites" element={<ReceivedVisitsPage />} />
              </Route>

              {/* Rôles mixtes ou accessibles à tous les connectés */}
              <Route path="favoris" element={<FavoritesPage />} />
              <Route path="visites" element={<VisitsPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="publier" element={<Publish />} />
              <Route path="mes-annonces" element={<MyListings />} />
              <Route path="/tarifs" element={<Pricing />} />
              <Route path="boost" element={<Boost />} />
              <Route path="paiement" element={<Checkout />} />
              <Route path="abonnement" element={<Subscription />} />
              <Route path="paiements" element={<Invoices />} />
            </Route>
          </Route>
        </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
