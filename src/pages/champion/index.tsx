import ViewEntityBox from "../../components/view-entity-box";
import React from "react";
import {createSessionlessContext} from "../../server/trpc/context";
import Navigation from "../../components/navigation";
import {env} from "../../env/server.mjs";
import Head from "next/head";
import {createProxySSGHelpers} from '@trpc/react-query/ssg';
import type {NextPage} from 'next';
import {appRouter} from '../../server/trpc/router/_app';
import superjson from 'superjson';
import {trpc} from '../../utils/trpc';

const AllChampions: NextPage = () => {
    const grid_layout = 'h-auto grid md:grid-cols-2 xl:grid-cols-4 grid-cols-1 sm:mx-3 mx-1'
    const {data: champions} = trpc.champion.getAll.useQuery();
    return (
        <>
            <Head>
                <title>All Champions</title>
                <meta name="description"
                      content="List all Champions"/>
            </Head>
            <Navigation/>
            <div className="bg-gray-800 pt-5 md:pt-2 min-h-screen h-full px-1 sm:px-3">
                <div className={grid_layout}>
                    {champions?.map((champion) => (
                        <div key={champion.id} className={"mx-1 md:mx-5 sm:mx-3"}>
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
    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: await createSessionlessContext(),
        transformer: superjson
    });

    await ssg.champion.getAll.prefetch();

    return {
        props: {
            trpcState: ssg.dehydrate(),
        },
        revalidate: Number.parseInt(env.REVALIDATE_TIME_SECONDS),
    };
}