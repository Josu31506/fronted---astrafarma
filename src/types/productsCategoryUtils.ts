import { ProductCategory } from '../types/ProductCategory'

export const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.CUIDADO_PERSONAL_HIGIENE]: 'Cuidado Personal',
  [ProductCategory.OTROS]: 'Otros',
  [ProductCategory.VITAMINAS_SUPLEMENTOS_NUTRICIONALES]: 'Vitaminas y Suplementos',
  [ProductCategory.RESPIRATORIOS_EXPECTORANTES]: 'Respiratorios',
  [ProductCategory.ANTIBIOTICOS_ANTIVIRALES]: 'Antibióticos',
  [ProductCategory.DERMATOLOGICOS_TRATAMIENTOS_CUTANEOS]: 'Dermatológicos',
  [ProductCategory.ANALGESICOS_ANTINFLAMATORIOS]: 'Analgésicos',
  [ProductCategory.MATERIAL_MEDICO_EQUIPOS]: 'Material Médico',
  [ProductCategory.MEDICINA_NATURAL_HIDRATACION]: 'Medicina Natural',
  [ProductCategory.PEDIATRICOS_LACTANCIA]: 'Pediátricos',
  [ProductCategory.GASTROINTESTINALES_DIGESTIVOS]: 'Gastrointestinales',
  [ProductCategory.GINECOLOGICOS_UROLOGICOS]: 'Ginecológicos',
  [ProductCategory.CARDIOVASCULARES_ANTIDIABETICOS]: 'Cardiovasculares',
  [ProductCategory.OFTALMOLOGICOS]: 'Oftalmológicos',
  [ProductCategory.ANTIHISTAMINICOS_ANTIALERGICOS]: 'Antihistamínicos',
  [ProductCategory.NEUROLOGICOS_PSIQUIATRICOS]: 'Neurológicos'
}

const categoryColors: Record<ProductCategory, string> = {
  [ProductCategory.CUIDADO_PERSONAL_HIGIENE]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ProductCategory.OTROS]: 'bg-gray-100 text-gray-800 border-gray-200',
  [ProductCategory.VITAMINAS_SUPLEMENTOS_NUTRICIONALES]: 'bg-green-100 text-green-800 border-green-200',
  [ProductCategory.RESPIRATORIOS_EXPECTORANTES]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  [ProductCategory.ANTIBIOTICOS_ANTIVIRALES]: 'bg-red-100 text-red-800 border-red-200',
  [ProductCategory.DERMATOLOGICOS_TRATAMIENTOS_CUTANEOS]: 'bg-pink-100 text-pink-800 border-pink-200',
  [ProductCategory.ANALGESICOS_ANTINFLAMATORIOS]: 'bg-orange-100 text-orange-800 border-orange-200',
  [ProductCategory.MATERIAL_MEDICO_EQUIPOS]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [ProductCategory.MEDICINA_NATURAL_HIDRATACION]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  [ProductCategory.PEDIATRICOS_LACTANCIA]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ProductCategory.GASTROINTESTINALES_DIGESTIVOS]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [ProductCategory.GINECOLOGICOS_UROLOGICOS]: 'bg-rose-100 text-rose-800 border-rose-200',
  [ProductCategory.CARDIOVASCULARES_ANTIDIABETICOS]: 'bg-red-100 text-red-800 border-red-200',
  [ProductCategory.OFTALMOLOGICOS]: 'bg-sky-100 text-sky-800 border-sky-200',
  [ProductCategory.ANTIHISTAMINICOS_ANTIALERGICOS]: 'bg-lime-100 text-lime-800 border-lime-200',
  [ProductCategory.NEUROLOGICOS_PSIQUIATRICOS]: 'bg-violet-100 text-violet-800 border-violet-200'
}

export const getCategoryColor = (category: ProductCategory): string => {
  return categoryColors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
}