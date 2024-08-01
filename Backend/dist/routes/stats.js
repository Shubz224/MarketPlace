import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { getBarCharts, getDashboardStats, getLineCharts, getPieChart } from "../controllers/stats.js";
const app = express.Router();
// -> api/v1/dashboard/stats
app.get("/stats", adminOnly, getDashboardStats);
// -> api/v1/dashboard/pie
app.get("/pie", adminOnly, getPieChart);
// -> api/v1/dashboard/bar
app.get("/bar", adminOnly, getBarCharts);
// -> api/v1/dashboard/line
app.get("/line", adminOnly, getLineCharts);
export default app;
