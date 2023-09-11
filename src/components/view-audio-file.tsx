"use client";

import React, { Fragment, useEffect, useState } from "react";
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

const ViewAudioFile: React.FC<{
  story: Story;
  champions: Champion[];
  file: File;
}> = ({ story, champions, file }) => {
  const {
    curTime,
    duration,
    playing,
    playbackspeed,
    currentPercentage,
    setPlaying,
    setClickedTime,
    setPlaybackspeed,
  } = useAudioPlayer();
  const availableSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

  function formatDuration(toFormatDuration: number) {
    if (toFormatDuration > 3600) {
      return new Date(toFormatDuration * 1000).toISOString().substring(11, 19);
    }
    if (toFormatDuration > 600) {
      return new Date(toFormatDuration * 1000).toISOString().substring(14, 19);
    }
    return new Date(toFormatDuration * 1000).toISOString().substring(15, 19);
  }

  function skip() {
    curTime + 15 < duration
      ? setClickedTime(curTime + 15)
      : setClickedTime(duration);
  }

  function rewind() {
    curTime > 15 ? setClickedTime(curTime - 15) : setClickedTime(0.1);
  }

  function playPauseButton() {
    if (curTime >= duration - 0.1 && playing) {
      setClickedTime(0.1);
      setPlaying(!playing);
    }
    return (
      <button
        onClick={() => setPlaying(!playing)}
        type="button"
        className="-my-2 mx-auto flex h-6 flex-none items-center justify-center rounded-full bg-slate-100 text-slate-700 shadow-md ring-1 ring-slate-900/5"
        aria-label="Pause"
      >
        {!playing ? (
          <PlayCircleFilledWhite className="h-12" />
        ) : (
          <PauseCircleOutlineTwoTone className="h-12" />
        )}
      </button>
    );
  }

  function skipButton() {
    return (
      <button type="button" aria-label="Skip 15 seconds" onClick={() => skip()}>
        <Forward30 className="my-2 h-8 fill-white" />
      </button>
    );
  }

  function rewindButton() {
    return (
      <button
        type="button"
        aria-label="Rewind 10 seconds"
        onClick={() => rewind()}
      >
        <Replay30 className="my-2 h-8 fill-white" />
      </button>
    );
  }

  function endButton() {
    return (
      <button
        type="button"
        className="hidden md:block"
        aria-label="Next"
        onClick={() => setClickedTime(duration)}
      >
        <SkipNext className="my-2 h-8 fill-white" />
      </button>
    );
  }

  function startButton() {
    return (
      <button
        type="button"
        className="hidden md:block"
        aria-label="Start"
        onClick={() => setClickedTime(0.1)}
      >
        <SkipPrevious className="my-2 h-8 fill-white" />
      </button>
    );
  }

  function speedRegulation(speed: number) {
    setPlaybackspeed(speed);
  }

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

  const filePath = process.env.NEXT_PUBLIC_FILE_PATH + file.fileName;
  const trackStyling = `-webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))`;

  return (
    <div className={"my-3"}>
      <div className="space-y-6 rounded-t-xl border-b border-slate-500 bg-slate-800 p-4 pb-6">
        <div className="flex flex-col items-center space-y-2 md:flex-row md:space-x-4 md:space-y-0">
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
          <audio id="audio">
            <source src={filePath} />
            Your browser does not support the <code>audio</code> element.
          </audio>
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
export default ViewAudioFile;

export function useAudioPlayer() {
  const [duration, setDuration] = useState<number>(0);
  const [curTime, setCurTime] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [clickedTime, setClickedTime] = useState<number>(0);
  const [playbackspeed, setPlaybackspeed] = useState<number>(1);
  const [currentPercentage] = useState<number>(0);

  useEffect(() => {
    const audio = document.getElementById("audio") as HTMLAudioElement;
    if (audio == undefined) {
      return;
    }
    audio.playbackRate = playbackspeed;

    // state setters wrappers
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurTime(audio.currentTime);
      setCurTime((audio.currentTime / audio.duration) * 100);
    };

    const setAudioTime = () => setCurTime(audio.currentTime);

    // DOM listeners: update React state on DOM events
    audio.addEventListener("loadeddata", setAudioData);

    audio.addEventListener("timeupdate", setAudioTime);

    // React state listeners: update DOM on React state changes
    playing ? audio.play() : audio.pause();

    if (clickedTime && clickedTime !== curTime) {
      audio.currentTime = clickedTime;
      setClickedTime(0);
    }

    // effect cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  });

  return {
    curTime,
    duration,
    playing,
    playbackspeed,
    currentPercentage,
    setPlaying,
    setClickedTime,
    setPlaybackspeed,
  };
}
