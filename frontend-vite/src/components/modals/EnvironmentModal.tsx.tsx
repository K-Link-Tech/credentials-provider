import useStore from "@/store/useStore";
import { Button } from "../ui/button";
import React from "react";

interface UpdateEnvironmentProps {
  onUpdateEnvironment: (environmentPayload: IUpdateEnvironment) => void;
}

export const EnvironmentModal: React.FC<UpdateEnvironmentProps> = ({ onUpdateEnvironment: onUpdateProject }) => {
  const environmentObj: IEnvironment = useStore((state) => state.environment);
  const modalError: string = useStore((state) => state.environmentModalError);
  const setModalError: (value: string) => void = useStore((state) => state.setEnvironmentModalError);
  const clearModalError: () => void = useStore((state) => state.clearEnvironmentModalError);
  const setModal = useStore((state) => state.setEnvironmentModalOpen);
  const nameInputRef: React.RefObject<HTMLInputElement> = React.createRef();

  const handleOnSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredName = nameInputRef.current?.value;

    if (enteredName) {
      if (enteredName !== environmentObj.name) {
        const environmentPayload = {
          name: enteredName as string,
        }
        console.log("update environment payload: ", environmentPayload);
        onUpdateProject(environmentPayload);
      }
      setModal(false);
    } else {
      setModalError("Required: Please key in the Name to update.")
      // alert("At least 1 field is required!");
    }    
  }

  return (
    <div className="modal-overlay" 
         id="modalContainer" 
         onClick={(e) => {
          const target = e.target as HTMLInputElement
          if(target.className === "modal-overlay") {
            setModal(false);
            clearModalError();
          }
      }}>
      <div className="modal" id="modal">
        <form onSubmit={handleOnSubmit}>
          <div className="modal-group">
            <label className="font-medium text-lg mb-1" htmlFor="name">
              Name
            </label>
            <input
              className="rounded-md border-black p-2 text-base"
              id="name"
              placeholder="Enter your new Environment Name"
              defaultValue={environmentObj.name}
              type="text"
              onChange={clearModalError}
              ref={nameInputRef}
            />
          </div>
          <div id="error-message" className="text-red-600">{modalError}</div>
          <Button className="block m-auto mt-6">Submit</Button>
        </form>
      </div>
    </div>
  );
};
