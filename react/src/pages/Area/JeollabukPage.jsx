import RegionPage from "./RegionPage";
import bg1 from "../images/jeonbuk_bg1.png";
import bg2 from "../images/jeonbuk_bg2.png";
import bg3 from "../images/jeonbuk_bg3.png";

function JeollabukPage() {
  return (
    <RegionPage
      regionName="전라북도"
      backgroundImages={[]}
      cities={["전주", "군산", "남원"]}
    />
  );
}

export default JeollabukPage;
