import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './pages.css'
import App from './App.tsx'

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#d93025' }}>Une erreur inattendue est survenue</h1>
          <p>L'application n'a pas pu se charger correctement.</p>
          <pre style={{ textAlign: 'left', background: '#f1f3f4', padding: '1rem', borderRadius: '8px', display: 'inline-block', maxWidth: '800px', overflow: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
          <br />
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#0B1F3A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
