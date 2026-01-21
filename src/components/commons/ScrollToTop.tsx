import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const isProductDetailPage = pathname.includes('/producto/')
    const isProductsPage = pathname === '/productos'
    
    if (isProductsPage) {
      const savedScrollPosition = sessionStorage.getItem('productsPageScrollPosition')
      if (savedScrollPosition) {
        const scrollY = parseInt(savedScrollPosition, 10)
        
        if (!isNaN(scrollY) && scrollY >= 0) {
          
          const waitForContentAndRestore = () => {
            const checkContent = () => {
              const bodyHeight = document.body.scrollHeight
              const docHeight = document.documentElement.scrollHeight
              const maxScroll = Math.max(bodyHeight, docHeight) - window.innerHeight

              if (maxScroll > 200) {
                const targetScroll = Math.min(scrollY, Math.max(0, maxScroll))
                
                window.scrollTo({
                  top: targetScroll,
                  behavior: 'instant'
                })
                
                setTimeout(() => {
                  sessionStorage.removeItem('productsPageScrollPosition')
                }, 10)
                
                return true
              }
              return false
            }
            
            if (checkContent()) return
            
            let attempts = 0
            const maxAttempts = 10
            const retryInterval = setInterval(() => {
              attempts++
              if (checkContent() || attempts >= maxAttempts) {
                clearInterval(retryInterval)
                if (attempts >= maxAttempts) {
                  sessionStorage.removeItem('productsPageScrollPosition')
                }
              }
            }, 100)
          }
          
          setTimeout(waitForContentAndRestore, 50)
          
        } else {
          window.scrollTo(0, 0)
          sessionStorage.removeItem('productsPageScrollPosition')
        }
      } else {
        window.scrollTo(0, 0)
      }
    }
    else if (isProductDetailPage) {
      window.scrollTo(0, 0)
    }
    else {
      window.scrollTo(0, 0)
      sessionStorage.removeItem('productsPageScrollPosition')
    }
  }, [pathname])

  return null
}

export default ScrollToTop
