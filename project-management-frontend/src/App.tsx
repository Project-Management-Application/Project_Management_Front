import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
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
import SetupPage from './Pages/SetupPage';
import Projects from './Components/Dashboard/Projects';
import Members from './Components/Dashboard/members';
// Capitalized import

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
        <Route path="/Setup" element={<SetupPage />} />
        <Route path="/Dashboard" element={<Dashboard />}>
          <Route path="projects" element={<Projects />} />
          <Route path="members" element={<Members />} /> {/* Fixed path */}
        </Route>
        <Route path="/backlog/:projectId" element={<Backlog />} />
      </Routes>
    </Router>
  );
}

export default App;