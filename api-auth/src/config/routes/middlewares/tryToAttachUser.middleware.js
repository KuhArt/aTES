const userService = require('resources/user/user.service');
const tokenService = require('resources/token/token.service');
const config = require('config');
const jwt = require('jsonwebtoken');

const tryToAttachUser = async (ctx, next) => {
  let userData;

  if (ctx.state.accessToken) {
    userData = await tokenService.getUserDataByToken(ctx.state.accessToken);
  }

  if (userData) {
    await userService.updateLastRequest(userData.userId);
    ctx.state.user = await userService.findOne({ _id: userData.userId });
    ctx.req.headers.authorization = ctx.state.user && `Bearer ${jwt.sign({ userPublicId: ctx.state.user.publicId }, config.jwt.secret)}`;
    ctx.state.isShadow = userData.isShadow;
  }

  return next();
};

module.exports = tryToAttachUser;
