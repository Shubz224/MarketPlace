import express from "express";

//importing routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from 'node-cache'
//calling connect db
connectDB();

export const myCache = new NodeCache();

const app = express();
const port = 3000;

//using middlewear
app.use(express.json());
``;
app.get("/", (req, res) => {
  res.send("API Working /api/v1");
});

//using Routes
app.use("/api/v1/user", userRoute); //all user routes will will here 1

app.use("/api/v1/product", productRoute);

//using error middleware
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
