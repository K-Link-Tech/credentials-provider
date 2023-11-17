import Card from "../cards/NewEnvironmentCard";
import React from "react";
import { Button } from "../ui/button";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

interface NewEnvironmentFormProps {
  onAddEnvironment: Function;
}

const NewEnvironmentForm: React.FC<NewEnvironmentFormProps> = ({ onAddEnvironment }) => {
  const environmentNameInputRef: React.RefObject<HTMLInputElement> = React.createRef();
  const { projId } = useParams();
  console.log("ProjID: ", projId);

  const navigate = useNavigate();

  const handleAddNewEnvironment: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredEnvironmentName = environmentNameInputRef.current?.value;

    const environmentPayload = {
      name: enteredEnvironmentName,
      project_id: projId,
    };
    console.log("environment: ", environmentPayload);
    onAddEnvironment(environmentPayload);
  };

  return (
    <Card>
      <Button onClick={() => navigate(`/home/proj/${projId}`)}>Back</Button>
      <form className="pt-8 space-y-4" onSubmit={handleAddNewEnvironment}>
        <div>
          <label className="text-xl font-medium" htmlFor="environmentName">Environment Name</label>
          <input
            className="w-full border-2 bg-gray-100 rounded-xl p-4 mt-1 focus:bg-transparent"
            placeholder="Enter your environment name"
            type="text"
            required
            id="environmentName"
            ref={environmentNameInputRef}
          />
        </div>
        <div className="mt-8 flex flex-col">
          <Button>Add new environment</Button>
        </div>
      </form>
    </Card>
  );
};

export default NewEnvironmentForm;
