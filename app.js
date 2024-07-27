const express = require("express")
const app = express()
const socketIo = require('socket.io');
const path = require("path")
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const moment = require('moment');
const formatNumber = require("./formats/formatNumber")
const setLanguage = require("./middleware/languageMiddleware")
require('moment/locale/th');
dotenv.config()

const indexRoute = require("./routes/index")
const editActicleRoute = require('./routes/edit')
const addRoute = require('./routes/add')
const searchRoute = require('./routes/search')
const rulesRoute = require('./routes/rules')
const commentRoute = require('./routes/comment')
const readeRoute = require("./routes/read")
const playRoute = require("./routes/play")
const channelRoute = require("./routes/channel")
const acticleRoute = require("./routes/actcile")
const trendingRoute = require("./routes/trending")
const videosRoute = require("./routes/videos")
const loginRoute = require('./routes/pages/login')
const singupRoute = require("./routes/pages/singup")
const profileRoute = require("./routes/pages/profile")
const videosprofileRoute = require("./routes/pages/videos/videos")
const vidoechannelRoute = require("./routes/pages/channel/video")
const uploadRoute = require('./routes/pages/uploads/uplaods')
const updateReward = require('./routes/admin/updateReward')
const admin = require('./routes/admin')
const routersRoute = require('./routes/pages/router');
const Acticle = require("./models/acticle");
// const categoriesRouter = require('./routes/pages/categories')

const corsOptions = {
  origin: 'http://localhost:4000',
  credentials: true,
};

// mongodb+srv://Nightkun:i5uF4aLMR0KBM8NT@cluster0.sn8vcd9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const allowedOrigins = [
  'http://localhost:4000',
  'http://127.0.0.1:5500',
  'https://live-aninight.ani-night.online',
  'http://127.0.0.1:5500',
  'https://ani-night.online',
  'http://localhost:5173',
  'https://studio.ani-night.online'
];

// Middleware สำหรับกำหนดการอนุญาตของ CORS 
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(fileUpload());

app.use(session({
  secret: process.env.ACCESS_TOKEN_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use('/app', express.static(path.join(__dirname, 'src/public/css')));

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

const formatDate = (date) => {
  return moment(date).fromNow();
};

app.locals.number1 = 100;
app.locals.number2 = 500;
app.locals.number3 = 1500;
app.locals.number4 = 1200000;

app.locals.moment = moment;
app.locals.formatNumber = formatNumber;
app.locals.translations= setLanguage;
app.use(setLanguage);
app.use(bodyParser.json({ limit: '1000mb' })); // ขยายขีดจำกัด JSON
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }));
app.use(cookieParser());
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));
app.use(express.static(path.join(__dirname, 'src/public')));

app.use(uploadRoute)
app.use(updateReward)
app.use(admin)
app.use(routersRoute)
app.use(indexRoute)
app.use(searchRoute)
app.use(rulesRoute)
app.use(editActicleRoute)
app.use(addRoute)
app.use(commentRoute)
app.use(readeRoute)
app.use(playRoute)
app.use(channelRoute)
app.use(acticleRoute)
app.use(trendingRoute)
app.use(videosRoute)
app.use(loginRoute)
app.use(singupRoute)
app.use(profileRoute)
app.use(videosprofileRoute)
app.use(vidoechannelRoute)
// app.use(categoriesRouter)

app.use(cors(corsOptions));

app.use((req, res, next) => {
  const usersesstion = req.session.userlogin;
  res.status(404).render('404', {usersesstion});
});

const server = app.listen(3000, () => {
  console.log(`server is Runing to http://localhost:3000`)
})

const io = socketIo(server)
app.use((req, res, next) => {
  req.io = io;
  next();
});


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newComment', (inputcomment) => {
      io.emit('newComment', inputcomment);
  });
});