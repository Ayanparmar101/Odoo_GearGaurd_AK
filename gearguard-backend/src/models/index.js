import User from './User.js';
import Team from './Team.js';
import Asset from './Asset.js';
import MaintenanceRequest from './MaintenanceRequest.js';
import Comment from './Comment.js';

// User - Team associations
User.belongsTo(Team, { as: 'team', foreignKey: 'teamId' });
Team.hasMany(User, { as: 'members', foreignKey: 'teamId' });

// Asset - Team associations
Asset.belongsTo(Team, { as: 'maintenanceTeam', foreignKey: 'teamId' });
Team.hasMany(Asset, { as: 'assets', foreignKey: 'teamId' });

// MaintenanceRequest - Asset associations
MaintenanceRequest.belongsTo(Asset, { as: 'asset', foreignKey: 'assetId' });
Asset.hasMany(MaintenanceRequest, { as: 'maintenanceRequests', foreignKey: 'assetId' });

// MaintenanceRequest - User (Requester) associations
MaintenanceRequest.belongsTo(User, { as: 'requester', foreignKey: 'requesterId' });
User.hasMany(MaintenanceRequest, { as: 'createdRequests', foreignKey: 'requesterId' });

// MaintenanceRequest - User (Assigned Technician) associations
MaintenanceRequest.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });
User.hasMany(MaintenanceRequest, { as: 'assignedRequests', foreignKey: 'assignedToId' });

// MaintenanceRequest - Team associations
MaintenanceRequest.belongsTo(Team, { as: 'team', foreignKey: 'teamId' });
Team.hasMany(MaintenanceRequest, { as: 'requests', foreignKey: 'teamId' });

// Comment - MaintenanceRequest associations
Comment.belongsTo(MaintenanceRequest, { as: 'maintenanceRequest', foreignKey: 'requestId' });
MaintenanceRequest.hasMany(Comment, { as: 'comments', foreignKey: 'requestId' });

// Comment - User associations
Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(Comment, { as: 'comments', foreignKey: 'authorId' });

export {
  User,
  Team,
  Asset,
  MaintenanceRequest,
  Comment,
};
