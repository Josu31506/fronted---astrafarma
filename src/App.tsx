import React from 'react'
import { AuthProvider } from './context/AuthContext';
import { OfferProvider } from './context/OfferContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductsPage from './pages/ProductsPage'
import Producto from './pages/Producto'
import Stock from './pages/Stock'
import Usuario from './pages/Usuario'
import VerifyAccount from './pages/VerifyAccount'
import AuthenticatedRoute from './routes/AuthenticatedRoute'
import Navigation from './components/App/Navigation'
import Footer from './components/App/Footer'
import ProtectedRoute from './routes/ProtectedRoute'
import ScrollToTop from './components/commons/ScrollToTop'


const App: React.FC = () => {
  const handleSearch = () => {}
  const handleCategoryFilter = () => {}

  return (
    <AuthProvider>
      <OfferProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navigation onSearch={handleSearch} />
            
            <main className="flex-1 container mx-auto py-6 pt-20">
              <Routes>
                <Route path="/" element={<Home onCategoryFilter={handleCategoryFilter} />} />

                <Route path="/verify" element={<VerifyAccount />} />
                
                <Route path="/productos" element={<ProductsPage />} />
                
                <Route path="/producto/:productId" element={<Producto />} />
              
                <Route 
                  path="/stock" 
                  element={
                    <ProtectedRoute>
                      <Stock />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/usuario"
                  element={
                    <AuthenticatedRoute>
                      <Usuario />
                    </AuthenticatedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer onCategoryFilter={handleCategoryFilter} />
          </div>
        </Router>
      </OfferProvider>
    </AuthProvider>
  )
}

export default App