import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const VerifyAccount: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setToken, setUser } = useAuth()
  const tokenParam = searchParams.get('token')

  useEffect(() => {
    const verifyAndLogin = async () => {
      if (!tokenParam) {
        setTimeout(() => navigate('/'), 500)
        return
      }

      try {
        const { token } = await authService.verify(tokenParam)
        setToken(token)
        setTimeout(() => navigate('/'), 500)
      } catch (err) {
        setTimeout(() => navigate('/'), 500)
      }
    }
    verifyAndLogin()
  }, [tokenParam, setToken, setUser, navigate])

  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Verificación de Cuenta</h1>
      <p className="text-green-600 font-semibold mb-6">
        ¡Tu cuenta está siendo verificada! Serás redirigido al inicio en unos segundos...
      </p>
    </div>
  )
}

export default VerifyAccount