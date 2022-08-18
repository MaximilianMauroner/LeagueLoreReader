import Link from "next/link";
import {z} from "zod";
import React from "react";
import Image from "next/image";

const entityValidator = z.object({
    name: z.string().optional(),
    title: z.string(),
    link: z.string(),
    imageUrl: z.string()
})
const ViewEntityBox: React.FC<{ entity: z.infer<typeof entityValidator> }> = ({entity}) => {
    return (
        <Link href={entity.link} passHref={true}>
            <a>
                <div
                    className="py-6 px-4 max-w-4xl mx-auto grid grid-cols-1 hover:-translate-y-3 hover:scale-110 ease-in-out duration-300">
                    <div
                        className="z-10 relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black-75 via-black-0 ">
                        {entity.name ?
                            <p className="text-sm leading-4 font-medium text-white">{entity.title}</p> : null}
                        <h1 className="mt-1 text-lg font-semibold text-white">{entity.name ? entity.name : entity.title}</h1>
                    </div>
                    <div className="grid gap-4 col-start-1 col-end-3 row-start-1">
                        <div>
                            <Image
                                src={entity.imageUrl}
                                layout="responsive"
                                width={500}
                                height={300}
                                className={"object-top object-cover rounded-lg"}
                                alt={entity.name}/>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    )
}

export default ViewEntityBox;