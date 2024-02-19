
interface ListItemFileProps {
    name : string,
    size : any,
    date : any,
    id : string,
    type: string,
    onClick : (Event:any)=>void
}


//Gets the mapped props and creates a wrapper for them 
export const ListItemFile = (props:ListItemFileProps)=>{
   const {name, size, date, id, onClick, type }=props
   
   const getAddedTime = (dateString:string|Date) =>{//Gets the epoch time and formats it 
 
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric" });
  
    return `${year} ${month}(${date.getDate()}) ${time}`;
  }

  

    return (
        <>
         <div id={id} className="wrapper" onClick={onClick}>
            <div className="name">
            {name}  
            </div>
            <div  className="size">
            {`${size} KB`}
            </div>
            <div>
                {type}
            </div>
            <div  className="date">
            {getAddedTime(date)}
            </div>
            
         </div>
        </>
    )
}