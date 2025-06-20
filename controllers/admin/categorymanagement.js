const Category = require('../../models/Category');

// Create a new category (No image)
exports.createCategory = async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name,
            description: req.body.description || ""
        });

        await category.save();

        return res.status(201).json({
            success: true,
            message: "Category created",
            data: category
        });
    } catch (err) {
        console.error("Create Error:", err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.json({ success: true, data: categories, message: "All categories" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        return res.json({ success: true, data: category, message: "Category found" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update a category (No image)
exports.updateCategory = async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            description: req.body.description || ""
        };

        const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        return res.json({ success: true, data: category, message: "Category updated" });
    } catch (err) {
        console.error("Update Error:", err);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const result = await Category.findByIdAndDelete(req.params.id);

        if (!result) return res.status(404).json({ success: false, message: 'Category not found' });

        return res.json({ success: true, message: 'Category deleted' });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
