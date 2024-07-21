import express from 'express'

//importing routes
import userRoute from "./routes/user.js"
import { connectDB } from './utils/features.js';


//calling connect db 
connectDB();

const app = express();
const port = 3000;


app.get("/",(req,res)=>{
    res.send("API Working /api/v1");
})
//using Routes

app.use("/api/v1/user", userRoute);  //all user routes will will here 1






app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`)
})

