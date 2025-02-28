import express, {Request, Response} from 'express';
import CreateCustomerUsecase from '../../../usecase/customer/create/create.customer.usecase';
import CustomerRepository from '../../customer/repository/sequelize/customer.repository';
import ListCustomerUsecase from '../../../usecase/customer/list/list.customer.usecase';

export const customerRouter = express.Router();

customerRouter.post('/', async (req: Request, res: Response) => {
    const customerRepository = new CustomerRepository();
    const usecase = new CreateCustomerUsecase(customerRepository);

    try {
        const customerDto = {
            name: req.body.name,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                number: req.body.address.number,
                zip: req.body.address.zip,
            }
        }
        const output = await usecase.execute(customerDto);
        res.send(output);
    }
    catch (error) {
        res.status(500).send(error);
    }
});

customerRouter.get('/', async (req: Request, res: Response) => {
    const customerRepository = new CustomerRepository();
    const usecase = new ListCustomerUsecase(customerRepository);

    try {
        const output = await usecase.execute({});
        res.send(output);
    }
    catch (error) {
        res.status(500).send(error);
    }
});