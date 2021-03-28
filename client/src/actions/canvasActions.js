import ActionTypes from './ActionTypes';
import {apiCall} from './api';
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
changeShapeColor = color => {
    return {
        type: ActionTypes.CHANGE_SHAPE_COLOR,
        payload: {
            color
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
    changeShapeType, 
    changeShapeColor,
    changeShapeOpacity, 
    changeShapeWidth, 
    changeShapeRotation,
    changeCanvasScale, 
    createCanvas, 
    fetchCanvasList,
    changeShapeHeight, 
    changeShapeRadius, 
    selectShape, 
    changeBackgroundColor, 
    addColorToPalette, 
    clearCanvasData,
    removeColorFromPalette
};