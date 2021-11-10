const db = require('../models');

const createCanvas = async (req, res, next) => {
    const { body } = req;
    const copy = { ...body.canvas };
    delete copy._id;
    copy.user = body.user
    try {
        let canvas = await db.Canvas.create(copy);
        let foundUser = await db.User.findById(body.user);
        foundUser.canvas.push(canvas._id);
        await foundUser.save();
        let foundCanvas = await db.Canvas.findById(canvas._id).populate('user', {
            username: true
        });
        return res.status(200).json(foundCanvas);
    } catch (err) {
        return next(err)
    }
}

const getCanvasList = async (req, res, next) => {
    const { query } = req;
    try {
        let response = await db.Canvas.find(
            {
                user: query.user_id,
                deleted: false
            }
        )
        return res.status(200).json(response)
    } catch (error) {
        return next(error);
    }
}

const getCanvas = async (req, res, next) => {
    const { params } = req;
    try {
        let canvas = await db.Canvas.find({_id: params.canvas_id});
        return res.status(200).json(canvas[0]);
    } catch (err) {
        return next({
            status: 400, 
            message: err.message
        })
    }
}

const updateCanvas = async (req, res, next) => {
    const { body, params } = req;
    const {
        shapeList,
        canvasData,
        editor,
        info
    } = body.canvas;
    try {
        let canvas = await db.Canvas.findOneAndUpdate(
            { _id: params.canvas_id },
            {
                $set: {
                    shapeList,
                    canvasData,
                    editor,
                    info
                }
            },
            {new: true}
        )
        res.status(200).json(canvas[0])
    } catch (error) {
        return next({
            status: 400, 
            message: err.message
        })
    }
}

const deleteCanvas = async (req, res, next) => {
    const { params } = req;
    try {
        let canvas = await db.Canvas.findById(params.canvas_id);
        canvas.deleted = true;
        canvas.save();
        return res.status(200).json(canvas);
    } catch (error) {
        return next(err);
    }
}

module.exports = {
    createCanvas,
    getCanvas,
    updateCanvas,
    getCanvasList,
    deleteCanvas
}