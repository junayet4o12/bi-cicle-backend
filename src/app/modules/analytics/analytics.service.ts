import Order from "../order/order.model";

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

const calculateRevenueFromDB = async () => {
    // Total Revenue (All Time)
    const totalRevenue = await Order.aggregate(totalRevenueAggregateOperations);

    // Dates for Last Month
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const totalRevenueAtLastMonth = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }
            }
        },
        ...totalRevenueAggregateOperations
    ]);

    const currentTotal = totalRevenue[0]?.totalRevenue || 0;
    const lastMonthTotal = totalRevenueAtLastMonth[0]?.totalRevenue || 0;

    // Calculate Percentage Change
    let percentageChange = 0;
    if (lastMonthTotal > 0) {
        percentageChange = ((currentTotal - lastMonthTotal) / lastMonthTotal) * 100;
    }

    // Sales Over Time by Month (last 12 months)
    const last12Months = await Order.aggregate([
        {
            $unwind: "$products"
        },
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
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        },
        {
            $project: {
                _id: 0,
                month: {
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
                },
                totalRevenue: 1
            }
        }
    ]);

    const topProducts = await Order.aggregate([
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

    return {
        currentTotal,
        lastMonthTotal,
        percentageChange: parseFloat(percentageChange.toFixed(2)),
        salesOverTime: last12Months,
        topProducts
    };
};

export const AnalyticsServices = {
    calculateRevenueFromDB
};
