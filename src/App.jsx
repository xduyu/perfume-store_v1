// /* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Perfume from './pages/Perfume'
import AllPerfumes from './pages/Home'
import AdminPanel from './pages/AdminPanel'
import { TbPerfume } from "react-icons/tb";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoIosLogIn } from "react-icons/io";
import Categories from './pages/categories'
import BrandPerfumes from './pages/BrandPerfumes'
import { BiCategory } from "react-icons/bi";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const adminid = localStorage.getItem('adminid')

  useEffect(() => {
    async function checkAccess() {
      if (adminid) {
        try {
          const response = await fetch(`http://localhost:3000/api/get-access?adminid=${adminid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (data.status === 'success') {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error fetching access:', error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    }
    checkAccess();
  }, [adminid]);

  return (
    <Router>
      <nav className='containerHeader'>
        <Link className='nav__logo' to="/">
          <div className="name_org">
            <h2>bNG+</h2>
          </div>
        </Link>
        <div className="buttons_org">
          <Link className='nav__item' to="/"><TbPerfume className='iconPerfume' /> All Perfumes</Link>
          <Link className='nav__item' to="/categories"><BiCategory className='iconСategories iconPerfume' /> categories</Link>
          {/* <Link className='nav__item' to="/"><TbPerfume className='iconPerfume' /> All Perfumes</Link> TODO ADD HERE CATEGORY  */}
          {isLoggedIn ? (
            <Link className='nav__item' to="/admin" style={{ display: isLoggedIn ? 'inline-flex' : 'none' }}>
              <MdAdminPanelSettings className='iconPerfume' /> Admin Panel
            </Link>
          ) : null}
            {/* {!isLoggedIn && (
              <Link className='nav__item' to="/login">
                <IoIosLogIn className='iconPerfume' /> For Sellers
              </Link> 1223
            )} */}
            </div>
        </nav>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/categories" element={<Categories />} />// В секции Routes добавьте:
          <Route path="/brand/:brand" element={<BrandPerfumes />} />
          <Route path="/all-perfumes" element={<AllPerfumes />} />
          <Route path="/" element={<AllPerfumes />} />
          <Route path="/perfume/:id" element={<Perfume />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
              
        {/* Футер */}
      <footer style={{padding: '15px 0',textAlign: 'center',fontSize: '14px',marginTop: '40px',}}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
          <p className='allrr'>© 2025 bNG+ — All rights reserved.</p>
          <div className='social-links'>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a> |{' '}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a> |{' '}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a> | {' '}
            <p>
              <Link to="/login">
                For Sellers
              </Link>
            </p>
          </div>
          <p className='wcbrs'>The site was created by Rodion Sedov</p>
        </div>
      </footer>
    </Router>
  )
}

export default App
