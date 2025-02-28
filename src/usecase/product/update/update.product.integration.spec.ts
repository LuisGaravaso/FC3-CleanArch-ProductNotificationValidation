import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";

describe("Integration test for Update Product use case", () => {

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

    it("should update a product", async () => {

        // Arrange
        const productRepository = new ProductRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);
        const updateProductUseCase = new UpdateProductUseCase(productRepository);

        // Act
        const input1 = {
            name: "Product 1",
            price: 100,
        };

        const product1 = await createProductUseCase.execute(input1);

        const output1 = await updateProductUseCase.execute({
            id: product1.id,
            name: "Product 1 Updated",
            price: 300,
        });

        // Assert
        expect(output1).toEqual({
            id: product1.id,
            name: "Product 1 Updated",
            price: 300,
        });

        const output2 = await updateProductUseCase.execute({
            id: product1.id,
            name: "Product 1 Updated Again",
            price: 400,
        });

        // Assert
        expect(output2).toEqual({
            id: product1.id,
            name: "Product 1 Updated Again",
            price: 400,
        });
    });

    it("should throw an error when product is not found", async () => {
        // Arrange
        const productRepository = new ProductRepository();
        const updateProductUseCase = new UpdateProductUseCase(productRepository);

        await expect(updateProductUseCase.execute({
            id: "123",
            name: "Product 1 Updated",
            price: 300,
        })).rejects.toThrowError("Product not found");
    });

});