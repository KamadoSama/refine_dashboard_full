import mongoose, { mongo } from 'mongoose';
import property from '../mongodb/models/property.js';
import * as dotenv from 'dotenv'
import {v2 as cloudinary} from 'cloudinary'
import User from '../mongodb/models/user.js';
dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllProperty = async (req,res)=>{
    const {_end,_order, _start, _sort, title_like= "", propertyType=""}= req.query;
    
    const query = {};

    if(propertyType !== "") {
        query.propertyType = propertyType;
    }
    
    if(title_like) {
        query.title = { $regex: title_like, $options: 'i' };
    }
    
    try{
        const count = await property.countDocuments({query});

        const properpries = await property
            .find(query)
            .limit(_end)
            .skip(_start)
            .sort({[_sort]:_order});
        res.header('x-total-count', count);
        res.header('Access-Control-Expose-Headers', 'x-total-count');

        res.status(200).json(properpries);
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
};

const getPropertyDetail = async (req,res) =>{
    const {id}= req.params;
    const propertyExists = await property.findOne({_id:id}).populate('creator');

    if(propertyExists){
        res.status(200).json(propertyExists)
        
    }else{
        res.status(404).json({message:"Propriété introuvable"});
    }
}

const createProperty = async (req,res)=>{
    try{
        const {
            title,
            description,
            propertyType,
            location,
            price,
            photo,
            email,
        } = req.body;

        //commence une nouvelle session 

        const session  = await mongoose.startSession();
        session.startTransaction();
        const user = await User.findOne({email}).session(session);
        if(!user) {
            throw Error('Utilisateur non trouvé')
            console.log('va chier')
        };
        const photoUrl  = await cloudinary.uploader.upload(photo);
        
        const newProperty  = await property.create({
            title,
            description,
            propertyType,
            location,
            price,
            photo:photoUrl.url,
            creator:user._id
        });
        user.allProperties.push(newProperty._id);
        await user.save({session});

        await session.commitTransaction();
        
        res.status(200).json({message: "propriété créé avec succès"});
    }catch(error){
        res.status(500).json({message:error.message});
    }

};

const updateProperty = async (req,res)=>{
    try{
        const {id} = req.params;
        const {title, description, propertyType, location, price, photo} = req.body;
        
        const photoUrl =  await cloudinary.uploader.upload(photo)
        await property.findByIdAndUpdate({_id:id},{
            title,
            description,
            propertyType,
            location,
            price,
            photo:photoUrl.url || photo
        }) 
        
        res.status(200).json({message:'propriété modifié avec suuccès'})

    }catch(error){
        res.status(500).json({message:error.message})
    }
};

const deleteProperty = async (req,res)=>{
    try{
        const {id} = req.params;

        const propertyToDelete =  await property.findById({_id:id}).populate('creator');

        if(!propertyToDelete){
            throw Error('Propriété introuvable');
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        propertyToDelete.remove({session});
        propertyToDelete.creator.allProperties.pull(propertyToDelete)

        await propertyToDelete.creator.save({session});
        await session.commitTransaction();
        res.status(200).json({message:"Propriété supprimé avec succès"});

    }catch(error){
            res.status(500).json({message:error.message});
    }

};

export {
    getAllProperty,
    getPropertyDetail,
    createProperty,
    updateProperty,
    deleteProperty
};