import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
import LoginModal from './LoginModal'
import { clearAuth } from '../../services/api'
import { useAuth } from '../../context/AuthContext';

interface NavigationProps {
  onSearch: (query: string) => void
}

const Navigation: React.FC<NavigationProps> = ({ onSearch }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  const navigate = useNavigate();
  const { token, logout, user, isLoading } = useAuth();
  
  const isAdmin = !isLoading 
    ? (token && (user?.userRole === 'ADMIN' || user?.role === 'ADMIN'))
    : (!!localStorage.getItem('token') && localStorage.getItem('role') === 'ADMIN');

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY
      

      if (currentScrollY < 10) {
        setIsVisible(true)
      } 

      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
        setIsMobileSearchOpen(false) 
      } 

      else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }


    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          controlNavbar()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    clearAuth();
    navigate('/');
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen)
  }


  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      navigate(`/productos?search=${encodeURIComponent(query.trim())}`)
    } else {
      navigate('/productos')
    }
    onSearch(query)
  }

  return (
    <>
      <nav className={`bg-[#00bd4c] shadow-lg fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'
      }`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-lg sm:text-xl font-bold text-white hover:text-black hover:bg-white px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 border border-transparent hover:border-black flex items-center space-x-2">
                <img 
                  src="/icon.png" 
                  alt="Astrafarma Logo" 
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span>Astrafarma</span>
              </Link>
            </div>
            
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <SearchBar onSearch={handleSearchSubmit} />
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleMobileSearch}
                className="md:hidden text-white hover:text-black hover:bg-white p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-black"
                title={isMobileSearchOpen ? "Ocultar búsqueda" : "Mostrar búsqueda"}
              >
                {isMobileSearchOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
              
              {isAdmin && (
                <Link 
                  to="/stock" 
                  className="text-white hover:text-black hover:bg-white px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-lg font-medium sm:font-bold transition-all duration-200 border border-transparent hover:border-black flex items-center"
                >
                  <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">Catálogo</span>
                </Link>
              )}
              {token && (
                <Link
                  to="/usuario"
                  className="text-white hover:text-black hover:bg-white px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-lg font-medium sm:font-bold transition-all duration-200 border border-transparent hover:border-black flex items-center"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">Usuario</span>
                </Link>
              )}
              <button
                onClick={token ? handleLogout : handleLogin}
                className="text-white hover:text-black hover:bg-white p-2 rounded-lg transition-all duration-200 border border-transparent hover:border-black cursor-po"
                title={token ? 'Cerrar Sesión' : 'Iniciar Sesión'}
              >
                {token ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </button>
              
            </div>
          </div>
          {isMobileSearchOpen && (
            <div className="md:hidden pb-4 border-t-2 border-black border-dashed">
              <div className="pt-4">
                <SearchBar onSearch={handleSearchSubmit} />
              </div>
            </div>
          )}
        </div>
      </nav>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}

export default Navigation