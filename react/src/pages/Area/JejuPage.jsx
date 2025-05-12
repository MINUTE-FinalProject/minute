import RegionPage from "./RegionPage";
import bg1 from "../images/jeju_bg1.png";
import bg2 from "../images/jeju_bg2.png";
import bg3 from "../images/jeju_bg3.png";

function JejuPage() {
  return (
    <RegionPage
      regionName="제주특별자치도"
      backgroundImages={[]}
      cities={["서귀포", "성산", "애월"]}
    />
  );
}

export default JejuPage;
