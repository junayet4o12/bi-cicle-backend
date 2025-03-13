export type TSpecification = {
    key: string;
    value: string;
}

export interface IProduct {
    name: string;
    brand: string;
    price: number;
    category: 'Mountain' | 'Road' | 'Hybrid' | 'BMX' | 'Electric';
    frameMaterial: 'Aluminum' | 'Carbon' | 'Steel' | 'Titanium';
    wheelSize: number;
    quantity: number;
    description: string;
    images: string[];
    specifications: TSpecification[];
    isDeleted?: boolean;
}