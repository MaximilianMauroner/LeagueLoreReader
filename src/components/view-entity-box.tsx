import Link from "next/link";
import React from "react";
import Image from "next/image";

type EntityBox = {
  name?: string;
  title: string;
  link: string;
  imageUrl: string;
  priority?: boolean;
};
const ViewEntityBox = ({ entity }: { entity: EntityBox }) => {
  const prio = entity.priority ?? false;
  return (
    <Link href={entity.link}>
      <div className="mx-auto grid max-w-4xl grid-cols-1 px-1 py-3 duration-300 ease-in-out hover:-translate-y-3 hover:scale-105 md:px-4 md:py-6">
        <div className="from-black-75 via-black-0 relative z-10 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t p-3 ">
          {entity.name && (
            <p className="text-sm font-medium leading-4 text-white">
              {entity.title}
            </p>
          )}
          <h1 className="mt-1 text-lg font-semibold text-white">
            {entity.name ? entity.name : entity.title}
          </h1>
        </div>
        <div className="col-start-1 col-end-3 row-start-1 grid gap-4">
          <div className={"relative h-72 "}>
            <Image
              fill
              placeholder="blur"
              blurDataURL={entity.imageUrl}
              src={entity.imageUrl}
              className={"rounded-lg object-cover object-top"}
              alt={entity.name ? entity.name : entity.title}
              priority={prio}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ViewEntitySkeleton = () => {
  return (
    <>
      <div className="mx-auto grid max-w-4xl animate-pulse grid-cols-1 px-1 py-3 duration-300 ease-in-out hover:-translate-y-3 hover:scale-105 md:px-4 md:py-6">
        <div className="from-black-75 via-black-0 relative z-10 col-start-1 row-start-1 flex flex-col-reverse rounded-lg bg-gradient-to-t p-3 ">
          <div className="mt-2 h-2 max-w-[60px] rounded-full bg-gray-200 dark:bg-gray-100"></div>
          <div className="h-3 max-w-[80px] rounded-full bg-gray-200 dark:bg-gray-100"></div>
        </div>
        <div className="col-start-1 col-end-3 row-start-1 grid gap-4">
          <div className={"relative h-72 w-full rounded-lg bg-gray-700"}>
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-300 p-4 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewEntityBox;
