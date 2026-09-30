import React, { useState, useRef } from 'react';
import { X, Camera, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import api from '../../lib/api';

interface EditProfileModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProfileModal({ onClose, onSuccess }: EditProfileModalProps) {
  const { user, role, updateUser } = useAuth();
  
  const [firstName, setFirstName] = useState(user?.profile?.firstName || '');
  const [lastName, setLastName] = useState(user?.profile?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [avatar, setAvatar] = useState(user?.profile?.avatar || '');
  
  // Agence
  const [documentUrl, setDocumentUrl] = useState(user?.profile?.documentUrl || '');

  // Propriétaire & Agence
  const needsDocument = role === 'AGENCY' || role === 'OWNER';

  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

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

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-doc-${Math.random()}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    setUploadingDoc(true);
    try {
      // Assuming a "documents" bucket exists
      const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('documents').getPublicUrl(filePath);
      setDocumentUrl(data.publicUrl);
    } catch (err: any) {
      setError("Erreur lors de l'upload du document.");
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.put('/auth/profile', {
        firstName,
        lastName,
        phone,
        avatar,
        bio,
        documentUrl
      });

      if (updateUser && res.data?.user) {
        // Use the returned user to ensure exact sync
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
  
  if (firstName.trim()) completionScore += 15; else missingFields.push("Prénom");
  if (lastName.trim()) completionScore += 15; else missingFields.push("Nom");
  if (phone.trim()) completionScore += 20; else missingFields.push("Téléphone");
  if (avatar) completionScore += 20; else missingFields.push("Photo de profil");
  if (bio.trim()) completionScore += 10; else missingFields.push("Bio");
  if (needsDocument) {
    if (documentUrl) completionScore += 20; else missingFields.push("Document légal/ID");
  } else {
    // Si pas de document requis, répartir les 20% restants
    completionScore += 20;
  }

  // Empêcher d'avoir plus de 100% ou moins de 0%
  completionScore = Math.min(100, Math.max(0, completionScore));

  const getProgressColor = () => {
    if (completionScore < 50) return '#e74c3c';
    if (completionScore < 80) return '#f1c40f';
    return '#2ecc71';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content profile-modal">
        <div className="modal-header">
          <h2 className="modal-title">Modifier mon profil</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="alert alert-danger mb-4">{error}</div>}

          {/* Progress Bar */}
          <div className="profile-progress-container mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="font-weight-bold" style={{ fontSize: '0.9rem' }}>Complétion du profil</span>
              <span className="badge" style={{ backgroundColor: getProgressColor(), color: '#fff' }}>{completionScore}%</span>
            </div>
            <div className="progress" style={{ height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${completionScore}%`, 
                  backgroundColor: getProgressColor(),
                  transition: 'width 0.3s ease, background-color 0.3s ease'
                }} 
              ></div>
            </div>
            {completionScore < 100 && (
              <div className="mt-2 text-sm" style={{ color: '#64748b' }}>
                <strong>Reste à compléter :</strong> {missingFields.join(', ')}
              </div>
            )}
          </div>

          {/* Avatar Upload */}
          <div className="avatar-upload-container text-center mb-4">
            <div 
              className="avatar-preview-wrapper"
              onClick={() => fileInputRef.current?.click()}
            >
              <img 
                src={avatar || "https://ui-avatars.com/api/?name=" + (firstName || 'User')} 
                alt="Avatar" 
                className="avatar-preview"
              />
              <div className="avatar-overlay">
                {uploadingAvatar ? <span className="loader-sm"></span> : <Camera size={24} color="white" />}
              </div>
            </div>
            <p className="text-sm text-light mt-2" style={{ cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
              Cliquez pour changer la photo
            </p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Prénom *</label>
              <input 
                type="text" 
                className="form-control" 
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Nom *</label>
              <input 
                type="text" 
                className="form-control" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label>Téléphone / WhatsApp *</label>
            <input 
              type="text" 
              className="form-control" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+228 XX XX XX XX"
              required
            />
          </div>

          {needsDocument && (
            <div className="form-group mb-3 document-upload-group">
              <label>
                {role === 'AGENCY' ? "Document d'entreprise (RCCM, NIF, etc.)" : "Pièce d'identité (Carte, Passeport, Permis)"}
                <span className="text-light text-sm d-block mt-1">Requis pour garantir votre crédibilité sur la plateforme</span>
              </label>
              <div className="document-upload-box" onClick={() => docInputRef.current?.click()}>
                {uploadingDoc ? (
                  <span className="loader-sm" style={{ borderColor: 'var(--color-primary)' }}></span>
                ) : documentUrl ? (
                  <div className="document-success">
                    <span className="badge-success">Document uploadé avec succès</span>
                    <span className="text-sm">Cliquez pour modifier</span>
                  </div>
                ) : (
                  <>
                    <Upload size={20} color="var(--color-text-light)" />
                    <span>Ajouter un document (PDF, JPG, PNG)</span>
                  </>
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
          )}

          <div className="form-group mb-4">
            <label>À propos de vous (Bio)</label>
            <textarea 
              className="form-control" 
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              placeholder="Décrivez votre profil en quelques mots..."
            />
          </div>

          <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || uploadingAvatar || uploadingDoc}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(11, 31, 58, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }
        .modal-content.profile-modal {
          background: #fff;
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }
        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text-dark);
          margin: 0;
        }
        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-light);
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .modal-close:hover {
          background: var(--color-background);
          color: var(--color-text-dark);
        }
        .modal-body {
          padding: 1.5rem;
          max-height: 80vh;
          overflow-y: auto;
        }
        .avatar-preview-wrapper {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin: 0 auto;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        .avatar-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .avatar-preview-wrapper:hover .avatar-overlay {
          opacity: 1;
        }
        
        .form-control {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.95rem;
          margin-top: 0.25rem;
          transition: all 0.2s;
        }
        .form-control:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(11, 31, 58, 0.1);
        }
        .form-group label {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--color-text-dark);
        }
        .document-upload-box {
          border: 2px dashed var(--color-border);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          background-color: var(--color-background);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-light);
          font-size: 0.9rem;
          transition: all 0.2s;
          margin-top: 0.25rem;
        }
        .document-upload-box:hover {
          border-color: var(--color-primary);
          background-color: rgba(11, 31, 58, 0.02);
        }
        .document-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }
        .loader-sm {
          width: 20px;
          height: 20px;
          border: 2px solid #fff;
          border-bottom-color: transparent;
          border-radius: 50%;
          display: inline-block;
          animation: rotation 1s linear infinite;
        }
        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
