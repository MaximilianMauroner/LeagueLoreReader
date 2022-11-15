import React from "react";
import Loading from "../../components/loading";
import ViewEntityBox from "../../components/view-entity-box";
import {GetStaticPaths, GetStaticPropsContext, NextPage} from "next";
import {useRouter} from "next/router";
import {Champion, Faction} from "@prisma/client";
import {appRouter} from "../../server/trpc/router/_app";
import {createSessionlessContext} from "../../server/trpc/context";
import superjson from "superjson";
import {prisma} from "../../server/db/client";
import {z} from "zod";
import {trpc} from "../../utils/trpc";
import Heading from "../../components/heading";
import Image from "next/image";
import Navigation from "../../components/navigation";
import {env} from "../../env/server.mjs";
import Head from "next/head";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";

export const FactionPage: NextPage = () => {
    const grid_layout = 'h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 sm:mx-3 mx-1'
    const router = useRouter()
    let {slug} = router.query
    const slugValidator = z.string()
    slug = slugValidator.parse(slug)
    const {data: faction, isLoading} = trpc.faction.bySlug.useQuery({slug});

    if (isLoading || faction == null) {
        return (<Loading/>)
    }
    return <>
        <Head>
            <title>{faction.title}</title>
            <meta name="description"
                  content={faction.description}/>
        </Head>
        <Navigation/>
        <div className="bg-gray-800 pt-5 md:pt-2 min-h-screen h-full px-3">
            <DisplayFaction faction={faction}/>
            <Heading title={"Champions"}/>
            <div className={grid_layout}>
                {faction.champions.map((champion) => (
                    <div key={champion.id} className={"md:mx-5 sm:mx-3 mx-1"}>
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
}

export const DisplayFaction: React.FC<{ faction: Faction & { champions: Champion[] } }> = ({faction}) => {
    const description = faction.description;
    return (
        <div className="container mx-auto py-9 md:py-2">
            <div className="flex items-strech justify-center flex-col ">
                <div className="flex flex-col items-strech justify-between py-3 px-1 md:py-6 md:px-6">
                    <h1 className={"text-center pt-3 text-4xl text-white"}>{faction.title}</h1>
                    <h3 className={"text-center pb-3 text-xl text-white"}><span
                        className={"font-bold text-3xl"}>{faction?.champions.length}</span>&nbsp;Champions are part of
                        this Faction</h3>
                    <div className={"relative h-96"}>
                        <Image
                            fill
                            src={faction.imageUrl}
                            className={"sm:object-contain object-cover rounded-xl"}
                            alt={faction.title}
                            priority={true}
                        />
                    </div>
                    <span className={"dark:text-white text-gray-700 py-3 "}
                          dangerouslySetInnerHTML={{__html: description}}/>
                </div>
            </div>
        </div>
    )
}
export default FactionPage;

export async function getStaticProps(context: GetStaticPropsContext<{ slug: string }>) {
    const ssg = await createProxySSGHelpers({
        router: appRouter,
        ctx: await createSessionlessContext(),
        transformer: superjson
    });

    const slug = context.params?.slug as string;

    ssg.faction.bySlug.prefetch({slug});

    return {
        props: {
            trpcState: ssg.dehydrate(),
            slug,
        },
        revalidate: Number.parseInt(env.REVALIDATE_TIME_SECONDS),
    };
}

export const getStaticPaths: GetStaticPaths = async () => {
    const factions = await prisma.faction.findMany({select: {slug: true}});
    return {
        paths: factions.map((faction) => ({
            params: {
                slug: faction.slug,
            },
        })),
        // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
        fallback: 'blocking',
    };
}