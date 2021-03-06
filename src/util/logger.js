import winston from 'winston';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      colorize: true,
      timestamp: true,
      prettyPrint: true,
      label: 'azk',
    }),
  ],
});

logger.stream = {
  write: message => logger.info(message),
};

export default logger;
