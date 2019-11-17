export interface Product {
    id: number;
    name: string;
    parentId: number;
    description: string;
    price: number;
    quantity: number;
    deal?: boolean;
    dprice?: number;
    fileUrl: string;
    isImage: boolean;
    like?: number;
    dislike?: number;
}
