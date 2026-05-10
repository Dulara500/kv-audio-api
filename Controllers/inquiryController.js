import { response } from "express";
import Inquiry from "../models/inquiry.js";

export function getinquiry(user,email){
    if(user!=="admin"){
        return Inquiry.find({email}).sort({id:-1});
    }
    return Inquiry.find().sort({id:-1});
}

export async function addinquiry(request){
    let data = request.body
    data.email = request.user.email;
    data.phone = request.user.phone;

    let id = 0;
    const inquiries = await Inquiry.find().sort({id:-1}).limit(1);
    if(inquiries.length===0){
        id=1;
    }else{
        id=inquiries[0].id + 1;
    }
    data.id = id;
    const newInquiry = new Inquiry(data);
    return newInquiry.save();
}

export async function deleteinquiry(id,user){
    const inquiry = await Inquiry.findOne({id});
    if(!inquiry){
        return null;
    }
    if(user.email===inquiry.email){
        return Inquiry.deleteOne({id});
    }
    if(user.role!=="admin" && inquiry.email!==user.email){
        throw new Error("Unauthorized");
    }
    return Inquiry.deleteOne({id})
}

export async function updateinquiry(id,user,data){
    console.log(data)
    const inquiry = await Inquiry.findOne({id});
    if(!inquiry){
        return null;
    }
    if(user.role==="admin"){
        return Inquiry.findOneAndUpdate({id},
            {$set:{
                response:data.response,
                isResolved:data.isResolved}
            },
            {new:true});
    }

    if(user.role==="customer"){
        if(inquiry.email!==user.email){
            throw new Error("unauthorized");
        }
        return Inquiry.findOneAndUpdate({id},{$set:{message:data.message}},{new:true});
    }

    
    
}