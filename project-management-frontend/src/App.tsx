import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import PageNotFound from './Pages/PageNotFound';
import ForgotPassword from './Pages/ForgetPassword';
import ChangePassword from './Pages/ChangePassword';
import Register from './Pages/Register';
import EmailVerification from './Pages/EmailVerification';

import Dashboard from './Pages/Dashboard';

import Backlog from './Pages/Backlog';





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/registration" element={<Register />} />

        <Route path="/Dashboard" element={<Dashboard />} />

        <Route path="/backlog" element={<Backlog />} />
        
      </Routes>
    </Router>
  );
}

export default App;