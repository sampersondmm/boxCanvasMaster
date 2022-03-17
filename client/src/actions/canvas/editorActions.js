import ActionTypes from '../ActionTypes';

const changeShapeType = type => {
    return {
        type: ActionTypes.CHANGE_SHAPE_TYPE,
        payload: {
            type
        }
    }
}

const changeShapeFill = fill => {
    return {
        type: ActionTypes.CHANGE_SHAPE_FILL,
        payload: {
            fill
        }
    }
}

const changeShapeStroke = stroke => {
    return {
        type: ActionTypes.CHANGE_SHAPE_STROKE,
        payload: {
            stroke
        }
    }
}

const changeShapeOpacity = opacity => {
    return {
        type: ActionTypes.CHANGE_SHAPE_OPACITY,
        payload: {
            opacity
        }
    }
}

const changeShapeWidth = width => {
    return {
        type: ActionTypes.CHANGE_SHAPE_WIDTH,
        payload: {
            width
        }
    }
}

const changeShapeHeight = height => {
    return {
        type: ActionTypes.CHANGE_SHAPE_HEIGHT,
        payload: {
            height
        }
    }
}

const changeShapeRotation = rotation => {
    return {
        type: ActionTypes.CHANGE_SHAPE_ROTATION,
        payload: {
            rotation
        }
    }
}

const changeShapeRadius = radius => {
    return {
        type: ActionTypes.CHANGE_SHAPE_RADIUS,
        payload: {
            radius
        }
    }
}

const changeShapeStrokeWidth = width => {
    return {
        type: ActionTypes.CHANGE_SHAPE_STROKE_WIDTH,
        payload: {
            width
        }
    }
}

const selectPoint = selectedPoints => {
    return {
        type: ActionTypes.SELECT_POINT,
        payload: {
            selectedPoints
        }
    }
}

export {
    changeShapeType, 
    changeShapeFill,
    changeShapeStroke,
    changeShapeOpacity, 
    changeShapeWidth, 
    changeShapeRotation,
    changeShapeStrokeWidth,
    changeShapeHeight, 
    changeShapeRadius, 
    selectPoint
}