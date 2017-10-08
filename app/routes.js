// Dependencies
var mongoose        = require('mongoose');
var User            = require('./model.js');

// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    app.get('/users', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = User.find({});
        query.exec(function(err, users){
            if(err)
            {
              console.log("Get Error in route" + err);
              res.send(err);
            }
            else
            {
              // If no errors are found, it responds with a JSON of all users
              console.log("Get No Error in route" + users);
              res.json(users);
            }
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/users', function(req, res){

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newuser = new User(req.body);

        // New User is saved in the db.
        newuser.save(function(err){
            if(err)
            {
              console.log("Post Error in route" + err);
              res.send(err);
            }
            else {
              // If no errors are found, it responds with a JSON of the new user
              console.log("Post No Error in route" + req.body);
              res.json(req.body);
            }
        });
    });

    // // Provides method for saving new users in the db
    // app.post('/updateone', function(req, res){
    //
    //     // Creates a new User based on the Mongoose schema and the post bo.dy
    //     var query = req.body.query;
    //     var newvalue = { $set:req.body.update};
    //
    //     // New User is saved in the db.
    //     newuser.updateone(query, newvalue, function(err){
    //         if(err)
    //         {
    //           res.send(err);
    //         }
    //         else {
    //           res.json(req.body);
    //         }
    //     });
    // });

    // Retrieves JSON records for all users who meet a certain set of query conditions
    app.post('/query', function(req, res){

        // var name = req.body.name;
        // Grab all of the query parameters from the body.
        var lat             = req.body.latitude;
        var long            = req.body.longitude;
        var distance        = req.body.distance;
        var favLang         = req.body.favlang;
        var username        = req.body.username;
        // var votecount           = req.body.votecount;

        // Opens a generic Mongoose Query. Depending on the post body we will...
        var query = User.find({});

        // ...include filter by Max Distance (converting miles to meters)
        if(distance){

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

                // Converting meters to miles. Specifying spherical geometry (for globe)
                maxDistance: distance * 1609.34, spherical: true});
        }

        if (username)
        {
          query = query.where('username').equals(username);
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, users){
            if(err)
            {
                res.send(err);
            }
            else {
              // If no errors, respond with a JSON of all users that meet the criteria
              res.json(users);
            }
        });
    });
};
