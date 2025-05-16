import httpStatus from 'http-status';
import express, { Application, NextFunction, Request, Response } from "express";
import cors from 'cors'
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from 'cookie-parser';
import Order from "./app/modules/order/order.model";
import config from "./app/config";
import AppError from "./app/errors/AppError";
import { OrderServices } from './app/modules/order/order.service';
const frontend_url = config.frontend_url
const app: Application = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: ['https://cycle-craze-frontend.vercel.app'], credentials: true, }))
app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
    res.send('bi-cycle server is running');
});

app.post('/checkout/success/:tranId', async (req, res) => {
    const tranId = req.params.tranId
    await Order.findOneAndUpdate({ transactionId: tranId }, { $set: { paidStatus: true } }, { new: true })
    res.redirect(`${frontend_url}/checkout/OP/success/${tranId}`)
})
app.post('/checkout/fail/:tranId', async (req, res) => {
    const transId = req.params.tranId;
    const result = await Order.findOne({ transactionId: transId }).select('_id').lean();
    if (result?._id) {
        await OrderServices.deleteOrderFromDB(result?._id.toString())
    }
    res.redirect(`${frontend_url}/checkout/OP/fail`);
});

app.post('/checkout/cancel/:tranId', async (req, res) => {
    const transId = req.params.tranId;
    const result = await Order.findOne({ transactionId: transId }).select('_id').lean();
    if (result?._id) {
        await OrderServices.deleteOrderFromDB(result?._id.toString())
    }
    res.redirect(`${frontend_url}/checkout/OP/cancel`);
});

app.post('/checkout/ipn', async (req, res) => {
    try {
        const { tran_id, status } = req.body;

        if (!tran_id) {
            throw new AppError(httpStatus.NOT_FOUND, 'Transaction id not found!')
        }

        if (status === 'VALID') {
            await Order.findOneAndUpdate(
                { transactionId: tran_id },
                { $set: { paidStatus: true } },
                { new: true }
            );
        }

        res.status(200).json({ message: 'IPN received' });
    } catch (error) {
        throw new AppError(httpStatus.BAD_REQUEST, 'IPN processing failed')
        res.status(500).json({ message: 'IPN processing failed', error });
    }
});





app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    globalErrorHandler(err, req, res, next)
});

app.use((req: Request, res: Response, next: NextFunction) => {
    notFound(req, res, next)
})

export default app