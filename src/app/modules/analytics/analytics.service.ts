import Order from "../order/order.model";
import { User } from "../user/user.model";

// ------------------ Helper Aggregation Pipelines ------------------

const totalRevenueAggregateOperations = [
    { $unwind: "$products" },
    {
        $group: {
            _id: null,
            totalRevenue: {
                $sum: { $multiply: ["$products.quantity", "$products.price"] }
            }
        }
    },
    {
        $project: {
            _id: 0,
            totalRevenue: 1
        }
    }
];

const monthSyntax = {
    $concat: [
        { $toString: "$_id.year" },
        "-",
        {
            $cond: [
                { $lt: ["$_id.month", 10] },
                { $concat: ["0", { $toString: "$_id.month" }] },
                { $toString: "$_id.month" }
            ]
        }
    ]
};

const calculatePercentChange = (previous: number, current: number) => {
    if (previous <= 0) return 0;
    return ((current - previous) / previous) * 100;
};

// ------------------ Main Analytics Function ------------------

const analyzeOrders = async () => {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [currentRevenue] = await Order.aggregate(totalRevenueAggregateOperations);
    const [lastMonthRevenue] = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }
            }
        },
        ...totalRevenueAggregateOperations
    ]);

    const currentTotalRevenue = currentRevenue?.totalRevenue || 0;
    const lastMonthTotalRevenue = lastMonthRevenue?.totalRevenue || 0;

    const last12MonthsOrdersData = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().setMonth(new Date().getMonth() - 11))
                }
            }
        },
        { $unwind: "$products" },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                totalRevenue: {
                    $sum: { $multiply: ["$products.quantity", "$products.price"] }
                },
                orderIds: { $addToSet: "$_id" }
            }
        },
        {
            $addFields: {
                totalOrders: { $size: "$orderIds" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
            $project: {
                _id: 0,
                month: monthSyntax,
                totalRevenue: 1,
                totalOrders: 1
            }
        }
    ]);



    const totalOrders = await Order.countDocuments();
    const lastMonthOrders = await Order.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }
    });

    const totalUsers = await User.countDocuments({ role: "user" });
    const lastMonthUsers = await User.countDocuments({
        role: "user",
        createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }
    });

    return {
        revenueData: {
            total: currentTotalRevenue,
            lastMonthTotal: lastMonthTotalRevenue,
            percentageChange: parseFloat(calculatePercentChange(lastMonthTotalRevenue, currentTotalRevenue).toFixed(2))
        },
        ordersData: {
            total: totalOrders,
            lastMonthTotal: lastMonthOrders,
            percentageChange: parseFloat(calculatePercentChange(lastMonthOrders, totalOrders).toFixed(2)),
            overYearData: last12MonthsOrdersData
        },
        usersData: {
            total: totalUsers,
            lastMonthTotal: lastMonthUsers,
            percentageChange: parseFloat(calculatePercentChange(lastMonthUsers, totalUsers).toFixed(2))
        }
    };
};

// ------------------ Separate Services ------------------

// ✅ Get last month users
const getLast12MonthUsersData = async () => {
    return await User.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().setMonth(new Date().getMonth() - 11))
                },
                role: "user"
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                users: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
            $project: {
                _id: 0,
                users: 1,
                month: monthSyntax
            }
        }
    ]);

};

// ✅ Get top 10 products
const getTopTenProducts = async () => {
    return await Order.aggregate([
        { $unwind: "$products" },
        {
            $group: {
                _id: "$products.product",
                totalQuantitySold: { $sum: "$products.quantity" },
                totalRevenue: {
                    $sum: { $multiply: ["$products.quantity", "$products.price"] }
                }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        { $unwind: "$productDetails" },
        {
            $project: {
                _id: 0,
                productId: "$_id",
                name: "$productDetails.name",
                totalQuantitySold: 1,
                totalRevenue: 1
            }
        },
        { $sort: { totalQuantitySold: -1 } },
        { $limit: 10 }
    ]);
};


export const AnalyticsServices = {
    analyzeOrders,
    getLast12MonthUsersData,
    getTopTenProducts
};
