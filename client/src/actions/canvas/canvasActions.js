import ActionTypes from '../ActionTypes';

const setCanvasSize = (canvasWidth, canvasHeight) => {
    return {
        type: ActionTypes.SET_CANVAS_SIZE,
        payload: {
            canvasWidth,
            canvasHeight
        }
    }
}
const addShapeToCanvas = newShape => {
    return {
        type: ActionTypes.ADD_SHAPE_TO_CANVAS,
        payload: {
            newShape, 
        }
    }
}

const addShapeToCollection = newShape => {
    return {
        type: ActionTypes.ADD_SHAPE_TO_COLLECTION,
        payload: {
            newShape, 
        }
    }
}

const updateLine = newLine => {
    return {
        type: ActionTypes.UPDATE_LINE,
        payload: {
            newLine
        }
    }
}

const createCollection = newCollection => {
    return {
        type: ActionTypes.CREATE_COLLECTION,
        payload: {
            newCollection, 
        }
    }
}

const changeCanvasScale = scale => {
    return {
        type: ActionTypes.CHANGE_CANVAS_SCALE,
        payload: {
            canvasScale: scale
        }
    }
}


const changeBackgroundColor = color => {
    return {
        type: ActionTypes.CHANGE_BACKGROUND_COLOR,
        payload: {
            backgroundColor: color
        }
    }
}

const changeBackgroundOpacity = opacity => {
    return {
        type: ActionTypes.CHANGE_BACKGROUND_OPACITY,
        payload: {
            opacity: opacity
        }
    }
}

const addColorToPalette = color => {
    return {
        type: ActionTypes.ADD_TO_PALETTE,
        payload: color
    }
}

const selectShape = (id) => {
    return {
        type: ActionTypes.SELECT_SHAPE,
        payload: {id}
    }
}

const removeShape = (id) => {
    return {
        type: ActionTypes.REMOVE_SHAPE,
        payload: id
    }
}

const removeColorFromPalette = newColorPalette => {
    return {
        type: ActionTypes.REPLACE_PALETTE,
        payload: newColorPalette
    }
}

const loadCanvasList = canvasList => {
    return {
        type: ActionTypes.LOAD_CANVAS_LIST,
        payload: canvasList
    }
}

const clearCanvasData = () => {
    return {
        type: ActionTypes.CLEAR_CANVAS_DATA,
        payload: null
    }
}

const setCanvasData = (canvas) => {
    return {
        type: ActionTypes.SET_CANVAS_DATA,
        payload: canvas
    }
}

const updateCanvasTitle = (title) => {
    return {
        type: ActionTypes.UPDATE_CANVAS_TITLE,
        payload: {
            title
        }
    }
}

const updateCanvasDescription = (description) => {
    return {
        type: ActionTypes.UPDATE_CANVAS_DESCRIPTION,
        payload: {
            description
        }
    }
}

export {
    setCanvasSize, 
    addShapeToCanvas, 
    addShapeToCollection, 
    createCollection,
    updateLine,
    changeCanvasScale, 
    setCanvasData,
    selectShape, 
    removeShape,
    changeBackgroundColor,
    changeBackgroundOpacity,
    addColorToPalette, 
    clearCanvasData,
    updateCanvasTitle,
    updateCanvasDescription,
    removeColorFromPalette
};