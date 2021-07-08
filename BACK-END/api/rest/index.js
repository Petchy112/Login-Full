const express = require('express')
const app = express();
const cors = require('cors');
const config = require('../../config');
const routes = require('./router/index')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
routes(app);

app.use((req, res, next) => {
    next(createError(404, 'Not Found'));
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
});

console.log(`Starting with port ${config.port}`);
app.listen(config.port, () => { `Server on port ${config.port}` });