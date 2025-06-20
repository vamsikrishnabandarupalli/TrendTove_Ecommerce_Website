const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be a string.",
      });
    }

    const searchRegex = new RegExp(keyword, "i");

    const searchQuery = {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { brand: searchRegex },
      ],
    };

    const searchResults = await Product.find(searchQuery);

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while searching for products.",
    });
  }
};

module.exports = { searchProducts };
