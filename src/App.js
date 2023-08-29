import "./App.css";
import Header from "./components/Header/Header";
import PodcastList from "./components/PodcastsList/PodcastList";
import SearchBar from "./components/SearchBar/SearchBar";

function App() {
  return (
    <div className="App flex justify-center">
      <div className="w-1/2">
        <SearchBar />
        <Header />
        <PodcastList />
      </div>
    </div>
  );
}

export default App;
