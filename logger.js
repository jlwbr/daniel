const winston = require('winston');

winston.configure({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
          colorize: false,
          timestamp: true,
          filename: 'error.log',
          level: 'error',
          handleExceptions: false
        }),
      new winston.transports.File({
          filename: 'combined.log'
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    winston.add(new winston.transports.Console({
      format: winston.format.simple(),
      colorize: true,
      timestamp: true
    }));
  }

module.exports = winston;