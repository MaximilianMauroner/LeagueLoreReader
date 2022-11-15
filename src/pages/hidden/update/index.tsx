import {trpc} from "../../../utils/trpc";

export default function UpdateStats() {
    const faction = trpc.faction.updateAll.useQuery();
    const champions = trpc.champion.updateAll.useQuery();
    const files = trpc.file.updateAll.useQuery();
    return <>
        <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
            {faction.data ? <p>{"Faction Count: " + faction.data.length}</p> : <p>Faction Loading..</p>}
        </div>
        <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
            {champions.data ? <p>{"Champion Count: " + champions.data.length}</p> : <p>Champion & Story Loading..</p>}
        </div>
        <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
            {files.data ? <p>{"File Count: " + files.data.length}</p> : <p>Files Loading..</p>}
        </div>
    </>
}