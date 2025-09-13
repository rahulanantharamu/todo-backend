import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'done'),
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'in-progress', 'done']],
    },
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  tableName: 'todos',
});

User.hasMany(Todo, {
  foreignKey: 'userId',
  as: 'todos',
});

Todo.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default Todo;