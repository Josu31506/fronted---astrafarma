import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [birthday, setBirthday] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const { setToken, setUser } = useAuth();

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await authService.login({ email, password });
      setToken(res.token);
      setUser({
        id: 0,
        fullName: '',
        email,
        role: res.role,
      });
      setEmail('');
      setPassword('');
      onClose();
    } catch (err: any) {
      setError('Credenciales incorrectas o error de servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await authService.signup({
        fullName,
        email,
        password,
        phoneNumber,
        gender,
        birthday,
      });
      setToken(res.token);
      setUser({
        id: 0,
        fullName,
        email,
        role: res.role,
      });
      setEmail('');
      setPassword('');
      onClose();
    } catch (err: any) {
      setError('Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authService.loginWithGoogle();
  };

  const handleOverlayClick = () => {
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white border-2 border-black rounded-xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
              <path d="M533.5 278.4c0-17.4-1.6-34-4.7-50.2H272v95h147.3c-6.3 34-25 62.8-53.4 82.1v68h86.5c50.6-46.6 80.1-115.3 80.1-194.9z" fill="#4285F4" />
              <path d="M272 544.3c72.6 0 133.6-24.1 178.1-65.5l-86.5-68c-24.1 16.2-55 25.7-91.6 25.7-70.4 0-130.1-47.6-151.4-111.6H33.4v70.2c44.3 87.8 134.8 149.2 238.6 149.2z" fill="#34A853" />
              <path d="M120.6 324.9c-5.3-15.9-8.3-32.9-8.3-50.4s3-34.5 8.3-50.4V153.9H33.4C12.1 198.1 0 247.4 0 298.5s12.1 100.4 33.4 144.6l87.2-68.2z" fill="#FBBC04" />
              <path d="M272 107.7c39.5 0 75 13.6 103 40.3l77.1-77.1C405.5 24.1 344.6 0 272 0 168.2 0 77.7 61.4 33.4 149.2l87.2 68.2C141.9 155.3 201.6 107.7 272 107.7z" fill="#EA4335" />
            </svg>
            <span>Ingresa con Google</span>
          </button>

          <div className="text-center text-sm text-gray-500">o</div>

          {isRegister && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Nombre completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#17A15B] focus:ring-2 focus:ring-[#17A15B] focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Nombre completo"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Teléfono</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#17A15B] focus:ring-2 focus:ring-[#17A15B] focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Teléfono"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Género</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#17A15B] focus:ring-2 focus:ring-[#17A15B] focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                  disabled={isLoading}
                >
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Femenino</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Fecha de nacimiento</label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#17A15B] focus:ring-2 focus:ring-[#17A15B] focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#17A15B] focus:ring-2 focus:ring-[#17A15B] focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Ingresa tu correo"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#17A15B] focus:ring-2 focus:ring-[#17A15B] focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed pr-10"
                placeholder="Ingresa tu contraseña"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.835-.66 1.624-1.149 2.336M15.362 17.362A9.958 9.958 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.638-4.362" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.638-4.362M17.94 17.94A9.953 9.953 0 0019.542 14M9.88 9.88A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .512-.13.995-.36 1.414M6.1 6.1l11.8 11.8" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-between space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className={isRegister
                ? "px-4 py-2 text-xs font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                : "px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              }
              disabled={isLoading}
            >
              {isRegister ? 'Ya tengo cuenta' : 'Registrarse'}
            </button>
            <button
              type="submit"
              onClick={isRegister ? handleRegister : handleLogin}
              className={isRegister
                ? "px-4 py-2 text-xs font-semibold text-white bg-[#17A15B] border-2 border-black rounded-lg hover:bg-white hover:text-[#17A15B] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                : "px-6 py-3 text-sm font-semibold text-white bg-[#17A15B] border-2 border-black rounded-lg hover:bg-white hover:text-[#17A15B] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{isRegister ? 'Registrando...' : 'Verificando...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>{isRegister ? 'Registrarse' : 'Iniciar Sesión'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal