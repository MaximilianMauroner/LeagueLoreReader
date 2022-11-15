import {trpc} from "../../../utils/trpc";
import ViewEntityBox from "../../../components/view-entity-box";
import {useRouter} from "next/router";
import Loading from "../../../components/loading";
import {z} from "zod";
import {GetServerSidePropsContext, NextPage} from "next";
import {appRouter} from "../../../server/trpc/router/_app";
import {createContext, createSessionlessContext} from "../../../server/trpc/context";
import superjson from "superjson";
import {createProxySSGHelpers} from "@trpc/react-query/ssg";

export const CreateStory: NextPage = () => {
    const router = useRouter()
    let {textId} = router.query
    if (textId == undefined) {
        return <Loading/>
    }
    const slugValidator = z.string()
    textId = slugValidator.parse(textId)

    const {data: story, isLoading} = trpc.file.create.useQuery({textId: textId});
    if (isLoading || story == undefined) {
        return <Loading/>
    }
    return <>
        <ViewEntityBox entity={{
            imageUrl: story.imageUrl,
            name: story.title,
            title: story.championStories.map((es) => es.champion.name).join(", "),
            link: "/story/" + story.textId
        }}/>
    </>
}
export default CreateStory
