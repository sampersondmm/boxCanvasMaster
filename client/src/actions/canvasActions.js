import ActionTypes from './ActionTypes';
import {apiCall} from '../utils/apiUtils';
import { addError } from './errorActions';

const setCanvasSize = (canvasWidth, canvasHeight) => {
    return {
        type: ActionTypes.SET_CANVAS_SIZE,
        payload: {
            canvasWidth,
            canvasHeight
        }
    }
},
addShapeToCanvas = newShape => {
    return {
        type: ActionTypes.ADD_SHAPE_TO_CANVAS,
        payload: {
            newShape, 
        }
    }
},
addShapeToCollection = newShape => {
    return {
        type: ActionTypes.ADD_SHAPE_TO_COLLECTION,
        payload: {
            newShape, 
        }
    }
},
updateLine = newLine => {
    return {
        type: ActionTypes.UPDATE_LINE,
        payload: {
            newLine
        }
    }
},
createCollection = newCollection => {
    return {
        type: ActionTypes.CREATE_COLLECTION,
        payload: {
            newCollection, 
        }
    }
},
changeCanvasScale = scale => {
    return {
        type: ActionTypes.CHANGE_CANVAS_SCALE,
        payload: {
            canvasScale: scale
        }
    }
},
changeShapeType = type => {
    return {
        type: ActionTypes.CHANGE_SHAPE_TYPE,
        payload: {
            type
        }
    }
},
changeShapeFill = fill => {
    return {
        type: ActionTypes.CHANGE_SHAPE_FILL,
        payload: {
            fill
        }
    }
},
changeShapeStroke = stroke => {
    return {
        type: ActionTypes.CHANGE_SHAPE_STROKE,
        payload: {
            stroke
        }
    }
},
changeShapeOpacity = opacity => {
    return {
        type: ActionTypes.CHANGE_SHAPE_OPACITY,
        payload: {
            opacity
        }
    }
},
changeShapeWidth = width => {
    return {
        type: ActionTypes.CHANGE_SHAPE_WIDTH,
        payload: {
            width
        }
    }
},
changeShapeHeight = height => {
    return {
        type: ActionTypes.CHANGE_SHAPE_HEIGHT,
        payload: {
            height
        }
    }
},
changeShapeRotation = rotation => {
    return {
        type: ActionTypes.CHANGE_SHAPE_ROTATION,
        payload: {
            rotation
        }
    }
},
changeShapeRadius = radius => {
    return {
        type: ActionTypes.CHANGE_SHAPE_RADIUS,
        payload: {
            radius
        }
    }
},
changeShapeStrokeWidth = width => {
    return {
        type: ActionTypes.CHANGE_SHAPE_STROKE_WIDTH,
        payload: {
            width
        }
    }
},
changeBackgroundColor = color => {
    return {
        type: ActionTypes.CHANGE_BACKGROUND_COLOR,
        payload: {
            backgroundColor: color
        }
    }
},
addColorToPalette = color => {
    return {
        type: ActionTypes.ADD_TO_PALETTE,
        payload: color
    }
},
selectShape = (id) => {
    return {
        type: ActionTypes.SELECT_SHAPE,
        payload: id
    }
},
removeShape = (id) => {
    return {
        type: ActionTypes.REMOVE_SHAPE,
        payload: id
    }
},
removeColorFromPalette = newColorPalette => {
    return {
        type: ActionTypes.REPLACE_PALETTE,
        payload: newColorPalette
    }
},
loadCanvasList = canvasList => {
    return {
        type: ActionTypes.LOAD_CANVAS_LIST,
        payload: canvasList
    }
},
clearCanvasData = () => {
    return {
        type: ActionTypes.CLEAR_CANVAS_DATA,
        payload: null
    }
},
fetchCanvasList = () => {
    return dispatch => {
        return apiCall('get', '/api/canvas')
            .then(res => {
                dispatch(loadCanvasList(res))
            })
            .catch(err => {
                addError(err.message);
            })
    }
},
setCanvasData = (canvas) => {
    return {
        type: ActionTypes.SET_CANVAS_DATA,
        payload: canvas
    }
},
createCanvas = canvasData => (dispatch, getState) => {
    let {currentUser} = getState();
    const {id} = currentUser.user;
    apiCall('post', `/api/users/${id}/canvas`, {canvasData})
        .then(res => {})
        .catch(err => dispatch(addError(err.message)));
};

export {
    setCanvasSize, 
    addShapeToCanvas, 
    addShapeToCollection, 
    createCollection,
    updateLine,
    changeShapeType, 
    changeShapeFill,
    changeShapeStroke,
    changeShapeOpacity, 
    changeShapeWidth, 
    changeShapeRotation,
    changeShapeStrokeWidth,
    changeCanvasScale, 
    createCanvas, 
    setCanvasData,
    fetchCanvasList,
    changeShapeHeight, 
    changeShapeRadius, 
    selectShape, 
    removeShape,
    changeBackgroundColor, 
    addColorToPalette, 
    clearCanvasData,
    removeColorFromPalette
};