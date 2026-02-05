import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import SplashScreen from "./components/chat/SplashScreen";

function AppRouter() {
  const location = useLocation();
  
  // Check URL fragment for session_id (auth callback)
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/chat/:chatId" element={<ChatPage />} />
    </Routes>
  );
}

function AuthCallback() {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);
  
  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    
    const processAuth = async () => {
      const hash = window.location.hash;
      const sessionId = hash.split('session_id=')[1]?.split('&')[0];
      
      if (sessionId) {
        try {
          const API_URL = process.env.REACT_APP_BACKEND_URL;
          const response = await fetch(`${API_URL}/api/auth/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ session_id: sessionId })
          });
          
          if (response.ok) {
            const user = await response.json();
            // Clear the hash and navigate
            window.history.replaceState(null, '', '/');
            navigate('/', { state: { user }, replace: true });
            return;
          }
        } catch (error) {
          console.error('Auth error:', error);
        }
      }
      
      // If auth failed, just go to home
      window.history.replaceState(null, '', '/');
      navigate('/', { replace: true });
    };
    
    processAuth();
  }, [navigate]);
  
  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-white text-center">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Signing in...</p>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {showSplash && <SplashScreen />}
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
