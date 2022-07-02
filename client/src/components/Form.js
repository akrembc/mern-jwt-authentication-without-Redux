import React, {
  useEffect,
  useRef,
  useCallback,
  Fragment,
  useReducer,
} from "react";

import Button from "./Button";

function updateArray(array, index, value) {
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}

function formReducer(state, action) {
  switch (action.type) {
    case "valid": {
      const { valid } = state;
      const { index, validate, inputValues } = action.payload;
      return {
        ...state,
        valid: updateArray(valid, index, validate(inputValues[index])),
      };
    }
    case "validClass": {
      const { validClass } = state;
      const { index, value } = action.payload;
      return {
        ...state,
        validClass: updateArray(validClass, index, value),
      };
    }
    case "inputValues": {
      const { inputValues } = state;
      const { index, value } = action.payload;
      return {
        ...state,
        inputValues: updateArray(inputValues, index, value),
      };
    }
    case "meta": {
      // type = focused, blur or touched
      const { meta } = state;
      const { index, values } = action.payload;
      // should use deep copy instead of shallow copy, should not mutate state
      // otherwise "meta" state won't get updated until non-meta state does.
      // stringify then parse (spread & assign save reference of nested props)
      const editedMeta = JSON.parse(JSON.stringify(meta));
      Object.keys(values).forEach((key) => {
        editedMeta[key][index] = values[key];
      });
      return {
        ...state,
        meta: { ...meta, ...editedMeta },
      };
    }
    default:
      return state;
  }
}

function initialState(fields) {
  return {
    validClass: fields.map(() => ""),
    inputValues: fields.map(() => ""),
    valid: fields.map(() => false),
    meta: {
      focused: fields.map((_, i) => (i === 0 ? true : false)),
      blur: fields.map(() => false),
      touched: fields.map((_, i) => (i === 0 ? true : false)),
    },
  };
}

const Form = ({
  formFields,
  handleSubmit,
  isLoading,
  confirmButtonText: { confirmText, loadingText },
  formError,
  setFormError,
}) => {
  // will be recompiled after each rerender (whenever state changes)
  // unstableDispatch will get new ref same as state
  const [state, unstableDispatch] = useReducer(
    formReducer,
    initialState(formFields)
  );

  // save a reference for state so that dispatch won't get new ref after each rerender:
  // we have 2 useEffects that have dispatch as a dependency & if we use "bare" state as a
  // dependency of useCallback (of dispatch), it will trigger both of them, when we only
  // want to trigger each one of them once for the life cycle of "showError" to work properly
  // ==> Solution: putting state in a nested object in React ref (useRef()), then we don't need to
  // make it as dependency for useCallback (works also for useEffect & useMemo) & even if we add deps,
  // it won't trigger any of them since a React ref don't tell us when its value changes.
  const stateRef = useRef({ state });

  useEffect(() => {
    stateRef.current.state = state;
  }, [state]);

  // save a reference for dispatch() to prevent needless useEffect triggering
  // ==> essential for the ref "showError" life cycle (explained in useEffect)
  const dispatch = useCallback(({ type, payload }) => {
    // only dispatch when state is going to change value by creating a deep copy
    // to make sure that error is displayed at least once (after dispatch "error")
    let currentStateValue = JSON.stringify(stateRef.current.state);
    let expectedStateValue = JSON.stringify(
      formReducer(stateRef.current.state, {
        type,
        payload,
      })
    );
    // _.isEqual only works if we add nesting condition for each nesting object
    if (currentStateValue !== expectedStateValue) {
      unstableDispatch({ type, payload });
    }
  }, []);

  const { validClass, inputValues, valid, meta } = state;
  // boolean ref to decide when we should display error
  const showError = useRef(false);

  useEffect(() => {
    if (formError) {
      // meta & inputValues are not in this useEffect deps array
      // ==> formError is truthy only once ==> displayed only once
      showError.current = true;
      // inputs behavior after getting new formError value (!= "")
      formFields.forEach(({ afterFailBehavior }, index) => {
        if (afterFailBehavior) {
          switch (afterFailBehavior) {
            case "focus":
              document.getElementById(`input-${index}`).focus();
              break;
            case "clear":
              dispatch({
                type: "inputValues",
                payload: { index, value: "" },
              });
              break;
            case "disable":
              document
                .getElementById(`input-${index}`)
                .setAttribute("disabled", "true");
              break;
            default:
              break;
          }
          dispatch({ type: "validClass", payload: { index, value: "" } });
          if (afterFailBehavior !== "focus")
            dispatch({
              type: "meta",
              payload: {
                index,
                values: { touched: false },
              },
            });
        }
      });
    }
  }, [formError, formFields, dispatch]);

  // store error value in a ref to avoid adding "formError" as deps of useEffect
  // that will make this component rerender twice directly after getting new error
  const displayedError = useRef();
  useEffect(() => {
    displayedError.current = formError;
  }, [formError]);

  useEffect(() => {
    const { focused, blur, touched } = meta;
    formFields.forEach(({ validate }, index) => {
      // form validation used for enabling / disabling submit button
      dispatch({ type: "valid", payload: { index, validate, inputValues } }); // same index as inputValues
    });
    if (showError.current) {
      // close cycle after first error rendering (stop display error next rerender)
      // it works because "formError" is not a dependency of this useEffect()
      showError.current = false;
      return;
    }
    if (displayedError.current) {
      // only clear error when there's one & it's already been displayed
      // otherwise App rerender each time any of these deps changed (unwanted behavior)
      setFormError?.("");
    }
    formFields.forEach(({ validate }, index) => {
      if (focused[index] || !touched[index]) {
        dispatch({ type: "validClass", payload: { index, value: "" } });
        return;
      }
      if (blur[index]) {
        if (validate(inputValues[index])) {
          dispatch({
            type: "validClass",
            payload: { index, value: "is-valid" },
          });
          return;
        }
      }
      dispatch({ type: "validClass", payload: { index, value: "is-invalid" } });
    });
  }, [meta, formFields, inputValues, setFormError, dispatch]);

  const validationFeedback = useCallback(
    (index, validFieldNote, invalidFieldNote) => {
      if (validClass[index] === "is-valid")
        return (
          <div className="valid-feedback" style={{ height: "1rem" }}>
            {validFieldNote && validFieldNote}
          </div>
        );
      if (validClass[index] === "is-invalid")
        return (
          <div className="invalid-feedback" style={{ height: "1rem" }}>
            {invalidFieldNote && invalidFieldNote}
          </div>
        );
      // reserved space to prevent form container resize (modal?)
      return <div style={{ height: "1rem" }}></div>;
    },
    [validClass]
  );

  return (
    <Fragment>
      <div
        id="form-error"
        className="bg-danger rounded-3 mb-1 mx-auto px-2 text-center"
        style={{
          width: "fit-content",
          height: "1.5rem",
          visibility: `${formError ? "visible" : "hidden"}`,
        }} // reserved space
      >
        {formError}
      </div>
      <form className="row g-3" noValidate>
        {formFields.map(
          (
            { style, label, inputType, validFieldNote, invalidFieldNote },
            index
          ) => (
            <div className={style} key={index}>
              <label htmlFor={`input-${index}`} className="form-label">
                {label}
              </label>
              <input
                type={inputType}
                className={`form-control ${validClass[index]}`}
                id={`input-${index}`}
                value={inputValues[index]}
                autoFocus={index === 0}
                onChange={(e) =>
                  dispatch({
                    type: "inputValues",
                    payload: { index, value: e.target.value },
                  })
                }
                onFocus={() => {
                  dispatch({
                    type: "meta",
                    payload: {
                      index,
                      values: { focused: true, blur: false, touched: true },
                    },
                  });
                }}
                onBlur={() => {
                  dispatch({
                    type: "meta",
                    payload: {
                      index,
                      values: { focused: false, blur: true },
                    },
                  });
                }}
              />
              {validationFeedback(index, validFieldNote, invalidFieldNote)}
            </div>
          )
        )}
        <div className="col-12">
          <Button
            className="btn btn-primary"
            type="submit"
            onClick={(e) => {
              handleSubmit(e, inputValues);
            }}
            disabled={!valid.every((input) => input) || isLoading}
          >
            {isLoading ? loadingText : confirmText}
          </Button>
        </div>
      </form>
    </Fragment>
  );
};

export default Form;
