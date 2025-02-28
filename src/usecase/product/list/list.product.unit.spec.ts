import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const product1 = new Product("1", "Product 1", 100);
const product2 = new Product("2", "Product 2", 200);

const MockRepository = () => ({
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2]))
});

describe("Unit test for List Product use case", () => {

    it("should return a list of products", async () => {
        const repository = MockRepository();
        const usecase = new ListProductUseCase(repository);
        const output = await usecase.execute({});

        expect(output.products.length).toEqual(2);
        expect(output.products[0].name).toEqual(product1.name);
        expect(output.products[1].name).toEqual(product2.name);
        expect(output.products[0].id).toEqual(product1.id);
        expect(output.products[1].id).toEqual(product2.id);
        expect(output.products[0].price).toEqual(product1.price);
        expect(output.products[1].price).toEqual(product2.price);
    });

    it("should return an empty list of products", async () => {
        const repository = MockRepository();
        repository.findAll.mockReturnValue(Promise.resolve([]));
        const usecase = new ListProductUseCase(repository);
        const output = await usecase.execute({});

        expect(output.products.length).toEqual(0);
    });

});