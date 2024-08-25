import DigitButton from "./digitButton";
import OperationButton from "./operationButton";
import "./index.css";
import {useReducer} from "react";

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
      if (payload.operation === "log" || 
        payload.operation === "√" || 
        payload.operation === "ln" ||
        payload.operation === "√" || 
        payload.operation === "π" || 
        payload.operation === "x²" || 
        payload.operation === "ex" || 
        payload.operation === "10x" || 
        payload.operation === "n!" || 
        payload.operation === "sin" ||
        payload.operation === "cos" ||
        payload.operation === "tan") {
          return {
            ...state,
            previousOperant: state.previousOperant,
            currentOperand: "",
            operation: payload.operation,
          };
      }

      if (state.currentOperand == null && state.previousOperant == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperant == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperant: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperant: calculation(state),
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
      if (state.operation === "log" && state.previousOperant !== null) {
        return {
          ...state,
          overwrite: true,
          previousOperant: null,
          operation: null,
          currentOperand: calculation(state),
        };
      }
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperant == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperant: null,
        operation: null,
        currentOperand: calculation(state),
      };
  }
}


function calculation ({currentOperand, previousOperant, operation}) {
  const prev = parseFloat(previousOperant)
  const curr = parseFloat(currentOperand)
  
  let computation = ""
  switch (operation) {
    case "+": 
    if (isNaN(prev) || isNaN(curr)) return ""
      computation = prev + curr;
      break;
    case "-":
      if (isNaN(prev) || isNaN(curr)) return ""
      computation = prev - curr;
      break;
    case "*":
      if (isNaN(prev) || isNaN(curr)) return ""
      computation = prev * curr;
      break;
    case "÷":
      if (isNaN(prev) || isNaN(curr)) return ""
      computation = prev / curr;
      break;
      case "log":
        if (!isNaN(prev) && prev !== undefined) {
          computation = prev * Math.log10(curr);
        } else {
          computation = Math.log10(curr);
        }
        break;
    case "ln":
      if (!isNaN(prev) && prev !== undefined) {
        computation = prev * Math.log(curr);
      } else {
        computation = Math.log(curr);
      }
      break;
    case "√":
      if (!isNaN(prev) && prev !== undefined) {
        computation = prev * Math.sqrt(curr);
      } else {
        computation = Math.sqrt(curr);
      }
      break;
    case "π":
      if (!isNaN(prev) && prev !== undefined) {
        computation = prev * Math.PI(curr);
      } else {
        computation = Math.PI(curr);
      }
      break;
    case "x²":
      if (!isNaN(prev) && prev !== undefined) {
        computation = prev * Math.pow(curr);
      } else {
        computation = Math.pow(curr);
      }
      break;
    case "ex":
      if (!isNaN(prev) && prev !== undefined) {
        computation = prev * Math.exp(curr);
      } else {
        computation = Math.exp(curr);
      }
      break;
    case "10x":
      if (!isNaN(prev) && prev !== undefined) {
        computation = prev * Math.pow(10,curr);
      } else {
        computation = Math.pow(10,curr);
      }
      break;
    case "n!":
      function factorial(n) {
        if (n === 0 || n === 1) return 1;
        let fact = 1;
        for (let i = 2; i <= n; i++) {
          fact *= i;
        }
        return fact;
      }
      if (!isNaN(prev) && prev !== undefined) {
        computation = prev * factorial(curr);
      } else {
        computation = factorial(curr);
      }
      break;
    case "sin":
      if (!isNaN(prev) && prev !== undefined) {
        computation = prev * Math.sin(curr);
      } else {
        computation = Math.sin(curr);
      }
      break;
    case "cos":
      if (!isNaN(prev) && prev !== undefined) {
        computation = prev * Math.cos(curr);
      } else {
        computation = Math.cos(curr);
      }
      break;
    case "tan":
      if (!isNaN(prev) && prev !== undefined) {
        computation = prev * Math.tan(curr);
      } else {
        computation = Math.tan(curr);
      }
      break;
    default:
      computation = "";
      break;
  }
  return computation.toString();
}

function App() {
  const [{currentOperand,previousOperant, operation}, dispatch] = useReducer(reducer, {});
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
      <OperationButton operation="log" dispatch={dispatch}/>
      <OperationButton operation="ln" dispatch={dispatch}/>
      <OperationButton operation="√" dispatch={dispatch}/>
      <OperationButton operation="π" dispatch={dispatch}/>
      <OperationButton operation="x²" dispatch={dispatch}/>
      <OperationButton operation="ex" dispatch={dispatch}/>
      <OperationButton operation="10x" dispatch={dispatch}/>
      <OperationButton operation="n!" dispatch={dispatch}/>
      <OperationButton operation="sin" dispatch={dispatch}/>
      <OperationButton operation="cos" dispatch={dispatch}/>
      <OperationButton operation="tan" dispatch={dispatch}/>
      <OperationButton operation="" dispatch={dispatch}/>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>

    </div>
  )
}

export default App;
