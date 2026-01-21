import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { userService } from '../services/userService';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

interface FormData {
  fullName: string;
  phoneNumber: string;
  gender: Gender;
  birthday: string;
  email: string;
}

const Usuario: React.FC = () => {
  const { user, token, setUser, logout } = useAuth();
  
  // Inicializa el estado solo UNA vez (como la versión que funciona)
  const [form, setForm] = useState<FormData>({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    gender: (user?.gender as Gender) || 'OTHER',
    birthday: user?.birthday || '',
    email: user?.email || '',
  });
  
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Solo refrescar datos desde el servidor si es necesario
  useEffect(() => {
    if (token && user && (!user.phoneNumber || !user.gender || !user.fullName)) {
      userService.getMe(token).then((data) => {
        setUser(data);
      });
    }
  }, [token, user, setUser]);

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // Cuando cancelas la edición, restaura los datos del usuario actual
  const handleCancel = () => {
    setForm({
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      gender: (user.gender as Gender) || 'OTHER',
      birthday: user.birthday || '',
      email: user.email || '',
    });
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Validaciones
    if (!form.fullName.trim()) {
      setError('El nombre completo es obligatorio');
      return;
    }
    if (!form.phoneNumber.trim()) {
      setError('El número de teléfono es obligatorio');
      return;
    }
    if (!form.birthday) {
      setError('La fecha de nacimiento es obligatoria');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updated = await userService.updateMe(token, form);
      setUser({ ...user, ...updated });
      setSuccess('Datos actualizados correctamente');
      setEditMode(false);
    } catch (err) {
      setError('Error al actualizar los datos');
    } finally {
      setLoading(false);
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'MALE': return 'Masculino';
      case 'FEMALE': return 'Femenino';
      case 'OTHER': return 'Otro';
      default: return 'No especificado';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#17A15B] to-[#0F8B47] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800">Información Personal</h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 bg-[#17A15B] hover:bg-[#0F8B47] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar datos
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Nombre completo */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-[#17A15B]">
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#17A15B] focus:ring-0 transition-colors disabled:bg-gray-50"
                      disabled={loading}
                      placeholder="Ingresa tu nombre completo"
                      required
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-lg min-h-[50px] flex items-center">
                      {user.fullName || <span className="text-gray-400 italic">No disponible</span>}
                    </div>
                  )}
                </div>
                
                {/* Correo electrónico */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-[#17A15B]">
                    Correo electrónico
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-lg min-h-[50px] flex items-center">
                    {user.email || <span className="text-gray-400 italic">No disponible</span>}
                  </div>
                  {editMode && (
                    <p className="text-xs text-gray-500 mt-1">El correo electrónico no se puede modificar</p>
                  )}
                </div>
                
                {/* Teléfono */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-[#17A15B]">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={form.phoneNumber || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#17A15B] focus:ring-0 transition-colors disabled:bg-gray-50"
                      disabled={loading}
                      placeholder="Ingresa tu teléfono"
                      required
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-lg min-h-[50px] flex items-center">
                      {user.phoneNumber || <span className="text-gray-400 italic">No disponible</span>}
                    </div>
                  )}
                </div>
                
                {/* Fecha de nacimiento */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-[#17A15B]">
                    Fecha de nacimiento <span className="text-red-500">*</span>
                  </label>
                  {editMode ? (
                    <input
                      type="date"
                      name="birthday"
                      value={form.birthday}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#17A15B] focus:ring-0 transition-colors disabled:bg-gray-50"
                      disabled={loading}
                      required
                      max={new Date().toISOString().split('T')[0]}
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-lg min-h-[50px] flex items-center">
                      {formatDate(user.birthday || '')}
                    </div>
                  )}
                </div>
                
                {/* Género */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-[#17A15B]">
                    Género
                  </label>
                  {editMode ? (
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#17A15B] focus:ring-0 transition-colors bg-white disabled:bg-gray-50"
                      disabled={loading}
                    >
                      <option value="MALE">Masculino</option>
                      <option value="FEMALE">Femenino</option>
                      <option value="OTHER">Otro</option>
                    </select>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-lg min-h-[50px] flex items-center">
                      {getGenderLabel(user.gender || 'OTHER')}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {editMode && (
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 bg-[#17A15B] hover:bg-[#0F8B47] text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </span>
                    ) : (
                      'Guardar cambios'
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Estado de la cuenta</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rol:</span>
                  <span className="font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {user.userRole || user.role}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Verificado:</span>
                  <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                    user.verified 
                      ? 'text-green-700 bg-green-100' 
                      : 'text-yellow-700 bg-yellow-100'
                  }`}>
                    {user.verified ? (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verificado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        No verificado
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-200">
              <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Control de cuenta
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, estate seguro.
              </p>
              <button
                onClick={async () => {
                  if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                    setLoading(true);
                    setError('');
                    try {
                      await userService.deleteMe(token);
                      logout();
                    } catch (err) {
                      setError('Error al eliminar la cuenta');
                    } finally {
                      setLoading(false);
                    }
                  }
                }}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {(error || success) && (
          <div className="fixed bottom-6 right-6 z-50">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-lg mb-4 max-w-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setError('')}
                      className="text-red-400 hover:text-red-600"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg shadow-lg max-w-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      onClick={() => setSuccess('')}
                      className="text-green-400 hover:text-green-600"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Usuario;