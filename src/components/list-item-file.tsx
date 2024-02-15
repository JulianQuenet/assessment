import { CSSProperties } from "react"


interface ListItemFileProps {
    name : String,
    size : Number,
    date : any,
    path : any,
}

export const ListItemFile = (props:ListItemFileProps)=>{
   const {name, size, date, path }=props
   
    return (
        <>
         <div id={path} className="wrapper">
            <div className="name">
            {name}  
            </div>
            <div  className="size">
            {size.toString()}
            </div>
            <div  className="date">
            {date}
            </div>
         </div>
        </>
    )
}