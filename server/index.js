import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import userRouter from './routes/user.routes.js';
import propertyRouter from './routes/property.routes.js';

dotenv.config();
const port = 8080 || process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json({limit:'50 mb'}));

app.get('/', (req,res)=>{
    res.send({message:'KAMADO is here yeah !'})
});

app.use('/api/v1/users',userRouter)
app.use('/api/v1/properties',propertyRouter)

const startServer = async () =>{
    try{
        connectDB(process.env.MONGODB_URL);
        app.listen(port,()=>console.log(`le server tourne sur http://localhost:${port}`))
    }catch(error){
        console.log(error);
    }
};

startServer();