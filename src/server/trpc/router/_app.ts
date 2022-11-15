import {router} from "../trpc";
import {factionRouter} from "./faction";
import {championRouter} from "./champion";
import {storyRouter} from "./story";
import {fileRouter} from "./file";

export const appRouter = router({
  champion: championRouter,
  story: storyRouter,
  file: fileRouter,
  faction: factionRouter,
});


// export type definition of API
export type AppRouter = typeof appRouter;
