import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreatedProductUseCase from "./create.product.usecase";

describe("Integration test for Create Product use case", () => {

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

    it("should create a product", async () => {
        // Arrange
        const productRepository = new ProductRepository();
        const usecase = new CreatedProductUseCase(productRepository);

        // Act
        const input = {
            name: "Product 1",
            price: 100,
        };

        const output = await usecase.execute(input);

        // Assert
        expect(output.name).toEqual(input.name);
        expect(output.price).toEqual(input.price);
        expect(output.id).toBeDefined();
    
    });

    it("should throw an error when name is missing", async () => {
        // Arrange
        const productRepository = new ProductRepository();
        const usecase = new CreatedProductUseCase(productRepository);

        // Act
        await expect(usecase.execute({
            name: "",
            price: 100,
        })).rejects.toThrowError("Name is required");
    });

    it("should throw an error when price is negative", async () => {
        // Arrange
        const productRepository = new ProductRepository();
        const usecase = new CreatedProductUseCase(productRepository);

        // Act
        await expect(usecase.execute({
            name: "Product 1",
            price: -1,
        })).rejects.toThrowError("Price must be greater than zero");
    });

});