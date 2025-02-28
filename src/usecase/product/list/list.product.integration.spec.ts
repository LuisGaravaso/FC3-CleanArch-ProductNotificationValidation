import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import ListProductUseCase from "./list.product.usecase";

describe("Integration test for List Product use case", () => {

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

    it("should return a list of products", async () => {
        // Arrange
        const productRepository = new ProductRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);
        const listProductUseCase = new ListProductUseCase(productRepository);

        // Act
        const input1 = {
            name: "Product 1",
            price: 100,
        };

        const input2 = {
            name: "Product 2",
            price: 200,
        };

        await createProductUseCase.execute(input1);
        await createProductUseCase.execute(input2);

        const output = await listProductUseCase.execute({});

        // Assert
        expect(output.products.length).toEqual(2);
        expect(output.products[0].name).toEqual(input1.name);
        expect(output.products[1].name).toEqual(input2.name);
        expect(output.products[0].price).toEqual(input1.price);
        expect(output.products[1].price).toEqual(input2.price);
    });

    it("should return an empty list of products", async () => {
        // Arrange
        const productRepository = new ProductRepository();
        const listProductUseCase = new ListProductUseCase(productRepository);

        // Act
        const output = await listProductUseCase.execute({});

        // Assert
        expect(output.products.length).toEqual(0);
    });

});