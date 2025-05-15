import RegionPage from "./RegionPage";
import bg1 from "../../assets/images/gangwondo_bg1.png";
import bg2 from "../../assets/images/gangwondo_bg2.png";
import bg3 from "../../assets/images/gangwondo_bg3.png";
function JeollanamPage() {
  return (
    <RegionPage
      regionName="전라남도"
      backgroundImages={[bg1, bg2, bg3]}
      cities={["여수", "순천", "담양"]}
    />
  );
}

export default JeollanamPage;
