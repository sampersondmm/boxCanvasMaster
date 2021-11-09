require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {loginRequired, ensureCorrectUser} = require('./middleware/authMiddleware');
const db = require('./models')
const errorHandler = require('./handlers/errorHandler');
const authRoutes = require('./routes/authRoutes');
const canvasRoutes = require('./routes/canvasRoutes');

const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());

//Routes
app.use('/api/auth', authRoutes)
app.use(
    '/api/canvas', 
    // loginRequired,
    // ensureCorrectUser,
    canvasRoutes
)

app.get('/api/canvas', loginRequired, async (req, res, next) => {
    try {
        let canvas = await db.Canvas.find()
            .sort({createdAt: 'desc'})
            .populate('user', {
                email: true,
            });
        return res.status(200).json(canvas);
    } catch (err) {
        return next('Testing');
    }
})

//Generic error handler
app.use((req, res, next) => {
    let error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//Error handler
app.use(errorHandler);

//Start server on port 8081
app.listen(PORT, () => {
    console.log(`Server starting on port: ${PORT}`);
});