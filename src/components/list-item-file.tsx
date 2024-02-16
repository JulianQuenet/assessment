
interface ListItemFileProps {
    name : string,
    size : any,
    date : any,
    id : string,
    onClick : (Event:any)=>void
}



export const ListItemFile = (props:ListItemFileProps)=>{
   const {name, size, date, id, onClick }=props
   
   const getAddedTime = (dateString:string|Date) =>{
 
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
            <div  className="date">
            {getAddedTime(date)}
            </div>
         </div>
        </>
    )
}