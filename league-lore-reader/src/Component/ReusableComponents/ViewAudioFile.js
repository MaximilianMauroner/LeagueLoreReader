import {Fragment} from 'react'
import {Menu, Transition} from '@headlessui/react'
import {ChevronDownIcon} from '@heroicons/react/solid'
import useAudioPlayer from "../Helpers/useAudioPlayer";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import {Replay30, Forward30, PlayCircleFilledWhite, PauseCircleOutlineTwoTone, SkipPrevious, SkipNext} from '@mui/icons-material/';
import {Link} from "react-router-dom";

const ViewAudioFile = ({story, champions, file}) => {

    const {curTime, duration, playing, playbackspeed, setPlaying, setClickedTime, setPlaybackspeed} = useAudioPlayer();
    const availableSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3]

    function formatDuration(duration) {
        return moment.duration(duration, "seconds").format("mm:ss", {trim: false});
    }

    function skip() {
        curTime + 15 < duration ? setClickedTime(curTime + 15) : setClickedTime(duration)
    }

    function rewind() {
        curTime > 15 ? setClickedTime(curTime - 15) : setClickedTime(0.1)
    }

    function playPauseButton() {
        return (
            <button onClick={() => setPlaying(!playing)} type="button"
                    className="bg-slate-100 text-slate-700 flex-none -my-2 mx-auto rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center"
                    aria-label="Pause">
                {!playing ? <PlayCircleFilledWhite class={"h-12"}/> : <PauseCircleOutlineTwoTone class={"h-12"}/>}
            </button>)
    }

    function skipButton() {
        return (<button type="button" aria-label="Skip 15 seconds" onClick={() => skip()}>
            <Forward30 class={"my-2 h-8 fill-white"}/>
        </button>)
    }

    function rewindButton() {
        return (<button type="button" aria-label="Rewind 10 seconds" onClick={() => rewind()}>
            <Replay30 class={"my-2 h-8 fill-white"}/>
        </button>)
    }

    function endButton() {
        return (<button type="button" className="md:hidden" aria-label="Next" onClick={() => setClickedTime(duration)}>
            <SkipNext class={"my-2 h-8 fill-white"}/>
        </button>)
    }

    function startButton() {
        return (<button type="button" className="md:hidden" aria-label="Start" onClick={() => setClickedTime(0.1)}>
            <SkipPrevious class={"my-2 h-8 fill-white"}/>
        </button>)
    }

    function speedRegulation(speed) {
        setPlaybackspeed(speed)
    }

    function speedButton() {
        return (
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button
                        className="rounded-lg text-xs leading-6 font-semibold px-2 ring-inset ring-slate-500
                     text-slate-100 ring-0 bg-slate-500 hover:bg-slate-800">
                        {playbackspeed + "x"}
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 rounded-lg text-xs leading-6 font-semibold ring-inset ring-slate-500
                                             text-slate-100 ring-0 bg-slate-500">
                        <div className="py-1">
                            {availableSpeeds.map((singleSpeed) => (
                                <Menu.Item key={singleSpeed} className="w-full text-right rounded-lg text-xs leading-6 font-semibold px-2 ring-inset ring-slate-500
                                           text-slate-100 ring-0 bg-slate-500 hover:bg-slate-400">
                                    <button onClick={() => speedRegulation(singleSpeed)}>
                                        {singleSpeed + "x"}
                                    </button>
                                </Menu.Item>))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        )
    }

    function widthCalculator() {
        return curTime / duration * 100 + "%"
    }

    function calcClickedTime(e) {
        const clickPositionInPage = e.pageX;
        const bar = document.getElementById("bar__progress");
        const barStart = bar.getBoundingClientRect().left + window.scrollX;
        const barWidth = bar.offsetWidth;
        const clickPositionInBar = clickPositionInPage - barStart;
        const timePerPixel = duration / barWidth;
        return !isFinite(timePerPixel * clickPositionInBar) || isNaN(timePerPixel * clickPositionInBar) ? 0 : timePerPixel * clickPositionInBar;
    }

    function handleTimeDrag(e) {
        setClickedTime(calcClickedTime(e));
        const updateTimeOnMove = eMove => {
            setClickedTime(calcClickedTime(eMove));
        };

        document.addEventListener("mousemove", updateTimeOnMove);

        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", updateTimeOnMove);
        });
    }

    return (<div className={"my-3"}>
        <div className="bg-slate-800 border-slate-500 border-b rounded-t-xl p-4 pb-6 space-y-6">
            <div className="flex flex-row md:flex-col items-center space-x-4">
                <img src={story.image_url} alt={champions.map((champion) => champion.name + " ")} className="flex-none h-40 max-w-sm md:w-full rounded-lg bg-slate-100 md:object-cover"/>
                <div className="min-w-0 flex-auto space-y-1 font-semibold">
                    <h2 className="text-slate-400 text-sm leading-6 truncate">
                        {champions.map((champion, index) => {
                            let connectionString = index < champions.length - 1 ? ", " : " ";
                            return (
                                <Link key={champion.id} to={"/champion/" + champion.slug}>
                                    <span className={"hover:underline"}>{champion.name}</span>
                                    {connectionString}
                                </Link>
                            )
                        })}
                    </h2>
                    <p className="text-slate-50 text-lg">
                        {story.title}
                    </p>
                </div>
            </div>
            <div className="space-y-2">
                <div className="relative">
                    <div id={"bar__progress"} className="bg-slate-700 rounded-full overflow-hidden" onMouseDown={e => handleTimeDrag(e)}>
                        <div className="bg-cyan-400 w-full h-2" style={{width: widthCalculator()}} role="progressbar" aria-label="music progress" aria-valuenow={Math.floor(curTime)}
                             aria-valuemin="0" aria-valuemax={Math.floor(duration)}/>
                    </div>
                </div>
                <audio id="audio">
                    <source src={process.env.REACT_APP_MEDIA_URL + "/" + file.filename}/>
                    Your browser does not support the <code>audio</code> element.
                </audio>
                <div className="flex justify-between text-sm leading-6 font-medium tabular-nums">
                    <div className="text-slate-100">{formatDuration(curTime)}</div>
                    <div className="text-slate-400">{formatDuration(duration)}</div>
                </div>
            </div>
        </div>
        <div className="bg-slate-600 text-slate-200 rounded-b-xl flex items-center">
            <div className="flex-auto flex items-center justify-evenly">
                {startButton()}
                {rewindButton()}
            </div>

            {playPauseButton()}

            <div className="flex-auto flex items-center justify-evenly">
                {skipButton()}
                {endButton()}
                {speedButton()}
            </div>
        </div>
    </div>)
}
export default ViewAudioFile