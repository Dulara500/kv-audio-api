import { addinquiry,deleteinquiry,getinquiry, updateinquiry } from "../Controllers/inquiryController.js";
import express from "express";
import authentication from "../middleware/authentication.js";
import authorization from "../middleware/authorization.js";

const inquiryRouter = express.Router();

inquiryRouter.get('/',authentication,async (req,res)=>{
    try{
        const inquires = await getinquiry(req.user.role,req.user.email);
        res.status(200).json({
            "message" : "Inquiries retrived successfuly",
            inquires
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            "message" : "failed retrival"
        });
    }
})

inquiryRouter.post('/',authentication,authorization("customer"),async (req,res)=>{
    try{
        const inquiry = await addinquiry(req);
        res.status(201).json({
            "message" : "inquiry added successfuly",
            "id" : inquiry.id
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            "message" : "inquiry add failed"
        });
    }
});

inquiryRouter.put('/:id',authentication, async(req,res)=>{
    try{
        const inquiry = await updateinquiry(req.params.id,req.user,req.body);
        if(!inquiry){
            return res.status(404).json({
                "message" : "no inquiry exists with that id"
            });
        }
        res.status(201).json({
            "message" : "inquiry updated sucessfuly"
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            "message" : err.message || "error occured while updating"
        })
    }
})

inquiryRouter.delete('/:id',authentication, async(req,res)=>{
    try{
        
        const inquiry = await deleteinquiry(req.params.id,req.user);
        console.log(inquiry);
        if(!inquiry){
            return res.status(404).json({
                "message" : "inquiry not found"
            });
            
        }
        res.status(201).json({
            "message": "inquiry deleted successfuly"
        });
    }catch(err){
        res.status(500).json({
            "message": err.message || "failed to delete the inquiry" 
        });
    }
})

export default inquiryRouter;
