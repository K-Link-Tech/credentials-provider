import Card from "../cards/NewEnvironmentCard";
import React from "react";
import { Button } from "../ui/button";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

interface NewEnvKeyValueFormProps {
  onAddEnvKeyValue: Function;
}

const NewEnvKeyValueForm: React.FC<NewEnvKeyValueFormProps> = ({ onAddEnvKeyValue }) => {
  const envKeyValue_KeyInputRef: React.RefObject<HTMLInputElement> = React.createRef();
  const envKeyValue_ValueInputRef: React.RefObject<HTMLInputElement> = React.createRef();
  const { environmentId } = useParams();
  console.log("EnvironmentID: ", environmentId);

  const navigate = useNavigate();

  const handleAddNewEnvironment: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredEnvironmentKey = envKeyValue_KeyInputRef.current?.value;
    const enteredEnvironmentValue = envKeyValue_ValueInputRef.current?.value;

    const envKeyValuePayload = {
      key: enteredEnvironmentKey,
      value: enteredEnvironmentValue,
      encryption_method: "aes-256",
      environment_id: environmentId,
    };
    console.log("environment: ", envKeyValuePayload);
    onAddEnvKeyValue(envKeyValuePayload);
  };

  return (
    <Card>
      <Button onClick={() => navigate(`/home/env/${environmentId}`)}>Back</Button>
      <form className="pt-8 space-y-4" onSubmit={handleAddNewEnvironment}>
        <div>
          <label className="text-xl font-medium" htmlFor="key">Key</label>
          <input
            className="w-full border-2 bg-gray-100 rounded-xl p-4 mt-1 focus:bg-transparent"
            placeholder="Enter your environment key"
            type="text"
            required
            id="key"
            ref={envKeyValue_KeyInputRef}
          />
        </div>
        <div>
          <label className="text-xl font-medium" htmlFor="value">Value</label>
          <input
            className="w-full border-2 bg-gray-100 rounded-xl p-4 mt-1 focus:bg-transparent"
            placeholder="Enter your environment value"
            type="text"
            required
            id="value"
            ref={envKeyValue_ValueInputRef}
          />
        </div>
        <div className="mt-8 flex flex-col">
          <Button>Add new env key value pair</Button>
        </div>
      </form>
    </Card>
  );
};

export default NewEnvKeyValueForm;
