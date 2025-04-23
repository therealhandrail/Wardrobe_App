import SearchBar from "./elements/searchBar.jsx";
import myOutfitBox from "./elements/myOutfitBox";
import mainPageBox from "./elements/mainPageBox";
import "./stylesheets/home.css";

function Home() {

  return (
    <div className="home">
      <section className="leftBox">{myOutfitBox()}</section>
      <section className="rightBox">
        {mainPageBox()}
      </section>
    </div>
  );
}

export default Home;
// Returns dashboard page
