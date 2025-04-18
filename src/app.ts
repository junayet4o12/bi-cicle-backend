import express, { Application, NextFunction, Request, Response } from "express";
import cors from 'cors'
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from 'cookie-parser';
const app: Application = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: ['http://localhost:5173', 'https://cycle-craze-frontend.vercel.app'], credentials: true, }))
app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
    res.send('bi-cycle server is running');
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    globalErrorHandler(err, req, res, next)
});

app.use((req: Request, res: Response, next: NextFunction) => {
    notFound(req, res, next)
})

export default app