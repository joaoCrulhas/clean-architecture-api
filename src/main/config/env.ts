const envVariables = {
  port: process.env.PORT || 5000,
  mongodbUrl:
    process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/clean-architecture-api'
};

export { envVariables };
