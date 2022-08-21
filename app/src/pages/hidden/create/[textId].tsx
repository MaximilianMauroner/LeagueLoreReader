import {trpc} from "../../../utils/trpc";
import ViewEntityBox from "../../../components/view-entity-box";
import {useRouter} from "next/router";
import Loading from "../../../components/loading";
import {z} from "zod";
import {GetServerSidePropsContext, NextPage} from "next";
import {createSSGHelpers} from "@trpc/react/ssg";
import {appRouter} from "../../../server/router";
import {createContext} from "../../../server/router/context";
import superjson from "superjson";

export const CreateStory: NextPage = () => {
    const router = useRouter()
    let {textId} = router.query
    if (textId == undefined) {
        return <Loading/>
    }
    const slugValidator = z.string()
    textId = slugValidator.parse(textId)

    const {data: story, isLoading} = trpc.useQuery(["file.create", {textId: textId}]);
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

export async function getServerSideProps(
    context: GetServerSidePropsContext<{ textId: string }>,
) {
    const ssg = createSSGHelpers({
        router: appRouter,
        ctx: await createContext(),
        transformer: superjson
    });
    const textId = context.params?.textId as string;

    await ssg.prefetchQuery('file.create', {
        textId,
    });

    return {
        props: {
            trpcState: ssg.dehydrate(),
            textId,
        },
    };
}
