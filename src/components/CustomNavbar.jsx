// import { useEffect, useState,useContext } from "react";
// import { data, NavLink as ReactLink, useNavigate } from "react-router-dom";
// import { Navbar,NavbarBrand,NavLink,NavbarToggler,Collapse,Nav,NavItem,UncontrolledDropdown,DropdownMenu,DropdownToggle,DropdownItem,NavbarText } from "reactstrap";
// import { isLoggedIn, getCurrentUserDetail, doLogout  } from "../auth";
// import userContext from "../context/userContext";

// const CustomNavbar = () => {
//     const userContextData=useContext(userContext)
    
//     const [isOpen, setIsOpen]=useState(false)
//     const [login,setLogin]=useState(false)
//     const [user,setUser]=useState(undefined)

//     const navigate = useNavigate();

//     useEffect(()=>{
//         setLogin(isLoggedIn())
//         setUser(getCurrentUserDetail())
//     },[login]);

//     // const handleLogout = () => {
//     //     doLogout(() => {
//     //         setLogin(false);
//     //         navigate("/login");
//     //     });
//     // };

//     const logout=()=>{
//         doLogout(()=>{
//             //logged out
//             setLogin(false)
//             userContextData.setUser({
//                 data:null,
//                 login:false
//             })
//             navigate("/")
//         })
//     }

//     return (
//         <div>
//             <Navbar
//                 color="dark"
//                 dark
//                 expand="md"
//                 fixed=""
//                 className="px-5"
//             >
//                 <NavbarBrand tag={ReactLink} to='/'>
//                     MyBlogs
//                 </NavbarBrand>
//                 <NavbarToggler onClick={()=>setIsOpen(!isOpen)} />
//                 <Collapse isOpen={isOpen} navbar>
//                     <Nav
//                         className="me-auto"
//                         navbar
//                     >
//                         <NavItem>
//                             <NavLink tag={ReactLink} to="/" >
//                                 New Feed
//                             </NavLink>
//                         </NavItem>
//                         <NavItem>
//                             <NavLink tag={ReactLink} to="/about" >
//                                 About
//                             </NavLink>
//                         </NavItem>
//                         <NavItem>
//                             <NavLink tag={ReactLink} to="/services" >
//                                 Services
//                             </NavLink>
//                         </NavItem>
//                         <UncontrolledDropdown
//                             inNavbar
//                             nav
//                         >
//                             <DropdownToggle
//                                 caret
//                                 nav
//                             >
//                                 More
//                             </DropdownToggle>
//                             <DropdownMenu right>
//                                 <DropdownItem tag={ReactLink} to="/contact">
//                                     Contact us
//                                 </DropdownItem>
//                                 <DropdownItem tag={ReactLink}to="/facebook">
//                                     Facebook
//                                 </DropdownItem>
//                                 <DropdownItem divider />
//                                 <DropdownItem>
//                                     YouTube
//                                 </DropdownItem>
//                                 <DropdownItem>
//                                     Instagram
//                                 </DropdownItem>
//                                 <DropdownItem>
//                                     LinkedIn
//                                 </DropdownItem>
//                             </DropdownMenu>
//                         </UncontrolledDropdown>
//                     </Nav>
//                     <Nav navbar>
//                         {
//                             login ? (
//                                 <>
//                                     <NavItem>
//                                         <NavLink tag={ReactLink} to={`/user/profile-info/${user.id}`}>
//                                             Profile Info
//                                         </NavLink>
//                                     </NavItem>

//                                     <NavItem>
//                                         <NavLink tag={ReactLink} to="/user/dashboard">
//                                             {user.email}
//                                         </NavLink>
//                                     </NavItem>

//                                     <NavItem>
//                                         <NavLink onClick={logout}>
//                                             Logout
//                                         </NavLink>
//                                     </NavItem>
//                                 </>
//                             ) : (
//                                 <>
//                                     <NavItem>
//                                         <NavLink tag={ReactLink} to="/login">
//                                             Login
//                                         </NavLink>
//                                     </NavItem>
//                                     <NavItem>
//                                         <NavLink tag={ReactLink} to="/signup">
//                                             Signup
//                                         </NavLink>
//                                     </NavItem>
//                                 </>
//                             )
//                         }
//                     </Nav>


//                     <NavbarText>
                        
//                     </NavbarText>
//                 </Collapse>
//             </Navbar>
//         </div>
//     )
// }

// export default CustomNavbar;


import { useEffect, useState, useContext } from "react";
import { NavLink as ReactLink, useNavigate } from "react-router-dom";
import {
  Navbar, NavbarBrand, NavLink, NavbarToggler, Collapse,
  Nav, NavItem, UncontrolledDropdown, DropdownMenu,
  DropdownToggle, DropdownItem, NavbarText, Button,
} from "reactstrap";
import { isLoggedIn, getCurrentUserDetail, doLogout } from "../auth";
import userContext from "../context/userContext";
import { useTheme } from "../context/ThemeContext";

const CustomNavbar = () => {
  const userContextData = useContext(userContext);
  const [isOpen, setIsOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setLogin(isLoggedIn());
    setUser(getCurrentUserDetail());
  }, [login]);

  const logout = () => {
    doLogout(() => {
      setLogin(false);
      userContextData.setUser({ data: null, login: false });
      navigate("/");
    });
  };

  return (
    <div>
      <Navbar color="dark" dark expand="md" className="px-5">
        <NavbarBrand tag={ReactLink} to="/">MyBlogs</NavbarBrand>

        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink tag={ReactLink} to="/">New Feed</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={ReactLink} to="/about">About</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={ReactLink} to="/services">Services</NavLink>
            </NavItem>
            <UncontrolledDropdown inNavbar nav>
              <DropdownToggle caret nav>More</DropdownToggle>
              <DropdownMenu end>
                <DropdownItem tag={ReactLink} to="/contact">Contact us</DropdownItem>
                <DropdownItem tag={ReactLink} to="/facebook">Facebook</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>YouTube</DropdownItem>
                <DropdownItem>Instagram</DropdownItem>
                <DropdownItem>LinkedIn</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>

          <Nav navbar className="align-items-center">
            <NavItem className="me-3">
              <Button size="sm" onClick={toggleTheme} color="secondary" outline>
                {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
              </Button>
            </NavItem>

            {login ? (
              <>
                <NavItem>
                  <NavLink tag={ReactLink} to={`/user/profile-info/${user.id}`}>Profile Info</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={ReactLink} to="/user/dashboard">{user.email}</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={logout}>Logout</NavLink>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <NavLink tag={ReactLink} to="/login">Login</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={ReactLink} to="/signup">Signup</NavLink>
                </NavItem>
              </>
            )}
          </Nav>

          <NavbarText></NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;
