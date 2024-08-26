"use client";

import React, {
  Fragment,
  useCallback,
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
import { useTTS } from "./text-to-speech";

const ViewAudioFile: React.FC<{
  story: Story;
  champions: Champion[];
  file: File;
}> = ({ story, champions, file }) => {
  const storyHTML = stripTags(story.htmlStory);
  const {
    currentTime,
    duration,
    playing,
    playbackSpeed,
    currentPercentage,
    voices,
    selectedVoice,
    togglePlaying,
    setTime,
    setPlaybackSpeed,
    setVoice,
  } = useTTS({
    text: storyHTML,
  });

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
    currentTime + 15 < duration ? setTime(currentTime + 15) : setTime(duration);
  }

  function rewind() {
    currentTime > 15 ? setTime(currentTime - 15) : setTime(0.1);
  }

  function playPauseButton() {
    return (
      <button
        onClick={togglePlaying}
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
        onClick={() => setTime(duration)}
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
        onClick={() => setTime(0.1)}
      >
        <SkipPrevious className="my-2 h-8 fill-white" />
      </button>
    );
  }

  function speedRegulation(speed: number) {
    setPlaybackSpeed(speed);
  }

  function speedButton() {
    return (
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="rounded-lg bg-slate-500 px-2 text-xs font-semibold leading-6 text-slate-100 ring-0 ring-inset ring-slate-500 hover:bg-slate-800">
            {playbackSpeed + "x"}
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
          <Menu.Items className="absolute right-0 mt-2 origin-top-right rounded-lg bg-slate-500 text-xs font-semibold leading-6 text-slate-100 ring-0 ring-inset ring-slate-500">
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

  function voiceHandler() {
    return (
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="rounded-lg bg-slate-500 px-2 text-xs font-semibold leading-6 text-slate-100 ring-0 ring-inset ring-slate-500 hover:bg-slate-800">
            {selectedVoice?.name}
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
          <Menu.Items className="absolute right-0 mt-2 origin-top-right rounded-lg bg-slate-500 text-xs font-semibold leading-6 text-slate-100 ring-0 ring-inset ring-slate-500">
            <div className="py-1">
              {voices.map((voice) => (
                <Menu.Item key={voice.voiceURI}>
                  <button
                    className={
                      "w-full rounded-lg bg-slate-500 px-2 text-right text-xs font-semibold leading-6 text-slate-100 ring-0 ring-inset ring-slate-500 hover:bg-slate-400"
                    }
                    onClick={() => setVoice(voice)}
                  >
                    {voice.name}
                  </button>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  }
  const trackStyling = `-webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))`;

  return (
    <div className={"my-3"}>
      <div className="space-y-6 rounded-t-xl border-b border-slate-500 bg-slate-800 p-4 pb-6">
        <div className="relative flex flex-col items-center space-y-2 md:flex-row md:space-x-4 md:space-y-0">
          <StoryProblem fileId={file.id} />
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
              value={Math.floor(currentTime)}
              step="1"
              min="0"
              max={duration ? duration : `${duration}`}
              className="w-full cursor-pointer"
              onChange={(e) => setTime(Number.parseInt(e.target.value))}
              // onMouseUp={onScrubEnd}
              // onKeyUp={onScrubEnd}
              style={{ background: trackStyling }}
            />
          </div>
          <div className="flex justify-between text-sm font-medium tabular-nums leading-6">
            <div className="text-slate-100">{formatDuration(currentTime)}</div>
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
          {voiceHandler()}
        </div>
      </div>
    </div>
  );
};
export default ViewAudioFile;

const StoryProblem = ({ fileId }: { fileId: number }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const changeLoading = () => {
    setTimeout(() => {
      setLoading((old) => !old);
    }, 100);
  };
  return (
    <form
      action={(formData) => {
        setLoading(true);
        void saveFileProblem(formData).then(() => {
          changeLoading();
        });
      }}
    >
      <input type="hidden" name="fileId" value={fileId} />
      <button
        className="absolute right-0 top-0 z-10 text-center text-white"
        type="submit"
        disabled={loading}
      >
        {loading ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="ml-auto h-8 w-8 rounded-full border border-white p-1 hover:bg-slate-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="ml-auto h-8 w-8 rounded-full border border-white p-1 hover:bg-slate-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082"
            />
          </svg>
        )}
      </button>
    </form>
  );
};

function stripTags(input: string): string {
  // Check if DOMParser is available (browser environment)
  if (typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.body.textContent ?? "";
  } else {
    // Server-side or environments without DOMParser
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  }
}
