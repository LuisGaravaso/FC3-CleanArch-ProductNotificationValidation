import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";


const product = new Product("123", "Product 1", 100);

const productUpdated = new Product("123", "Product 1 Updated", 200);

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        update: jest.fn(),
    }
};

describe('Update Product Use Case Unit Test', () => {
    
    it('should update a product', async () => {
        // Arrange
        const repository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(repository);

        // Act
        const output = await productUpdateUseCase.execute(productUpdated);

        // Assert
        expect(output).toEqual({
            id: productUpdated.id,
            name: productUpdated.name,
            price: productUpdated.price
        });
    });

    it('should throw an error when product is not found', async () => {
        // Arrange
        const repository = MockRepository();
        repository.find = jest.fn().mockReturnValue(Promise.resolve(null));
        const productUpdateUseCase = new UpdateProductUseCase(repository);

        await expect(productUpdateUseCase.execute(productUpdated)).rejects.toThrowError('Product not found');
    });

});