import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader, ShieldCheck, Lock, Check,
  Sparkles, Crown, Building2, RefreshCw
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
export default function Pricing() {
  const { role, user } = useAuth();
  const userRole = role || "SEEKER";
  const navigate = useNavigate();

  let firstName = "Cher Partenaire";
  if (user) {
    if (userRole === "OWNER" && (user as any).profile?.firstName) {
      firstName = (user as any).profile.firstName;
    } else if (userRole === "AGENCY" && (user as any).agency?.name) {
      firstName = (user as any).agency.name;
    }
  }

  const [plans, setPlans] = useState<any>({ seeker: [], owner: [], agency: [] });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [selectedPremiumPlanId, setSelectedPremiumPlanId] = useState<string>("");
  const [selectedSeekerPlanId, setSelectedSeekerPlanId] = useState<string>("");
  const [publicTab, setPublicTab] = useState<"OWNER" | "SEEKER" | "AGENCY">("OWNER");

  const fetchPlans = async () => {
    setLoading(true);
    setApiError(false);
    try {
      const response = await api.get("/payments/plans");
      const subscriptionPlans = response.data.subscriptionPlans || [];
      const ownerList = subscriptionPlans.filter((p: any) => p.targetRole === "OWNER");
      const agencyList = subscriptionPlans.filter((p: any) => p.targetRole === "AGENCY");
      const seekerList = subscriptionPlans.filter((p: any) => p.targetRole === "SEEKER");

      setPlans({ seeker: seekerList, owner: ownerList, agency: agencyList });

      const activeList = userRole === "OWNER" ? ownerList : agencyList;
      if (activeList.length > 0) {
        const pop = activeList.find((p: any) => p.popular) || activeList[0];
        setSelectedPremiumPlanId(pop?.id || "");
      }
      if (seekerList.length > 0) {
        const pop = seekerList.find((p: any) => p.popular) || seekerList[0];
        setSelectedSeekerPlanId(pop?.id || "");
      }
    } catch (error) {
      console.error("Erreur chargement des plans", error);
      setApiError(true);
      setPlans({ seeker: [], owner: [], agency: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan: any, type: string) => {
    navigate("/paiement", { state: { plan, type } });
  };

  const handlePremiumCheckout = (planId?: string) => {
    const activePlans = userRole === "OWNER" ? plans.owner : plans.agency;
    const id = planId || selectedPremiumPlanId;
    const dbPlan = activePlans.find((p: any) => p.id === id);
    if (dbPlan) {
      navigate("/paiement", {
        state: { plan: { id: dbPlan.id, name: dbPlan.name, code: dbPlan.code }, type: "SUBSCRIPTION" }
      });
    } else {
      alert("Veuillez selectionner un forfait.");
    }
  };

  const handleSeekerCheckout = () => {
    const selectedPlan = plans.seeker.find((p: any) => p.id === selectedSeekerPlanId);
    if (selectedPlan) {
      handleSelectPlan(selectedPlan, "Pass Chercheur VIP");
    } else {
      alert("Veuillez selectionner un forfait.");
    }
  };

  const parsedFeatures = (plan: any): string[] => {
    try {
      if (Array.isArray(plan.features)) return plan.features;
      if (typeof plan.features === "string") return JSON.parse(plan.features);
      return [];
    } catch {
      return [];
    }
  };

  const renderPremiumHero = () => (
    <div className="premium-hero-wrapper">
      <div className="premium-hero-header">
        <div className="premium-pill-tag">
          <Sparkles size={14} />
          <span>{userRole === "AGENCY" ? "Partenaire Agence" : "Partenaire Proprietaire"}</span>
        </div>
        <h1 className="premium-hero-title">
          <span className="premium-hero-name">{firstName},</span>{" "}
          ton futur {userRole === "AGENCY" ? "client" : "locataire"} t&apos;attend.
          <span className="premium-accent-text">Ne le rate pas.</span>
        </h1>
        <p className="premium-hero-subtitle">
          {userRole === "AGENCY"
            ? "Choisissez le plan adapte a la taille de votre agence."
            : "Sans Premium, ton annonce reste noyee. Avec Premium, tu apparais en premier."}
        </p>
        <div className="premium-stats-bar">
          <div className="premium-stat-item">
            <h3 className="premium-stat-number">3x</h3>
            <p className="premium-stat-label">plus de contacts</p>
          </div>
          <div className="premium-stat-item">
            <h3 className="premium-stat-number">+85%</h3>
            <p className="premium-stat-label">de vues</p>
          </div>
          <div className="premium-stat-item">
            <h3 className="premium-stat-number">2x</h3>
            <p className="premium-stat-label">plus rapide</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlanCards = (activePlans: any[]) => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <Loader className="spin" size={40} color="#C9A227" style={{ margin: "0 auto 1rem", display: "block" }} />
          <p style={{ color: "#64748b", fontSize: "1rem" }}>Chargement des offres Premium...</p>
        </div>
      );
    }

    if (!activePlans || activePlans.length === 0) {
      if (apiError) {
        return (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <p style={{ color: "#ef4444", marginBottom: "1rem", fontSize: "1rem" }}>
              Impossible de charger les offres Premium. Réessayer
            </p>
            <button onClick={fetchPlans} className="btn btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <RefreshCw size={16} /> Réessayer
            </button>
          </div>
        );
      } else {
        return (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <p style={{ color: "#64748b", marginBottom: "1rem", fontSize: "1rem" }}>
              Aucun plan premium disponible actuellement
            </p>
          </div>
        );
      }
    }

    return (
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1rem 3rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "clamp(1.3rem,4vw,1.8rem)", fontWeight: 800, color: "#0B1F3A", marginBottom: "0.5rem" }}>
            {userRole === "AGENCY" ? "Choisissez votre plan Agence" : "Passez a NESTORA Pro"}
          </h2>
          <p style={{ color: "#64748b", fontSize: "1rem" }}>
            {userRole === "AGENCY"
              ? "Developpez votre agence avec le plan adapte."
              : "Publiez gratuitement. Developpez votre visibilite quand vous le souhaitez."}
          </p>
          {apiError && (
            <p style={{ color: "#f59e0b", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              Prix indicatifs — montants confirmes lors du paiement.
            </p>
          )}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: activePlans.length === 1 ? "minmax(0, 480px)" : "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
          margin: activePlans.length === 1 ? "0 auto" : undefined,
        }}>
          {activePlans.map((plan: any) => {
            const isSelected = selectedPremiumPlanId === plan.id;
            const features = parsedFeatures(plan);
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPremiumPlanId(plan.id)}
                style={{
                  border: isSelected ? "2px solid #C9A227" : "2px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "1.75rem 1.5rem",
                  backgroundColor: isSelected ? "#fffbeb" : "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                  boxShadow: isSelected ? "0 4px 20px rgba(201,162,39,0.15)" : "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #C9A227 0%, #B89320 100%)",
                    color: "white", padding: "0.3rem 1.2rem", borderRadius: "999px",
                    fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", whiteSpace: "nowrap",
                  }}>
                    RECOMMANDE
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                      {userRole === "AGENCY" ? <Building2 size={20} color="#C9A227" /> : <Crown size={20} color="#C9A227" />}
                      <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0B1F3A" }}>{plan.name}</span>
                    </div>
                    <div style={{ color: "#64748b", fontSize: "0.85rem" }}>{plan.duration} jours / mois</div>
                  </div>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                    border: isSelected ? "2px solid #C9A227" : "2px solid #cbd5e1",
                    background: isSelected ? "#C9A227" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {isSelected && <Check size={14} color="white" />}
                  </div>
                </div>

                <div style={{ marginBottom: "1.25rem", paddingBottom: "1rem", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: "2rem", fontWeight: 900, color: "#0B1F3A" }}>
                    {plan.price?.toLocaleString("fr-FR")}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "#64748b", marginLeft: "0.3rem" }}>
                    {plan.currency || "FCFA"} / mois
                  </span>
                </div>

                {features.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {features.map((f: string, i: number) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.88rem", color: "#334155" }}>
                        <Check size={15} color="#16a34a" style={{ marginTop: "2px", flexShrink: 0 }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); handlePremiumCheckout(plan.id); }}
                  style={{
                    width: "100%", padding: "0.85rem", borderRadius: "10px", border: "none",
                    background: isSelected ? "linear-gradient(135deg, #C9A227 0%, #B89320 100%)" : "#0B1F3A",
                    color: "white", fontWeight: 700, fontSize: "0.95rem",
                    cursor: "pointer", transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  }}
                >
                  {userRole === "AGENCY" ? "Choisir " + plan.name : "Passer a NESTORA Pro"}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#16a34a", fontSize: "0.85rem" }}>
            <ShieldCheck size={16} /> Paiement 100% securise via Mobile Money et Carte bancaire
          </div>
          <p style={{ color: "#94a3b8", fontSize: "0.8rem", margin: 0 }}>
            Abonnement active apres confirmation du paiement. Annulable a tout moment.
          </p>
        </div>
      </div>
    );
  };

  const renderSeekerUI = () => (
    <div className="premium-subscription-container">
      <div className="text-center mb-4">
        <span className="badge" style={{ backgroundColor: "#fef3c7", color: "#b45309", fontWeight: 700, padding: "0.35rem 0.85rem", marginBottom: "0.5rem", display: "inline-block" }}>
          ESPACE CHERCHEUR
        </span>
        <h2 className="premium-section-heading">Pass Chercheur VIP</h2>
        <p className="premium-section-subheading">
          Accedez directement aux proprietaires sans limites
        </p>
      </div>

      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "1.25rem", marginBottom: "2rem" }}>
        <div style={{ fontWeight: 700, color: "#15803d", marginBottom: "0.75rem", fontSize: "0.95rem" }}>
          Tout ceci est GRATUIT pour vous :
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.4rem" }}>
          {["Recherche illimitee", "Consulter les annonces", "Ajouter aux favoris", "Contacter le proprietaire", "Demander une visite", "Poster une demande de logement"].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#166534" }}>
              <Check size={14} color="#16a34a" /> {f}
            </div>
          ))}
        </div>
      </div>

      {plans.seeker && plans.seeker.length > 0 ? (
        <>
          <div className="premium-cards-stack">
            {plans.seeker.map((plan: any) => {
              const isSelected = selectedSeekerPlanId === plan.id;
              return (
                <div key={plan.id} className={"premium-card" + (isSelected ? " selected" : "")} onClick={() => setSelectedSeekerPlanId(plan.id)}>
                  <div className="premium-card-left">
                    <div className={"premium-radio" + (isSelected ? " checked" : "")}></div>
                    <div className="premium-card-info">
                      <div className="premium-card-title-row">
                        <span className="premium-card-title">{plan.name}</span>
                        {plan.popular && <span className="premium-badge-popular">POPULAIRE</span>}
                      </div>
                      <div className="premium-card-monthly">Contacts illimites pendant {plan.duration} jours</div>
                    </div>
                  </div>
                  <div className="premium-card-right">
                    <div className="premium-price-current">
                      <span className="price-number">{plan.price}</span>
                      <span className="price-currency">{plan.currency || "FCFA"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="premium-action-container">
            <button className="btn btn-primary btn-premium-checkout" onClick={handleSeekerCheckout}>
              Continuer vers le paiement
            </button>
          </div>
        </>
      ) : (
        <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontWeight: 700, color: "#0B1F3A", marginBottom: "0.5rem" }}>Option Demande Prioritaire</div>
          <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
            Mettez votre demande en avant pour 1 000 a 2 500 FCFA depuis votre espace Demandes.
          </p>
        </div>
      )}
    </div>
  );

  const renderPublicPricing = () => (
    <div className="public-pricing-wrapper">
      <div className="public-pricing-header">
        <h1 className="public-pricing-title">Tarification simple et transparente</h1>
        <p className="public-pricing-subtitle">Creez votre compte gratuitement. Payez uniquement pour plus de visibilite.</p>
        <div className="pricing-mobile-segmented">
          <button className={"segmented-btn" + (publicTab === "OWNER" ? " active" : "")} onClick={() => setPublicTab("OWNER")}>Proprietaires</button>
          <button className={"segmented-btn" + (publicTab === "SEEKER" ? " active" : "")} onClick={() => setPublicTab("SEEKER")}>Chercheurs</button>
          <button className={"segmented-btn" + (publicTab === "AGENCY" ? " active" : "")} onClick={() => setPublicTab("AGENCY")}>Agences</button>
        </div>
      </div>

      <div className="public-pricing-grid">
        <div className={"public-pricing-card" + (publicTab !== "SEEKER" ? " mobile-hidden" : "")}>
          <h3 className="pricing-card-role text-blue">Chercheurs</h3>
          <p className="pricing-card-target">Tout pour trouver gratuitement</p>
          <div className="pricing-card-price">Gratuit<span className="pricing-card-period"> / a vie</span></div>
          <div className="pricing-features-heading">Inclus gratuitement :</div>
          <ul className="pricing-features-list">
            <li><Check size={18} color="#10b981" /> <span>Recherche illimitee</span></li>
            <li><Check size={18} color="#10b981" /> <span>Contact proprietaire</span></li>
            <li><Check size={18} color="#10b981" /> <span>Messagerie securisee</span></li>
            <li><Check size={18} color="#10b981" /> <span>Demande de visite gratuite</span></li>
            <li><Check size={18} color="#10b981" /> <span>Demande Je cherche</span></li>
            <div className="pricing-divider"></div>
            <li><Lock size={16} color="#94a3b8" /> <span className="text-muted">Demande prioritaire (1 000 FCFA)</span></li>
          </ul>
          <button className="btn btn-outline pricing-btn" onClick={() => navigate("/inscription", { state: { role: "SEEKER" } })}>
            S inscrire comme chercheur
          </button>
        </div>

        <div className={"public-pricing-card card-featured" + (publicTab !== "OWNER" ? " mobile-hidden" : "")}>
          <div className="pricing-popular-pill">LE PLUS POPULAIRE</div>
          <h3 className="pricing-card-role text-gold">Proprietaires</h3>
          <p className="pricing-card-target text-slate">Publiez gratuitement. Boostez quand vous le souhaitez.</p>
          <div className="pricing-card-price text-white">Freemium<span className="pricing-card-period text-slate"> / Pro des 3 000 FCFA</span></div>
          <div className="pricing-features-heading text-gold">Inclus gratuitement :</div>
          <ul className="pricing-features-list list-light">
            <li><Check size={18} color="#C9A227" /> <span>Profil verifie</span></li>
            <li><Check size={18} color="#C9A227" /> <span>Publication d annonces</span></li>
            <li><Check size={18} color="#C9A227" /> <span>Reception des messages</span></li>
            <li><Check size={18} color="#C9A227" /> <span>Gestion des visites</span></li>
            <div className="pricing-divider divider-light"></div>
            <li><Lock size={16} color="#64748b" /> <span className="text-slate">Statistiques avancees (Pro)</span></li>
            <li><Lock size={16} color="#64748b" /> <span className="text-slate">Badge Pro (Pro)</span></li>
          </ul>
          <button className="btn btn-primary pricing-btn btn-gold" onClick={() => navigate("/inscription", { state: { role: "OWNER" } })}>
            Devenir annonceur
          </button>
        </div>

        <div className={"public-pricing-card" + (publicTab !== "AGENCY" ? " mobile-hidden" : "")}>
          <h3 className="pricing-card-role text-purple">Agences</h3>
          <p className="pricing-card-target">Starter / Pro / Business</p>
          <div className="pricing-card-price">Des<span className="pricing-card-period"> 7 500 FCFA / mois</span></div>
          <div className="pricing-features-heading">Starter inclus :</div>
          <ul className="pricing-features-list">
            <li><Check size={18} color="#10b981" /> <span>Profil Agence Certifiee</span></li>
            <li><Check size={18} color="#10b981" /> <span>Gestion des agents</span></li>
            <li><Check size={18} color="#10b981" /> <span>Annonces illimitees</span></li>
            <li><Check size={18} color="#10b981" /> <span>Tableau de bord de performance</span></li>
            <div className="pricing-divider"></div>
            <li><Lock size={16} color="#94a3b8" /> <span className="text-muted">Boosts groupes (Pro)</span></li>
            <li><Lock size={16} color="#94a3b8" /> <span className="text-muted">Stats completes (Business)</span></li>
          </ul>
          <button className="btn btn-outline pricing-btn btn-purple" onClick={() => navigate("/inscription", { state: { role: "AGENCY" } })}>
            Creer un compte Agence
          </button>
        </div>
      </div>
    </div>
  );

  if (loading && (userRole === "OWNER" || userRole === "AGENCY")) {
    return (
      <div className="pricing-page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <Loader className="spin" size={48} color="#C9A227" style={{ margin: "0 auto 1rem", display: "block" }} />
          <p style={{ color: "#64748b" }}>Chargement des offres Premium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-page-container">
      {!user && (
        <div className="public-pricing-section">{renderPublicPricing()}</div>
      )}
      {user && userRole === "SEEKER" && (
        <div className="pricing-section">{renderSeekerUI()}</div>
      )}
      {user && (userRole === "OWNER" || userRole === "AGENCY") && (
        <div className="pricing-section">
          {renderPremiumHero()}
          {renderPlanCards(userRole === "OWNER" ? plans.owner : plans.agency)}
        </div>
      )}
      <style>{`
        .pricing-page-container { padding: 1.5rem 1rem calc(100px + env(safe-area-inset-bottom)); min-height: calc(100vh - 80px); background: #f8fafc; }
        .pricing-mobile-segmented { display: none; background: #e2e8f0; padding: 4px; border-radius: 12px; margin: 1.5rem auto 0; max-width: 380px; width: 100%; }
        .segmented-btn { flex: 1; padding: 0.65rem 0.5rem; border: none; background: transparent; border-radius: 9px; font-weight: 600; font-size: 0.88rem; color: #64748b; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .segmented-btn.active { background: #fff; color: #0B1F3A; box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
        @media (max-width: 768px) { .pricing-mobile-segmented { display: flex; } .public-pricing-card.mobile-hidden { display: none !important; } }
        .premium-hero-wrapper { max-width: 820px; margin: 0 auto; }
        .premium-hero-header { text-align: center; margin-bottom: 2rem; }
        .premium-pill-tag { display: inline-flex; align-items: center; gap: 0.45rem; background: #fef3c7; color: #92400e; border: 1px solid #fde68a; padding: 0.35rem 0.95rem; border-radius: 999px; font-size: 0.8rem; font-weight: 700; margin-bottom: 1.15rem; }
        .premium-hero-title { font-size: clamp(1.4rem, 5vw, 2.15rem); font-weight: 800; color: #0B1F3A; line-height: 1.3; margin-bottom: 0.85rem; max-width: 650px; margin-left: auto; margin-right: auto; }
        .premium-hero-name { color: #0B1F3A; font-weight: 800; }
        .premium-accent-text { color: #d97706; display: block; margin-top: 0.25rem; }
        .premium-hero-subtitle { font-size: clamp(0.9rem,3.2vw,1.05rem); color: #475569; max-width: 550px; margin: 0 auto 1.5rem; line-height: 1.65; }
        .premium-stats-bar { display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .premium-stat-item { text-align: center; }
        .premium-stat-number { font-size: 1.6rem; font-weight: 900; color: #0B1F3A; margin: 0; }
        .premium-stat-label { font-size: 0.75rem; color: #64748b; margin: 0; }
        .pricing-section { max-width: 960px; margin: 0 auto; }
        .public-pricing-section { max-width: 1140px; margin: 0 auto; }
        .public-pricing-wrapper { padding: 1rem 0; }
        .public-pricing-header { text-align: center; margin-bottom: 2rem; }
        .public-pricing-title { font-size: clamp(1.5rem,5vw,2.2rem); font-weight: 800; color: #0B1F3A; margin-bottom: 0.75rem; }
        .public-pricing-subtitle { color: #475569; font-size: 1.05rem; }
        .public-pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .public-pricing-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem 1.5rem; display: flex; flex-direction: column; }
        .public-pricing-card.card-featured { background: #0B1F3A; border-color: #C9A227; border-width: 2px; position: relative; overflow: hidden; padding-top: 2.5rem; }
        .pricing-popular-pill { position: absolute; top: 0; left: 0; right: 0; background: #C9A227; color: white; text-align: center; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; padding: 0.35rem; border-radius: 14px 14px 0 0; }
        .pricing-card-role { font-size: 1.3rem; font-weight: 800; margin-bottom: 0.3rem; }
        .text-blue { color: #3b82f6; } .text-gold { color: #C9A227; } .text-purple { color: #8b5cf6; } .text-white { color: white; } .text-slate { color: #94a3b8; }
        .pricing-card-target { color: #64748b; font-size: 0.9rem; margin-bottom: 1rem; }
        .pricing-card-price { font-size: 1.8rem; font-weight: 900; color: #0B1F3A; margin-bottom: 1rem; }
        .pricing-card-period { font-size: 0.85rem; font-weight: 400; }
        .pricing-features-heading { font-weight: 700; margin-bottom: 0.75rem; font-size: 0.85rem; color: #64748b; }
        .pricing-features-list { list-style: none; padding: 0; margin: 0 0 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
        .pricing-features-list li { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.88rem; color: #334155; }
        .list-light .pricing-features-list li { color: #cbd5e1; }
        .text-muted { color: #94a3b8; }
        .pricing-divider { height: 1px; background: #e2e8f0; margin: 0.5rem 0; }
        .divider-light { background: #1e3a5f; }
        .pricing-btn { width: 100%; padding: 0.85rem; font-weight: 700; border-radius: 10px; margin-top: auto; }
        .btn-gold { background: linear-gradient(135deg, #C9A227 0%, #B89320 100%) !important; border: none !important; color: white !important; }
        .btn-purple { color: #8b5cf6; border-color: #8b5cf6; }
        .premium-subscription-container { max-width: 620px; margin: 0 auto; }
        .premium-section-heading { font-size: 1.6rem; font-weight: 800; color: #0B1F3A; margin-bottom: 0.5rem; }
        .premium-section-subheading { color: #64748b; margin-bottom: 1.5rem; }
        .premium-cards-stack { display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.5rem; }
        .premium-card { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border: 2px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.2s; background: white; }
        .premium-card.selected { border-color: #C9A227; background: #fffbeb; }
        .premium-card-left { display: flex; align-items: center; gap: 0.85rem; }
        .premium-radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid #cbd5e1; flex-shrink: 0; transition: all 0.2s; }
        .premium-radio.checked { border-color: #C9A227; background: #C9A227; }
        .premium-card-title-row { display: flex; align-items: center; gap: 0.5rem; }
        .premium-card-title { font-weight: 700; color: #0B1F3A; }
        .premium-badge-popular { background: #C9A227; color: white; font-size: 0.65rem; padding: 0.1rem 0.5rem; border-radius: 999px; font-weight: 700; }
        .premium-card-monthly { font-size: 0.82rem; color: #64748b; margin-top: 0.2rem; }
        .premium-card-right { text-align: right; }
        .premium-price-current { display: flex; align-items: baseline; gap: 0.25rem; }
        .price-number { font-size: 1.3rem; font-weight: 900; color: #0B1F3A; }
        .price-currency { font-size: 0.8rem; color: #64748b; }
        .premium-action-container { margin-top: 1rem; }
        .btn-premium-checkout { width: 100%; padding: 1rem; font-size: 1.05rem; font-weight: 700; border-radius: 12px; }
        @media (max-width: 640px) { .public-pricing-grid { grid-template-columns: 1fr; } .premium-stats-bar { gap: 1rem; } }
      `}</style>
    </div>
  );
}
