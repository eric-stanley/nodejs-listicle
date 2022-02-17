const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const dotenv = require('dotenv');

const AppError = require('./utils/appError');
const roleRouter = require('./routes/roleRoutes');
const environmentRouter = require('./routes/environmentRoutes');
const statusRouter = require('./routes/statusRoutes');
const priorityRouter = require('./routes/priorityRoutes');
const groupRouter = require('./routes/groupRoutes');
const applicationRouter = require('./routes/applicationRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const projectRouter = require('./routes/projectRoutes');
const runRouter = require('./routes/runRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const userRoleRouter = require('./routes/userRoleRoutes');
const accessRouter = require('./routes/accessRoutes');

const errorController = require('./controllers/errorController');

const app = express();

dotenv.config({
  path: './config.env',
});

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: process.env.RATE_LIMIT_MAX,
  windowMs: process.env.RATE_LIMIT_MINS * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour!',
});

app.use('/api', limiter);

app.use(
  express.json({
    limit: '10kb',
  })
);

app.use(mongoSanitize());

app.use(xss());

app.use(hpp());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/roles', roleRouter);
app.use('/api/v1/environments', environmentRouter);
app.use('/api/v1/status', statusRouter);
app.use('/api/v1/priorities', priorityRouter);
app.use('/api/v1/groups', groupRouter);
app.use('/api/v1/applications', applicationRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/runs', runRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user-roles', userRoleRouter);
app.use('/api/v1/access', accessRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

module.exports = app;
