import { useState, useEffect, CSSProperties, FormEvent } from "react";
import TextField from "@mui/material/TextField";
import { Select, SelectChangeEvent, IconButton } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { ListItemFile } from "./list-item-file";
import Fuse from "fuse.js";

//---------------------------Interfaces, CSS objects && arrays--------------------------------------------------
interface FileViewerProps {
  directory: any;
  firstLoadFiles: any;
}

const fileContainerStyles: CSSProperties = {
  margin: "0 auto",
  width: "70vw",
};

const selectInputsStyles:CSSProperties={
  margin: "1px 0",
  display: "flex",
  alignItems: "center",
  gap: "10px",
}

const fileContainerDivStyle:CSSProperties={
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "1px",
}

const fileContainerStylesInner: CSSProperties = {
  margin: "0 auto",
  borderRadius: "10px",
  border: "0.5px solid #646cff",
  width: "70vw",
  overflowX: "hidden",
  overflowY: "auto",
  height: "65vh",
};


const SORTING__OPTIONS: string[] = [
  "Sort by",
  "A-Z",
  "Z-A",
  "Newest",
  "Oldest",
  "Biggest",
  "Smallest"
];




//------------------------End of interfaces and CSS objects-------------------------------------------------

export const FileViewer = (props: FileViewerProps) => {
  const { directory, firstLoadFiles } = props;
  const SETTER_URL: any = "http://localhost:8080/setter";
  const GETTER_URL: String = "http://localhost:8080/files";
  const [list, setList] = useState<any>([]);
  const [files, setFiles] = useState<any>([]);
  const [filesArchive, setFilesArchive] = useState<any>([]);
  const [path, setPath] = useState<string>("");
  const [paths, setPaths] = useState<any>([]);

  const fuse = new Fuse(filesArchive, {
    minMatchCharLength: 1,
    threshold: 0.15,
    keys: ["name", "size", "lastModified", "path"],
  });

  //----------------------------------React effects-------------------------------------------------------------
  useEffect(() => {
    if (directory) {
      const root = directory[0];
      setList(directory);
      setFiles(firstLoadFiles);
      setFilesArchive(firstLoadFiles);
      if (paths.length < 1) {
        updatePaths(root);
      }
    }
  }, [directory, firstLoadFiles]);

  useEffect(() => {
    if (path) {
      const getList = async () => {
        try {
          const res = await fetch(`${GETTER_URL}`);
          const data = await res.json();
          setList(data);
          setFiles(data);
          setFilesArchive(data);
        } catch (error) {
          console.error(
            `${error}, logged from the getter function in the file-viewer component`
          );
        }
      };
      getList();
    }
  }, [path]);

  //---------------------------End of react effects--------------------------------------------------------

  //----------------------------Functions and event listeners-----------------------------------------------

  function updatePaths(param: String) {
    setPaths((items: any) => [...items, param]);
  }

  /**
   * Accepts a param and creates a post request which inturn populates the GETTER_URL with the relevant files
   * All request "paths" are only able to come from existing paths already retrieved form the backend, no unreachable
   * paths are able to make it through, though some paths to lead to an empty folder/file as
   */
  const handleRedirect = (param: any) => {
    const redirection = param;
    setPath(redirection);
    updatePaths(redirection);
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: redirection,
    };
    try {
      fetch(SETTER_URL, request)
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          console.log("Response from server:", data);
        });
    } catch (error) {
      alert(error);
    }
  };

  const handleChange = (Event: SelectChangeEvent) => {
    handleRedirect(Event.target.value);
  };

  const handleClick = (Event: any) => {
    if (Event?.target) {
      const path = Event.currentTarget.id;
      handleRedirect(path);
    }
  };

  //Works the same as the handleRedirect function just as a few more conditional but basically looks at the array of paths and redirects to the prev one
  const handlePrev = () => {
    //Would've used the handleRedirect function but both these function need to manipulate the array differently
    const items = paths.slice(0, -1);
    let redirection = items[items.length - 1].path;
    if (items[items.length - 1].path) {
      redirection = items[items.length - 1].path;
    } else {
      redirection = items[items.length - 1];
    }
    setPaths(items);
    setPath(redirection);
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: redirection,
    };
    try {
      fetch(SETTER_URL, request)
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          console.log("Response from server:", data);
        });
    } catch (error) {
      alert(error);
    }
  };

  const handleRefresh = () => {
    if (directory) {
      const redirection = directory[0].path;
      handleRedirect(redirection);
    }
  };

  const searchHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget["search-file"].value) {
      const searchedRequest = e.currentTarget["search-file"].value;
      if (searchedRequest != "") {
        const results = fuse.search(searchedRequest);
        const mappedResult = results.map((item: any) => item.item);
        setFiles(mappedResult);
        e.currentTarget.reset();
      }
    }
  };

  window.addEventListener("beforeunload", handleRefresh);



  const handleSortBy = (e: SelectChangeEvent) => {
    const valueSelect = e.target.value;
    let sortedResult: any[] = [];
    switch (valueSelect) {
      case "A-Z":
        sortedResult = [...files].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );
        break;
      case "Z-A":
        sortedResult = [...files].sort((a, b) =>
          b.name.localeCompare(a.name, undefined, { sensitivity: "base" })
        );
        break;
      case "Newest":
        sortedResult = [...files].sort(
          (a, b) =>
            new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
        );
        break;
      case "Oldest":
        sortedResult = [...files].sort(
          (a, b) =>
            new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
        );  
        break;
        case "Biggest":
          sortedResult = [...files].sort(
            (a, b) =>
            b.size - a.size
          );
          break;
        case "Smallest":
          sortedResult = [...files].sort(
            (a, b) =>
              a.size - b.size
          );  
          break;  
        
      default:
        sortedResult = files;
    }
    setFiles(sortedResult);
  };



  //-------------------------End of functions and event listeners--------------------------------------------------

  return (
    <div>
      <div id="file-container" style={fileContainerStyles}>
        <div
          id="inputs"
          style={fileContainerDivStyle}
        >
          <div id="inputs-search" style={{ marginRight: "auto" }}>
            <form
              style={{ display: "flex", alignItems: "center" }}
              onSubmit={searchHandler}
              id="search"
            >
              <TextField
                label="Find file in current directory"
                id="search-file"
                color="success"
                margin="normal"
              />
            </form>
          </div>

          <div
            id="inputs-select"
            style={selectInputsStyles}
          >
            {paths.length > 1 && (
              <IconButton color="primary" onClick={handlePrev}>
                <KeyboardBackspaceIcon fontSize="small" />
              </IconButton>
            )}

            <Select
              native
              id="path-select"
              onChange={handleChange}
              value="1"
            >
              {path && <option>{path}</option>}
              {list?.map((name: any, index: any) => (
                <option key={name + index} value={name.path}>
                  {name.path}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div id="file-container-inner" style={fileContainerStylesInner}>
          <div className="table-header">
            <div>Name</div>
            <div>Size</div>
            <div>Type</div>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            Date modified
             <Select
              native
              id="sort-select"
              onChange={handleSortBy}
              value="1"
              color="success"
            >
              {SORTING__OPTIONS?.map((item: string, index: number) => (
                <option key={index} value={item}>
                {item}
              </option>
              ))}
            </Select>
            </div>
            
           
          </div>
          {files?.map((element: any, index: number) => {
            return (
              <ListItemFile
                id={element.path}
                onClick={handleClick}
                key={index}
                name={element.name}
                size={element.size}
                date={element.lastModified}
                type={element.type}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
