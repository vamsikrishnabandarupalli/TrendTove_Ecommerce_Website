const Feature = require("../../models/Features");

// Add a new feature image
const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    const newFeature = new Feature({ image });
    await newFeature.save();

    return res.status(201).json({
      success: true,
      data: newFeature,
    });
  } catch (error) {
    console.error("Error adding feature image:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

// Get all feature images
const getFeatureImages = async (req, res) => {
  try {
    const features = await Feature.find();

    return res.status(200).json({
      success: true,
      data: features,
    });
  } catch (error) {
    console.error("Error fetching feature images:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};

module.exports = {
  addFeatureImage,
  getFeatureImages,
};
