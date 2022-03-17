import Common from '../constants/common';
import cloneDeep from 'lodash/cloneDeep';

const updateCurrentShape = (state, field, value) => {
  const copy = cloneDeep(state);
  const { selectedShapeId } = copy.editor;
  let { shapeList } = copy;
  let { currentShape, editedShapes } = copy.editor;
  if(selectedShapeId){
    shapeList = shapeList.map((shape) => {
      const shapeCopy = { ...shape };
      if(shapeCopy.id === selectedShapeId){
        shapeCopy[field] = value;
        currentShape[field] = value;
      }
      return shapeCopy;
    })
  } else {
    currentShape[field] = value;
    editedShapes[currentShape.type.toLowerCase()] = {...currentShape};
  }
  return {
    ...copy,
    shapeList,
    editor: {
      ...copy.editor,
      currentShape,
      editedShapes
    }
  }
}

const createPointString = (pointData) => {
  
}

export { 
  updateCurrentShape
};