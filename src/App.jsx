import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminCreatePanel from "./Components/AdminCreatePanel";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AdminPanel from "./pages/AdminPanel";
import AdminUpdatePanel from "./Components/AdminUpdatePanel";
import AdminDeletePanel from "./Components/AdminDeletePanel";
import ProblemPage from "./pages/ProblemPage";
import PremiumPanel from "./Components/PremiumPanel";
import ContestPanel from "./Components/ContestPanel";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DiscussPanel from "./pages/DiscussPanel";
import Contestpage from "./pages/Contestpage";
import LandingPage from "./pages/LandingPage";
import { Provider } from "react-redux";
import {store} from "./store/store"
import ThemeProvider from "./Components/ThemeProvider";
import Success from "./pages/Success";
import Canceled from "./pages/Canceled";
import AdminVideo from "./Components/AdminVideo";
import AdminUpload from "./Components/AdminUpload";
import DSVisualizer from "./pages/DSVisualizer";
import Leaderboard from "./Components/Leaderboard";
import { Home } from "lucide-react";
export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Provider store={store}>
       <ThemeProvider>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
     <Routes>
  {/* Public routes */}
  <Route path="/" element={ isAuthenticated?<Homepage></Homepage>:<LandingPage />} />
  <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login></Login>} />
  <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <Signup />} />
  <Route path="/visualizer" element={isAuthenticated ?<DSVisualizer />:<Login></Login>} />

  {/* Protected routes */}
  <Route path="/home" element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />} />
  <Route path="/problem" element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />} />
  <Route path="/premium" element={isAuthenticated ? <PremiumPanel /> : <Navigate to="/login" />} />
  <Route path="/contest" element={isAuthenticated ? <Contestpage /> : <Navigate to="/login" />} />
  <Route path="/aa" element={isAuthenticated ? <DiscussPanel /> : <Navigate to="/login" />} />
  <Route path="/payment/success" element={ <Success />} />
  <Route path="/payment/cancel" element={<Canceled />} />
  <Route path="/leaderboard" element={isAuthenticated? <Leaderboard></Leaderboard>:<Navigate to="/login" />}></Route>

  {/* Admin routes */}
  <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/login" />} />
  <Route path="/admin/create-problem" element={isAuthenticated && user?.role === 'admin' ? <AdminCreatePanel /> : <Navigate to="/login" />} />
  <Route path="/admin/update-problem" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdatePanel /> : <Navigate to="/login" />} />
  <Route path="/admin/delete-problem" element={isAuthenticated && user?.role === 'admin' ? <AdminDeletePanel /> : <Navigate to="/login" />} />
  <Route path="/admin/create-contest" element={isAuthenticated && user?.role === 'admin' ? <ContestPanel /> : <Navigate to="/login" />} />
  <Route path="/admin/video-management" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/login" />} />
  <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/login" />} />


</Routes>
      </ThemeProvider>
    </ Provider>
  );
}



  