import {Link, Redirect} from "react-router-dom";
import {useState} from "react";

function ViewEntityBox({entity}) {
    const [redirect, setRedirect] = useState(false);

    if (redirect === true) {
        return (<Redirect to={entity.link}/>)
    }
    return (
        <Link to={entity.link}>
            <div onClick={() => setRedirect(true)} className="py-6 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-1 hover:-translate-y-3 hover:scale-110 ease-in-out duration-300">
                    <div className="relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black/75 via-black/0 ">
                        {entity.name ? <p className="text-sm leading-4 font-medium text-white">{entity.title}</p> : null}
                        <h1 className="mt-1 text-lg font-semibold text-white">{entity.name ? entity.name : entity.title}</h1>
                    </div>
                    <div className="grid gap-4 col-start-1 col-end-3 row-start-1 ">
                        <img src={entity.image_url} alt="" className="w-full h-60 object-cover rounded-lg" loading="lazy"/>
                    </div>
                </div>
            </div>
        </Link>
    )

}

export default ViewEntityBox;