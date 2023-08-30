import React, { useRef, useState } from "react";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";
import { CiPause1, CiPlay1, CiVolumeHigh } from "react-icons/ci";
import ArrowDown from "../../assets/png/arrow-down.png";
import Clock from "../../assets/png/clock.png";
import SearchIcon from "../../assets/png/search-icon.png";
import Loop from "../../assets/png/loop.png";
import Play from "../../assets/png/play.png";
import Shuffle from "../../assets/png/shuffle.png";
import StepBack from "../../assets/png/step-back.png";
import StepForward from "../../assets/png/step-forward.png";
import Spinner from "../Spinner/Spinner";

const PodcastList = ({ filteredPodcasts, isLoading }) => {
  const [currentPlaying, setCurrentPlaying] = useState({
    audio: null,
    trackId: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRefs = useRef({});

  const togglePlayPause = (id) => {
    const audioElement = audioRefs.current[id];

    if (currentPlaying.audio && currentPlaying.audio !== audioElement) {
      currentPlaying.audio.pause();
      setCurrentPlaying({ audio: null, trackId: null });
    }

    if (audioElement.paused) {
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            setCurrentPlaying({ audio: audioElement, trackId: id });
          })
          .catch((error) => {
            console.error("Playback failed:", error);
          });
      }
    } else {
      audioElement.pause();
      setCurrentPlaying({ audio: null, trackId: null });
    }
  };

  const currentlyPlayingPodcast = filteredPodcasts?.find(
    (podcast) => podcast.trackId === currentPlaying.trackId,
  );

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return (
    <>
      <div className="flex w-full justify-between text-white items-center mb-5">
        {currentPlaying.audio && currentPlaying.trackId ? (
          <AiFillPauseCircle className="cursor-pointer" size={80} />
        ) : (
          <AiFillPlayCircle className="cursor-pointer" size={80} />
        )}
        <h1>
          {currentlyPlayingPodcast
            ? currentlyPlayingPodcast.trackName
            : "No Podcast Playing"}
        </h1>
        <div className="flex justify-between w-1/6 relative">
          <img src={SearchIcon} alt="Magnifying Glass" />
          <p style={{ fontSize: "16px" }}>Order by</p>
          <img
            src={ArrowDown}
            alt="down"
            width={18}
            height={18}
            onClick={() => setIsModalOpen(!isModalOpen)}
          />
          {isModalOpen && (
            <div
              className="absolute top-24 left-1/2 bg-white text-black p-5 rounded-md"
              style={{
                transform: "translate(-50%, -50%)",
              }}
            >
              <p className="cursor-pointer">Sort Ascending</p>
              <p className="cursor-pointer">Sort Descending</p>
            </div>
          )}
        </div>
      </div>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th style={{ color: "#FFFFFF4D" }} className="px-2 py-2 text-left">
              #
            </th>
            <th style={{ color: "#FFFFFF4D" }} className="px-4 py-2 text-left">
              Title
            </th>
            <th style={{ color: "#FFFFFF4D" }} className="px-4 py-2">
              Topic
            </th>
            <th style={{ color: "#FFFFFF4D" }} className="px-4 py-2">
              Released
            </th>
            <th style={{ color: "#FFFFFF4D" }} className="px-4 py-2">
              <img src={Clock} alt="clock" />
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <Spinner />
          ) : (
            filteredPodcasts?.map((podcast, index) => (
              <tr
                key={podcast.trackId}
                style={{
                  color: "#FFFFFF4D",
                  borderTop: "1px solid",
                  borderBottom: "1px solid",
                }}
                onClick={() => togglePlayPause(podcast.trackId)}
                className="cursor-pointer"
              >
                <td className="px-4 py-2 pt-4 pb-4">
                  {currentPlaying.audio &&
                  currentPlaying.trackId === podcast.trackId ? (
                    <CiPause1
                      style={{ color: "white" }}
                      className="cursor-pointer"
                      onClick={() => togglePlayPause(podcast.trackId)}
                    />
                  ) : (
                    <CiPlay1
                      style={{ color: "white" }}
                      className="cursor-pointer"
                      onClick={() => togglePlayPause(podcast.trackId)}
                    />
                  )}
                </td>
                <td className="px-4 py-2 pt-4 pb-4">
                  <div className="flex">
                    <img
                      src={podcast.artworkUrl100}
                      alt="podcast artwork"
                      className="mr-4 rounded-xl cursor-pointer"
                      style={{ width: "45px", height: "45px" }}
                    />
                    <audio
                      ref={(el) => (audioRefs.current[podcast.trackId] = el)}
                      src={podcast.audioUrl}
                      onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                      onLoadedMetadata={(e) => setDuration(e.target.duration)}
                    ></audio>
                    <div>
                      <p>{podcast.trackName}</p>
                      <p>{podcast.artistName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2 pt-4 pb-4">
                  {podcast.primaryGenreName}
                </td>
                <td className="px-4 py-2 pt-4 pb-4">
                  {new Date(podcast.releaseDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 pt-4 pb-4">
                  {podcast.trackTimeMillis ? (
                    <>
                      {Math.floor(podcast.trackTimeMillis / 60000)}:
                      {((podcast.trackTimeMillis % 60000) / 1000).toFixed(2)}
                    </>
                  ) : (
                    "Not Available"
                  )}
                </td>
              </tr>
            ))
          )}
          <div
            className="fixed bottom-0 left-0 w-full text-white"
            style={{ backgroundColor: "#1A1A1A" }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {currentPlaying.audio && (
                  <div className="flex-shrink-0">
                    <img
                      src={currentlyPlayingPodcast?.artworkUrl100}
                      alt="Currently Playing Podcast"
                      className="h-28 w-28"
                    />
                  </div>
                )}
                <div className="ml-5">
                  <h2 className="text-xl font-semibold">
                    {currentlyPlayingPodcast?.trackName || "No Podcast Playing"}
                  </h2>
                  <p>{currentlyPlayingPodcast?.artistName}</p>
                </div>
              </div>
              <div>
                <div className="flex flex-1 gap-4 ml-5">
                  <img
                    src={Shuffle}
                    alt="shuffle"
                    style={{ color: "white" }}
                    className="cursor-pointer object-contain"
                  />
                  <img
                    src={StepBack}
                    alt="step-back"
                    style={{ color: "white" }}
                    className="cursor-pointer object-contain"
                  />

                  {/* Play/Pause icon logic */}
                  {currentPlaying.audio && currentPlaying.trackId ? (
                    <CiPause1
                      style={{ color: "white" }}
                      className="cursor-pointer"
                      onClick={() => {
                        if (currentPlaying.trackId && currentPlaying.audio) {
                          togglePlayPause(currentPlaying.trackId);
                        }
                      }}
                    />
                  ) : (
                    <CiPlay1
                      style={{ color: "white" }}
                      className="cursor-pointer"
                      onClick={() => {
                        if (currentPlaying.trackId && currentPlaying.audio) {
                          togglePlayPause(currentPlaying.trackId);
                        }
                      }}
                    />
                  )}

                  <img
                    src={StepForward}
                    alt="step-forward"
                    style={{ color: "white" }}
                    className="cursor-pointer object-contain"
                  />
                  <img
                    src={Loop}
                    alt="loop"
                    style={{ color: "white" }}
                    className="cursor-pointer object-contain"
                  />
                </div>
              </div>
              {/* Podcast Progress Bar and Time */}
              <div className="flex items-center ml-5">
                <span className="mr-2">{formatTime(currentTime)}</span>
                <div
                  style={{ width: "32rem" }}
                  className="relative h-1.5 bg-gray-600 rounded-full mr-2"
                >
                  <div
                    className="absolute h-1.5 bg-white rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                <span>{formatTime(duration)}</span>
              </div>
              {/* Volume Control */}
              <div className="flex items-center mr-4">
                <CiVolumeHigh size={24} className="mr-2 cursor-pointer" />
                <div className="relative w-32 h-1.5 bg-gray-600 rounded-full">
                  <div
                    className="absolute h-1.5 bg-white rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </tbody>
      </table>
    </>
  );
};

export default PodcastList;
