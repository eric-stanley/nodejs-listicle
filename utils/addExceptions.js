exports.uncaughtException = () => {
  process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception! Shutting down...');
    process.exit(1);
  });
};

exports.unhandledRejection = (server) => {
  process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection! Shutting down...');
    server.close(() => {
      process.exit(1);
    });
  });
};
