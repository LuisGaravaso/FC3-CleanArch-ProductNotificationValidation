import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

const expectProduct = new Product("123", "Product 1", 1000);

const MockRepository = () => ({
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(expectProduct)),
    findAll: jest.fn(),
});

describe("Unit test for Find Product use case", () => {

    it("should find a product", async () => {
        const repository = MockRepository();
        const productFindUseCase = new FindProductUseCase(repository);

        const output = await productFindUseCase.execute({ id: "123" });

        expect(output.id).toEqual(expectProduct.id);
        expect(output.name).toEqual(expectProduct.name);
        expect(output.price).toEqual(expectProduct.price);
    });

    it("should throw an error when product not found", async () => {
        const repository = MockRepository();
        const productFindUseCase = new FindProductUseCase(repository);

        repository.find.mockImplementation(() => {
            throw new Error("Product not found");
        });

        await expect(productFindUseCase.execute({ id: "123" })).rejects.toThrow("Product not found");
    });


});