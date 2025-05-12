import RegionPage from "./RegionPage";
import bg1 from "../images/gyeongnam_bg1.png";
import bg2 from "../images/gyeongnam_bg2.png";
import bg3 from "../images/gyeongnam_bg3.png";

function GyeongsangnamPage() {
  return (
    <RegionPage
      regionName="경상남도"
      backgroundImages={[]}
      cities={["통영", "거제", "진주"]}
    />
  );
}

export default GyeongsangnamPage;
