import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Lock, Bell, Shield, Camera, CheckCircle2, 
  AlertCircle, Save, LogOut, Phone, Mail, Building, Globe, MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, role, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'account'>('profile');

  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [address, setAddress] = useState('');

  // Agency fields if role === AGENCY
  const [agencyName, setAgencyName] = useState('');
  const [agencyPhone, setAgencyPhone] = useState('');
  const [agencyAddress, setAgencyAddress] = useState('');
  const [agencyWebsite, setAgencyWebsite] = useState('');
  const [agencyDescription, setAgencyDescription] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preferences state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [visitReminders, setVisitReminders] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }

    setFirstName(user?.profile?.firstName || '');
    setLastName(user?.profile?.lastName || '');
    setPhone(user?.phone || '');
    setEmail(user?.email || '');
    setBio(user?.profile?.bio || '');
    setAvatar(user?.profile?.avatar || '');
    setAddress(user?.profile?.address || '');

    const userAgency = (user as any)?.agency;
    if (userAgency) {
      setAgencyName(userAgency.name || '');
      setAgencyPhone(userAgency.phone || '');
      setAgencyAddress(userAgency.address || '');
      setAgencyWebsite(userAgency.website || '');
      setAgencyDescription(userAgency.description || '');
      setRegistrationNumber(userAgency.registrationNumber || '');
    }

    // Load saved preferences if any
    const savedPrefs = localStorage.getItem('nestora_user_prefs');
    if (savedPrefs) {
      try {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.emailAlerts !== undefined) setEmailAlerts(parsed.emailAlerts);
        if (parsed.smsAlerts !== undefined) setSmsAlerts(parsed.smsAlerts);
        if (parsed.visitReminders !== undefined) setVisitReminders(parsed.visitReminders);
        if (parsed.newsletter !== undefined) setNewsletter(parsed.newsletter);
      } catch (e) {
        // ignore
      }
    }
  }, [user, navigate]);

  const showToast = (success: string, error?: string) => {
    if (success) {
      setSuccessMessage(success);
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 4000);
    }
    if (error) {
      setErrorMessage(error);
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setUploadingAvatar(true);
    setErrorMessage('');
    try {
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatar(data.publicUrl);

      // Auto update in backend
      const res = await api.put('/auth/profile', { avatar: data.publicUrl });
      if (res.data?.user) {
        updateUser(res.data.user);
      }
      showToast('Photo de profil mise à jour !');
    } catch (err: any) {
      console.error(err);
      showToast('', "Erreur lors du téléchargement de la photo de profil.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload: any = {
        firstName,
        lastName,
        phone,
        bio,
        address,
        avatar
      };

      if (role === 'AGENCY') {
        payload.agencyName = agencyName;
        payload.agencyPhone = agencyPhone;
        payload.agencyAddress = agencyAddress;
        payload.website = agencyWebsite;
        payload.agencyDescription = agencyDescription;
        payload.registrationNumber = registrationNumber;
      }

      const res = await api.put('/auth/profile', payload);
      if (res.data?.user) {
        updateUser(res.data.user);
      }
      showToast('Vos informations personnelles ont été enregistrées avec succès !');
    } catch (err: any) {
      console.error(err);
      showToast('', err.response?.data?.message || 'Erreur lors de la mise à jour du profil.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword.length < 6) {
      showToast('', 'Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('', 'Les deux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword,
        newPassword
      });
      showToast('Votre mot de passe a été modifié avec succès.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      showToast('', err.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const prefs = { emailAlerts, smsAlerts, visitReminders, newsletter };
    localStorage.setItem('nestora_user_prefs', JSON.stringify(prefs));
    showToast('Vos préférences de notification ont été enregistrées.');
  };

  return (
    <div className="settings-page container mt-4" style={{ paddingBottom: '90px', maxWidth: '960px' }}>
      {/* Header */}
      <div className="mb-4">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-dark)', margin: 0, letterSpacing: '-0.02em' }}>
          Paramètres du compte
        </h1>
        <p className="text-light mt-1" style={{ margin: 0, fontSize: '0.95rem' }}>
          Gérez votre profil, vos identifiants de sécurité et vos préférences.
        </p>
      </div>

      {/* Notifications Toast */}
      {successMessage && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.85rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
          <CheckCircle2 size={20} color="#16a34a" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
          <AlertCircle size={20} color="#dc2626" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Navigation Tabs (Mobile scrollable) */}
      <div className="settings-tabs-nav mb-4">
        <button 
          className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} />
          <span>Profil</span>
        </button>

        <button 
          className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Lock size={18} />
          <span>Sécurité</span>
        </button>

        <button 
          className={`settings-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <Bell size={18} />
          <span>Notifications</span>
        </button>

        <button 
          className={`settings-tab-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <Shield size={18} />
          <span>Compte</span>
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="card p-4" style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>
            Informations personnelles
          </h2>

          <form onSubmit={handleSaveProfile}>
            {/* Avatar section */}
            <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
              <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Profil" 
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} 
                  />
                ) : (
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#0B1F3A', color: '#C9A227', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold' }}>
                    {firstName ? firstName.charAt(0).toUpperCase() : 'N'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#0B1F3A',
                    color: '#fff',
                    border: '2px solid #fff',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Changer la photo"
                >
                  <Camera size={14} />
                </button>
                <input 
                  type="file" 
                  ref={avatarInputRef} 
                  onChange={handleAvatarUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>

              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  {firstName} {lastName}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  {uploadingAvatar ? 'Téléchargement en cours...' : 'Format JPG, PNG ou WEBP conseillé'}
                </p>
              </div>
            </div>

            {/* Inputs grid */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Prénom</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  required 
                  placeholder="Votre prénom"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Nom</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  required 
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
                  <Mail size={15} style={{ display: 'inline', marginRight: '5px' }} /> Email
                </label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={email} 
                  disabled 
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
                <small style={{ color: '#64748b', fontSize: '0.78rem' }}>L'adresse email est liée à votre compte Nestora.</small>
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
                  <Phone size={15} style={{ display: 'inline', marginRight: '5px' }} /> Téléphone
                </label>
                <input 
                  type="tel" 
                  className="form-control" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+228 90 00 00 00"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
                <MapPin size={15} style={{ display: 'inline', marginRight: '5px' }} /> Adresse de résidence / localisation
              </label>
              <input 
                type="text" 
                className="form-control" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Ex: Lomé, Tokoin Wuiti"
              />
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Bio / Description</label>
              <textarea 
                className="form-control" 
                rows={3} 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                placeholder="Présentez-vous en quelques mots..."
              />
            </div>

            {/* Agency specific info */}
            {role === 'AGENCY' && (
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <Building size={20} color="#0B1F3A" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                    Informations de l'agence immobilière
                  </h3>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Nom de l'agence</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={agencyName} 
                      onChange={(e) => setAgencyName(e.target.value)} 
                      placeholder="Nom officiel de votre structure"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Téléphone de contact agence</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      value={agencyPhone} 
                      onChange={(e) => setAgencyPhone(e.target.value)} 
                      placeholder="+228..."
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>N° RCCM / Enregistrement</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={registrationNumber} 
                      onChange={(e) => setRegistrationNumber(e.target.value)} 
                      placeholder="Ex: TG-LOM-2023-B-0000"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
                      <Globe size={15} style={{ display: 'inline', marginRight: '5px' }} /> Site web
                    </label>
                    <input 
                      type="url" 
                      className="form-control" 
                      value={agencyWebsite} 
                      onChange={(e) => setAgencyWebsite(e.target.value)} 
                      placeholder="https://mon-agence.com"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Adresse physique du siège</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={agencyAddress} 
                    onChange={(e) => setAgencyAddress(e.target.value)} 
                    placeholder="Boulevard du 13 Janvier, Lomé"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Description de l'agence</label>
                  <textarea 
                    className="form-control" 
                    rows={3} 
                    value={agencyDescription} 
                    onChange={(e) => setAgencyDescription(e.target.value)} 
                    placeholder="Présentez votre catalogue et vos services aux clients..."
                  />
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', fontWeight: 600, minHeight: '46px' }}
              >
                <Save size={18} />
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Security */}
      {activeTab === 'security' && (
        <div className="card p-4" style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            Sécurité & Mot de passe
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Mettez à jour votre mot de passe pour garantir la sécurité de votre compte Nestora.
          </p>

          <form onSubmit={handleSavePassword} style={{ maxWidth: '520px' }}>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Mot de passe actuel</label>
              <input 
                type="password" 
                className="form-control" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                placeholder="Votre mot de passe actuel"
              />
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Nouveau mot de passe</label>
              <input 
                type="password" 
                className="form-control" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                placeholder="Au moins 6 caractères"
              />
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Confirmer le nouveau mot de passe</label>
              <input 
                type="password" 
                className="form-control" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                placeholder="Répétez le mot de passe"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', fontWeight: 600, minHeight: '46px' }}
            >
              <Lock size={18} />
              {loading ? 'Modification en cours...' : 'Modifier le mot de passe'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Preferences */}
      {activeTab === 'preferences' && (
        <div className="card p-4" style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            Notifications & Alertes
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Choisissez les canaux sur lesquels vous souhaitez être notifié.
          </p>

          <form onSubmit={handleSavePreferences}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>Notifications par Email</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Recevez les demandes de visite et les nouveaux messages par email.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts} 
                  onChange={(e) => setEmailAlerts(e.target.checked)} 
                  style={{ width: '20px', height: '20px', accentColor: '#0B1F3A' }} 
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>Rappels de visites immobilières</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Alerte 24h avant chaque visite programmée avec un client.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={visitReminders} 
                  onChange={(e) => setVisitReminders(e.target.checked)} 
                  style={{ width: '20px', height: '20px', accentColor: '#0B1F3A' }} 
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>Alertes SMS & WhatsApp</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Notification instantanée lors d'un nouveau contact direct.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={smsAlerts} 
                  onChange={(e) => setSmsAlerts(e.target.checked)} 
                  style={{ width: '20px', height: '20px', accentColor: '#0B1F3A' }} 
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>Actualités & Conseils Nestora</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Offres exclusives, conseils pour booster la visibilité et actualités du marché.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={newsletter} 
                  onChange={(e) => setNewsletter(e.target.checked)} 
                  style={{ width: '20px', height: '20px', accentColor: '#0B1F3A' }} 
                />
              </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', fontWeight: 600, minHeight: '46px' }}
            >
              <Save size={18} />
              Enregistrer les préférences
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Account */}
      {activeTab === 'account' && (
        <div className="card p-4" style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>
            Gestion du compte
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Type de compte</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
                  {role === 'AGENCY' ? 'Agence Immobilière' : role === 'OWNER' ? 'Propriétaire / Bailleur' : role === 'ADMIN' ? 'Administrateur' : 'Chercheur de logement'}
                </div>
              </div>
              <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
                {role}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Statut de vérification</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
                  {user?.profile?.documentUrl ? 'Documents d\'identité transmis' : 'Profil standard'}
                </div>
              </div>
              <span style={{ backgroundColor: user?.profile?.documentUrl ? '#dcfce7' : '#fef3c7', color: user?.profile?.documentUrl ? '#15803d' : '#b45309', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
                {user?.profile?.documentUrl ? 'En cours de validation' : 'Non vérifié'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Identifiant compte (UID)</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#334155' }}>
                  {user?.id || '—'}
                </div>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>Session active</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Déconnectez-vous de tous vos appareils en sécurité.</div>
            </div>

            <button 
              onClick={() => logout()}
              className="btn btn-outline"
              style={{ color: '#dc2626', borderColor: '#fca5a5', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, minHeight: '44px' }}
            >
              <LogOut size={16} />
              Se déconnecter
            </button>
          </div>
        </div>
      )}

      <style>{`
        .settings-tabs-nav {
          display: flex;
          gap: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
          overflow-x: auto;
          white-space: nowrap;
          padding-bottom: 2px;
          -webkit-overflow-scrolling: touch;
        }
        .settings-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: #64748b;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: -2px;
          border-radius: 8px 8px 0 0;
        }
        .settings-tab-btn:hover {
          color: #0B1F3A;
          background-color: #f8fafc;
        }
        .settings-tab-btn.active {
          color: #0B1F3A;
          border-bottom-color: #C9A227;
          background-color: #fff;
        }
        @media (max-width: 640px) {
          .settings-tab-btn {
            padding: 0.6rem 0.85rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
