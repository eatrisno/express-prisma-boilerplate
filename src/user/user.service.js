const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const ApiError = require('../common/utils/apiError');
const db = require('../common/providers/database/prisma');

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (!validator.isEmail(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email');
  }

  if (!userBody.password.match(/\d/) || !userBody.password.match(/[a-zA-Z]/)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password must contain at least one letter and one number');
  }

  if (await getUserByEmail(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const user = await db.user.create(
    {
      data: {
        name: userBody.name,
        email: userBody.email,
        password: await bcrypt.hash(userBody.password, 8),
      },
    },
  );
  return {
    email: user.email,
    name: user.name,
  };
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await db.user.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => db.user.findById(id);

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await db.user.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
