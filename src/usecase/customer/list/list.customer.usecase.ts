import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import { InputFindAllCustomerDto, OutputFindAllCustomerDto } from "./list.customer.dto";


export default class ListCustomerUsecase {
    private CustomerRepository: CustomerRepositoryInterface;

    constructor(CustomerRepository: CustomerRepositoryInterface) {
        this.CustomerRepository = CustomerRepository;
    }

    async execute(input: InputFindAllCustomerDto): Promise<OutputFindAllCustomerDto> {
        const customers = await this.CustomerRepository.findAll();

        return {
            customers: customers.map((customer) => {
                return {
                    id: customer.id,
                    name: customer.name,
                    address: {
                        street: customer.Address.street,
                        number: customer.Address.number,
                        zip: customer.Address.zip,
                        city: customer.Address.city,
                    },
                };
            }),
        };
    }
}