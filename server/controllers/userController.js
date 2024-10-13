const mysql = require('mysql');

//connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});



//View Users
exports.view = (req, res) => {

  //Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected!
    console.log('Connected as ID ' + connection.threadId);

    //User the connection
    connection.query('Select * from user where status="active"', (err, rows) => {
      //when done with the connection,release it
      connection.release();
      if (!err) {
        let removedUser=req.query.removed;
        res.render('home', { rows,removedUser});
      } else {
        console.log(err);
      }

      console.log('The data from user table: \n', rows);

    });
  });

}

//find user by search
exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected!
    console.log('Connected as ID ' + connection.threadId);

    let searchTerm = req.body.search;

    //User the connection
    connection.query('Select * from user where first_name like ? or last_name like ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
      //when done with the connection,release it
      connection.release();
      if (!err) {
        res.render('home', { rows });
      } else {
        console.log(err);
      }

      console.log('The data from user table: \n', rows);

    });
  });
}

exports.form = (req, res) => {
  res.render('add-user');
}

//Add new user
exports.create = (req, res) => {
  //res.render('add-user');
  const {first_name,last_name,email,phone,comments}=req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected!
    console.log('Connected as ID ' + connection.threadId);

    let searchTerm = req.body.search;

    //User the connection
    connection.query('Insert into user set first_name=?,last_name=?,email=?,phone=?,comments=?',[first_name, last_name, email, phone, comments],(err, rows) => {
      //when done with the connection,release it
      connection.release();
      if (!err) {
        res.render('add-user',{alert:'User added successfully.'});
      } else {
        console.log(err);
      }

      console.log('The data from user table: \n', rows);

    });
  });
}

//Edit user
exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected!
    console.log('Connected as ID ' + connection.threadId);

    //User the connection
    connection.query('Select * from user where id= ?',[req.params.id], (err, rows) => {
      //when done with the connection,release it
      connection.release();
      if (!err) {
        res.render('edit-user', { rows });
      } else {
        console.log(err);
      }

      console.log('The data from user table: \n', rows);

    });
  });
}

//Update user
exports.update = (req, res) => {
  const {first_name,last_name,email,phone,comments}=req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected!
    console.log('Connected as ID ' + connection.threadId);

    //User the connection
    connection.query('UPDATE user SET first_name=?,last_name=?,email=?,phone=?,comments=? where id=?',[first_name,last_name,email,phone,comments,req.params.id],(err, rows) => {
      //when done with the connection,release it
      connection.release();
      if (!err) {
       
        pool.getConnection((err, connection) => {
          if (err) throw err; //not connected!
          console.log('Connected as ID ' + connection.threadId);
      
          //User the connection
          connection.query('Select * from user where id= ?',[req.params.id], (err, rows) => {
            //when done with the connection,release it
            connection.release();
            if (!err) {
              res.render('edit-user', { rows,alert:`${first_name} has been updated`});
            } else {
              console.log(err);
            }
      
            console.log('The data from user table: \n', rows);
      
          });
        });

      } else {
        console.log(err);
      }

      console.log('The data from user table: \n', rows);

    });
  });
}

//Delete user
exports.delete = (req, res) => {
  /*pool.getConnection((err, connection) => {
    if (err) throw err; //not connected!
    console.log('Connected as ID ' + connection.threadId);

    //User the connection
    connection.query('delete from user where id= ?',[req.params.id], (err, rows) => {
      //when done with the connection,release it
      connection.release();
      if (!err) {
        res.redirect('/');
      } else {
        console.log(err);
      }

      console.log('The data from user table: \n', rows);

    });
  });*/
  pool.getConnection((err,connection)=>{
    if(err) throw err;
    connection.query('update user set status=? where id=?',['removed',req.params.id],(err,rows)=>{
      connection.release()
      if(!err){
        let removedUser=encodeURIComponent('User succesfully removed.');
        res.redirect('/?removed='+removedUser);
      } else{
        console.log(err);
      }
      console.log('The data from beer table are:\n',rows);
    });
  });
}

//view users

//View Users
exports.viewall = (req, res) => {

  //Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected!
    console.log('Connected as ID ' + connection.threadId);

    //User the connection
    connection.query('Select * from user where id=?',[req.params.id], (err, rows) => {
      //when done with the connection,release it
      connection.release();
      if (!err) {
        res.render('view-user', { rows });
      } else {
        console.log(err);
      }

      console.log('The data from user table: \n', rows);

    });
  });

}