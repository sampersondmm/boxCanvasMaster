import ActionTypes from "../actions/ActionTypes";
import Common from '../constants/common';
import uuid from 'react-uuid';
import { cloneDeep, filter, isEmpty } from 'lodash';
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
    width: 500,
    height: 400,
    fill: 'rgb(50,50,55)',
    opacity: 1,
    scale: 1,
  },
  action: 'add',
  editor: {
    currentShapeType: Common.square,
    selectedPoints: [],
    colorPalette: [
      {color: "#4771e8", uuid: "50ecc8b-23f5-dc2f-e06d-15e01b437a0"},
      {color: "#af56d8", uuid: "4dc6017-71d3-1b5-0067-4017bbe66efd"},
      {color: "#5b2175", uuid: "55fa65b-b05-e446-d0f-77757824e5"},
      {color: "#cd5b5b", uuid: "b24323-3bc0-1671-c67e-53823dac62"}
    ],
    selectedShapeId: '',
    hoverShapeId: '',
    selectedShape: {},
    currentShape: {
      id: '',
      type: Common.line,
      stroke: 'rgb(106, 184, 197)',
      strokeWidth: 2,
      fill: 'rgb(106, 210, 180)',
      opacity: 0.5,
      completed: false,
      points: 'M 100 100',
      pointData: []
    },
    editedShapes: {
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
        curve: false,
        fill: 'rgb(106, 210, 180)',
        // fill: 'rgba(106, 210, 180, 0.5)',
        opacity: 0.5,
        completed: false,
        points: 'M 100 100',
        pointData: []
      },
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
        fill: 'rgb(106, 210, 180)',
        opacity: 0.5,
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
          currentShape: { ...state.editor.defaultShape['square']},
          selectedShapeId: '',
        }
      }
    case ActionTypes.LOAD_CANVAS_LIST:
      return {
        ...state,
        canvasList: payload
      }
    case ActionTypes.TOGGLE_CANVAS_ACTION:
      let updatedId = null;
      let updatedCurrentShape = null;
      if(payload.action === 'add'){
        const updatedShape = state.editor.editedShapes[state.editor.currentShapeType.toLocaleLowerCase()] ||
          state.editor.defaultShapes;

        updatedId = '';
        updatedCurrentShape = state.editor.editedShapes[state.editor.currentShapeType.toLocaleLowerCase()] ||
          state.editor.defaultShapes
      }
      return {
        ...state,
        action: payload.action,
        editor: {
          ...state.editor,
          selectedShapeId: updatedId
        }
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
        editor: {
          ...state.editor,
          currentShape: {
            ...replacedShape
          }
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
          fill: payload.backgroundColor
        }
      }
    case ActionTypes.CHANGE_BACKGROUND_OPACITY:
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          opacity: payload.opacity
        }
      }
    case ActionTypes.UPDATE_CANVAS_TITLE:
      return {
        ...state,
        info: {
          ...state.info,
          title: payload.title
        }
      }
    case ActionTypes.UPDATE_CANVAS_DESCRIPTION:
      return {
        ...state,
        info: {
          ...state.info,
          description: payload.description
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
      let newCurrentShape = {};
      if(payload.id){
        newCurrentShape = state.shapeList.find(x => x.id === payload.id);
      } else {
        const newEdited = state.editor.editedShapes[state.editor.currentShapeType.toLowerCase()];
        if(newEdited){
          newCurrentShape = newEdited
        } else {
          newCurrentShape = state.editor.defaultShape[state.editor.currentShapeType.toLowerCase()]
        }
      }
      return {
        ...state,
        action: payload.id ? 'edit' : state.action,
        editor: {
          ...state.editor,
          currentShape: newCurrentShape,
          selectedShapeId: payload.id,
        }
      }
    case ActionTypes.HOVER_SHAPE:
      const hoverShapeData = state.shapeList.find((shape) => shape.id === payload.id);
      return {
        ...state,
        editor: {
          ...state.editor,
          hoverShapeId: payload.id,
        }
      }
    case ActionTypes.SELECT_POINT:
      return {
        ...state,
        editor: {
          ...state.editor,
          selectedPoints: payload.selectedPoints
        }
      }
    case ActionTypes.UPDATE_SELECTED_SHAPE:
      const shapeListWithSelectedUpdate = cloneDeep(state.shapeList).map((shape) => {
        return shape.id === payload.selectedShape.id ?
          {...payload.selectedShape} :
          shape
      })
      return {
        ...state,
        shapeList: shapeListWithSelectedUpdate
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
      return updateCurrentShape(
        state,
        'width',
        payload.width
      )
    case ActionTypes.CHANGE_SHAPE_HEIGHT: 
      return updateCurrentShape(
        state, 
        'height',
        payload.height
      )
    case ActionTypes.CHANGE_SHAPE_ROTATION: 
      return updateCurrentShape(
        state, 
        'rotation',
        payload.rotation
      )
    case ActionTypes.CHANGE_SHAPE_RADIUS:
      return updateCurrentShape(
        state, 
        'radius',
        payload.radius
      )
    case ActionTypes.CHANGE_SHAPE_TYPE: 
      // const newShape = { ...state.editor.defaultShape[payload.type.toLowerCase()]}
      const updatedShape = { ...state.editor.editedShapes[payload.type.toLowerCase()]};
      const defaultShape = { ...state.editor.defaultShape[payload.type.toLowerCase()]};
      return {
        ...state,
        editor: {
          ...state.editor,
          currentShapeType: payload.type,
          currentShape: !isEmpty(updatedShape) ? updatedShape : defaultShape,
          selectedShapeId: ''
        }
    }
    case ActionTypes.CHANGE_SHAPE_FILL:
      return updateCurrentShape(
        state, 
        'fill',
        payload.fill
      )
    case ActionTypes.CHANGE_SHAPE_STROKE:
      return updateCurrentShape(
        state, 
        'stroke',
        payload.stroke
      )
    case ActionTypes.CHANGE_SHAPE_STROKE_WIDTH:
      return updateCurrentShape(
        state,
        'strokeWidth',
        payload.width
      )
    case ActionTypes.CHANGE_SHAPE_OPACITY:
      return updateCurrentShape(
        state, 
        'opacity',
        payload.opacity
      )
    default:
      return state;
  }
};

export default canvasReducer;