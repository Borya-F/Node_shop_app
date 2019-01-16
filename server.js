//scaling
const os = require('os');
const cluster = require('cluster');
const log = require('./util/messagelog.js');

if (cluster.isMaster) {
    const n_cpus = os.cpus().length;
    log.status(`Forking ${n_cpus} CPUs`, 'server');
    for (let i = 0; i < n_cpus; i++) {
        cluster.fork();
    }
} else {
    //node modules
    const express = require('express');
    const bodyParser = require('body-parser');
    const path = require('path');
    const mongoose = require('mongoose');


    //db connection
    const db = require('./util/database.js');

    //helper functions


    //routes/controllers
    const shopRoutes = require('./routes/shop_routes.js');
    const adminRoutes = require('./routes/admin_routes.js');
    const sharedController = require('./controllers/sharedController.js');

    //userModel
    // const User = require('./models/user.js');


    // parameters
    const dev_port = process.env.PORT || 3000;
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

    // app.use((req, res, next) => {
    //     User.fetchUserById("5c3cc2ad82aac51570ed1e3c")
    //         .then(fetchedUser => {
    //             if (fetchedUser === null) {
    //                 log.err('no such user found->creating new user', 'server');
    //                 const newUser = new User('testuser', 'testuser@email', { items: [] }, null);
    //                 newUser.save();
    //             } else {
    //                 log.success(`user found -> attaching to req with id: ${fetchedUser._id}`, 'server');
    //                 req.user = new User(fetchedUser.name, fetchedUser.email, fetchedUser.cart, fetchedUser._id);
    //             }

    //             next();
    //         })
    //         .catch(err => {
    //             log.err(err);
    //             next();
    //         });
    // })

    //Routes instantiation
    app.use(shopRoutes);
    app.use('/admin', adminRoutes);
    app.use(sharedController.get404);


    mongoose.connect(db.admin_uri,{ useNewUrlParser: true })
    .then(client=>{
        app.listen(dev_port);
        log.status(`Process ${process.pid} is listening on port ${dev_port}`, 'server');
    })
    .catch(err=>{
        log.err(err,'server');
    })

}