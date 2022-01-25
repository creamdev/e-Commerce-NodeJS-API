const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'product-service' },
  transports: [

    new winston.transports.File({ filename: 'logs/products/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/products/info.log', level: 'info' }),
    new winston.transports.File({ filename: 'logs/products/combined.log', level: 'info' }),
  ],
});
module.export = logger