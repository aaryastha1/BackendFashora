require("dotenv").config()
const express = require ("express")
const connectDB = require ("./config/db")
const path = require("path")
const cors = require("cors")
const app = express();

const userRoutes = require('./routers/userRoutes.js')
const userProductRoutes = require("./routers/userProductRoutes.js");
const adminUserRoutes  = require('./routers/admin/userRouteAdmin.js')
const adminCategoryRoutes = require('./routers/admin/CategoryRouteAdmin.js')
const adminProductRoutes = require('./routers/admin/productRouteAdmin.js')
const adminRoute = require ('./routers/admin/adminRoute.js')

let corsOptions = {
    origin: "*"
}
app.use(cors(corsOptions))
app.use(express.json());
app.use(cors());

// app.use(express.json)
app.use("/uploads",express.static(path.join(__dirname, "uploads")))

const PORT = process.env.PORT
const userRoute=require('./routers/userRoutes.js')
// ✅ Correct — this imports the router you defined in routes/favoriteRoutes.js
const favoriteRoutes = require('./routers/FavoriteRoutes.js');



 


app.use('/api/auth', userRoute);
app.use("/api/user", userProductRoutes);   
app.use("/api/favorites", favoriteRoutes);







//Admin

connectDB()
app.use("/api/auth", userRoutes)
app.use("/api/admin/users", adminUserRoutes)
app.use("/api/admin/category", adminCategoryRoutes)
app.use("/api/admin/product", adminProductRoutes);
app.use('/api/admins', adminRoute)







module.exports = app;


const orderRoutes = require('./routers/admin/OrderRoute.js');
app.use('/api/orders', orderRoutes);


const cartRoutes = require('./routers/cartRoutes.js');
app.use('/api/cart', cartRoutes);


app.use("/", (req, res)=>res.send("Hello"))
app.listen(
    5006, //port -> localhost:5050
    () => {
        console.log("Server started", )
    }
)


