require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require("express-ejs-layouts");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const { xss } = require('express-xss-sanitizer');
const cors = require("cors");
const { rateLimit } = require('express-rate-limit')
const helmet = require("helmet");

const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");
const userRouter = require("./routes/userRouter");
const authAPIRouter = require("./api/routes/authRouter");
const postAPIRouter = require("./api/routes/postRouter");
const { passportInit } = require("./controllers/userControllers");


var app = express();


passportInit(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60,
    touchAfter: 24 * 60 * 60,
  })
}));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
app.use('/tinymce',
  express.static(
    path.join(__dirname, 'node_modules', 'tinymce')
  )
);
app.use(cors());
app.use(xss());
app.use(rateLimit({
  windowMs: 30 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false
}));
app.use(helmet());

// Routers

app.use("/", postRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/api/auth", authAPIRouter);
app.use("/api/post", postAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


app.use((err, req, res, next) => {
  if (err && err.statusCode) {
    res.status(err.statusCode).json({ error: err.message })
  }
  next(err);
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
