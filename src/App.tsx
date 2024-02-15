import { useState, useEffect } from 'react'
import { FileViewer } from './components/file-viewer'

function App() {
  const [directory, setDirectory] = useState<any[]>()

  const URL:String = "http://localhost:8080/directory"

  useEffect(() => {
    const getList = async () => {
      try {
        const res = await fetch(`${URL}`);
        const data = await res.json();
        setDirectory(data);
        if (!res) {
          throw new Error(`${res} returned null`);
        }
      } catch (error) {
        alert(error);
      }
    };
    getList();
  }, []);


  // if(directory?.length){
  //   console.log(directory)
  // }

  return (
    <>
      <h1>File Viewer</h1>
      <FileViewer directory={directory}/>
      
    </>
  )
}

export default App
