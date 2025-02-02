function configError(message) {
  throw new Error(message);
}

module.exports = {
  JWTKey:
    process.env.JWTKey ?? configError("enviroment variable JWTKey is missing"),
};
