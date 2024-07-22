const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Seller = require("./seller");

const Shoe = sequelize.define(
  "Shoe",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Shoe.belongsTo(Seller);
Seller.hasMany(Shoe);

module.exports = Shoe;
