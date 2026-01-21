import { ProductCategory } from "./ProductCategory"

export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  category: ProductCategory
}

export interface ProductResponse {
  data: Product[]
}

export interface ProductCreateRequest {
  name: string
  description: string
  price: number
  imageUrl: string
  category: ProductCategory
}