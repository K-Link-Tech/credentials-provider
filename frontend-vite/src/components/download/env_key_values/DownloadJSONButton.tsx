import { DropdownMenuItem } from "../../ui/dropdown-menu";

interface DownloadButtonProps<T extends object, K extends keyof T, J extends keyof T> {
  data: T[];
  fileName: string;
  property1: K;
  property2: J;
}

export function DownloadButton<T extends object, K extends keyof T, J extends keyof T> ({
  data,
  fileName,
  property1,
  property2,
}: DownloadButtonProps<T,K, J>) {

  const extractedJsonData = data.map(o => {
    const p1 = o[property1] as string;
    const p2 = o[property2] as string;
    return ({
      [property1]: p1.toUpperCase().replace(" ", "_"),
      [property2]: p2,
    });
  })
  // const extractedJsonData2 = data.map(o => `${o.key.toUpperCase().replace(" ", "_")}=${o.value} \n`);
  

  const downloadJsonFile = () => {
    // Convert JSON to string
    const jsonString = JSON.stringify(extractedJsonData, null, 2);

    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    // Set the file name
    link.download = `${fileName.replace(" ","_")}_environment.json`;

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger the click event to start the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };

  return (
    <DropdownMenuItem onClick={downloadJsonFile}>
      Download Env Key Values JSON file
    </DropdownMenuItem>
  );
};

export default DownloadButton;
