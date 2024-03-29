// user.ts
// Author: Parul Gautam
// Date: 23 July, 2023
import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

interface IUser {
    username: string;
    emailAddress: string;
    displayName: string;
    created: Date;
    updated: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: String,
        emailAddress: String,
        displayName: String,
        created: {
            type: Date,
            default: Date.now(),
        },
        updated: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        collection: "users",
    }
);

type _User = IUser;

UserSchema.plugin(passportLocalMongoose);

const Model = mongoose.model<IUser>("User", UserSchema);

declare global {
    export type UserDocument = mongoose.Document & {
        _id: String;
        username: String;
        emailAddress: String;
        displayName: String;
    };
}

export default Model;
