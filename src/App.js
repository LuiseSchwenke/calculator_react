import DigitButton from "./digitButton";
import OperationButton from "./operationButton";
import "./index.css";
import {useEffect, useReducer} from "react";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELET_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate',
}

const DIGIT_FORMATTER = Intl.NumberFormat("en-us", {
  maximumFractionDigits:0,
}) 

function formatOperand (operand) {
  if (operand==null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) {return DIGIT_FORMATTER.format(integer)}
  return `${DIGIT_FORMATTER.format(integer)}.${decimal}`
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }

      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand?.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if(state.previousOperant == null && state.currentOperand == null) 
        return{
        state
      }
      if(state.previousOperant != null) 
        return{
          ...state,
          previousOperant: calculation(state),
          operation: payload.operation,
          currentOperand: null,
        };
     
      return {
        ...state,
        previousOperant: state.currentOperand,
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.EVALUATE:
        return {
          ...state,
          overwrite: true,
          previousOperant: null,
          operation: null,
          currentOperand: calculation(state),
        };

    default:
      return state;
  }
}


function calculation ({currentOperand, previousOperant, operation}) {
  const prev = parseFloat(previousOperant)
  const curr = parseFloat(currentOperand)
   if (isNaN(prev) || isNaN(curr)) return ""
  
  let computation = ""
  switch (operation) {
    case "+": 
   
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "÷":
      computation = prev / curr;
      break;

    default:
      computation = "";
      break;
  }
  return computation.toString();
}



function App() {
  const [{currentOperand,previousOperant, operation}, dispatch] = useReducer(reducer, {});
  useEffect(() => {
    document.title = "Simple Calculator"});
  return (

    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operant">{formatOperand(previousOperant)} {operation}</div>
          <div className="current-oeprant">{formatOperand(currentOperand)}</div>

      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELET_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>

    </div>
  )
}

export default App;
