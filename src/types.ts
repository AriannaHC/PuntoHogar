export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  type: 'venta' | 'alquiler';
  bedrooms: number;
  bathrooms: number;
  area: number;
  image_url: string;
  category: 'casa' | 'apartamento' | 'terreno' | 'comercial';
}

export interface FilterOptions {
  type?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
