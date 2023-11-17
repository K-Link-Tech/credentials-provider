import Card from "../cards/NewProjectCard";
import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface NewProjectFormProps {
  onAddProject: Function;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onAddProject }) => {
  const projNameInputRef: React.RefObject<HTMLInputElement> = React.createRef();
  const urlInputRef: React.RefObject<HTMLInputElement> = React.createRef();

  const navigate = useNavigate();
  
  const handleAddNewProj: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredProjName = projNameInputRef.current?.value;
    const enteredUrl = urlInputRef.current?.value;

    const projPayload = {
      name: enteredProjName,
      url: enteredUrl,
    };
    console.log("proj", projPayload);
    onAddProject(projPayload);
  };

  return (
    <Card>
      <Button onClick={() => navigate("/home")}>Back</Button>
      <form className="pt-8 space-y-4" onSubmit={handleAddNewProj}>
        <div>
          <label className="text-xl font-medium" htmlFor="projName">Project Name</label>
          <input
            className="w-full border-2 bg-gray-100 rounded-xl p-4 mt-1 focus:bg-transparent"
            placeholder="Enter your project name"
            type="text"
            required
            id="projName"
            ref={projNameInputRef}
          />
        </div>
        <div>
          <label className="text-xl font-medium" htmlFor="url">Project Url</label>
          <input
            className="w-full border-2 bg-gray-100 rounded-xl p-4 mt-1 focus:bg-transparent"
            placeholder="Enter your project url"
            type="url"
            required
            id="url"
            ref={urlInputRef}
          />
        </div>
        <div className="mt-8 flex flex-col">
          <Button>Add new project</Button>
        </div>
      </form>
    </Card>
  );
};

export default NewProjectForm;
