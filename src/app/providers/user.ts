//User interface for the database
export interface User {
    uid?: string;
    email?: string;
    displayName?: string;
    admin?: boolean;
    voted?: number[];
    addressId?: number;
    defaultId?: number;
    // photoUrl?: string;
}
export interface Basket {
  id: number;
  quantity: number;

   // these fields are used when an order has been made - should not be updated if product changes are made or if product is removed
  price?: number;
  name?: string;
  imageUrl?: string;
}
export interface Votes {
  id: number;
  vote: number;
}
export interface Votes {
  id: number;
  vote: number;
}
export interface Address {
  id: number;
  firstName: string;
  lastName: string
  street: string;
  city: string;
  zip: number;
  phone?: string;
}
export interface Order {
  id: number;
  items: Basket[];
  deliveryAddress: Address;
  status: string;
  date: string;
  totalQuantity: number;
  totalPrice: number;
}