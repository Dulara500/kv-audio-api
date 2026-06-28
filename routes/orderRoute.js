import express from "express"
import { createOrder, getOrder, getCustomerOrders, cancelOrder } from "../Controllers/orderController.js";
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

orderRoute.get('/my-orders',authentication,authorization("customer", "admin"),async (req,res)=>{
    try{
        const orders = await getCustomerOrders(req.user.email);
        res.status(200).json({
            "message" : "Orders fetched successfully",
            "orders" : orders
        });
    }catch(err){
        res.status(500).json({
            "message" : err.message ||"error while fetching orders"
        })
    }
});

orderRoute.delete('/:orderId',authentication,authorization("customer"),async (req,res)=>{
    try{
        const order = await cancelOrder(req.params.orderId, req.user.email);
        res.status(200).json({
            "message" : "Order cancelled successfully",
            "order" : order
        });
    }catch(err){
        const status = err.message.includes("not found") ? 404
            : err.message.includes("expired") ? 410
            : err.message.includes("Only pending") ? 400
            : 500;
        res.status(status).json({
            "message" : err.message || "error while cancelling order"
        })
    }
});

orderRoute.get('/',authentication,authorization("admin"),async (req,res)=>{
    try{
        const orders = await getOrder();
        res.status(200).json({
            "message" : "Orders fetched successfully",
            "orders" : orders
        });
    }catch(err){
        res.status(500).json({
            "message" : err.message ||"error while fetching orders"
        })
    }
});

export default orderRoute;


