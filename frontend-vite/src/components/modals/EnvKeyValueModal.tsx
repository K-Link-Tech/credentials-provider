import useStore from "@/store/useStore";
import { Button } from "../ui/button";
import React from "react";

interface UpdateEnvKeyValueProps {
  onUpdateEnvKeyValue: (envKeyValuePayload: IUpdateEnvKeyValue) => void;
}

export const EnvKeyValueModal: React.FC<UpdateEnvKeyValueProps> = ({ onUpdateEnvKeyValue: onUpdateEnvKeyValue }) => {
  const envKeyValueObj: IEnvKeyValue = useStore((state) => state.envKeyValue);
  const modalError: string = useStore((state) => state.envKeyValueModalError);
  const setModalError: (value: string) => void = useStore((state) => state.setEnvKeyValueModalError);
  const clearModalError: () => void = useStore((state) => state.clearEnvKeyValueModalError);
  const setModal = useStore((state) => state.setEnvKeyValueModalOpen);
  const keyInputRef: React.RefObject<HTMLInputElement> = React.createRef();
  const valueInputRef: React.RefObject<HTMLInputElement> = React.createRef();

  const handleOnSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredKey = keyInputRef.current?.value;
    const enteredValue = valueInputRef.current?.value;

    if (enteredKey || enteredValue) {
      if (enteredKey !== envKeyValueObj.key || enteredValue !== envKeyValueObj.value) {
        const envKeyValuePayload = {
          key: enteredKey,
          value: enteredValue,
          encryption_method: "aes-256" // This is fixed for now as DB only supports 1 type of encryption.
        }
        console.log("update envKeyValue payload: ", envKeyValuePayload);
        onUpdateEnvKeyValue(envKeyValuePayload);
      }
      setModal(false);
    } else {
      setModalError("Required: Please key in either Key or Value to update.")
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
              Key
            </label>
            <input
              className="rounded-md border-black p-2 text-base"
              id="name"
              placeholder="Enter your new Env Key"
              defaultValue={envKeyValueObj.key}
              type="text"
              onChange={clearModalError}
              ref={keyInputRef}
            />
          </div>
          <div className="modal-group">
            <label className="font-medium text-lg mb-1" htmlFor="url">
              Value
            </label>
            <input
              className="rounded-md border-black p-2 text-base"
              id="url"
              placeholder="Enter your new Env Value"
              defaultValue={envKeyValueObj.value}
              type="text"
              onChange={clearModalError}
              ref={valueInputRef}
            />
          </div>
          <div id="error-message" className="text-red-600">{modalError}</div>
          <Button className="block m-auto mt-6">Submit</Button>
        </form>
      </div>
    </div>
  );
};
