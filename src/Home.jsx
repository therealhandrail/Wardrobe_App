import myOutfitBox from "./elements/myOutfitBox";
import PublicOutfits from "./elements/PublicOutfits";
import "./stylesheets/home.css";

function Home() {

  return (
    <div className="home">
      <section className="leftBox">{myOutfitBox()}</section>
      <section className="rightBox">
        {PublicOutfits()}
      </section>
    </div>
  );
}

export default Home;
// Returns dashboard page
