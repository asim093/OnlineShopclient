export interface Product {
  _id: number;
  name: string;
  image?: string;
  price: number;

  description?: string;

  discountPercentage?: number;
}
