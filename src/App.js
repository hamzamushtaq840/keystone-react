import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import CompanyInfo from './pages/CompanyInfo';
import Dashboard from './pages/Dashboard';
import AddDriver from './components/Driver/DriverModule';
import EmailSent from './components/Signin/EmailSent';
import EmailVerification from './components/Signup/EmailVerification';
import EquipmentDashboard from './components/Equipment/EquipmentDashboard';
import ForgetPassword from './components/Signin/ForgetPassword';
import InviteOnboard from './components/InviteTeam/InviteOnboard';
import InviteTeam from './pages/InviteTeam';
import MaintenanceListing from './components/Maintenance/MaintenanceListing';
import Commodity from './components/NavComponents/Commodity';
import Driver from './components/NavComponents/Driver';
import Equipment from './components/NavComponents/Equipment';
import PasswordChanged from './components/Signin/PasswordChanged';
import SetNewPassword from './components/Signin/SetNewPassword';
import AddTrailer from './components/Equipment/TrailerModule';
import AddTruck from './components/Equipment/TruckModule';
import Signin from './pages/SignIn';
import Signup from './pages/SignUp';
import { logout } from './reducers/userSlice';
import { scheduleTokenClear } from './utils/authTokenHandler';
import { persistor } from './store/store';
import Layout from './layouts/Layout';
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const loggedInUser = localStorage.getItem("authToken");
  //   if (loggedInUser) {
  //     // const foundUser = JSON.parse(loggedInUser);
  //     // setUser(foundUser);
  //     console.log(loggedInUser, "new")
  //   }
  // }, []);


  useEffect(() => {
    scheduleTokenClear();
  }, []);

  useEffect(() => {
    const unauthorizedHandler = () => {
      navigate('/');
      dispatch(logout());

    };
    setTimeout(() => {
      // Purge the persisted state
      persistor.purge();
    }, 600000); // Purge the state after 10 seconds

    window.addEventListener('unauthorized', unauthorizedHandler);

    return () => {
      window.removeEventListener('unauthorized', unauthorizedHandler);
    }
  }, [navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Signin /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/forgotpassword" element={<ForgetPassword />} />
      <Route path="/setpassword" element={<SetNewPassword />} />
      <Route path="/verify" element={<EmailVerification />} />
      <Route path="/emailsent" element={<EmailSent />} />
      <Route path="/passwordchanged" element={<PasswordChanged />} />

      {/* Protected Routes */}
      <Route element={<Layout />} >
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />


      <Route path="/invite" element={<ProtectedRoute><InviteTeam /></ProtectedRoute>} />
      <Route path="/inviteonboard" element={<InviteOnboard />} />
      <Route path="/commodity" element={<ProtectedRoute><Commodity /></ProtectedRoute>} />
      <Route path="/equipment" element={<ProtectedRoute><Equipment /></ProtectedRoute>} />
      <Route path="/addtruck" element={<ProtectedRoute><AddTruck /></ProtectedRoute>} />
      <Route path="/addtrailer" element={<ProtectedRoute><AddTrailer /></ProtectedRoute>} />
      <Route path="/adddriver" element={<ProtectedRoute><AddDriver /></ProtectedRoute>} />

      <Route path="/driver" element={<ProtectedRoute><Driver /></ProtectedRoute>} />
      <Route path="/maintenancelisting" element={<ProtectedRoute><MaintenanceListing /></ProtectedRoute>} />

      <Route path="/equipmentdashboard" element={<ProtectedRoute><EquipmentDashboard /></ProtectedRoute>} />
      </Route>
      <Route path="/companyonboard" element={<ProtectedRoute><CompanyInfo /></ProtectedRoute>} />




    </Routes>
  );
}

export default App;
