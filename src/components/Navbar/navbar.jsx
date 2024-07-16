import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  // get user from localStorage
  const user = JSON.parse(localStorage.getItem("users"));

  // navigate
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // logout function
  const logout = () => {
    localStorage.clear("users");
    navigate("/");
  };
  // navList Data
  const navList = (
    <ul className="flex space-x-8 text-white font-medium text-md ">
      {/* Home */}
      <li>
        <Link to={"/"}>Home</Link>
      </li>

      {/* All Product */}
      {/* <li>
        <Link to={"/catalog"}>Catalog</Link>
      </li> */}

      {/* Signup */}
      <li>
        <Link to={"/about"}>About Us</Link>
      </li>

      {/* Admin */}
      {!user ? (
        <li>
          <Link to={"/login"}>Admin Login</Link>
        </li>
      ) : (
        <li className=" cursor-pointer" onClick={logout}>
          Logout
        </li>
      )}

      {/* Cart */}
      {user?.role === "admin" && (
        <li>
          <Link to={"/admin-dashboard"}>Dashboard</Link>
        </li>
      )}
    </ul>
  );
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black bg-opacity-80" : "bg-transparent"
      }`}
    >
      {/* main  */}
      <div className="container mx-auto lg:flex lg:justify-between items-center py-4 px-6 ">
        {/* left  */}
        <div className="left py-3 lg:py-0">
          <Link to={"/"}>
            <h2 className=" font-bold text-white text-2xl text-center">
              PrasahHUB
            </h2>
          </Link>
        </div>

        {/* right  */}
        <div className="right flex justify-center mb-4 lg:mb-0">{navList}</div>
      </div>
    </nav>
  );
};

export default Navbar;
