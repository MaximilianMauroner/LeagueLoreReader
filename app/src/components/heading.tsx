import React from "react";

const Heading: React.FC<{ title: string }> = ({title}) => {
    return (<h1 className="pt-3 pl-5 text-2xl font-semibold text-white">{title}</h1>)
}
export default Heading;