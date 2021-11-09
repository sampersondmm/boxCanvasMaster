const express = require('express');
const router = express.Router({mergeParams: true});

const {createCanvas, getCanvasList, updateCanvas, getCanvas, deleteCanvas} = require('../handlers/canvasHandler');

// prefix - /api/users/:id/canvas
router.route('/')
    .post(createCanvas)
    .get(getCanvasList);


// prefix - /api/users/:id/canvas/:canvas_id
router
    .route('/:canvas_id')
    .get(getCanvas)
    .put(updateCanvas)

router
    .route('/delete/:canvas_id')
    .put(deleteCanvas)

module.exports = router;