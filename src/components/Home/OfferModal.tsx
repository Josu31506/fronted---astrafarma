import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOffers } from '../../context/OfferContext';
import type { Offer } from '../../services/offerService';
import { createWhatsappMessage } from './offerUtils';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer?: any;
}

const OfferModal = ({ isOpen, onClose, offer }: OfferModalProps) => {
  const { token } = useAuth();
  const { createOffer, updateOffer } = useOffers();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [useImage, setUseImage] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
  });

  const [productNamesText, setProductNamesText] = useState('');
  const [discounts, setDiscounts] = useState<(number | undefined)[]>([]);
  const [, setImagePreviewError] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [imageInputMode, setImageInputMode] = useState<'url' | 'file'>('url');

  const isEditing = !!offer;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: offer.title || '',
        description: offer.description || '',
        imageUrl: offer.imageUrl || '',
        startDate: offer.startDate ? offer.startDate.split('T')[0] : '',
        endDate: offer.endDate ? offer.endDate.split('T')[0] : '',
      });
      setProductNamesText(offer.productNames ? offer.productNames.join(', ') : '');
      setDiscounts(
        offer.discounts && Array.isArray(offer.discounts)
          ? offer.discounts.map((d: any) => (d.discountPercentage > 0 ? d.discountPercentage : undefined))
          : []
      );
      setUseImage(!!offer.imageUrl);
      setImageFile(null);
      setImagePreviewUrl(offer.imageUrl || '');
      setImageInputMode('url');
    } else {
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        startDate: '',
        endDate: '',
      });
      setProductNamesText('');
      setDiscounts([]);
      setUseImage(false);
      setImageFile(null);
      setImagePreviewUrl('');
      setImageInputMode('url');
    }
    setImagePreviewError(false);
  }, [offer, isEditing, isOpen]);

  useEffect(() => {
    const names = productNamesText
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length > discounts.length) {
      setDiscounts((prev) => [...prev, ...Array(names.length - prev.length).fill(undefined)]);
    } else if (names.length < discounts.length) {
      setDiscounts((prev) => prev.slice(0, names.length));
    }
  }, [productNamesText]);

  useEffect(() => {
    if (imageFile) {
      setImagePreviewUrl(URL.createObjectURL(imageFile));
    } else {
      setImagePreviewUrl(formData.imageUrl || '');
    }
    return () => {
      if (imageFile) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    }
  }, [imageFile, formData.imageUrl]);

  const formatDateForBackend = (dateString: string, isEndDate = false) => {
    if (!dateString) return '';
    const time = isEndDate ? '23:59:59' : '00:00:00';
    return `${dateString}T${time}`;
  };

  const handleDiscountChange = (idx: number, value: string) => {
    setDiscounts((prev) =>
      prev.map((d, i) => (i === idx ? (value === '' ? undefined : Number(value)) : d))
    );
  };

  const handleImageModeSwitch = (mode: 'url' | 'file') => {
    setImageInputMode(mode);
    if (mode === 'url') {
      setImageFile(null);
      setImagePreviewUrl(formData.imageUrl || '');
    } else {
      setFormData(prev => ({ ...prev, imageUrl: '' }));
      setImagePreviewUrl('');
    }
    setImagePreviewError(false);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (!file) {
      setImagePreviewUrl(formData.imageUrl || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);

    const productNames = productNamesText
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (productNames.length === 0) {
      setError('Debes agregar al menos un producto');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError('Las fechas de inicio y fin son obligatorias');
      return;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (start >= end) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    for (let idx = 0; idx < productNames.length; idx++) {
      if (discounts[idx] === undefined || discounts[idx] === null || isNaN(discounts[idx] as number)) {
        setError(`Debes asignar un descuento válido para el producto ${productNames[idx]}`);
        return;
      }
    }

    if (useImage && !imageFile && !formData.imageUrl) {
      setError('Debes seleccionar una imagen para banner o ingresar una URL');
      return;
    }

    if (!useImage && !formData.title && !formData.description) {
      setError('Debes agregar título o descripción para esta opción');
      return;
    }

    setLoading(true);

    try {
      const discountsData = productNames.map((name, idx) => ({
        productName: name,
        discountPercentage: discounts[idx]!,
      }));

      const startDateFormatted = formatDateForBackend(formData.startDate, false);
      const endDateFormatted = formatDateForBackend(formData.endDate, true);

      const tempOffer: Omit<Offer, 'id'> = {
        title: useImage ? '' : formData.title,
        description: useImage ? '' : formData.description,
        imageUrl: useImage ? formData.imageUrl : '',
        productNames,
        discounts: discountsData,
        startDate: startDateFormatted,
        endDate: endDateFormatted,
        mensajeWhatsApp: '',
      };

      const sendData = {
        ...tempOffer,
        mensajeWhatsApp: createWhatsappMessage({ id: 0, ...tempOffer }),
      };

      if (isEditing) {
        await updateOffer(token, offer.id, sendData, imageFile || undefined);
      } else {
        await createOffer(token, sendData, imageFile || undefined);
      }
      onClose();
    } catch (err) {
      setError(isEditing ? 'Error al actualizar la oferta' : 'Error al crear la oferta');
    } finally {
      setLoading(false);
    }
  };

  const closeError = () => {
    setError(null);
  };

  if (!isOpen) return null;

  const SwitchButton = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex items-center h-7 rounded-full w-14 transition-colors duration-200 ${checked ? 'bg-green-500' : 'bg-gray-400'}`}
      aria-checked={checked}
      role="switch"
      style={{ outline: 'none', border: 'none', userSelect: 'none', fontSize: '0.95rem' }}
    >
      <span
        className={`inline-block w-6 h-6 transform bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-7' : 'translate-x-1'}`}
      />
    </button>
  );

  const validProductNames = productNamesText
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  const subtitle = useImage
    ? 'Modo: Banner con imagen'
    : 'Modo: Título y descripción';

  const showPreview = !!imagePreviewUrl && imagePreviewUrl.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <div className="fixed inset-0 bg-black bg-opacity-50 select-none"></div>
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        style={{ zIndex: 100 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Editar Oferta' : 'Nueva Oferta'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              tabIndex={0}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center mt-2 mb-4 space-x-2">
            <SwitchButton checked={useImage} onChange={() => setUseImage(!useImage)} />
            <span className="text-gray-600 text-sm font-semibold">{subtitle}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {useImage && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Vista previa de la imagen
                  </label>
                  <div className="w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                    {showPreview ? (
                      <img
                        src={imagePreviewUrl}
                        alt="Vista previa del banner"
                        className="w-full h-full object-cover"
                        onError={() => setImagePreviewError(true)}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Sin imagen</span>
                    )}
                  </div>
                </div>

                {/* Switch para tipo de carga de imagen */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Tipo de carga de imagen
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => handleImageModeSwitch('url')}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        imageInputMode === 'url'
                          ? 'bg-[#00bd4c] text-white border-[#00bd4c]'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-[#00bd4c]'
                      }`}
                      disabled={loading}
                    >
                      Por URL
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImageModeSwitch('file')}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        imageInputMode === 'file'
                          ? 'bg-[#00bd4c] text-white border-[#00bd4c]'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-[#00bd4c]'
                      }`}
                      disabled={loading}
                    >
                      Subir archivo
                    </button>
                  </div>
                </div>

                {/* Campos de imagen condicionalmente */}
                {imageInputMode === 'url' ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      URL de la Imagen
                    </label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, imageUrl: e.target.value }));
                          setImagePreviewError(false);
                        }}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bd4c] focus:ring-opacity-20 focus:border-[#00bd4c] transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="https://ejemplo.com/banner.jpg (opcional)"
                        disabled={loading}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Selecciona una imagen
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={loading}
                        id="image-file-input"
                      />
                      <div className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center space-y-2">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700">
                            {imageFile ? imageFile.name : 'Haz clic para seleccionar o arrastra una imagen aquí'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, JPEG hasta 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {!useImage && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bd4c]"
                    placeholder="Título de la oferta"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bd4c]"
                    rows={3}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bd4c]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bd4c]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombres de Productos (separados por coma)</label>
              <input
                type="text"
                value={productNamesText}
                onChange={(e) => setProductNamesText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00bd4c]"
                placeholder="Producto A, Producto B"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ingrese los nombres separados por comas (ej: Producto A, Producto B)
              </p>
            </div>

            {validProductNames.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descuentos por Producto (%)</label>
                <div className="space-y-2">
                  {validProductNames.map((name, idx) => (
                    <div key={name || idx} className="flex space-x-2 items-center">
                      <span className="text-sm text-gray-700">{name}</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[1-9][0-9]?"
                        value={
                          discounts[idx] === undefined || discounts[idx] === null
                            ? ''
                            : String(discounts[idx])
                        }
                        min={1}
                        max={99}
                        placeholder="% Desc."
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val === '') {
                            handleDiscountChange(idx, '');
                          } else {
                            const num = Number(val);
                            if (num >= 1 && num <= 99) {
                              handleDiscountChange(idx, String(num));
                            }
                          }
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded appearance-none"
                        style={{
                          MozAppearance: 'textfield',
                          appearance: 'none',
                        }}
                      />
                      <span className="text-xs text-gray-400">%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
                <button
                  onClick={closeError}
                  className="text-red-500 hover:text-red-700 p-1"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-white bg-[#00bd4c] border-2 border-black rounded-lg hover:bg-white hover:text-[#00bd4c] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{isEditing ? 'Actualizando...' : 'Creando...'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isEditing ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      )}
                    </svg>
                    <span>{isEditing ? 'Actualizar' : 'Crear'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;