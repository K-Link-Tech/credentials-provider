import React from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

interface DownloadButtonProps {
  jsonData: IEnvKeyValue[];
  fileName: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  jsonData,
  fileName,
}) => {

  
  const extractedJsonData = jsonData.map(o => ({
    key: o.key,
    value: o.value
  }));
  
  // const columnsToExtract: string[] = ["key", "value"];

  // const extractedJsonData = jsonData.map(o => {
  //   const obj: any = {};
  //   columnsToExtract.forEach(element => {
  //     obj[element] = o[element as keyof IEnvKeyValue]
  //   });
  //   return obj;
  // });

  const downloadJsonFile = () => {
    // Convert JSON to string
    const jsonString = JSON.stringify(extractedJsonData, null, 2);

    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    // Set the file name
    link.download = `${fileName}_environment.json`;

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger the click event to start the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };

  return (
    <DropdownMenuItem onClick={downloadJsonFile}>
      Download Environment JSON
    </DropdownMenuItem>
  );
};

export default DownloadButton;
