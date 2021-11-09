import ActionTypes from "../actions/ActionTypes";
import Common from '../constants/common';
import uuid from 'react-uuid';
import { cloneDeep, filter, indexOf } from 'lodash';
import { updateCurrentShape } from "../utils/canvasUtils";
import { defaultCanvasData } from "../constants/data";

const shapeListData = []

const formatData = (shapes) => {
  return shapes.map((shape) => {
    const newShape = {}
    const keys = Object.keys(shape);
    keys.map((key) => {
      newShape[key] = shape[key];
    })
    return newShape;
  })
}

const formattedData = formatData(shapeListData)

const DEFAULT_STATE = {
  _id: '',
  info: {
    title: '',
    description: ''
  },
  shapeList: [],
  canvasData: {
    width: 600,
    height: 700,
    fill: 'rgba(50,50,55,1)',
    opacity: 1,
    scale: 1,
  },
  editor: {
    shapeType: Common.square,
    colorPalette: [
      {color: "#4771e8", uuid: "50ecc8b-23f5-dc2f-e06d-15e01b437a0"},
      {color: "#af56d8", uuid: "4dc6017-71d3-1b5-0067-4017bbe66efd"},
      {color: "#5b2175", uuid: "55fa65b-b05-e446-d0f-77757824e5"},
      {color: "#cd5b5b", uuid: "b24323-3bc0-1671-c67e-53823dac62"}
    ],
    selectedShapeId: '',
    currentShape: {
      id: '',
      type: Common.square,
      fill: 'rgb(106, 184, 197)',
      stroke: 'rgba(0,0,0)',
      strokeWidth: 0,
      opacity: 1,
      posX: 0,
      posY: 0,
      width: 60,
      height: 60,
      rotation: 0,
    },
    defaultShape: {
      square: {
        id: '',
        type: Common.square,
        fill: 'rgb(106, 184, 197)',
        stroke: 'rgba(0,0,0)',
        strokeWidth: 0,
        opacity: 0.7,
        posX: 0,
        posY: 0,
        width: 60,
        height: 60,
        rotation: 0,
      },
      circle: {
        id: '',
        type: Common.circle,
        fill: 'rgb(106, 184, 197)',
        stroke: 'rgba(0,0,0)',
        strokeWidth: 0,
        opacity: 0.7,
        posX: 0,
        posY: 0,
        radius: 30,
      },
      line: {
        id: '',
        type: Common.line,
        stroke: 'rgb(106, 184, 197)',
        strokeWidth: 2,
        fill: 'rgba(0,0,0,0)',
        opacity: 0.7,
        completed: false,
        points: 'M 100 100',
        pointData: []
      },
    }
  },
  collections: [],
};


const canvasReducer = (state = DEFAULT_STATE, action = {}) => {
  const {type, payload} = action,
    result = payload || {};
  let updatedShape = {};
  let replacedShape = {};
  switch(type){
    // Changes to canvas
    case ActionTypes.SET_CANVAS_DATA:
      return {
        ...payload,
      }
    case ActionTypes.CLEAR_CANVAS_DATA: 
      return {
        ...state,
        _id: '',
        info: {},
        shapeList: [],
        editor: {
          ...state.editor,
          currentShape: { ...state.editor.defaultShape['square']}
        }
      }
    case ActionTypes.LOAD_CANVAS_LIST:
      return {
        ...state,
        canvasList: payload
      }

      
    //Changes to canvas data
    case ActionTypes.CREATE_COLLECTION:
      const createdCollections = cloneDeep(state.canvasData.createdCollectionList)
      createdCollections.unshift(payload.newCollection)
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          createdCollectionList: createdCollections
        }
      }
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
      const newShapeList = cloneDeep(state.shapeList);
      const copy = cloneDeep(payload.newShape);
      const currentCopy = cloneDeep(payload.newShape);
      currentCopy.id = ''
      newShapeList.push(copy)
      return {
        ...state,
        shapeList: newShapeList,
        editor: {
          ...state.editor,
          currentShape: currentCopy
        }
      }
    case ActionTypes.ADD_SHAPE_TO_COLLECTION:
      const newCollectionList = cloneDeep(state.collectionCanvasData.collectionList);
      newCollectionList.unshift(payload.newShape)
      return {
        ...state,
        collectionCanvasData: {
          ...state.canvasData,
          collectionList: newCollectionList
        }
      }
    case ActionTypes.UPDATE_LINE:
      replacedShape = cloneDeep(payload.newLine);
      return {
        ...state,
        currentShape: {
          ...state.currentShape,
          line: replacedShape
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
      const selectedShapeData = state.canvasData.shapeList.find((shape) => shape.id === payload)
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          selectedShapeId: payload,
          selectedShape: selectedShapeData
        }
      }
    case ActionTypes.REMOVE_SHAPE:
      const listAfterRemove = filter(state.canvasData.shapeList, (shape) => {
        if(shape.id !== payload){
          return shape;
        } 
      })
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          shapeList: listAfterRemove,
        }
      }

    //Current shape data
    case ActionTypes.CHANGE_SHAPE_WIDTH: 
      updatedShape = updateCurrentShape(
        state.editor.currentShape, 
        'width',
        payload.width
      )
      return {
        ...state,
        editor: {
          ...state.editor,
          currentShape: updatedShape,
        }
      }
    case ActionTypes.CHANGE_SHAPE_HEIGHT: 
      updatedShape = updateCurrentShape(
        state.editor.currentShape, 
        'height',
        payload.height
      )
      return {
        ...state,
        editor: {
          ...state.editor,
          currentShape: updatedShape,
        }
      }
    case ActionTypes.CHANGE_SHAPE_ROTATION: 
      updatedShape = updateCurrentShape(
        state.editor.currentShape, 
        'rotation',
        payload.rotation
      )
      return {
        ...state,
        editor: {
          ...state.editor,
          currentShape: updatedShape,
        }
      }
    case ActionTypes.CHANGE_SHAPE_RADIUS:
      updatedShape = updateCurrentShape(
        state.editor.currentShape, 
        'radius',
        payload.radius
      )
      return {
        ...state,
        editor: {
          ...state.editor,
          currentShape: updatedShape,
        }
      }
    case ActionTypes.CHANGE_SHAPE_TYPE: 
      const newShape = { ...state.editor.defaultShape[payload.type.toLowerCase()]}
      return {
        ...state,
        editor: {
          ...state.editor,
          currentShape: newShape
        }
    }
    case ActionTypes.CHANGE_SHAPE_FILL:
      updatedShape = updateCurrentShape(
        state.editor.currentShape, 
        'fill',
        payload.fill
      )
      return {
        ...state,
        editor: {
          ...state.editor,
          currentShape: updatedShape,
        }
      }
    case ActionTypes.CHANGE_SHAPE_STROKE:
      updatedShape = updateCurrentShape(
        state.editor.currentShape, 
        'stroke',
        payload.stroke
      )
      return {
        ...state,
        editor: {
          ...state.editor,
          currentShape: updatedShape,
        }
      }
    case ActionTypes.CHANGE_SHAPE_STROKE_WIDTH:
      updatedShape = updateCurrentShape(
        state.editor.currentShape,
        'strokeWidth',
        payload.width
      )
      return {
        ...state,
        editor: {
          ...state.editor,
          currentShape: updatedShape,
        }
      }
    case ActionTypes.CHANGE_SHAPE_OPACITY:
      updatedShape = updateCurrentShape(
        state.editor.currentShape, 
        'opacity',
        payload.opacity
      )
      return {
        ...state,
        editor: {
          ...state.editor,
          currentShape: updatedShape,
        }
      }
    default:
      return state;
  }
};

export default canvasReducer;