'use strict';
require('dotenv').config(); // 讀取 .env 檔案
const { User } = require('../models');
const bcrypt = require('bcrypt')
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

    console.log('ADMIN_ACCOUNT:', process.env.ADMIN_ACCOUNT)
    console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD)
    const userData = {
      id: 1,
      employeeId: process.env.ADMIN_ACCOUNT,
      name: 'root',
      email: 'root@example.com',
      password: passwordHash,
      isAdmin: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    console.log(userData)
    await User.upsert(userData);
  },

  async down(queryInterface, Sequelize) {
    await User.destroy({ where: { id: 1 } });
  }
};
