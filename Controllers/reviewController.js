import Review from "../models/reviews.js";

export function addReview(data){
    let review = new Review(data);
    return review.save();
}

export async function getReviews(data){
    if(data.user==null || data.user.role!="admin"){ 
        return Review.find({isApproved : true});
    }
    return Review.find();
}

export async function deleteReview(user,paramEmail){
    if(user.email === paramEmail || user.role === "admin"){
        const result = await Review.deleteOne({email:paramEmail});
        return result;
    }
    throw new Error("Unauthorized");
}

export function approveReview(userRole, email){
    // if(userRole !== "admin"){
    //     throw new Error("Unauthorized");
    // }
    return Review.findOneAndUpdate({email},{$set:{isApproved:true}},{new:true});
}

