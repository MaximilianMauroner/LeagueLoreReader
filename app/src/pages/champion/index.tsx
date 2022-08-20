import {NextPage} from "next";
import {trpc} from "../../utils/trpc";
import ViewEntityBox from "../../components/view-entity-box";
import React from "react";
import {createSSGHelpers} from "@trpc/react/ssg";
import {appRouter} from "../../server/router";
import {createContext} from "../../server/router/context";
import superjson from "superjson";
import Navigation from "../../components/navigation";


const AllChampions: NextPage = () => {
    const grid_layout = 'h-auto grid md:grid-cols-2 xl:grid-cols-4 grid-cols-1 mx-3'
    const {data: champions, isLoading} = trpc.useQuery(['champion.getAll']);
    return (
        <>
            <Navigation/>
            <div className="bg-gray-800 pt-5 md:pt-2 min-h-screen h-full px-3">
                <div className={grid_layout}>
                    {champions?.map((champion) => (
                        <div key={champion.id} className={"mx-5"}>
                            <ViewEntityBox
                                entity={{
                                    imageUrl: champion.imageUrl,
                                    name: champion.name,
                                    title: champion.title!,
                                    link: "/champion/" + champion.slug
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default AllChampions;


export async function getStaticProps() {
    const ssg = createSSGHelpers({
        router: appRouter,
        ctx: await createContext(),
        transformer: superjson, // optional - adds superjson serialization
    });

    await ssg.fetchQuery('champion.getAll');

    return {
        props: {
            trpcState: ssg.dehydrate(),
        },
        revalidate: 1,
    };
}