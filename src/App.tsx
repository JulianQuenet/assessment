import { useState, useEffect } from "react";
import { FileViewer } from "./components/file-viewer";

function App() {
  const [directory, setDirectory] = useState<any[]>();
  const [files, setFiles] = useState<any[]>();

  const DIRECTORY_URL: String = "http://localhost:8080/directory";
  const GETTER_URL: String = "http://localhost:8080/files";


  const getFiles = async () => {
    try {
      const res = await fetch(`${GETTER_URL}`);
      const data = await res.json();
      setFiles(data);
    } catch (error) {
      alert(error);
    }
  };

  const getDirectory = async () => {
    try {
      const res = await fetch(`${DIRECTORY_URL}`);
      const data = await res.json();
      setDirectory(data);
    } catch (error) {
      alert(
        `${error}, logged from the getter function in the main app component`
      );
    }
  };

  useEffect(() => {
    getDirectory();
    getFiles();
  }, []);

 

  return (
    <>
      <h1>File/folder Viewer</h1>
      <FileViewer directory={directory} firstLoadFiles={files} />
    </>
  );
}

export default App;
