import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Address from "../../../domain/customer/value-object/address";
import Customer from "../../../domain/customer/entity/customer";
import FindCustomerUseCase from "./find.customer.usecase";

describe("Test find customer use case", () => {

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

    it("should find a customer", async () => {
        // Arrange
        const customerRepository = new CustomerRepository();
        const usecase = new FindCustomerUseCase(customerRepository);
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        // Act
        const input = { id: "123" };

        const expectedOutput = {
            id: "123",
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
        expect(output).toEqual(expectedOutput);
    });

    it("should throw an error when customer not found", async () => {
        // Arrange
        const customerRepository = new CustomerRepository();
        const usecase = new FindCustomerUseCase(customerRepository);

        // Act
        await expect(usecase.execute({ id: "123" })).rejects.toThrow("Customer not found");
    });
});