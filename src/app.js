const express = require('express');
const helmet = require('helmet');
const sanitizer = require('perfect-express-sanitizer');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./common/config/config');
const morgan = require('./common/config/morgan');
const { jwtStrategy } = require('./common/config/passport');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./common/middlewares/error');
const ApiError = require('./utils/apiError');

const app = express();

if (config.env !== 'development') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(
  sanitizer.clean({
    xss: true,
  }),
);
// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
