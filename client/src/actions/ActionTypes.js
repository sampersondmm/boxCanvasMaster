const ActionTypes = {
    //Canvas action types
    SET_CANVAS_SIZE: 'SET_CANVAS_SIZE',
    CHANGE_CANVAS_SCALE: 'CHANGE_CANVAS_SCALE',
    CHANGE_SHAPE_FILL: 'CHANGE_SHAPE_FILL',
    CHANGE_SHAPE_STROKE: 'CHANGE_SHAPE_STROKE',
    CHANGE_BACKGROUND_COLOR: 'CHANGE_BACKGROUND_COLOR',
    ADD_TO_PALETTE: 'ADD_TO_PALETTE',
    REPLACE_PALETTE: 'REPLACE_PALETTE',
    CHANGE_SHAPE_TYPE: 'CHANGE_SHAPE_TYPE',
    CHANGE_SHAPE_WIDTH: 'CHANGE_SHAPE_WIDTH',
    CHANGE_SHAPE_HEIGHT: 'CHANGE_SHAPE_HEIGHT',
    CHANGE_SHAPE_RADIUS: 'CHANGE_SHAPE_RADIUS',
    CHANGE_SHAPE_OPACITY: 'CHANGE_SHAPE_OPACITY',
    CHANGE_SHAPE_ROTATION: 'CHANGE_SHAPE_ROTATION',
    ADD_SHAPE_TO_CANVAS: 'ADD_SHAPE_TO_CANVAS',
    ADD_SHAPE_TO_COLLECTION: 'ADD_SHAPE_TO_COLLECTION',
    SELECT_SHAPE: 'SELECT_SHAPE',
    SAVE_CANVAS: 'SAVE_CANVAS',
    UPDATE_CANVAS_DATA: 'UPDATE_CANVAS_DATA',
    CLEAR_CANVAS_DATA: 'CLEAR_CANVAS_DATA',
    CREATE_COLLECTION: 'CREATE_COLLECTION',
    SET_SHAPE_TO_DEFAULT: 'SET_SHAPE_TO_DEFAULT',
    REMOVE_SHAPE: 'REMOVE_SHAPE',

    //Canvas DB
    LOAD_CANVAS_LIST: 'LOAD_CANVAS_LIST',
    REMOVE_MESSAGE: 'REMOVE_MESSAGE',

    //Error/Auth action types
    ADD_ERROR: 'ADD_ERROR',
    REMOVE_ERROR: 'REMOVE_ERROR',
    SET_CURRENT_USER: 'SET_CURRENT_USER',
}

export default ActionTypes;