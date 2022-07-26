const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const authConfig = require("../config/auth");
const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

class SessionUserController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email}).first();

    if(!user) {
      throw new AppError('E-mail e/ou usuário incorreto', 401);
    }

    const passwordMatched = compare(password, user.password);

    if(!passwordMatched) {
      throw new AppError('E-mail e/ou usuário incorreto', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    });

    return response.json({user, token});
  }
}

module.exports = SessionUserController;