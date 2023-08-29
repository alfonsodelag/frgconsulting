import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import PodcastList from "./components/PodcastsList/PodcastList";
import SearchBar from "./components/SearchBar/SearchBar";

function App() {
  const [podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Using allorigins proxy to bypass CORS restrictions
    const proxyURL = "https://api.allorigins.win/get?url=";
    const encodedAPIURL = encodeURIComponent(
      "https://itunes.apple.com/search?term=podcast&entity=podcast",
    );

    // Fetching podcasts from the Apple iTunes API using the allorigins proxy
    fetch(proxyURL + encodedAPIURL)
      .then((response) => response.json())
      .then(async (data) => {
        const parsedData = JSON.parse(data.contents);
        const podcasts = parsedData.results;

        // Fetch audio URLs for each podcast and update the podcast object
        const updatedPodcasts = await Promise.all(
          podcasts.map(async (podcast) => {
            try {
              const rssResponse = await fetch(podcast.feedUrl);
              const rssData = await rssResponse.text();
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(rssData, "text/xml");
              const audioUrl = xmlDoc
                .querySelector("enclosure")
                .getAttribute("url");
              return { ...podcast, audioUrl };
            } catch (error) {
              console.error(
                `Error fetching RSS feed for podcast ${podcast.trackName}:`,
                error,
              );
              return podcast;
            }
          }),
        );

        setPodcasts(updatedPodcasts);
        setFilteredPodcasts(updatedPodcasts);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching podcasts:", error));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const results = podcasts.filter(
      (podcast) =>
        podcast.trackName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        podcast.artistName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredPodcasts(results);
  }, [podcasts, searchTerm]);

  return (
    <div className="App flex justify-center">
      <div className="w-1/2">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Header />
        <PodcastList
          filteredPodcasts={filteredPodcasts}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default App;
