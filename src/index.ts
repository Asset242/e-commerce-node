import express, {Express, Request, Response} from 'express';
import { PORT } from './secret';
import rootRoutes from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';
const app:Express = express();

app.use(express.json())
app.use('/api', rootRoutes);
console.log(process.env.DATABASE_URL)

export const prismaClient = new PrismaClient({
    log: ['query']
}).$extends({
    result: {
        address: {
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pincode: true
                },
                compute: (addr: any) => {
                    return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}, ${addr.pincode}`
                }
            }
        }
    }
})

app.use(errorMiddleware)
app.listen(PORT, () => {console.log(`Server is rnning on port ${PORT}`);});
