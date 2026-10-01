import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Layout from './Layout';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout() {
  const { user } = useAuth();

  // Si l'utilisateur est connecté, afficher les pages dans le layout du tableau de bord
  // pour qu'il ne quitte pas son espace lors de la navigation
  if (user) {
    return <Layout />;
  }

  return (
    <div className="public-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
