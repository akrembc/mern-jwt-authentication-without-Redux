import React, { useState, useContext } from "react";

export const ShowModalContext = React.createContext();
ShowModalContext.displayName = "showModal";
export const UpdateShowModalContext = React.createContext();

export function useModal() {
  return useContext(ShowModalContext);
}

export function useModalUpdate() {
  return useContext(UpdateShowModalContext);
}

const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(() => false);
  return (
    <ShowModalContext.Provider value={showModal}>
      <UpdateShowModalContext.Provider value={setShowModal}>
        {children}
      </UpdateShowModalContext.Provider>
    </ShowModalContext.Provider>
  );
};

export default ModalProvider;
