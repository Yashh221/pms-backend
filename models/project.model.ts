import mongoose, {Document, Schema} from 'mongoose'

interface Project extends Document{
    name:string,
    deadline:Date,
    subject:string,
    owners:mongoose.Schema.Types.ObjectId[],
    maintainers:mongoose.Schema.Types.ObjectId[],
    members:mongoose.Schema.Types.ObjectId[],
}

const projectSchema = new Schema<Project>({
    name:{
        type:String,
        required:true
    },
    deadline:{
        type:Date,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    owners:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    maintainers:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    members:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
});

export const Project = mongoose.model<Project>("Project",projectSchema);