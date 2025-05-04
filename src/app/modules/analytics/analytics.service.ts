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
            percentageChange: parseFloat(calculatePercentChange(lastMonthOrders, totalOrders).toFixed(2))
        },
        usersData: {
            total: totalUsers,
            lastMonthTotal: lastMonthUsers,
            percentageChange: parseFloat(calculatePercentChange(lastMonthUsers, totalUsers).toFixed(2))
        }
    };
};

// ------------------ Separate Services ------------------

// ✅ Get last 12 months users, orders, revenue data
const getLast12MonthsAnalyticsData = async () => {
    const [users, orders, revenue] = await Promise.all([
        User.aggregate([
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
        ]),
        Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 11))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    orders: { $sum: 1 } // simply count orders directly
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
                $project: {
                    _id: 0,
                    orders: 1,
                    month: monthSyntax
                }
            }
        ]),
        Order.aggregate([
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
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
                $project: {
                    _id: 0,
                    totalRevenue: 1,
                    month: monthSyntax
                }
            }
        ])
    ]);

    return { users, orders, revenue };
};

// ✅ Get top 10 products
const getTopSellingProducts = async (query: Record<string, unknown>) => {
    const limit = query.limit ? parseInt(query.limit as string) : 10;
    
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
                totalRevenue: 1,
                images: "$productDetails.images",
                brand: "$productDetails.brand",
                price: "$productDetails.price"
            }
        },
        { $sort: { totalQuantitySold: -1 } },
        { $limit: limit }
    ]);
};

export const AnalyticsServices = {
    analyzeOrders,
    getLast12MonthsAnalyticsData,
    getTopSellingProducts
};
