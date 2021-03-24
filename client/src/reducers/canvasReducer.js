import ActionTypes from "../actions/ActionTypes";
import Common from '../constants/common';
import uuid from 'react-uuid';

const DEFAULT_STATE = {
  canvasData: {
    canvasWidth: 400,
    canvasHeight: 400,
    backgroundColor: '#0f0e0e',
    canvasScale: 1,
    shapeList: [],
    collectionList: [],
    selectedShape: '',
    selectShape: false,
    colorPalette: [
      {color: "#4771e8", uuid: "50ecc8b-23f5-dc2f-e06d-15e01b437a0"},
      {color: "#af56d8", uuid: "4dc6017-71d3-1b5-0067-4017bbe66efd"},
      {color: "#5b2175", uuid: "55fa65b-b05-e446-d0f-77757824e5"},
      {color: "#cd5b5b", uuid: "b24323-3bc0-1671-c67e-53823dac62"}
    ]
  },
  currentShape: {
    shapeType: Common.square,
    shapeColor: '#6ab8c5',
    shapeWidth: 60,
    shapeHeight: 60,
    shapeRadius: 30,
    shapeOpacity: 0.5,
    shapeRotation: 0,
    shapeType: Common.square
  },
  collectionCanvasData: {
    canvasWidth: 400,
    canvasHeight: 400,
    backgroundColor: 'rgb(180,180,180)',
    canvasScale: 1,
    shapeColor: '#000000',
    shapeList: [],
    collectionList: [],
    shapeType: Common.square,
    selectedShape: '',
    selectShape: false,
    shapeWidth: 20,
    shapeHeight: 20,
    shapeRadius: 10,
    shapeOpacity: 1,
    colorPalette: [
      {color: "#4771e8", uuid: "50ecc8b-23f5-dc2f-e06d-15e01b437a0"},
      {color: "#af56d8", uuid: "4dc6017-71d3-1b5-0067-4017bbe66efd"},
      {color: "#5b2175", uuid: "55fa65b-b05-e446-d0f-77757824e5"},
      {color: "#cd5b5b", uuid: "b24323-3bc0-1671-c67e-53823dac62"}
    ]
  }
};


const canvasReducer = (state = DEFAULT_STATE, action = {}) => {
  const {type, payload} = action,
    result = payload || {};
  switch(type){
    // Changes to canvas
    case ActionTypes.UPDATE_CANVAS_DATA:
      return {
        ...state,
        newCanvasData: payload
      }
    case ActionTypes.CLEAR_CANVAS_DATA: 
      return {
        ...state,
        canvasData: DEFAULT_STATE.canvasData
      }
    case ActionTypes.LOAD_CANVAS_LIST:
      return {
        ...state,
        canvasList: payload
      }

      
    //Changes to canvas data
    case ActionTypes.SET_CANVAS_SIZE:
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          canvasWidth: payload.canvasWidth,
          canvasHeight: payload.canvasHeight 
        }
      }
    case ActionTypes.ADD_SHAPE_TO_CANVAS:
      const newShapeList = [{...payload.newShape}, ...state.canvasData.shapeList];
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          shapeList: newShapeList
        }
      }
    case ActionTypes.ADD_SHAPE_TO_COLLECTION:
      const newCollectionList = [{...payload.newShape}, ...state.canvasData.collectionList];
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          collectionList: newCollectionList
        }
      }
    case ActionTypes.CHANGE_CANVAS_SCALE:
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          canvasScale: payload.canvasScale, 
        }
      }
    case ActionTypes.CHANGE_BACKGROUND_COLOR:
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          backgroundColor: payload.backgroundColor
        }
      }
    case ActionTypes.ADD_TO_PALETTE:
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          colorPalette: [{color: payload, uuid: uuid()}, ...state.colorPalette]
        }
      }
    case ActionTypes.REPLACE_PALETTE:
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          colorPalette: payload
        }
      }
    case ActionTypes.SELECT_SHAPE:
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          selectedShape: payload
        }
      }

    //Current shape data
    case ActionTypes.CHANGE_SHAPE_WIDTH: 
      return {
        ...state,
        currentShape: {
          ...state.currentShape,
          shapeWidth: payload.shapeWidth
        }
      }
    case ActionTypes.CHANGE_SHAPE_HEIGHT: 
      return {
        ...state,
        currentShape: {
            ...state.currentShape,
            shapeHeight: payload.shapeHeight
        }
      }
    case ActionTypes.CHANGE_SHAPE_ROTATION: 
      return {
        ...state,
        currentShape: {
            ...state.currentShape,
            shapeRotation: payload.shapeRotation
        }
      }
    case ActionTypes.CHANGE_SHAPE_RADIUS: 
      return {
        ...state,
        currentShape: {
          ...state.currentShape,
          shapeRadius: payload.shapeRadius
      }
      }
    case ActionTypes.CHANGE_SHAPE_TYPE: 
      return {
        ...state,
        currentShape: {
          ...state.currentShape,
          shapeType: payload.shapeType
      }
      }
    case ActionTypes.CHANGE_SHAPE_COLOR:
      return {
        ...state,
        currentShape: {
          ...state.currentShape,
          shapeColor: payload.shapeColor
      }
      }
    case ActionTypes.CHANGE_SHAPE_OPACITY:
      return {
        ...state,
        currentShape: {
          ...state.currentShape,
          shapeOpacity: payload.shapeOpacity
        }
      }
    default:
      return state;
  }
};

export default canvasReducer;