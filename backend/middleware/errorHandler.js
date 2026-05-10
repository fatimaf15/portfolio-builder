const errorHandler = (err, req, res, next) => {
  console.error(`\x1b[31m[Error] ${err.stack}\x1b[0m`);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;
