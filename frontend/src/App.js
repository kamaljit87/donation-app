import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import DonatePage from './pages/DonatePage';
import InitiativesPage from './pages/InitiativesPage';
import InitiativeDetail from './pages/InitiativeDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ThankYouPage from './pages/ThankYouPage';
import AboutUs from './pages/AboutUs';
import InspirationPage from './pages/InspirationPage';
import ContactUs from './pages/ContactUs';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<DonatePage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/about" element={<InspirationPage />} />
          <Route path="/inspiration" element={<AboutUs />} />
          <Route path="/initiatives" element={<InitiativesPage />} />
          <Route path="/initiatives/:slug" element={<InitiativeDetail />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </AuthProvider>
  );
}

export default App;
