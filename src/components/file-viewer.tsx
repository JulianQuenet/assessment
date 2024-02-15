import { useState, useEffect, CSSProperties } from "react";
import TextField from "@mui/material/TextField";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { ListItemFile } from "./list-item-file";

interface FileViewerProps {
  directory: any;
}




export const FileViewer = (props: FileViewerProps) => {
  const { directory } = props;
  const SETTER_URL:String = "http://localhost:8080/setter"
  const GETTER_URL:String = "http://localhost:8080/files"
  const [list, setList] = useState<String[]>([]);
  const [files, setFiles] = useState<any[]>([])
  const [path, setPath] = useState<any>();

 useEffect(()=>{
  setList(directory)
 },[directory])

 useEffect(()=>{
    const getList = async () => {
        try {
          const res = await fetch(`${GETTER_URL}`);
          const data = await res.json();
          setFiles(data)
          if (!res) {
            throw new Error(`${res} returned null`);
          }
        } catch (error) {
          alert(error);
        }
      };
      getList();

      console.log(files[0])
 },[path])
 

  const fileContainerStyles: CSSProperties = {
    margin: "0 auto",
    width: "70vw",
  };
  const fileContainerStylesInner: CSSProperties = {
    margin: "0 auto",
    borderRadius: "10px",
    border: "0.5px solid #646cff",
    width: "70vw",
    overflowX: "hidden",
    overflowY: "auto",
    height: "65vh",

  };

 
  

  return (
    <div>
      <div id="file-container" style={fileContainerStyles}>
      <div id="inputs" style={{ display: "flex", alignItems: "center", justifyContent:"space-between", margin:"1px" }}>
          <div id="inputs-search" style={{ marginRight: "auto" }}>
            <TextField
              label="Find file in current directory"
              id="search-file"
              color="success"
              margin="normal"
            />
          </div>

          <div id="inputs-select" style={{margin:"1px 0"}}>
            <InputLabel id="demo-simple-select-label">Path</InputLabel>
            <Select native id="demo-simple-select">
            {list?.map((name:any, index ) => (
            <option key={name + index} value={name.path.replace(/\\/g, "\\\\")}>
              {name.path}
            </option>
          ))}
            </Select>
          </div>
        </div>
        <div id="file-container-inner" style={fileContainerStylesInner} >
        <div className="table-header">
        <div>
            Name
            </div>
            <div>
            Size
            </div>
            <div>
            Date modified
            </div>
        </div>    
        {
          files?.map((element:any, index)=>{
            return <ListItemFile key={index} name={element.name} size={element.size} path={element.path} date={element.lastModified} />
          }
          )
        }
        </div>
      </div>
    </div>
  );
};




// // String to send to the backend
// const stringToSend = "This is a sample string";

// // URL of your backend
// const backendUrl = 'http://your-backend-url.com/api/endpoint';

// // Options for the fetch request
// const requestOptions = {
//   method: 'POST', // HTTP POST method
//   headers: {
//     'Content-Type': 'text/plain' // Specify content type as plain text
//   },
//   body: stringToSend // Just send the string directly
// };

// // Send the POST request
// fetch(backendUrl, requestOptions)
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.text(); // Parse response text
//   })
//   .then(data => {
//     // Handle response data
//     console.log('Response from server:', data);
//   })
//   .catch(error => {
//     // Handle errors
//     console.error('There was a problem with the fetch operation:', error);
//   });

