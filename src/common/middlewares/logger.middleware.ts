import * as _ from 'lodash';


export function logger(req, res, next) {
  const now = new Date();
  let logEntry = `${now.toISOString()} ${req.method} ${req.originalUrl}`;

  if (req.body) {
    const bodyData = _.clone(req.body);
    // Don't record user passwords in logs
    if (bodyData.password) {
      bodyData.password = 'hidden';
    }
    logEntry = `${logEntry} ${JSON.stringify(bodyData)}`;
  }

  console.log(logEntry);

  next();
};
