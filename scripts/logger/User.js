const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [

    new winston.transports.File({ filename: 'logs/users/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/users/info.log', level: 'info' }),
    new winston.transports.File({ filename: 'logs/users/combined.log', level: 'info' }),
  ],
});
module.export = logger