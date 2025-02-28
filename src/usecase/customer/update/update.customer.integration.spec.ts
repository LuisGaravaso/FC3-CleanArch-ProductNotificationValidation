import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Address from "../../../domain/customer/value-object/address";
import Customer from "../../../domain/customer/entity/customer";
import UpdateCustomerUseCase from "./update.customer.usecase";

describe("Integration tests for list customers use case", () => {

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

    it("should update a customer", async () => {
        // Arrange
        const customerRepository = new CustomerRepository();
        const usecase = new UpdateCustomerUseCase(customerRepository);
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const input = {
            id: "123",
            name: "Customer 1 Updated",
            address: {
                street: "Street 1 Updated",
                city: "City 1 Updated",
                number: 1,
                zip: "Zipcode 1 Updated",
            },
        };

        // Act
        const output = await usecase.execute(input);

        // Assert
        expect(output).toEqual({
            id: "123",
            name: "Customer 1 Updated",
            address: {
                street: "Street 1 Updated",
                city: "City 1 Updated",
                number: 1,
                zip: "Zipcode 1 Updated",
            },
        });
    });

    it("should throw an error when customer does not exist", async () => {
        // Arrange
        const customerRepository = new CustomerRepository();
        const usecase = new UpdateCustomerUseCase(customerRepository);

        const input = {
            id: "123",
            name: "Customer 1 Updated",
            address: {
                street: "Street 1 Updated",
                city: "City 1 Updated",
                number: 1,
                zip: "Zipcode 1 Updated",
            },
        };

        // Act & Assert
        await expect(usecase.execute(input)).rejects.toThrow("Customer not found");
    });

});