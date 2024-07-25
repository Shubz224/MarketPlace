import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, photo, gender, _id, dob } = req.body;
    console.log(name, email, photo, gender, _id, dob);
    const user = await User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: new Date(dob),
    });
    return res.status(200).json({
        sucess: true,
        message: `Welcome,${user.name}`,
    });
});
