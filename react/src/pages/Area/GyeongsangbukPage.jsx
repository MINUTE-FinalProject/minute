import RegionPage from "./RegionPage";
import bg1 from "../images/gyeongbuk_bg1.png";
import bg2 from "../images/gyeongbuk_bg2.png";
import bg3 from "../images/gyeongbuk_bg3.png";

function GyeongsangbukPage() {
  return (
    <RegionPage
      regionName="경상북도"
      backgroundImages={[]}
      cities={["경주", "안동", "포항"]}
    />
  );
}

export default GyeongsangbukPage;
