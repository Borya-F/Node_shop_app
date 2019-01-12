//node modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//debug
const chalk = require('chalk');

//db connection
const db = require('./util/database.js');

//helper functions
const msg = require('./util/messagelog.js');

//routes/controllers
const shopRoutes = require('./routes/shop_routes.js');
const adminRoutes = require('./routes/admin_routes.js');
const sharedController = require('./controllers/sharedController.js');

//userModel
const User = require('./models/user.js');


// parameters
const dev_port = 3000;
const app = express();



//global configurations
app.set('view engine', 'pug'); //view engine as pug
app.set('views', 'views');

//body-parser
app.use(bodyParser.urlencoded({
    extended: false
}));

//path to static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.fetchUserById("5c3a04246a1b65aaec2a7704")
        .then(fetchedUser => {
            if (fetchedUser === null) {
                msg.err('no such user found', 'server');
            } else {
                msg.success(`user found -> attaching to req with id: ${fetchedUser._id}`, 'server');
                req.user = fetchedUser;
            }

            next();
        })
        .catch(err => {
            msg.err(err);
            next();
        });
})

//Routes instantiation
app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use(sharedController.get404);



db.mongoConnect()
    .then(client => {

        app.listen(dev_port);
        msg.status(`server is listening on port ${dev_port}`, 'server');
        // client.close();
    })
    .catch(err => {
        console.log(chalk.red(err));
    })