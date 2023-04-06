import mongose from 'mongoose';

const connectDB  = (url)=>{
    mongose.set('strictQuery', true);
    mongose.connect(url)
        .then(()=>console.log('MongoDB connecté'))
        .catch((error)=>console.log(error))
};

export default connectDB;