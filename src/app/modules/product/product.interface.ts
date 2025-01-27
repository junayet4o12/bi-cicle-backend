export interface IProduct {
    name: string;
    brand: string;
    price: number;
    type: 'Mountain' | 'Road' | 'Hybrid' | 'BMX' | 'Electric';
    description: string;
    quantity: number;
    isStock: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}