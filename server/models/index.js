const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/boxcanvas', {
    keepAlive: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
});

module.exports.User = require('./userModel');
module.exports.Canvas = require('./canvasModel');