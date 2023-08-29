import React, { useState } from "react";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import ArrowDown from "../../assets/png/arrow-down.png";
import Clock from "../../assets/png/clock.png";
import SearchIcon from "../../assets/png/search-icon.png";
import Spinner from "../Spinner/Spinner";

const PodcastList = ({ filteredPodcasts, isLoading }) => {
  const [currentPlaying, setCurrentPlaying] = useState(null);

  console.log("filteredPodcasts", filteredPodcasts);

  const togglePlayPause = (id) => {
    const audioElement = document.getElementById(`audio-${id}`);

    if (currentPlaying && currentPlaying !== audioElement) {
      currentPlaying.pause();
      setCurrentPlaying(null);
    }

    if (audioElement.paused) {
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            setCurrentPlaying(audioElement);
          })
          .catch((error) => {
            console.error("Playback failed:", error);
          });
      }
    } else {
      audioElement.pause();
      setCurrentPlaying(null);
    }
  };

  return (
    <>
      <div className="flex w-full justify-between text-white items-center mb-5">
        {currentPlaying ? (
          <AiFillPauseCircle
            className="cursor-pointer"
            size={80}
            onClick={() => togglePlayPause(currentPlaying.id)}
          />
        ) : (
          <>
            {currentPlaying === null ? (
              <AiFillPlayCircle className="cursor-default" size={80} />
            ) : (
              <AiFillPlayCircle
                className="cursor-pointer"
                size={80}
                onClick={() => togglePlayPause(currentPlaying.id)}
              />
            )}
          </>
        )}
        <div className="flex justify-between w-1/6">
          <img src={SearchIcon} alt="Magnifying Glass" />
          <p style={{ fontSize: "16px" }}>Order by</p>
          <img src={ArrowDown} alt="down" width={18} height={18} />
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
              >
                <td className="px-4 py-2 pt-4 pb-4">
                  {document.getElementById(`audio-${podcast.trackId}`)
                    ?.paused ? (
                    <CiPlay1
                      style={{ color: "white" }}
                      className="cursor-pointer"
                      onClick={() => togglePlayPause(podcast.trackId)}
                    />
                  ) : (
                    <CiPause1
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
                      onClick={() => togglePlayPause(podcast.trackId)}
                    />
                    <audio
                      id={`audio-${podcast.trackId}`}
                      src={podcast.audioUrl}
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
        </tbody>
      </table>
    </>
  );
};

export default PodcastList;
