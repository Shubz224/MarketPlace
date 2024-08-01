import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";
export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats = {};
    if (myCache.has("admin-stats"))
        stats = JSON.parse(myCache.get("admin-stats"));
    else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        };
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0),
        };
        const thisMonthProductsPromise = Product.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        const lastMonthProductsPromise = Product.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        const thisMonthUsersPromise = User.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        const lastMonthUsersPromise = User.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        const thisMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        const lastMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        const lastSixMnthOrdersPromise = Order.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            },
        });
        const latestTransictionPromise = Order.find({})
            .select(["orderItems", "discount", "total", "status"])
            .limit(4);
        /// Passing all to run simultaniously
        const [thisMonthOrders, thisMonthProducts, thisMonthUsers, lastMonthOrders, lastMonthProducts, lastMonthUsers, productsCount, usersCount, allOrders, lastSixMnthOrders, categories, femaleUsersCount, lastestTransiction,] = await Promise.all([
            thisMonthOrdersPromise,
            thisMonthProductsPromise,
            thisMonthUsersPromise,
            lastMonthOrdersPromise,
            lastMonthProductsPromise,
            lastMonthUsersPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMnthOrdersPromise,
            Product.distinct("category"),
            User.countDocuments({ gender: "female" }),
            latestTransictionPromise,
        ]);
        const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const Changepercent = {
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
            product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
            orders: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
        };
        const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);
        const count = {
            revenue,
            user: usersCount,
            product: productsCount,
            order: allOrders.length,
        };
        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthlyRevenue = new Array(6).fill(0);
        lastSixMnthOrders.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = today.getMonth() - creationDate.getMonth();
            if (monthDiff < 6) {
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
            }
        });
        //inventory
        const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));
        const categoriesCount = await Promise.all(categoriesCountPromise);
        const categoryCount = [];
        categories.forEach((category, i) => {
            categoryCount.push({
                [category]: Math.round((categoriesCount[i] / productsCount) * 100),
            });
        });
        const userRatio = {
            male: usersCount - femaleUsersCount,
            female: femaleUsersCount,
        };
        const modifiedLatestTransiction = lastestTransiction.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status,
        }));
        stats = {
            categoryCount,
            Changepercent,
            count,
            chart: {
                order: orderMonthCounts,
                revenue: orderMonthlyRevenue,
            },
            userRatio,
            lastestTransiction: modifiedLatestTransiction,
        };
        myCache.set("admin-stats", JSON.stringify(stats));
    }
    return res.status(200).json({
        success: true,
        stats,
    });
});
export const getPieChart = TryCatch(async (req, res, next) => {
    let charts;
    if (myCache.has("admin-pie-charts"))
        charts = JSON.parse(myCache.get("admin-pie-charts"));
    else {
        const [processingOrder, shippingOrder, deliveredOrder] = await Promise.all([
            Order.countDocuments({ status: "Processing" }),
            Order.countDocuments({ status: "Shipped" }),
            Order.countDocuments({ status: "Delivered" }),
        ]);
        const orderFullfillment = {
            processing: processingOrder,
            shipped: shippingOrder,
            Delivered: deliveredOrder,
        };
        charts = {
            orderFullfillment,
        };
        myCache.set("admin-pie-charts", JSON.stringify(charts));
        //
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});
export const getLineCharts = TryCatch(async (req, res, next) => { });
export const getBarCharts = TryCatch(async (req, res, next) => { });
