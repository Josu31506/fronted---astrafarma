// Utilidades para el manejo de ofertas
import type { Offer } from '../../services/offerService';

/**
 * Crea el mensaje de WhatsApp para compartir una oferta
 */
export function createWhatsappMessage(offer: Offer): string {
  let msg = "¡Nueva oferta en Astrafarma!";
  
  if (offer.title) msg += `\n${offer.title}`;
  if (offer.description) msg += `\n${offer.description}`;
  
  msg += `\nVálida hasta: ${new Date(offer.endDate).toLocaleDateString()}`;

  if (offer.productNames && offer.productNames.length > 0) {
    msg += `\nProductos relacionados: ${offer.productNames.join(', ')}`;
  }

  if (offer.discounts && offer.discounts.length > 0) {
    msg += "\nDescuentos:";
    for (const d of offer.discounts) {
      msg += `\n- ${d.productName}: ${d.discountPercentage}%`;
    }
  }
  
  msg += "\nConsulta más detalles en astrafarma.com";
  return msg;
}

/**
 * Verifica si una oferta tiene imagen válida
 */
export function isImageOffer(offer: Offer): boolean {
  return !!(offer.imageUrl && typeof offer.imageUrl === 'string' && offer.imageUrl.trim().length > 0);
}

/**
 * Filtra ofertas activas basado en fechas de inicio y fin
 */
export function getActiveOffers(offers: Offer[]): Offer[] {
  const now = new Date();
  return offers
    .filter(offer => {
      const startDate = new Date(offer.startDate);
      const endDate = new Date(offer.endDate);
      return now >= startDate && now <= endDate;
    })
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
}

/**
 * Valida y filtra IDs de productos válidos
 */
export function getValidProductNames(productNames?: string[]): string[] {
  if (!productNames || !Array.isArray(productNames)) return [];

  return productNames
    .map(name => (typeof name === 'string' ? name.trim() : ''))
    .filter(name => name.length > 0);
}

/**
 * Obtiene el descuento máximo de una oferta
 */
export function getMaxDiscount(offer: Offer): number {
  if (!offer.discounts || offer.discounts.length === 0) return 0;
  return Math.max(...offer.discounts.map(d => d.discountPercentage));
}