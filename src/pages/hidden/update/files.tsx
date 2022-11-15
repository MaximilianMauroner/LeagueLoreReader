import {trpc} from "../../../utils/trpc";

export default function UpdateFiles() {
    const files = trpc.file.updateAll.useQuery();
    return <>
        <div className="pt-6 text-2xl text-blue-500 flex justify-center items-center w-full">
            {files.data ? <p>{"File Count: " + files.data.length}</p> : <p>Files Loading..</p>}
        </div>
    </>
}