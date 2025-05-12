import RegionPage from "./RegionPage";
import bg1 from "../images/jeonnam_bg1.png";
import bg2 from "../images/jeonnam_bg2.png";
import bg3 from "../images/jeonnam_bg3.png";

function JeollanamPage() {
  return (
    <RegionPage
      regionName="전라남도"
      backgroundImages={[]}
      cities={["여수", "순천", "담양"]}
    />
  );
}

export default JeollanamPage;
