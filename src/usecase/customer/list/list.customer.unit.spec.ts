import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import ListCustomerUsecase from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress(
  "John Doe",
  new Address("Main Street", 123, "12345", "Springfield")
);

const customer2 = CustomerFactory.createWithAddress(
  "Jane Doe",
  new Address("Main Street 2", 1233, "123456", "Springfall")
);

const MockRepository = () => {
    return {
        create: jest.fn(),
        update: jest.fn(),
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2]))
    };
};

describe("Unit test for listing customer usecase", () => {

    it("should return a list of customers", async () => {
        const repository = MockRepository();
        const usecase = new ListCustomerUsecase(repository);
        const output = await usecase.execute({});

        expect(output.customers.length).toEqual(2);
        expect(output.customers[0].name).toEqual(customer1.name);
        expect(output.customers[1].name).toEqual(customer2.name);
        expect(output.customers[0].id).toEqual(customer1.id);
        expect(output.customers[1].id).toEqual(customer2.id);
        expect(output.customers[0].address.city).toEqual(customer1.Address.city);
        expect(output.customers[1].address.city).toEqual(customer2.Address.city);     
        expect(output.customers[0].address.number).toEqual(customer1.Address.number);
        expect(output.customers[1].address.number).toEqual(customer2.Address.number);     
        expect(output.customers[0].address.zip).toEqual(customer1.Address.zip);
        expect(output.customers[1].address.zip).toEqual(customer2.Address.zip);
        expect(output.customers[0].address.street).toEqual(customer1.Address.street);
        expect(output.customers[1].address.street).toEqual(customer2.Address.street);     
    });

    it("should return an empty list of customers", async () => {
        const repository = MockRepository();
        repository.findAll.mockReturnValue(Promise.resolve([]));
        const usecase = new ListCustomerUsecase(repository);
        const output = await usecase.execute({});

        expect(output.customers.length).toEqual(0);
    });
});