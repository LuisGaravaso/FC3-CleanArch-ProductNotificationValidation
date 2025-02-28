// import CreateProductUsecase from "./create.product.usecase";

import CreateProductUseCase from "./create.product.usecase";

const valid_product = {
    name: 'Produto 1',
    price: 100,
};

const empty_name_product = {
    name: '',
    price: 100,
};

const negative_price_product = {
    name: 'Produto 1',
    price: -1,
};

const MockRepository = () => ({
    create: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
});

describe('Unit test for create product use case', () => {

    it('should create a valid product', async () => {
        const repository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(repository);

        const output = await productCreateUseCase.execute(valid_product);

        expect(output).toEqual({
            id: expect.any(String),
            name: valid_product.name,
            price: valid_product.price,
        });
    });

    it('should throw an error when name is missing', async () => {
        const repository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(repository);
       
        await expect(productCreateUseCase.execute({
            ...empty_name_product,
        })).rejects.toThrowError('Name is required');
    });

    it('should throw an error when price is negative', async () => {
        const repository = MockRepository();
        const productCreateUseCase = new CreateProductUseCase(repository);
       
        await expect(productCreateUseCase.execute({
            ...negative_price_product,
        })).rejects.toThrowError('Price must be greater than zero');
    });

});