import express, {Request, Response} from 'express';
import CreateProductUsecase from '../../../usecase/product/create/create.product.usecase';
import ProductRepository from '../../product/repository/sequelize/product.repository';
import ListProductUsecase from '../../../usecase/product/list/list.product.usecase';

export const productRouter = express.Router();

productRouter.post('/', async (req: Request, res: Response) => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUsecase(productRepository);

    try {
        const productDto = {
            name: req.body.name,
            price: req.body.price,
        }
        const output = await usecase.execute(productDto);
        res.send(output);
    }
    catch (error) {
        res.status(500).send(error);
    }
});

productRouter.get('/', async (req: Request, res: Response) => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUsecase(productRepository);

    try {
        const output = await usecase.execute({});
        res.send(output);
    }
    catch (error) {
        res.status(500).send(error);
    }
});