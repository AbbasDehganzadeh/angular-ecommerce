export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  uri: string;
  rating: Rating;
}

interface Rating {
  rate: number;
  count: number;
}
