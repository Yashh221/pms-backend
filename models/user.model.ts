import { NextFunction } from 'express';
import mongoose,{ Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

interface User extends Document{
    name:string,
    password:string,
    phoneNum?:string,
    email:string,
    role: "owner" | "maintainer" | "member",
    isValidatePassword: (password:string) => Promise<boolean>
}

const userSchema = new Schema<User>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNum:{
        type:String
    },
    role:{
        type:String,
        required:true,
        enum:["owner" , "maintainer" , "member"]
    }
});
userSchema.methods.getHashedPassword = async function(next:NextFunction) {
    if(!this.isModified('password')) return next()
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        return next()
    } catch (error) {
        next(error)
    }
}
userSchema.pre('save',userSchema.methods.getHashedPassword);

userSchema.methods.isValidatePassword = async function(password:string) {
    return await bcrypt.compare(password,this.password)
}
export const User = mongoose.model<User>('User',userSchema);