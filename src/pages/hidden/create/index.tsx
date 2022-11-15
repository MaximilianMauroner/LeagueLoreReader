import {trpc} from "../../../utils/trpc";
import Loading from "../../../components/loading";
import {GetServerSidePropsContext, NextPage} from "next";
import {appRouter} from "../../../server/trpc/router/_app";
import {createContext} from "../../../server/trpc/context";
import superjson from "superjson";
import ViewAudioFile from "../../../components/view-audio-file";
import React from "react";

export const CreateRandomStory: NextPage = () => {

    const {data: story, isLoading} = trpc.file.createRandom.useQuery();
    if (isLoading || story == undefined) {
        return <Loading/>
    }
    return <>
        <div className="bg-gray-800 md:pt-5 pt-2 min-h-screen h-full px-3">
            <div className={"pb-5 text-white content-center flex flex-col items-center"}>
                <article className="relative justify-center xl:w-2/3 w-full lg:w-3/4">
                    <h1 className="mb-4 text-2xl tracking-tight font-bold text-slate-200 text-center">
                        {story.title}
                    </h1>
                    {story?.file ? <ViewAudioFile story={story} champions={story.championStories.map(cs => cs.champion)}
                                                  file={story.file}/> : null}

                    <div className="mb-6 prose text-gray-200 antialiased  tracking-wide prose-dark"
                         dangerouslySetInnerHTML={{__html: story.htmlStory}}/>
                </article>
            </div>
        </div>
    </>
}
export default CreateRandomStory