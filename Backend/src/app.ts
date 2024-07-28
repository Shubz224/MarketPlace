import express from "express";

//importing routes
import userRoute from "./routes/user.js";
import orderRoute from "./routes/orders.js"
import productRoute from "./routes/products.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from 'node-cache'
import {config} from "dotenv"
import morgan from 'morgan'



config({
  path:"./.env"
})

const mongouri = process.env.MONGO_URI || "";
//calling connect db
connectDB(mongouri);

export const myCache = new NodeCache();

const app = express();
app.use(morgan("dev"))
const port = process.env.PORT  || 3000 ;

//using middlewear
app.use(express.json());
``;
app.get("/", (req, res) => {
  res.send("API Working /api/v1");
});

//using Routes
app.use("/api/v1/user", userRoute); //all user routes will will here 1

app.use("/api/v1/product", productRoute);

app.use('/api/v1/order' , orderRoute)

//using error middleware
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
