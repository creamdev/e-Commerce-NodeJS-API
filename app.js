const express = require("express");
const helmet = require("helmet");
const config = require("./config");
const {CategoryRoutes,SearchRoutes,UserRoutes,ProductRoutes,OrderRoutes,HomeOfferRoutes,BrandRoutes} = require("./routes");
const events = require("./scripts/events");
const loaders = require("./loaders");
require('./loaders/dbConnect')
var bodyParser = require('body-parser');


const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

config();
loaders();
events();


//app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(helmet());
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())



app.listen(process.env.APP_PORT, () => {
  console.log(`3000 Port Connected`);
  app.use("/category", CategoryRoutes);
  app.use("/users", UserRoutes);
  app.use("/product",ProductRoutes)
  app.use("/order",OrderRoutes)
  app.use("/homeoffer",HomeOfferRoutes)
  app.use("/brand",BrandRoutes)
  app.use("/search",SearchRoutes)
});
