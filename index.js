// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.
const { receiveMessageOnPort } = require('worker_threads');



// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************


// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************


  app.get('/', (req, res) => {
    res.redirect('/login'); //this will call the /anotherRoute route in the API
  });
  
  app.get('/login', (req, res) => {
    res.render('pages/login');
  });
  app.get('/register', (req, res) => {
    res.render('pages/register');
  });
  app.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('pages/logout');
  });

  // Register
    app.post('/register', async (req, res) => {
    //hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);
    const query = 'INSERT INTO users (username, password) Values ($1, $2)';

    await db.none(query, [req.body.username, hash]).then(users => {
      res.redirect('/login')
    })
    .catch(err => {
      console.log(err);
      res.redirect('/register');
    });
  });

  app.post('/login', (req, res) => {
    const username = req.body.username;
    const query = 'select * from users where users.username = $1 LIMIT 1';

    db.one(query, [username])
      .then(async user => {
        if(!user) {
          return res.render('pages/register', {
          });
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
          return res.render('pages/login', {
            message: 'Incorrect username or password',
            error: true
          });
        }

        req.session.user = user;
        req.session.save();
        res.redirect('/discover');
      })
      .catch(err => {
        res.render('pages/register', {
        });
      });
  });

app.get('/discover', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }



  try {
    const response = await axios({
      url: 'https://app.ticketmaster.com/discovery/v2/events.json',
      method: 'GET',
      headers: {
        'Accept-Encoding': 'application/json',
      },
      params: {
        apikey: process.env.API_KEY,
        keyword: '2hollis', 
        size: 10 
      },
    });
    const results = response.data._embedded ? response.data._embedded.events : [];
    res.render('pages/discover', { results, message: null });
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.render('pages/discover', { results: [], message: 'Unable to fetch events at this time.' });
  }
});
// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');