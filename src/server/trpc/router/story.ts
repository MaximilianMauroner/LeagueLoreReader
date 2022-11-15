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
    })
});