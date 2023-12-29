import useStore from "@/store/useStore";
import { Button } from "../ui/button";
import React from "react";

interface UpdateProjectProps {
  onUpdateProject: (projectPayload: IUpdateProject) => void;
  userRole: string;
}

export const ProjectModal: React.FC<UpdateProjectProps> = ({
  onUpdateProject,
  userRole
}) => {
  const projObj: IProject = useStore((state) => state.project);
  const modalError: string = useStore((state) => state.projectModalError);
  const setModalError: (value: string) => void = useStore(
    (state) => state.setProjectModalError
  );
  const clearModalError: () => void = useStore(
    (state) => state.clearProjectModalError
  );
  const setModal = useStore((state) => state.setProjectModalOpen);
  const nameInputRef: React.RefObject<HTMLInputElement> = React.createRef();
  const urlInputRef: React.RefObject<HTMLInputElement> = React.createRef();
  const scopeInputRef: React.RefObject<HTMLSelectElement> = React.createRef();

  const handleOnSubmit: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredName = nameInputRef.current?.value;
    const enteredUrl = urlInputRef.current?.value;
    const enteredScope =
      userRole === "admin" ? scopeInputRef.current?.value : "user";

    if (enteredName || enteredUrl || enteredScope) {
      if (enteredName !== projObj.name || enteredUrl !== projObj.url || enteredScope !== projObj.scope) {
        const projPayload = {
          name: enteredName,
          url: enteredUrl,
          scope: enteredScope
        };
        console.log("update proj payload: ", projPayload);
        onUpdateProject(projPayload);
      }
      setModal(false);
    } else {
      if (userRole === "admin") {
        setModalError("Required: Please key in either Name or Url or change the Scope to update.");
      } else {
        setModalError("Required: Please key in either Name or Url to update.");
      }
      // alert("At least 1 field is required!");
    }
  };

  return (
    <div
      className="modal-overlay"
      id="modalContainer"
      onClick={(e) => {
        const target = e.target as HTMLInputElement;
        if (target.className === "modal-overlay") {
          setModal(false);
          clearModalError();
        }
      }}
    >
      <div className="modal" id="modal">
        <form onSubmit={handleOnSubmit}>
          <div className="modal-group">
            <label className="font-medium text-lg mb-1" htmlFor="name">
              Name
            </label>
            <input
              className="rounded-md border-black p-2 text-base"
              id="name"
              placeholder="Enter your new Project Name"
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
              placeholder="Enter your new Project Url"
              defaultValue={projObj.url}
              type="url"
              onChange={clearModalError}
              ref={urlInputRef}
            />
          </div>
          {userRole === "admin" && <div className="modal-group">
            <label className="font-medium text-lg mb-1" htmlFor="url">
              Scope
            </label>
            <select
              className="w-full border-2 bg-gray-100 rounded-xl p-4 mt-1 focus:bg-transparent"
              id="scope"
              ref={scopeInputRef}
              onChange={clearModalError}
              required
              defaultValue={projObj.scope}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>}
          <div id="error-message" className="text-red-600">
            {modalError}
          </div>
          <Button className="block m-auto mt-6">Submit</Button>
        </form>
      </div>
    </div>
  );
};
