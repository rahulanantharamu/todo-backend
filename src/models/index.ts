import sequelize from '../config/database';
import User from './User';
import Todo from './Todo';

export { User, Todo };

export { sequelize };

export const syncDatabase = async (force: boolean = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
};