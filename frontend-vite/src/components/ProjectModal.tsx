import useStore from "@/store/useStore";
import { Button } from "./ui/button";
import React from "react";

interface UpdateProjectProps {
  onUpdateProject: (projectPayload: IUpdateProject) => void;
}

export const ProjectModal: React.FC<UpdateProjectProps> = ({ onUpdateProject }) => {
  const projObj: IProject = useStore((state) => state.project);
  const modalError: string = useStore((state) => state.projectModalError);
  const setModalError: (value: string) => void = useStore((state) => state.setProjectModalError);
  const clearModalError: () => void = useStore((state) => state.clearProjectModalError);
  const setModal = useStore((state) => state.setProjectModalOpen);
  const nameInputRef: React.RefObject<HTMLInputElement> = React.createRef();
  const urlInputRef: React.RefObject<HTMLInputElement> = React.createRef();

  // const isFormDirty = () => {
    // console.log("nameInput: ", nameInputRef.current?.value);
    // console.log("projObj name: ", projObj.name);
  //   return (nameInputRef.current?.value === projObj.name) && (urlInputRef.current?.value === projObj.url);
  // }

  const handleOnSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredName = nameInputRef.current?.value;
    const enteredUrl = urlInputRef.current?.value;

    if (enteredName || enteredUrl) {
      if (enteredName !== projObj.name || enteredUrl !== projObj.url) {
        const projPayload = {
          name: enteredName,
          url: enteredUrl
        }
        console.log("update proj payload: ", projPayload);
        onUpdateProject(projPayload);
      }
      setModal(false);
    } else {
      setModalError("Required: Please key in either name or url to update.")
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
              placeholder="Enter your new project name"
              defaultValue={projObj.name}
              type="text"
              onChange={clearModalError}
              ref={nameInputRef}
            />
          </div>
          <div className="modal-group">
            <label className="font-medium text-lg mb-1" htmlFor="url">
              Url
            </label>
            <input
              className="rounded-md border-black p-2 text-base"
              id="url"
              placeholder="Enter your new project url"
              defaultValue={projObj.url}
              type="url"
              onChange={clearModalError}
              ref={urlInputRef}
            />
          </div>
          <div id="error-message" className="text-red-600">{modalError}</div>
          <Button className="block m-auto mt-6">Submit</Button>
        </form>
      </div>
    </div>
  );
};
