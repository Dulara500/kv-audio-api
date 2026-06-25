import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId:{
        type : String,
        required : true
    },
    sender:{
        type : String,
        required : true
    },
    receiver:{
        type : String,
        required : true,
        default:"admin"
    },
    message:{
        type : String,
        required : true
    },
    date:{
        type : Date,
        required : true,
        default : Date.now()
    },
    isResolved:{
        type: Boolean,
        required: true,
        default: false
    },
    response:{
        type: String,
        required:false,
        default: ""
    }
});

const Message = new mongoose.model("Message",messageSchema);

export default Message;