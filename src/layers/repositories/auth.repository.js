const User = require("../../../models/user");
const bcrypt = require("bcrypt");

const findByEmail = async (email) => {
    await User.findOne({ where: { email } });
};

const createSignUp = async (email, nickname, password) => {
    const hash = await bcrypt.hash(password, 12);
    await User.Create({ email, nickname, password: hash });
};

module.exports = { findByEmail, createSignUp };
