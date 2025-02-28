import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import UpdateCustomerUsecase from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress(
    'John', 
    new Address('Street', 123, 'Zip', 'City'));

const input = {
    id: '123',
    name: 'John Updated',
    address: {
        street: 'Main Street Updated',
        number: 1234,
        zip: 'Zip Updated',
        city: 'City Updated',
    },
}

const MockRepository = () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        update: jest.fn(),
    }
};

describe('Unit test for update customer use case', () => {

    it('should update a customer', async () => {
        const repository = MockRepository();
        const customerUpdateUseCase = new UpdateCustomerUsecase(repository);

        const output = await customerUpdateUseCase.execute(input);

        expect(output).toEqual({
            id: customer.id,
            name: input.name,
            address: {
                street: input.address.street,
                number: input.address.number,
                zip: input.address.zip,
                city: input.address.city,
            },
        });
    });

    it('should throw an error when customer is not found', async () => {
        const repository = MockRepository();
        repository.find = jest.fn().mockReturnValue(Promise.resolve(null));
        const customerUpdateUseCase = new UpdateCustomerUsecase(repository);

        await expect(customerUpdateUseCase.execute(input)).rejects.toThrowError('Customer not found');
    });

});
