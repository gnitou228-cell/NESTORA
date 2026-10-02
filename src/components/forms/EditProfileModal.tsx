import React, { useState, useRef } from 'react';
import { 
  X, Camera, Upload, ShieldCheck, Mail, Calendar, LogOut, 
  User, Phone, Lock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import api from '../../lib/api';

interface EditProfileModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProfileModal({ onClose, onSuccess }: EditProfileModalProps) {
  const { user, role, updateUser, logout } = useAuth();
  
  const [firstName, setFirstName] = useState(user?.profile?.firstName || '');
  const [lastName, setLastName] = useState(user?.profile?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [avatar, setAvatar] = useState(user?.profile?.avatar || '');
  
  // Date of birth
  const [birthDate, setBirthDate] = useState(user?.profile?.birthDate ? new Date(user.profile.birthDate).toISOString().split('T')[0] : '');

  // Documents
  const [idDocumentType, setIdDocumentType] = useState(user?.profile?.idDocumentType || (role === 'AGENCY' ? 'COMPANY_REGISTRATION' : ''));
  const [documentUrl, setDocumentUrl] = useState(user?.profile?.documentUrl || ''); // Recto ou Passeport
  const [documentBackUrl, setDocumentBackUrl] = useState(user?.profile?.documentBackUrl || ''); // Verso
  const [selfieUrl, setSelfieUrl] = useState(user?.profile?.selfieUrl || '');

  const needsDocument = role === 'AGENCY' || role === 'OWNER';
  const hasVerso = idDocumentType === 'ID_CARD' || idDocumentType === 'DRIVER_LICENSE';

  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingDocBack, setUploadingDocBack] = useState(false);
  const [uploadingSelfie, setUploadingSelfie] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const docBackInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setUploadingAvatar(true);
    try {
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatar(data.publicUrl);
    } catch (err: any) {
      setError("Erreur lors de l'upload de l'image.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const uploadToSupabase = async (file: File, prefix: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${prefix}-${Math.random()}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('documents').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingDoc(true);
    try {
      const url = await uploadToSupabase(e.target.files[0], 'doc-recto');
      setDocumentUrl(url);
    } catch (err) {
      setError("Erreur lors de l'upload du document.");
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDocBackUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingDocBack(true);
    try {
      const url = await uploadToSupabase(e.target.files[0], 'doc-verso');
      setDocumentBackUrl(url);
    } catch (err) {
      setError("Erreur lors de l'upload du verso.");
    } finally {
      setUploadingDocBack(false);
    }
  };

  const handleSelfieUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingSelfie(true);
    try {
      const url = await uploadToSupabase(e.target.files[0], 'selfie');
      setSelfieUrl(url);
    } catch (err) {
      setError("Erreur lors de l'upload du selfie.");
    } finally {
      setUploadingSelfie(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.put('/auth/profile', {
        firstName,
        lastName,
        phone,
        avatar,
        bio,
        birthDate,
        idDocumentType,
        documentUrl,
        documentBackUrl,
        selfieUrl
      });

      if (updateUser && res.data?.user) {
        updateUser({
          ...res.data.user,
          profile: {
            ...res.data.user.profile
          }
        });
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  // Calcul du score de complétion
  let completionScore = 0;
  const missingFields: string[] = [];
  
  if (firstName.trim()) completionScore += 10; else missingFields.push("Prénom");
  if (lastName.trim()) completionScore += 10; else missingFields.push("Nom");
  if (phone.trim()) completionScore += 15; else missingFields.push("Téléphone");
  if (avatar) completionScore += 15; else missingFields.push("Photo");
  if (bio.trim()) completionScore += 10; else missingFields.push("Bio");
  if (birthDate) completionScore += 10; else missingFields.push("Date de naissance");

  if (needsDocument) {
    if (idDocumentType) {
      completionScore += 5;
      if (documentUrl) completionScore += 10; else missingFields.push(hasVerso ? "Document (Recto)" : "Document");
      if (hasVerso) {
        if (documentBackUrl) completionScore += 5; else missingFields.push("Document (Verso)");
      } else {
        completionScore += 5;
      }
      if (selfieUrl) completionScore += 10; else missingFields.push("Selfie");
    } else {
      missingFields.push("Document d'identité");
    }
  } else {
    completionScore += 30;
  }

  completionScore = Math.min(100, Math.max(0, completionScore));

  const getProgressColor = () => {
    if (completionScore < 50) return '#ef4444';
    if (completionScore < 80) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="profile-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="profile-modal-dialog">
        
        {/* Sticky Header */}
        <div className="profile-modal-header">
          <div className="profile-modal-drag-handle" />
          <div className="profile-modal-header-content">
            <div>
              <h2 className="profile-modal-title">Modifier mon profil</h2>
              <p className="profile-modal-subtitle">Gérez vos informations personnelles</p>
            </div>
            <button 
              type="button" 
              className="profile-modal-close" 
              onClick={onClose}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="profile-modal-body">
          {error && (
            <div className="profile-alert profile-alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Avatar Upload Hero */}
          <div className="profile-avatar-hero">
            <div 
              className="profile-avatar-wrapper"
              onClick={() => fileInputRef.current?.click()}
              title="Changer la photo de profil"
            >
              <img 
                src={avatar || "https://ui-avatars.com/api/?name=" + (firstName || 'User') + "&background=0B1F3A&color=fff"} 
                alt="Avatar" 
                className="profile-avatar-img"
              />
              <div className="profile-avatar-badge">
                {uploadingAvatar ? (
                  <span className="profile-spinner-sm" />
                ) : (
                  <Camera size={16} />
                )}
              </div>
            </div>
            <div className="profile-avatar-text">
              <button 
                type="button" 
                className="profile-avatar-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingAvatar ? 'Téléchargement...' : 'Changer la photo de profil'}
              </button>
              <span className="profile-avatar-hint">JPG ou PNG · max 5 Mo</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          {/* Profile Completion Bar */}
          <div className="profile-completion-card">
            <div className="profile-completion-header">
              <span className="profile-completion-label">Complétion du profil</span>
              <span 
                className="profile-completion-badge" 
                style={{ backgroundColor: `${getProgressColor()}18`, color: getProgressColor() }}
              >
                {completionScore}%
              </span>
            </div>
            <div className="profile-completion-track">
              <div 
                className="profile-completion-fill"
                style={{ width: `${completionScore}%`, backgroundColor: getProgressColor() }}
              />
            </div>
            {completionScore < 100 && (
              <div className="profile-completion-missing">
                <span className="missing-label">À compléter :</span>
                <span className="missing-items">{missingFields.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Section: Informations Personnelles */}
          <div className="profile-form-section">
            <h3 className="profile-section-title">
              <User size={18} className="profile-section-icon" />
              Informations personnelles
            </h3>

            {/* Email (Read-Only) */}
            <div className="profile-field-group">
              <label className="profile-field-label">
                <span>Adresse Email</span>
                <span className="profile-badge-lock"><Lock size={12} /> Non modifiable</span>
              </label>
              <div className="profile-input-wrapper profile-input-disabled">
                <Mail size={18} className="profile-input-icon" />
                <input 
                  type="email" 
                  className="profile-input" 
                  value={user?.email || ''} 
                  disabled 
                />
              </div>
              <span className="profile-field-caption">Votre adresse email sert d'identifiant unique.</span>
            </div>

            {/* Prénom & Nom */}
            <div className="profile-fields-row">
              <div className="profile-field-group">
                <label className="profile-field-label">Prénom <span className="text-required">*</span></label>
                <div className="profile-input-wrapper">
                  <User size={18} className="profile-input-icon" />
                  <input 
                    type="text" 
                    className="profile-input" 
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Ex: Essowedeou"
                    required
                  />
                </div>
              </div>

              <div className="profile-field-group">
                <label className="profile-field-label">Nom <span className="text-required">*</span></label>
                <div className="profile-input-wrapper">
                  <User size={18} className="profile-input-icon" />
                  <input 
                    type="text" 
                    className="profile-input" 
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Ex: Gnitou"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Téléphone & Date de naissance */}
            <div className="profile-fields-row">
              <div className="profile-field-group">
                <label className="profile-field-label">Téléphone / WhatsApp <span className="text-required">*</span></label>
                <div className="profile-input-wrapper">
                  <Phone size={18} className="profile-input-icon" />
                  <input 
                    type="tel" 
                    className="profile-input" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+228 90 00 00 00"
                    required
                  />
                </div>
              </div>

              <div className="profile-field-group">
                <label className="profile-field-label">Date de naissance</label>
                <div className="profile-input-wrapper">
                  <Calendar size={18} className="profile-input-icon" />
                  <input 
                    type="date" 
                    className="profile-input" 
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="profile-field-group">
              <label className="profile-field-label">
                <span>À propos de vous (Bio)</span>
                <span className="profile-field-optional">Optionnel</span>
              </label>
              <textarea 
                className="profile-textarea" 
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                placeholder="Présentez-vous en quelques mots..."
              />
            </div>
          </div>

          {/* Section: Vérification d'identité (KYC si applicable) */}
          {needsDocument && (
            <div className="profile-form-section profile-kyc-section">
              <div className="profile-kyc-header">
                <div>
                  <h3 className="profile-section-title">
                    <ShieldCheck size={18} className="profile-section-icon" style={{ color: '#10b981' }} />
                    Vérification d'identité (KYC)
                  </h3>
                  <p className="profile-section-desc">Requis pour publier des annonces et certifier votre profil.</p>
                </div>
                <span className="profile-badge-required">Requis</span>
              </div>

              <div className="profile-field-group">
                <label className="profile-field-label">Type de document officiel <span className="text-required">*</span></label>
                <select 
                  className="profile-select" 
                  value={idDocumentType} 
                  onChange={(e) => {
                    setIdDocumentType(e.target.value);
                    setDocumentUrl('');
                    setDocumentBackUrl('');
                  }}
                  required
                >
                  <option value="">Sélectionnez un type de document...</option>
                  {role === 'AGENCY' ? (
                    <option value="COMPANY_REGISTRATION">Registre du Commerce / Entreprise (RCCM, NIF...)</option>
                  ) : (
                    <>
                      <option value="ID_CARD">Carte Nationale d'Identité (CNI)</option>
                      <option value="PASSPORT">Passeport</option>
                      <option value="DRIVER_LICENSE">Permis de conduire</option>
                    </>
                  )}
                </select>
              </div>

              {idDocumentType && (
                <div className="profile-docs-grid">
                  {/* Recto */}
                  <div className="profile-doc-box" onClick={() => docInputRef.current?.click()}>
                    <span className="profile-doc-label">{hasVerso ? 'Recto du document' : 'Document officiel (PDF/Image)'}</span>
                    <div className="profile-doc-target">
                      {uploadingDoc ? (
                        <span className="profile-spinner-sm" style={{ borderColor: '#0B1F3A' }} />
                      ) : documentUrl ? (
                        <div className="profile-doc-success">
                          <CheckCircle2 size={24} color="#10b981" />
                          <span className="doc-status-ok">Document uploadé</span>
                          <span className="doc-action-text">Toucher pour remplacer</span>
                        </div>
                      ) : (
                        <div className="profile-doc-empty">
                          <Upload size={22} color="#64748b" />
                          <span className="doc-prompt">Choisir le recto</span>
                          <span className="doc-formats">JPG, PNG ou PDF</span>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={docInputRef}
                      onChange={handleDocUpload}
                      accept=".pdf,image/*"
                      style={{ display: 'none' }}
                    />
                  </div>

                  {/* Verso */}
                  {hasVerso && (
                    <div className="profile-doc-box" onClick={() => docBackInputRef.current?.click()}>
                      <span className="profile-doc-label">Verso du document</span>
                      <div className="profile-doc-target">
                        {uploadingDocBack ? (
                          <span className="profile-spinner-sm" style={{ borderColor: '#0B1F3A' }} />
                        ) : documentBackUrl ? (
                          <div className="profile-doc-success">
                            <CheckCircle2 size={24} color="#10b981" />
                            <span className="doc-status-ok">Verso uploadé</span>
                            <span className="doc-action-text">Toucher pour remplacer</span>
                          </div>
                        ) : (
                          <div className="profile-doc-empty">
                            <Upload size={22} color="#64748b" />
                            <span className="doc-prompt">Choisir le verso</span>
                            <span className="doc-formats">JPG, PNG ou PDF</span>
                          </div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={docBackInputRef}
                        onChange={handleDocBackUpload}
                        accept=".pdf,image/*"
                        style={{ display: 'none' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {idDocumentType && (
                <div className="profile-selfie-box mt-3" onClick={() => selfieInputRef.current?.click()}>
                  <div className="profile-selfie-header">
                    <span className="profile-doc-label">Selfie de vérification</span>
                    <span className="profile-selfie-hint">Tenez votre pièce à côté de votre visage</span>
                  </div>
                  <div className="profile-selfie-target">
                    {uploadingSelfie ? (
                      <span className="profile-spinner-sm" style={{ borderColor: '#10b981' }} />
                    ) : selfieUrl ? (
                      <div className="profile-doc-success">
                        <CheckCircle2 size={24} color="#16a34a" />
                        <span className="doc-status-ok" style={{ color: '#16a34a' }}>Selfie validé</span>
                        <span className="doc-action-text">Prendre une autre photo</span>
                      </div>
                    ) : (
                      <div className="profile-selfie-prompt">
                        <Camera size={24} color="#10b981" />
                        <span className="selfie-prompt-title">Prendre une photo (Caméra)</span>
                        <span className="selfie-prompt-sub">Touchez pour ouvrir l'appareil</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={selfieInputRef}
                    onChange={handleSelfieUpload}
                    accept="image/*"
                    capture="user"
                    style={{ display: 'none' }}
                  />
                </div>
              )}

              {(documentUrl && selfieUrl) && (
                <div className="profile-kyc-alert">
                  <ShieldCheck size={18} color="#10b981" />
                  <div>
                    <strong>Documents reçus :</strong> Vos pièces justificatives sont entre les mains de notre équipe de modération. Vous recevrez une confirmation sous peu.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section Compte & Déconnexion */}
          <div className="profile-account-section">
            <div>
              <div className="account-section-title">Session en cours</div>
              <div className="account-section-sub">
                Connecté ({user?.phone || user?.email || 'Utilisateur'})
              </div>
            </div>
            <button 
              type="button" 
              className="profile-logout-btn"
              onClick={() => { onClose(); logout(); }}
            >
              <LogOut size={15} />
              <span>Se déconnecter</span>
            </button>
          </div>

          {/* Hidden submit trigger */}
          <button type="submit" style={{ display: 'none' }} />
        </form>

        {/* Sticky Actions Footer */}
        <div className="profile-modal-footer">
          <button 
            type="button" 
            className="profile-btn-cancel" 
            onClick={onClose} 
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            type="button"
            className="profile-btn-save" 
            onClick={() => handleSubmit()}
            disabled={loading || uploadingAvatar || uploadingDoc || uploadingDocBack || uploadingSelfie}
          >
            {loading ? (
              <>
                <span className="profile-spinner-sm" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <span>Enregistrer les modifications</span>
            )}
          </button>
        </div>

      </div>

      <style>{`
        /* Overlay */
        .profile-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(11, 31, 58, 0.7);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2100;
          padding: 1rem;
        }

        @media (max-width: 640px) {
          .profile-modal-overlay {
            padding: 0;
            align-items: flex-end;
          }
        }

        /* Dialog Container */
        .profile-modal-dialog {
          background: #ffffff;
          border-radius: 16px;
          width: 100%;
          max-width: 580px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(11, 31, 58, 0.25);
          overflow: hidden;
          position: relative;
          animation: profileModalFadeIn 0.25s ease-out;
        }

        @media (max-width: 640px) {
          .profile-modal-dialog {
            max-width: 100%;
            max-height: 94vh;
            border-radius: 20px 20px 0 0;
            animation: profileModalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
        }

        @keyframes profileModalFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes profileModalSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        /* Drag Handle on Mobile */
        .profile-modal-drag-handle {
          display: none;
        }
        @media (max-width: 640px) {
          .profile-modal-drag-handle {
            display: block;
            width: 36px;
            height: 4px;
            background: #cbd5e1;
            border-radius: 999px;
            margin: 0 auto 0.65rem auto;
          }
        }

        /* Sticky Header */
        .profile-modal-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e2e8f0;
          background: #ffffff;
          flex-shrink: 0;
        }
        .profile-modal-header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .profile-modal-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0B1F3A;
          margin: 0;
        }
        .profile-modal-subtitle {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 2px;
          margin-bottom: 0;
        }
        .profile-modal-close {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .profile-modal-close:hover {
          background: #e2e8f0;
          color: #0B1F3A;
        }

        /* Scrollable Body */
        .profile-modal-body {
          padding: 1.25rem;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* Avatar Hero */
        .profile-avatar-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0.25rem 0 0.5rem 0;
        }
        .profile-avatar-wrapper {
          position: relative;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 8px 24px -4px rgba(11, 31, 58, 0.15);
        }
        .profile-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #ffffff;
        }
        .profile-avatar-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #C9A227;
          color: #ffffff;
          border: 2.5px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }
        .profile-avatar-wrapper:hover .profile-avatar-badge {
          transform: scale(1.1);
        }
        .profile-avatar-text {
          margin-top: 0.65rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .profile-avatar-btn {
          background: none;
          border: none;
          color: #0B1F3A;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .profile-avatar-hint {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        /* Completion Card */
        .profile-completion-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.85rem 1rem;
        }
        .profile-completion-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .profile-completion-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
        }
        .profile-completion-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.15rem 0.6rem;
          border-radius: 999px;
        }
        .profile-completion-track {
          height: 6px;
          background: #e2e8f0;
          border-radius: 999px;
          overflow: hidden;
        }
        .profile-completion-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.4s ease, background-color 0.4s ease;
        }
        .profile-completion-missing {
          margin-top: 0.5rem;
          font-size: 0.78rem;
          color: #64748b;
          line-height: 1.4;
        }
        .missing-label {
          font-weight: 600;
          color: #475569;
          margin-right: 4px;
        }

        /* Form Sections & Fields */
        .profile-form-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .profile-section-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0B1F3A;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .profile-section-icon {
          color: #C9A227;
        }
        .profile-fields-row {
          display: flex;
          gap: 1rem;
        }
        @media (max-width: 640px) {
          .profile-fields-row {
            flex-direction: column;
            gap: 1rem;
          }
        }
        .profile-field-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1;
          min-width: 0;
        }
        .profile-field-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .text-required {
          color: #ef4444;
        }
        .profile-badge-lock {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .profile-field-optional {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 400;
        }
        .profile-field-caption {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 2px;
        }

        /* Inputs */
        .profile-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          transition: all 0.2s;
        }
        .profile-input-wrapper:focus-within {
          border-color: #0B1F3A;
          box-shadow: 0 0 0 3px rgba(11, 31, 58, 0.08);
        }
        .profile-input-wrapper.profile-input-disabled {
          background: #f8fafc;
          border-color: #e2e8f0;
          cursor: not-allowed;
        }
        .profile-input-icon {
          position: absolute;
          left: 0.85rem;
          color: #94a3b8;
          pointer-events: none;
        }
        .profile-input {
          width: 100%;
          height: 46px;
          border: none;
          background: transparent;
          padding: 0 1rem 0 2.6rem;
          font-size: 16px;
          color: #0f172a;
          font-family: inherit;
          outline: none;
        }
        .profile-input:disabled {
          color: #64748b;
          cursor: not-allowed;
        }
        .profile-select {
          width: 100%;
          height: 46px;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 0 1rem;
          font-size: 16px;
          color: #0f172a;
          background-color: #ffffff;
          font-family: inherit;
          outline: none;
          cursor: pointer;
        }
        .profile-select:focus {
          border-color: #0B1F3A;
          box-shadow: 0 0 0 3px rgba(11, 31, 58, 0.08);
        }
        .profile-textarea {
          width: 100%;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 16px;
          color: #0f172a;
          background-color: #ffffff;
          font-family: inherit;
          outline: none;
          resize: vertical;
          min-height: 80px;
        }
        .profile-textarea:focus {
          border-color: #0B1F3A;
          box-shadow: 0 0 0 3px rgba(11, 31, 58, 0.08);
        }

        /* KYC Section */
        .profile-kyc-section {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem;
        }
        .profile-kyc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .profile-section-desc {
          font-size: 0.78rem;
          color: #64748b;
          margin-top: 2px;
          margin-bottom: 0;
        }
        .profile-badge-required {
          background: #fee2e2;
          color: #dc2626;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          text-transform: uppercase;
        }
        .profile-docs-grid {
          display: flex;
          gap: 0.75rem;
        }
        @media (max-width: 640px) {
          .profile-docs-grid {
            flex-direction: column;
          }
        }
        .profile-doc-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .profile-doc-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
        }
        .profile-doc-target {
          border: 2px dashed #cbd5e1;
          border-radius: 10px;
          padding: 1rem;
          text-align: center;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .profile-doc-target:hover {
          border-color: #0B1F3A;
          background: #f8fafc;
        }
        .profile-doc-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .doc-prompt {
          font-size: 0.85rem;
          font-weight: 600;
          color: #0B1F3A;
        }
        .doc-formats {
          font-size: 0.72rem;
          color: #94a3b8;
        }
        .profile-doc-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }
        .doc-status-ok {
          font-size: 0.85rem;
          font-weight: 700;
          color: #10b981;
        }
        .doc-action-text {
          font-size: 0.72rem;
          color: #64748b;
          text-decoration: underline;
        }

        /* Selfie Box */
        .profile-selfie-box {
          background: #f0fdf4;
          border: 1.5px solid #86efac;
          border-radius: 10px;
          padding: 0.85rem;
          cursor: pointer;
        }
        .profile-selfie-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
          gap: 4px;
        }
        .profile-selfie-hint {
          font-size: 0.72rem;
          color: #15803d;
        }
        .profile-selfie-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 0.5rem 0;
        }
        .selfie-prompt-title {
          font-weight: 600;
          font-size: 0.875rem;
          color: #15803d;
        }
        .selfie-prompt-sub {
          font-size: 0.72rem;
          color: #16a34a;
        }
        .profile-kyc-alert {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 0.8rem;
          color: #065f46;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          line-height: 1.4;
          margin-top: 0.75rem;
        }

        /* Account / Logout Box */
        .profile-account-section {
          border-top: 1px solid #e2e8f0;
          padding-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .account-section-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
        }
        .account-section-sub {
          font-size: 0.78rem;
          color: #64748b;
          margin-top: 2px;
        }
        .profile-logout-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.85rem;
          background-color: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .profile-logout-btn:hover {
          background-color: #fecaca;
        }

        /* Sticky Footer */
        .profile-modal-footer {
          padding: 0.85rem 1.25rem;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .profile-btn-cancel {
          padding: 0.65rem 1.25rem;
          border: 1.5px solid #cbd5e1;
          background: #ffffff;
          color: #475569;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          min-height: 44px;
        }
        .profile-btn-cancel:hover {
          background: #f1f5f9;
        }
        .profile-btn-save {
          padding: 0.65rem 1.5rem;
          background: #0B1F3A;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 44px;
          box-shadow: 0 4px 12px rgba(11, 31, 58, 0.15);
          transition: all 0.2s;
          flex: 1;
        }
        .profile-btn-save:hover {
          background: #15325b;
        }
        .profile-btn-save:disabled, .profile-btn-cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Spinner */
        .profile-spinner-sm {
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-bottom-color: transparent;
          border-radius: 50%;
          display: inline-block;
          animation: profileSpin 0.8s linear infinite;
        }
        @keyframes profileSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Alert */
        .profile-alert {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
        }
        .profile-alert-danger {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
      `}</style>
    </div>
  );
}
