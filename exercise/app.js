const express = require("express");

const sequelize = require("./util/database");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

/**EJS TEMPLATE*/
app.set("view engine", "ejs");
app.set("views", "views");
//**END EJS */

//unlike, pug and EJS template engine, the handlebars are not installed by default by express. we have manually do like below
/**Handlebars TEMPLATE*/
// const expressHbs = require("express-handlebars");
//the first argument("handlebars") is our custom name and with the layoutsDir we are showing the handlebars where our layouts present
// app.engine(
//   "handlebars",
//   expressHbs({
//     layoutsDir: "views/layouts",
//     defaultLayout: "main-layout",
//     extname: "handlebars",
//   })
// );
// app.set("view engine", "handlebars");
// app.set("views", "views");
/**END Handlebars */

//*****PUG TEMPLATE*/
//This function allows us to set any value globally on our express application. (Here, we are telling the express application to run our template with pug engine)
// app.set("view engine", "pug");
//This tells the above function/Pug where to find the templates
// app.set("views", "views");
/****END PUG */

//This parses the body before it passes it to other middleware
app.use(bodyParser.urlencoded({ extended: false }));

//Here we are staticlly providing the file in the below path(giving read access to the below file path), In this case we are giving access to public folder which has styling files
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      //Here, we are storing the extracter "user" sequelize object into req
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

//Here, the '/admin' we are passing will be used as start segment url for the middlewares in adminRoutes.(eg., if there is an url '/add-produts' in the adminRoutes's middleware. Then that middleware will be reached at '/admin/add-products' because we are passing the starting segment here. Passing that url segment is optional)
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Establishing the association between User and Product tables
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// We will pass the "{ force: true }" in sync(), if we want to force update the table oon refresh by deleting the old instance.
sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      User.create({ name: "Vishnu", email: "v@vishnulokesh.com" });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

//module.exports = path.dirname(require.main.filename);
