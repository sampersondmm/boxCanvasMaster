const mongoose = require('mongoose');
const User = require('./userModel');

const { ObjectId } = mongoose.Schema.Types;

const canvasSchema = new mongoose.Schema({
    info: {
        type: Object,
        default: {}
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    shapeList: {
        type: Array,
        required: true
    },
    canvasData: {
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        fill: {
            type: String,
            required: true
        },
        scale: {
            type: Number,
            required: true
        }
    },
    editor: {
        selectedShapeId: {
            type: String,
            default: ''
        },
        currentShape: {
            type: Object,
            required: true,
        },
        defaultShape: {
            type: Object,
        },
        colorPalette: {
            type: Array
        }
    },
    deleted: {
        type: Boolean,
        default: false,
        required: true
    },
}, {
    timestamps: true
})

canvasSchema.pre('remove', async function(next){
    try {
        let user = await User.findById(this.user);
        user.canvas.remove(this.id);
        await user.save();
        return next();
    } catch (err) {
        return next(err);
    }
})

const Canvas = mongoose.model('Canvas', canvasSchema);
module.exports = Canvas;