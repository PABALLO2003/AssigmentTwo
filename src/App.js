import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import LecturerDashboard from './LecturerDashboard';
import StudentDashboard from './StudentDashboard';
import PRLDashboard from './PRLDashboard';
import PLDashboard from './PLDashboard'; // ✅ PL route added

import NotFound from './NotFound';
import PrivateRoute from './PrivateRoute';
import ViewModules from './ViewModules';
import Monitoring from './Monitoring';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Student Routes */}
        <Route path="/student" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
        <Route path="/student/modules" element={<PrivateRoute><ViewModules /></PrivateRoute>} />
        <Route path="/student/monitoring" element={<PrivateRoute><Monitoring /></PrivateRoute>} />

        {/* Lecturer Route */}
        <Route path="/lecturer" element={<PrivateRoute><LecturerDashboard /></PrivateRoute>} />

        {/* PRL Route */}
        <Route path="/prl" element={<PrivateRoute><PRLDashboard /></PrivateRoute>} />

        {/* PL Route */}
        <Route path="/pl" element={<PrivateRoute><PLDashboard /></PrivateRoute>} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;