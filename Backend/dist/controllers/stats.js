import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage, getChartData, getInventries, } from "../utils/features.js";
export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats = {};
    const key = "admin-stats";
    if (myCache.has(key))
        stats = JSON.parse(myCache.get(key));
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
            const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
            if (monthDiff < 6) {
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
            }
        });
        //inventory
        const categoryCount = await getInventries({
            categories,
            productsCount,
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
        myCache.set(key, JSON.stringify(stats));
    }
    return res.status(200).json({
        success: true,
        stats,
    });
});
//------------------------------------------------------------------------------------------------------>
export const getPieChart = TryCatch(async (req, res, next) => {
    let charts;
    const key = "admin-pie-charts";
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const allOrderPromise = Order.find({}).select([
            "total",
            "discount",
            "subtotal",
            "tax",
            "shippingCharges",
        ]);
        const [processingOrder, shippingOrder, deliveredOrder, categories, productsCount, outOfStock, allOrders, allUsers, adminUsers, customerUser,] = await Promise.all([
            Order.countDocuments({ status: "Processing" }),
            Order.countDocuments({ status: "Shipped" }),
            Order.countDocuments({ status: "Delivered" }),
            Product.distinct("category"),
            Product.countDocuments(),
            Product.countDocuments({ stock: 0 }),
            allOrderPromise,
            User.find({}).select(["dob"]),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "user" }),
        ]);
        const orderFullfillment = {
            processing: processingOrder,
            shipped: shippingOrder,
            Delivered: deliveredOrder,
        };
        const productCategories = await getInventries({
            categories,
            productsCount,
        });
        const stockAvailability = {
            instock: productsCount - outOfStock,
            outOfStock,
        };
        const GrossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0), 0);
        const discount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0);
        const productionCost = allOrders.reduce((prev, order) => prev + (order.shippingCharges || 0), 0);
        const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
        const marketingCost = Math.round(GrossIncome * (30 / 100));
        const netMargin = GrossIncome - discount - productionCost - burnt - marketingCost;
        const revenueDistribution = {
            netMargin,
            discount,
            productionCost,
            burnt,
            marketingCost,
        };
        const usersAgeGroup = {
            teen: allUsers.filter((i) => i.age < 20).length,
            adult: allUsers.filter((i) => i.age < 40 && i.age >= 20).length,
            old: allUsers.filter((i) => i.age >= 40).length,
        };
        const adminCustomer = {
            admin: adminUsers,
            customer: customerUser,
        };
        charts = {
            orderFullfillment,
            productCategories,
            stockAvailability,
            revenueDistribution,
            adminCustomer,
            usersAgeGroup,
        };
        myCache.set(key, JSON.stringify(charts));
        //
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});
//----------------------------------------------------------------------------------------------------->
//bar charts
export const getBarCharts = TryCatch(async (req, res, next) => {
    let charts;
    const key = "admin-bar-charts";
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const twelveMonthAgo = new Date();
        twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);
        const sixM0nthProductPromise = Product.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const sixMonthUsersPromise = User.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const twelveMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: twelveMonthAgo,
                $lte: today,
            },
        }).select("createdAt");
        const [products, users, orders] = await Promise.all([
            sixM0nthProductPromise,
            sixMonthUsersPromise,
            twelveMonthOrdersPromise,
        ]);
        const productCount = getChartData({ length: 6, docArr: products, today });
        const userCount = getChartData({ length: 6, docArr: users, today });
        const orderCount = getChartData({ length: 12, docArr: orders, today });
        charts = {
            users: userCount,
            product: productCount,
            order: orderCount,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});
export const getLineCharts = TryCatch(async (req, res, next) => {
    let charts;
    const key = "admin-line-charts";
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const today = new Date();
        const twelveMonthAgo = new Date();
        twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);
        const basequery = {
            createdAt: {
                $gte: twelveMonthAgo,
                $lte: today,
            },
        };
        const [products, users, orders] = await Promise.all([
            Product.find(basequery).select("createdAt"),
            User.find(basequery).select("createdAt"),
            Order.find(basequery).select(["createdAt", "discount", "total"]),
        ]);
        const productCount = getChartData({ length: 12, docArr: products, today });
        const userCount = getChartData({ length: 12, docArr: users, today });
        const discount = getChartData({
            length: 12,
            docArr: orders,
            today,
            property: "discount",
        });
        const revenue = getChartData({
            length: 12,
            docArr: orders,
            today,
            property: "total",
        });
        charts = {
            users: userCount,
            product: productCount,
            discount,
            revenue,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});
