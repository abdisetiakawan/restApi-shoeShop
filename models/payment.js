const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Consumer = require("./consumer");
const Shoe = require("./shoe");

const Payment = sequelize.define(
  "Payment",
  {
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM("Tunai", "Debit"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentDetail = sequelize.define(
  "PaymentDetail",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Payment.belongsTo(Consumer);
Consumer.hasMany(Payment);

Payment.belongsToMany(Shoe, { through: PaymentDetail });
Shoe.belongsToMany(Payment, { through: PaymentDetail });

module.exports = { Payment, PaymentDetail };
