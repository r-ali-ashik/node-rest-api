const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoute = require('./api/routes/users');

mongoose.connect('mongodb://172.17.0.2:27017/test',  { useNewUrlParser: true });

const swaggerRouter = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

swaggerRouter.use('/swagger', swaggerUi.serve);
swaggerRouter.get('/swagger', swaggerUi.setup(swaggerDocument));

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoute);
app.use(swaggerRouter);


app.use(function(req, res, next) {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});
app.use(function(error, req, res, next) {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;