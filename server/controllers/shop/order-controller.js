const paypal = require("../../helpers/paypal");
const Order = require("../../models/Orders");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");


const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    if (!userId || !cartItems || cartItems.length === 0 || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data. User ID, cart items, and total amount are required.",
      });
    }

    const paymentRequest = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/checkout",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "Purchase from Shop.",
        },
      ],
    };

    paypal.payment.create(paymentRequest, async (err, paymentInfo) => {
      if (err) {
        console.error("PayPal payment creation error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to create PayPal payment.",
        });
      }

      const newOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId,
        payerId,
      });

      await newOrder.save();

      const approvalLink = paymentInfo.links.find((link) => link.rel === "approval_url");

      if (!approvalLink) {
        return res.status(500).json({
          success: false,
          message: "Failed to get approval URL from PayPal.",
        });
      }

      return res.status(201).json({
        success: true,
        approvalURL: approvalLink.href,
        orderId: newOrder._id,
      });
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating order.",
    });
  }
};


const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    if (!orderId || !paymentId || !payerId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID, Payer ID, and Order ID are required.",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.title}`,
        });
      }

      if (product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

   
    if (order.cartId) {
      await Cart.findByIdAndDelete(order.cartId);
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order confirmed and payment captured.",
      data: order,
    });
  } catch (error) {
    console.error("Payment capture error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during payment capture.",
    });
  }
};


const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user.",
      });
    }

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Fetching user orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching orders.",
    });
  }
};


const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Fetching order details error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching order.",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
