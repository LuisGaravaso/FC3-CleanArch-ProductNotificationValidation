import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import FindProductUseCase from "./find.product.usecase";

describe("Integration test for Find Product use case", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find a product", async () => {
        // Arrange
        const productRepository = new ProductRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);
        const findProductUseCase = new FindProductUseCase(productRepository);

        // Act
        const input = {
            name: "Product 1",
            price: 100,
        };

        const createdProduct = await createProductUseCase.execute(input);

        const output = await findProductUseCase.execute({ id: createdProduct.id });

        // Assert
        expect(output.id).toEqual(createdProduct.id);
        expect(output.name).toEqual(createdProduct.name);
        expect(output.price).toEqual(createdProduct.price);

    });

    it("should throw an error when product not found", async () => {
        // Arrange
        const productRepository = new ProductRepository();
        const findProductUseCase = new FindProductUseCase(productRepository);

        // Act
        await expect(findProductUseCase.execute({ id: "123" })).rejects.toThrow("Product not found");
    });

});