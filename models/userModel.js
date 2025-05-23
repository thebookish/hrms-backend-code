// userModel.js
const { getContainer } = require('../config/cosmosClient');

const userContainer = () => getContainer('Users');

const findUserByEmail = async (email) => {
  const { resources } = await userContainer().items
    .query({ query: 'SELECT * FROM c WHERE c.email = @email', parameters: [{ name: '@email', value: email }] })
    .fetchAll();
  return resources[0];
};

const createUser = async (user) => {
  const { resource } = await userContainer().items.create(user);
  return resource;
};

module.exports = { findUserByEmail, createUser };
