import React, { useEffect, useState } from "react";
import ArrowDown from "../../assets/png/arrow-down.png";
import Clock from "../../assets/png/clock.png";
import PlayButton from "../../assets/png/play-button.png";
import PlayPodcast from "../../assets/png/play-podcast.png";
import SearchIcon from "../../assets/png/search-icon.png";

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    // Using allorigins proxy to bypass CORS restrictions
    const proxyURL = "https://api.allorigins.win/get?url=";
    const encodedAPIURL = encodeURIComponent(
      "https://itunes.apple.com/search?term=podcast&entity=podcast",
    );

    // Fetching podcasts from the Apple iTunes API using the allorigins proxy
    fetch(proxyURL + encodedAPIURL)
      .then((response) => response.json())
      .then((data) => {
        const parsedData = JSON.parse(data.contents);
        setPodcasts(parsedData.results);
      })
      .catch((error) => console.error("Error fetching podcasts:", error));
  }, []);

  return (
    <>
      <div className="flex w-full justify-between text-white items-center mb-5">
        <img src={PlayButton} alt="play" />
        <h1>Title</h1>
        <div className="flex justify-between w-1/6">
          <img src={SearchIcon} alt="Magnifying Glass" width={16} height={16} />
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
          {podcasts?.map((podcast, index) => (
            <tr
              key={podcast.trackId}
              style={{
                color: "#FFFFFF4D",
                borderTop: "1px solid",
                borderBottom: "1px solid",
              }}
            >
              <td className="px-4 py-2 pt-4 pb-4">
                <img src={PlayPodcast} alt="play podcast" />
              </td>
              <td className="px-4 py-2 pt-4 pb-4">
                <div className="flex">
                  <img
                    src={podcast.artworkUrl100}
                    alt="podcast artwork"
                    className="mr-4 rounded-xl"
                    style={{ width: "45px", height: "45px" }}
                  />
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
                {Math.floor(podcast.trackTimeMillis / 60000)}:
                {((podcast.trackTimeMillis % 60000) / 1000).toFixed(0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default PodcastList;
