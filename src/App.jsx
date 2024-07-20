import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/home";
import NoPage from "./pages/NoPage/nopage";
import ScrollTop from "./components/ScrollTop/scrollTop";
import Login from "./pages/Registration/login";
import AdminDashboard from "./pages/Dashboard/adminDashboard";
import MyState from "./context/myState";
import TakeawayForm from "./pages/Forms/takeawayForm";
import { Toaster } from "react-hot-toast";
import UpdateForeignForm from "./pages/Forms/updateForm";
import DeliveryForm from "./pages/Forms/deliveryForm";
import { ProtectedRouteForAdmin } from "./protectedRoute/protectAdmin";
import AboutPage from "./pages/AboutPage/AboutPage";
import Signup from "./pages/Registration/signup";

const App = () => {
  return (
    <MyState>
      <Router>
        <ScrollTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<NoPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-signup" element={<Signup />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRouteForAdmin>
                <AdminDashboard />{" "}
              </ProtectedRouteForAdmin>
            }
          />
          <Route path="/category/takeaway" element={<TakeawayForm />} />
          <Route path="/category/delivery" element={<DeliveryForm />} />
          <Route path="/category/update" element={<UpdateForeignForm />} />
        </Routes>
        <Toaster />
      </Router>
    </MyState>
  );
};

export default App;
