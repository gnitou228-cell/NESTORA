import { useLocation, useNavigate } from 'react-router-dom';
import BoostModal from '../components/BoostModal';

export default function Boost() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const propertyId = searchParams.get('propertyId') || '';

  return (
    <div style={{ padding: '2rem', minHeight: '80vh', backgroundColor: '#f8fafc' }}>
      <BoostModal 
        isOpen={true} 
        onClose={() => navigate('/mes-annonces')} 
        propertyId={propertyId} 
      />
    </div>
  );
}
