import React, { useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";

const Modal = ({
  showModal,
  setShowModal,
  title,
  children,
  buttons,
  handleSubmit,
}) => {
  const pressedKeys = useRef([]);
  const nextElement = useRef(null);

  const handleKeyPressed = useCallback(
    (e) => {
      if (pressedKeys.current.includes("Escape")) {
        setShowModal(false);
      } else if (pressedKeys.current.includes("Tab")) {
        // take control of Tab fonctionalities to prevent navigating outside the modal
        e.preventDefault();
        const controls = modalControls();
        let currentElement = controls.indexOf(document.activeElement);
        if (pressedKeys.current.includes("Shift")) {
          if (currentElement - 1 >= 0) {
            nextElement.current = controls[currentElement - 1];
          } else {
            nextElement.current = controls[controls.length - 1];
          }
        } else {
          if (currentElement + 1 < controls.length) {
            nextElement.current = controls[currentElement + 1];
          } else {
            nextElement.current = controls[0];
          }
        }
      } else if (
        !modalControls().includes(document.activeElement) &&
        (pressedKeys.current.includes("Enter") ||
          pressedKeys.current.includes(" "))
      ) {
        // prevent any interaction if accidentally a non-modal element get focuses
        e.preventDefault();
      }
    },
    [setShowModal]
  );

  useEffect(() => {
    nextElement.current = document.activeElement;

    // empty pressedKeys Array when navigating back to browser or current tab
    const onWindowFocus = () => {
      pressedKeys.current.length = 0;
    };

    const onKeyEvents = (e) => {
      if (e.type === "keydown" && !pressedKeys.current.includes(e.key)) {
        pressedKeys.current.push(e.key);
      } else if (e.type === "keyup") {
        pressedKeys.current = pressedKeys.current.filter(
          (val) => val !== e.key
        );
        if (e.key === "AltGraph" || e.key === "Shift") {
          // clear array for alternative keys (@ or M...)
          pressedKeys.current.length = 0;
        } else if (e.key === "Tab") {
          nextElement.current.focus();
        }
      }
      handleKeyPressed(e);
    };

    document.addEventListener("keydown", onKeyEvents);
    document.addEventListener("keyup", onKeyEvents);
    window.addEventListener("focus", onWindowFocus);

    return () => {
      document.removeEventListener("keydown", onKeyEvents);
      document.removeEventListener("keyup", onKeyEvents);
      window.removeEventListener("focus", onWindowFocus);
    };
  }, [handleKeyPressed]);

  // return list of all modal controls to verify no outer element get focused
  const modalControls = () => {
    const focussableElements =
      'a:not([disabled]), button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
    const modalInputs = document
      .querySelector(".modal-content")
      ?.querySelectorAll(focussableElements); // need to be reviewed .. why SOMETIMES need using "?"
    const modalInputsArray = [];
    modalInputs.forEach((item) => modalInputsArray.push(item));
    return modalInputsArray;
  };

  // two possible ways to close modal when clincking outside it:
  // 1- window.onclick and verify if (useRef (.modal) === e.target)
  // 2- click handler on main div and stop propagation in its 1st child
  return ReactDOM.createPortal(
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ display: `${showModal ? "block" : "none"}` }}
      onClick={() => {
        setShowModal(false);
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content bg-secondary text-dark">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            {/* <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button> */}
            <button
              className="btn btn-sm btn-danger"
              id="closing-button"
              onClick={() => setShowModal(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            {buttons?.(handleSubmit, setShowModal)}
          </div>
        </div>
      </div>
    </div>,
    document.querySelector("#portal")
  );
};

Modal.defaultProps = {
  buttons: (handleSubmit, setShowModal) => (
    <>
      <button type="button" className="btn btn-primary" onClick={handleSubmit}>
        Confirm
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        data-dismiss="modal"
        onClick={() => setShowModal(false)}
      >
        Cancel
      </button>
    </>
  ),
};

export default Modal;
