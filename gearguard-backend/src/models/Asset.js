import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serialNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  category: {
    type: DataTypes.ENUM('IT', 'Workshop'),
    allowNull: false,
  },
  subCategory: {
    type: DataTypes.STRING,
  },
  department: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('active', 'maintenance', 'scrapped'),
    defaultValue: 'active',
  },
  purchaseDate: {
    type: DataTypes.DATE,
  },
  warrantyExpiry: {
    type: DataTypes.DATE,
  },
  description: {
    type: DataTypes.TEXT,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
});

export default Asset;
