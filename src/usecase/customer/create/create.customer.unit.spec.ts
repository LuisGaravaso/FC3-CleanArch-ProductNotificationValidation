import CreateCustomerUsecase from "./create.customer.usecase";

const input = {
    name: 'John Doe',
    address: {
        street: 'Main Street',
        city: 'Springfield',
        number: 123,
        zip: '12345',
    },
};

const MockRepository = () => ({
    create: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
});

describe('Unit test for create customer use case', () => {

    it('should create a customer', async () => {
        const repository = MockRepository();
        const customerCreateUseCase = new CreateCustomerUsecase(repository);

        const output = await customerCreateUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                city: input.address.city,
                number: input.address.number,
                zip: input.address.zip,
            },
        });
    });

    it('should throw an error when name is missing', async () => {
        const repository = MockRepository();
        const customerCreateUseCase = new CreateCustomerUsecase(repository);
       
        await expect(customerCreateUseCase.execute({
            ...input,
            name: '',
        })).rejects.toThrowError('Name is required');
    });
    
});

