const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getSalesAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ status: 'paid' });
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalProducts = await Product.countDocuments();

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.name', totalSold: { $sum: '$items.quantity' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalOrders,
      paidOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalProducts,
      topProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};