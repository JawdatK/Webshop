export interface Category {
  id: number;
  name: string;
}

export interface SubCategory {
  parentId: number;
  uid: number;
  name: string;
}
