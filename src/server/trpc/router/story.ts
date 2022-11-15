import {z} from "zod";
import {router, publicProcedure, protectedProcedure} from "../trpc";


export const storyRouter = router({
    bySlug: publicProcedure.input(
        z.object({
            slug: z.string().min(1),
        }))
        .query(({ctx, input}) => {
            return ctx.prisma.story.findFirst({
                where: {textId: input.slug},
                include: {
                    championStories: {
                        include: {
                            champion: true,
                        }
                    },
                    file: true,
                }
            })
        }),
    getAll: publicProcedure.query(({ctx}) => {
        return ctx.prisma.story.findMany({
            orderBy: [
                {title: 'asc',},
                {textId: 'asc',}
            ],
            include: {
                championStories: {
                    include: {
                        champion: true,
                    }
                }
            }
        })
    }),
    getRandomWithLimit: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1),
            }))
        .query(async ({ctx, input}) => {
            const stories = await ctx.prisma.story.findMany({
                include: {
                    championStories: {
                        include: {
                            champion: true,
                        }
                    }
                }
            })
            const ret = [];
            let counter = 0;
            const randomCount = stories.length > 0 ? input.limit / stories.length : 0;
            for (const story of stories) {
                if (counter >= input.limit) {
                    break;
                }
                if (Math.random() <= randomCount) {
                    ret.push(story)
                    counter++;
                }
            }
            return ret;
        })
});