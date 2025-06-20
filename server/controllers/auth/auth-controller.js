const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "CLIENT_SECRET_KEY";

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ success: true, message: "Registration successful." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Registration failed." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: "Invalid password." });

    const payload = { id: user._id, email: user.email, role: user.role, userName: user.userName };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ success: true, message: "Login successful.", user: payload, token });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Login failed." });
  }
};

const logoutUser = (req, res) => {
  return res.status(200).json({ success: true, message: "Logout handled client-side." });
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
