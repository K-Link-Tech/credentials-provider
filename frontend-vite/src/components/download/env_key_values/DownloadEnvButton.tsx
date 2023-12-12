import { DropdownMenuItem } from "../../ui/dropdown-menu";

interface DownloadEnvButtonProps<T extends object, K extends keyof T, J extends keyof T> {
  data: T[];
  fileName: string;
  property1: K;
  property2: J;
}

export function DownloadEnvButton<T extends object, K extends keyof T, J extends keyof T> ({
  data,
  fileName,
  property1,
  property2,
}: DownloadEnvButtonProps<T,K, J>) {
    const formattedData = data.map(o => {
    const p1 = o[property1] as string;
    const p2 = o[property2] as string;
    return `${p1.toUpperCase().replace(" ", "_")}=${p2} \n`;
  })

  const downloadEnvFile = () => {
    // Create a file from the formattedData string
    const blob = new File(formattedData, `.env.${fileName.replace(" ", "_")}`);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    // Set the file name
    link.download = `.env.${fileName.replace(" ","_")}`;

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger the click event to start the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };

  return (
    <DropdownMenuItem onClick={downloadEnvFile}>
      Download Env Key Values .Env file
    </DropdownMenuItem>
  );
};

export default DownloadEnvButton;
