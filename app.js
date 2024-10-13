const express = require('express');
const exphbs = require('express-handlebars'); // Import the handlebars package correctly
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Parsing middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static files
app.use(express.static('public'));

// Templating Engine
const hbs = exphbs.create({ extname: '.hbs' });
// Create an instance of express-handlebars
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');



//connection pool
const pool=mysql.createPool({
   connectionLimit: 100,
   host           : process.env.DB_HOST,
   user           : process.env.DB_USER,
   password       : process.env.DB_PASS,
   database       : process.env.DB_NAME
});

//Connect to DB
pool.getConnection((err,connection)=>{
    if(err) throw err; //not connected!
    console.log('Connected as ID '+ connection.threadId);
});


const routes=require('./server/routes/user');
app.use('/',routes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
