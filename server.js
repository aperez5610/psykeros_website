require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const i18n = require('i18n');
const db = require('./lib/db');

const app = express();
app.use(helmet());

// i18n setup
i18n.configure({
  locales: ['es','en'],
  directory: path.join(__dirname, 'config', 'i18n'),
  defaultLocale: 'es',
  cookie: 'lang'
});
app.use(cookieParser());
app.use(i18n.init);

// view engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set true if using https
}));

// CSRF protection on POST forms
const csrfProtection = csrf({ cookie: false });
app.use((req,res,next)=>{
  res.locals.lang = req.getLocale();
  res.locals.currentUser = req.session.user || null;
  next();
});

// simple language switcher
app.get('/lang/:locale', (req,res)=>{
  const loc = req.params.locale;
  res.cookie('lang', loc, { maxAge: 900000, httpOnly: false });
  res.setLocale(loc);
  res.redirect('back');
});

// Routes
const publicRoutes = require('./routes/public');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

app.use('/', publicRoutes);
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
  console.log(`Psykeros server running on port ${PORT}`);
});
