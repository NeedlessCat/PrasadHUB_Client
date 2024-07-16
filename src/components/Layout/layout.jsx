/* eslint-disable react/prop-types */
import Footer from "../Footer/footer";
import Navbar from "../Navbar/navbar";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="main-content min-h-screen">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
