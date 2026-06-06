import express from "express"
import { createOrder } from "../Controllers/orderController.js";
import authentication from "../middleware/authentication.js";
import authorization from "../middleware/authorization.js";

const orderRoute = express.Router();

orderRoute.post('/',authentication,authorization("customer"),async (req,res)=>{
    try{
        const order = await createOrder(req);
        res.status(201).json({
            "message" : "Order created successfully",
            "order" : order
        });
    }catch(err){
        res.status(500).json({
            "message" : err.message ||"error while creating order"
        })
    }
});

export default orderRoute;

