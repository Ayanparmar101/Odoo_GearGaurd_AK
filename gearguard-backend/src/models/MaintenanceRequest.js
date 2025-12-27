import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const MaintenanceRequest = sequelize.define('MaintenanceRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  requestNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM('corrective', 'preventive'),
    allowNull: false,
    defaultValue: 'corrective',
  },
  status: {
    type: DataTypes.ENUM('new', 'in_progress', 'repaired', 'scrap'),
    allowNull: false,
    defaultValue: 'new',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  scheduledDate: {
    type: DataTypes.DATE,
  },
  dueDate: {
    type: DataTypes.DATE,
  },
  completedAt: {
    type: DataTypes.DATE,
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
  },
  scrapReason: {
    type: DataTypes.TEXT,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (request) => {
      // Generate request number
      const count = await MaintenanceRequest.count();
      const year = new Date().getFullYear();
      request.requestNumber = `MR${year}${String(count + 1).padStart(5, '0')}`;
    },
  },
});

export default MaintenanceRequest;
