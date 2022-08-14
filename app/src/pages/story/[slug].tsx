import React from "react";
import Loading from "../../components/loading";
import ViewEntityBox from "../../components/view-entity-box";
import ViewAudioFile from "../../components/view-audio-file";
import {GetStaticPaths, GetStaticPropsContext, NextPage} from "next";
import {useRouter} from "next/router";
import {createSSGHelpers} from "@trpc/react/ssg";
import {appRouter} from "../../server/router";
import {createContext} from "../../server/router/context";
import superjson from "superjson";
import {prisma} from "../../server/db/client";
import {z} from "zod";
import {trpc} from "../../utils/trpc";

export const StoryPage: NextPage = () => {
    const grid_layout = 'h-auto grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 mx-3'
    const router = useRouter()
    let {slug} = router.query
    const slugValidator = z.string()
    slug = slugValidator.parse(slug)
    const {data: story, isLoading} = trpc.useQuery(['story.bySlug', {slug}]);

    if (isLoading || story == null) {
        return (<Loading/>)
    }
    console.log(story)
    return <>{slug}</>
}
export default StoryPage;

export async function getStaticProps(context: GetStaticPropsContext<{ slug: string }>,) {
    const ssg = createSSGHelpers({
        router: appRouter,
        ctx: await createContext(),
        transformer: superjson,
    });

    const slug = context.params?.slug as string;

    await ssg.fetchQuery('story.bySlug', {
        slug,
    });

    return {
        props: {
            trpcState: ssg.dehydrate(),
            slug,
        },
        revalidate: 1,
    };
}

export const getStaticPaths: GetStaticPaths = async () => {
    const stories = await prisma.story.findMany({select: {textId: true}});
    return {
        paths: stories.map((story) => ({
            params: {
                slug: story.textId,
            },
        })),
        // https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
        fallback: 'blocking',
    };
}

//
// class Slug extends React.Component {
//     state = {
//         story: null,
//         file: null,
//         relations: [],
//         loading: true,
//     }
//
//     componentDidMount() {
//         const text_id = this.props.match.params.text_id
//         new API().story(text_id).then((res) => {
//             let response = res.data.data
//             this.setState({
//                 story: response.story,
//                 relations: response.related_champions,
//                 file: response.file,
//                 loading: false
//             })
//         })
//     }
//
//     heading = (title) => {
//         return (<h1 className="pt-3 pl-5 text-2xl font-semibold text-white">{title}</h1>)
//     }
//     changeLink = (link) => {
//         this.setState({redirectTo: link})
//     }
//
//     render() {
//         if (this.state.loading) {
//             return (<Loading/>)
//         }
//         return (
//             <div className="bg-gray-800 pt-5 md:pt-2 min-h-screen h-full px-3">
//                 <div className={"pb-5 text-white content-center flex flex-col items-center"}>
//                     <article className="relative justify-center w-1/2 md:w-full lg:w-2/3">
//                         <h1 className="mb-4 text-2xl tracking-tight font-bold text-slate-200 text-center">
//                             {this.state.story.title}
//                         </h1>
//                         {this.state.file ? <ViewAudioFile story={this.state.story} champions={this.state.relations}
//                                                           file={this.state.file}/> : null}
//
//                         <div className="mb-6 prose text-gray-200 antialiased  tracking-wide prose-dark"
//                              dangerouslySetInnerHTML={{__html: this.state.story.html_story}}/>
//                     </article>
//                 </div>
//                 {this.heading("Related Champions")}
//                 <div className={this.state.grid_layout}>
//                     {this.state.relations.map((champion) => (
//                         <div key={champion.id} className={"mx-5"}>
//                             <ViewEntityBox
//                                 entity={{
//                                     image_url: champion.image_url,
//                                     name: champion.name,
//                                     title: champion.title,
//                                     link: "/champion/" + champion.slug
//                                 }}/>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         )
//     }
// }
//
// export default Slug;