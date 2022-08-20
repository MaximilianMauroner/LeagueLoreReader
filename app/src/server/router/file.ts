import {createRouter} from "./context";
import {env} from "../../env/server.mjs";

export const fileRouter = createRouter()
    .query("updateAll", {
        async resolve({ctx}) {
            const fs = require('fs');
            const path = env.NODE_ENV === "development" ? env.DEV_FILE_PATH : env.PROD_FILE_PATH
            fs.readdir(path, async (err: any, files: any[]) => {
                for (const file of files) {
                    const story = await ctx.prisma.story.findFirst({
                        select: {id: true},
                        where: {textId: file.split(".mp3")[0]}
                    })
                    if (story) {
                        await ctx.prisma.file.upsert({
                                where: {storyId: story.id},
                                update: {
                                    fileName: file,
                                    savePath: path + file,
                                    storyId: story.id
                                },
                                create: {
                                    fileName: file,
                                    savePath: path + file,
                                    storyId: story.id
                                }
                            }
                        )
                    }
                }
            });
            return await ctx.prisma.file.findMany({})
        },
    })