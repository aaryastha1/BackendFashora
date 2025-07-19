



// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// // ========== REGISTER ==========
// exports.registerUser = async (req, res) => {
//   const { name, email, phoneNumber, password, role = "normal" } = req.body;

//   if (!name || !email || !phoneNumber || !password) {
//     return res.status(400).json({ success: false, message: "Missing fields" });
//   }

//   try {
//     const existingUser = await User.findOne({
//       $or: [{ name }, { email }, { phoneNumber }],
//     });

//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "User exists" });
//     }

//     const hashedPas = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       phoneNumber,
//       password: hashedPas,
//       role,
//     });

//     await newUser.save();

//     return res.status(201).json({
//       success: true,
//       message: "User Registered",
//       data: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//       },
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ========== LOGIN ==========
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ success: false, message: "Missing fields" });
//   }

//   try {
//     const getUser = await User.findOne({ email });
//     if (!getUser) {
//       return res.status(403).json({ success: false, message: "User not found" });
//     }

//     const passwordCheck = await bcrypt.compare(password, getUser.password);
//     if (!passwordCheck) {
//       return res.status(403).json({ success: false, message: "Invalid credentials" });
//     }

//     const payload = {
//       _id: getUser._id,
//       email: getUser.email,
//       fullname: getUser.fullName,
//       role: getUser.role,
//     };

//     const token = jwt.sign(payload, process.env.SECRET || "defaultsecret", {
//       expiresIn: "7d",
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: {
//         id: getUser._id,
//         name: getUser.name,
//         email: getUser.email,
//         role: getUser.role,
//       },
//       token,
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ========== GET MY PROFILE ==========
// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password");
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     return res.status(200).json({ success: true, data: user });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ========== UPDATE MY PROFILE ==========
// exports.updateProfile = async (req, res) => {
//   try {
//     const updates = req.body;

//     if (updates.password) {
//       updates.password = await bcrypt.hash(updates.password, 10);
//     }

//     const user = await User.findByIdAndUpdate(req.user._id, updates, {
//       new: true,
//       runValidators: true,
//     }).select("-password");

//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     return res.status(200).json({ success: true, message: "Profile updated", data: user });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };



const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ========== REGISTER ==========
exports.registerUser = async (req, res) => {
  const { name, email, phoneNumber, password, role = "normal" } = req.body;

  if (!name || !email || !phoneNumber || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ========== LOGIN ==========
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ success: false, message: "Invalid credentials" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.SECRET || "defaultsecret", {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ========== GET MY PROFILE ==========
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ========== UPDATE MY PROFILE ==========
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Optional: Generate new token with updated info
    const payload = {
      _id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    };

    const newToken = jwt.sign(payload, process.env.SECRET || "defaultsecret", {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
      token: newToken, // Return new token if frontend wants to use it
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
