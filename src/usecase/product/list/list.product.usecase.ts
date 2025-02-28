import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputListProductsDto, OutputListProductsDto } from "../../product/list/list.product.dto";

export default class ListProductUseCase {

    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    async execute(input: InputListProductsDto): Promise<OutputListProductsDto> {
        const products = await this.productRepository.findAll();

        return {
            products: products.map((product) => {
                return {
                    id: product.id,
                    name: product.name,
                    price: product.price
                };
            }),
        };
    }
}