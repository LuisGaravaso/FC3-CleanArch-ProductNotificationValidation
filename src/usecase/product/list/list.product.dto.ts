type Product = {
    id: string;
    name: string;
    price: number;
};

export interface InputListProductsDto {}

export interface OutputListProductsDto {
    products: Product[];
}