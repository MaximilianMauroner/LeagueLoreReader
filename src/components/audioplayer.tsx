"use client";

import React, {
  Fragment,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  Replay30,
  Forward30,
  PlayCircleFilledWhite,
  PauseCircleOutlineTwoTone,
  SkipPrevious,
  SkipNext,
} from "@mui/icons-material/";
import type { Story, File, Champion } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { saveFileProblem } from "@/app/actions";

export const AudioPlayer = ({
  story,
  champions,
  file,
}: {
  story: Story;
  champions: Champion[];
  file: File;
}) => {
  // states
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const filePath = process.env.NEXT_PUBLIC_FILE_PATH + file.fileName;

  return (
    <>
      <Audio audioRef={audioRef} src={filePath} />
      <Controls
        audioRef={audioRef}
        duration={duration}
        setTimeProgress={setTimeProgress}
      />
    </>
  );
};

const Audio = ({
  src,
  audioRef,
}: {
  src: string;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}) => {
  const onLoadedMetadata = () => {
    console.log("onLoadedMetadata");
  };

  return (
    <>
      <audio src={src} ref={audioRef} />
    </>
  );
};

const Controls = ({
  audioRef,
  setTimeProgress,
  duration,
}: {
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  setTimeProgress: (time: number) => void;
  duration: number;
}) => {
  const trackStyling = `-webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))`;

  const [isPlaying, setIsPlaying] = useState(false);
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (isPlaying) {
      void audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, audioRef]);
  console.log(audioRef);

  return (
    <div className={"my-3"}>
      <div className="space-y-6 rounded-t-xl border-b border-slate-500 bg-slate-800 p-4 pb-6">
        <div className="relative flex flex-col items-center space-y-2 md:flex-row md:space-x-4 md:space-y-0">
          <div className={"relative h-64 w-full md:w-1/2"}>
            <Image
              fill
              src={story.imageUrl}
              className={"rounded-lg object-cover object-top"}
              alt={story.title}
              priority={true}
            />
          </div>
          <div className="m-0 mr-auto min-w-0 flex-auto font-semibold md:m-auto md:mr-0">
            <h2 className="flex flex-wrap space-x-1 truncate text-sm leading-6 text-slate-400">
              {champions.map((champion, index) => {
                return (
                  <Link
                    key={champion.id}
                    href={"/champion/" + champion.slug}
                    passHref={true}
                  >
                    <span className={"hover:underline"}>{champion.name}</span>
                    {index < champions.length - 1 ? ", " : null}
                  </Link>
                );
              })}
            </h2>
            <p className="text-lg text-slate-50">{story.title}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <input
              type="range"
              value={Math.floor(curTime)}
              step="1"
              min="0"
              max={duration ? duration : `${duration}`}
              className="w-full cursor-pointer"
              onChange={(e) => setClickedTime(Number.parseInt(e.target.value))}
              // onMouseUp={onScrubEnd}
              // onKeyUp={onScrubEnd}
              style={{ background: trackStyling }}
            />
          </div>
          <div className="flex justify-between text-sm font-medium tabular-nums leading-6">
            <div className="text-slate-100">{formatDuration(curTime)}</div>
            <div className="text-slate-400">{formatDuration(duration)}</div>
          </div>
        </div>
      </div>
      <div className="flex items-center rounded-b-xl bg-slate-600 text-slate-200">
        <div className="flex flex-auto items-center justify-evenly">
          {startButton()}
          {rewindButton()}
        </div>
        {playPauseButton()}
        <div className="flex flex-auto items-center justify-evenly">
          {skipButton()}
          {endButton()}
          {speedButton()}
        </div>
      </div>
    </div>
  );
};

function speedButton() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="rounded-lg bg-slate-500 px-2 text-xs font-semibold leading-6 text-slate-100
                   ring-0 ring-inset ring-slate-500 hover:bg-slate-800"
        >
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
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 mt-2 origin-top-right rounded-lg bg-slate-500 text-xs font-semibold leading-6 text-slate-100
                                           ring-0 ring-inset ring-slate-500"
        >
          <div className="py-1">
            {availableSpeeds.map((singleSpeed) => (
              <Menu.Item key={singleSpeed}>
                <button
                  className={
                    "w-full rounded-lg bg-slate-500 px-2 text-right text-xs font-semibold leading-6 text-slate-100 ring-0 ring-inset ring-slate-500 hover:bg-slate-400"
                  }
                  onClick={() => speedRegulation(singleSpeed)}
                >
                  {singleSpeed + "x"}
                </button>
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
