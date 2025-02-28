import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CreatedCustomerUseCase from "./create.customer.usecase";

describe("Integration test for Create Customer use case", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });


    it("should create a customer", async () => {
        // Arrange
        const customerRepository = new CustomerRepository();
        const usecase = new CreatedCustomerUseCase(customerRepository);

        // Act
        const input = {
            name: "Customer 1",
            address: {
                street: "Street 1",
                city: "City 1",
                number: 1,
                zip: "Zipcode 1",
            },
        };

        const output = await usecase.execute(input);

        // Assert
        expect(output.name).toEqual(input.name);
        expect(output.address.street).toEqual(input.address.street);
        expect(output.address.city).toEqual(input.address.city);
        expect(output.address.number).toEqual(input.address.number);
        expect(output.address.zip).toEqual(input.address.zip);
        expect(output.id).toBeDefined();
    
    });

    it("should throw an error when name is missing", async () => {
        // Arrange
        const customerRepository = new CustomerRepository();
        const usecase = new CreatedCustomerUseCase(customerRepository);

        // Act
        const input = {
            id: "123",
            name: "",
            address: {
                street: "Street 1",
                city: "City 1",
                number: 1,
                zip: "Zipcode 1",
            },
        };

        // Assert
        await expect(usecase.execute(input)).rejects.toThrowError("Name is required");
    });
});