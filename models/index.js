const sequelize = require("../config/database.js");
const Admin = require("./admin");
const Consumer = require("./consumer");
const { Payment, PaymentDetail } = require("./payment");
const Seller = require("./seller");
const Shoe = require("./shoe");

// Relations
Seller.hasMany(Shoe);
Shoe.belongsTo(Seller);

Consumer.hasMany(Payment);
Payment.belongsTo(Consumer);

Payment.belongsToMany(Shoe, { through: PaymentDetail });
Shoe.belongsToMany(Payment, { through: PaymentDetail });

sequelize.sync();

module.exports = {
  Admin,
  Consumer,
  Payment,
  PaymentDetail,
  Seller,
  Shoe,
};
