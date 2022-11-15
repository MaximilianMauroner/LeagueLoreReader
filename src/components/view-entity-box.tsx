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
        <Link href={entity.link} prefetch={false}>
            <div
                className="py-6 px-4 max-w-4xl mx-auto grid grid-cols-1 hover:-translate-y-3 hover:scale-105 ease-in-out duration-300">
                <div
                    className="z-10 relative p-3 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t from-black-75 via-black-0 ">
                    {entity.name ?
                        <p className="text-sm leading-4 font-medium text-white">{entity.title}</p> : null}
                    <h1 className="mt-1 text-lg font-semibold text-white">{entity.name ? entity.name : entity.title}</h1>
                </div>
                <div className="grid gap-4 col-start-1 col-end-3 row-start-1">
                    <div className={"relative h-72 "}>
                        <Image
                            fill
                            src={entity.imageUrl}
                            className={"rounded-lg object-cover object-top"}
                            alt={entity.name ? entity.name : entity.title}/>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ViewEntityBox;