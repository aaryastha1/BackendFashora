// const Product = require("../../models/Product")

// exports.createProduct = async (req, res) => {
//     const { name, price, categoryId, userId } = req.body;

//     if (!name || !price || !categoryId || !userId) {
//         return res.status(403).json({
//             success: false,
//             message: "Missing field"
//         });
//     }

//     const imagePath = req.file ? req.file.filename : "";

//     try {
//         const product = new Product({
//             name,
//             price,
//             categoryId,
//             sellerId: userId,
//             productImage: imagePath
//         });

//         await product.save();

//         return res.status(200).json({
//             success: true,
//             data: product,
//             message: "Product saved"
//         });
//     } catch (err) {
//         console.log("createProduct error", err);
//         return res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// };

// exports.getProducts = async (req, res) => {
//     try {
//         const { page = 1, limit = 10, search = "" } = 
//             req.query

//         let filter = {}
//         if (search) {
//             filter.$or = [
//                 { name: 
//                     { 
//                         $regex: search, 
//                         $options: 'i' 
//                     } 
//                 }
//             ]
//         }
//         const skips = (page - 1) * limit

//         const products = await Product.find(filter)
//             .populate("categoryId", "name")
//             .populate("sellerId", "firstName email")
//             .skip(skips)
//             .limit(Number(limit))
//         const total = await Product.countDocuments(filter)
//         return res.status(200).json(
//             {
//                 success: true,
//                 message: "Product fetched",
//                 data: products,
//                 pagination: {
//                     total,
//                     page: Number(page),
//                     limit: Number(limit),
//                     totalPages: Math.ceil(
//                         total / limit
//                     ) // ceil rounds number
//                 }
//             }
//         )
//     } catch (err) {
//         console.log('getProducts', {
//             message: err.message,
//             stack: err.stack,
//           });
//         return res.status(500).json(
//             { success: false, message: "Server error" }
//         )
//     }
// }

const Product = require("../../models/Product");

exports.createProduct = async (req, res) => {
    // Safety: log incoming form data
    console.log("➡️ Incoming req.body:", req.body);
    console.log("➡️ Incoming req.file:", req.file);

    // Validate req.body exists before destructuring
    if (!req.body) {
        return res.status(400).json({
            
            success: false,
            message: "Request body is missing",
        });
    }

    const { name, price, categoryId, userId } = req.body;

    if (!name || !price || !categoryId || !userId) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields",
        });
    }

    const imagePath = req.file ? req.file.filename : "";

    try {
        const product = new Product({
            name,
            price,
            categoryId,
            sellerId: userId,
            productImage: imagePath,
        });

        await product.save();

        return res.status(201).json({
            success: true,
            message: "Product saved",
            data: product,
        });
    } catch (err) {
        console.error("❌ createProduct error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const skips = (page - 1) * limit;

        let filter = {};
        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        const products = await Product.find(filter)
            .populate("categoryId", "name")
            .populate("sellerId", "firstName email")
            .skip(skips)
            .limit(Number(limit));

        const total = await Product.countDocuments(filter);

        return res.status(200).json({
            success: true,
            message: "Product fetched",
            data: products,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("❌ getProducts error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
