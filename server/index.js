const express = require('express');
const app = new express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const redis = require('redis');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');


// Create new redis database client -> if you need other connection options, please specify here

const redisClient = redis.createClient();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(session({secret: 'NewDBConcepts2020', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());




const auth = () => {
    return (req, res, next) => {
        passport.authenticate('local', {session:true}, (error, user, info) => {
            if(error) res.status(400).json({"statusCode" : 200 ,"message" : error});
            req.login(user, function(error) {
                if (error) return next(error);
                next();
            });
        })(req, res, next);
    }
}

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }
    return res.status(400).json({"statusCode": 400, "message": "not authenticated"})
}

//routing

app.all("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
})


app.get('/', (req, res) => {
    res.send('It works!');
});

app.get('/user', isLoggedIn, (req, res) => {res.status(200).json({"user" : req.user})});


app.get('/users', isLoggedIn,  (req, res) => {
    redisClient.lrange('wwi-tweety-users', 0, -1, (err, postJsonStrings) => {
        if (err) {
            console.error(err);
            return;
        }
    const objects = postJsonStrings.map(string => JSON.parse(string));
    res.send(JSON.stringify(objects));
    })
});

//register + login (passport)

passport.use(new LocalStrategy(
    function(username, password, done){
        redisClient.lrange('wwi-tweety-users', 0, -1, (err, postJsonStrings) => {
            if (err) {
                console.error(err);
                return;
            }
    
            // Parse all JSON strings, emit to client
            const users = postJsonStrings.map(string => JSON.parse(string));
            for (var i = 0; i < users.length; i++){
                if(users[i].username == username){
                    var user = users[i];
                    bcrypt.compare(password, users[i].password, function(err, isMatch){
                        if(err){return done(err)}
                        if(!isMatch){
                            return done('wrong password', false);
                        }
                        return done(null, user);
                    })               
                }
            }
        });
    }
));

app.post('/users/register', (req, res) => {
    console.log('register ' + JSON.stringify(req.body));
    let user = req.body;

    redisClient.lrange('wwi-tweety-users', 0, -1, (err, postJsonStrings) => {
        if (err) {
            console.error(err);
            return;
        }

        // Parse all JSON strings, emit to client
        const users = postJsonStrings.map(string => JSON.parse(string));
  
    if(users.length > 0){
        for (var i = 0; i < users.length; i++){
            if(users[i].username == user["username"]){
                console.log('username already taken');
                return res.status(400).json({"statusCode" : 400, "message" : "username already taken"});
            }
        }
        console.log(users.length);
        user["id"] = users.length + 1;
    }
    else{
        user["id"] = 1;
    }
    
    bcrypt.hash(user["password"], 10, function(err, hash){
        if(err){
            return err;
        }
        user["password"] = hash;
        redisClient.rpush('wwi-tweety-users', JSON.stringify(user));
        console.log(user["password"]);
    });

    return res.status(200).json({"statusCode" : 200, "message" : "registration successful"});
    })
});


app.post('/follow', isLoggedIn, (req, res) => {
    console.log(req.body.user);
    var follow = req.body.user;
   
    console.log(req.isAuthenticated());

    redisClient.lrange('wwi-tweety-users', 0, -1, (err, usersJsonStrings) => {
        if (err) {
            console.error(err);
            return;
        }
        const objects = usersJsonStrings.map(string => JSON.parse(string));
        for (var i = 0; i<objects.length; i++){
            if(objects[i].username === req.user.username && objects[i].follows.includes(follow)){
                console.log(objects[i].follows);
                console.log(follow);
                return res.status(400).json({"statusCode" : 400, "message" : "already following"});
               
            }
            else if (objects[i].username === req.user.username){
                objects[i].follows.push(follow); 
                console.log(JSON.stringify(objects[i]));
                redisClient.lset('wwi-tweety-users', i, JSON.stringify(objects[i]) );
                req.user.follows.push(follow);
                return res.status(200).json({"statusCode" : 200, "user" : req.user,  "message" : "following successful"});
            }
        }
    })

   

});

app.post('/unfollow', isLoggedIn, (req, res) => {
    console.log(req.body.user);
    var unfollow = req.body.user;
   
    redisClient.lrange('wwi-tweety-users', 0, -1, (err, usersJsonStrings) => {
        if (err) {
            console.error(err);
            return;
        }
        const objects = usersJsonStrings.map(string => JSON.parse(string));
        for (var i = 0; i<objects.length; i++){
            if (objects[i].username === req.user.username){
                var index = objects[i].follows.indexOf(unfollow);
                if (index !== -1) {objects[i].follows.splice(index, 1)};
                console.log(JSON.stringify(objects[i]));
                redisClient.lset('wwi-tweety-users', i, JSON.stringify(objects[i]) )


                var index = req.user.follows.indexOf(unfollow);
                if (index !== -1) {req.user.follows.splice(index, 1)};
                return res.status(200).json({"statusCode" : 200, "user" : req.user ,"message" : "unfollowing successful"});
            }
        }
    })

   

});


passport.serializeUser(function(user, done) {
    if(user) done(null, user);
});
  
passport.deserializeUser(function(id, done) {
    done(null, id);
});




app.post('/authenticate', auth() , (req, res) => {
    res.status(200).json({"statusCode" : 200 ,"user" : req.user});
});


app.post('/logout', (req, res) => {
    req.logOut();
    req.session.destroy();
    res.send(200).json({"statusCode" : 200, "message" : "logged out"});
});




//socket io


io.on('connection', socket => {
    console.log('a user connected');

    // After initial connection, send all existing posts to the user
    redisClient.lrange('wwi-tweety-posts', 0, -1, (err, postJsonStrings) => {
        if (err) {
            console.error(err);
            return;
        }

        // Parse all JSON strings, emit to client
        const objects = postJsonStrings.map(string => JSON.parse(string));
        socket.emit('previous posts', JSON.stringify(objects));
    });

    socket.on('post', postAsJson => {
        const post = JSON.parse(postAsJson);
        console.log('posting: ' + JSON.stringify(post));

        // Save post in redis
        redisClient.rpush('wwi-tweety-posts', JSON.stringify(post));
        

        // Send Post to everyone
        io.emit('post', JSON.stringify(post));
    });

    socket.on('image', image => {
        //console.log(image); 
        image = JSON.stringify(image);
        //console.log(image);
        // Save post in redis
        redisClient.rpush('wwi-tweety-posts', image);
        

        // Send Post to everyone
        io.emit('image', image);
    });


    socket.on('like', postAsJson => {
        const post = JSON.parse(postAsJson);
        console.log(post);
        
        redisClient.lrange('wwi-tweety-posts', 0, -1, (err, postJsonStrings) => {
            if (err) {
                console.error(err);
                return;
            }
            const objects = postJsonStrings.map(string => JSON.parse(string));
            console.log(objects);
            console.log(post.id);
            
            for (var i = 0; i<objects.length; i++){
                if (objects[i].id == post.id){
                    redisClient.lset('wwi-tweety-posts', i, JSON.stringify(post) )
                    var position=i
                }
            }

        // Send Post to everyone
       io.emit('like', JSON.stringify(post), position);
    })
    });

    socket.on('dislike', postAsJson => {
        console.log('dislike');
        const post = JSON.parse(postAsJson);
        console.log(post);

        redisClient.lrange('wwi-tweety-posts', 0, -1, (err, postJsonStrings) => {
            if (err) {
                console.error(err);
                return;
            }
            const objects = postJsonStrings.map(string => JSON.parse(string));
            console.log(objects);
            console.log(post.id);
            
            for (var i = 0; i<objects.length; i++){
                if (objects[i].id == post.id){
                    redisClient.lset('wwi-tweety-posts', i, JSON.stringify(post) )
                    var position=i
                }
            }

        // Send Post to everyone
       io.emit('dislike', JSON.stringify(post), position);
    })
    });


    socket.on('filter', (filter, type) => {
        redisClient.lrange('wwi-tweety-posts', 0, -1, (err, postJsonStrings) => {
            if (err) {
                console.error(err);
                return;
            }
            var posts = [];
            // Parse all JSON strings, emit to client
            const objects = postJsonStrings.map(string => JSON.parse(string));

            var filters = filter.split(" ");
            console.log(filters);
            for (var j = 0; j < filters.length; j++){
                for(var i = 0; i < objects.length; i++){
                    if(type === "hashtag"){
                        if(objects[i]["content"].includes(filters[j]) || objects[i]["content"].includes("#"+filters[j]) || objects[i]["content"].includes(filters[j].slice(1)) ){
                            posts.push(objects[i]);
                        }
                    }
                    if(type === "users"){
                        if(objects[i]["user"].includes(filters[j]) ){
                            posts.push(objects[i]);
                        }
                    }
                }
            }
            socket.emit('filtered posts', JSON.stringify(posts));
    })
    });

  


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});
