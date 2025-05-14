import RegionPage from "./RegionPage";
import bg1 from "../../assets/images/Gyeongsangbuk_bg1.png";
import bg2 from "../../assets/images/Gyeongsangbuk_bg2.png";
import bg3 from "../../assets/images/Gyeongsangbuk_bg3.png";


function GyeongsangbukPage() {
  return (
    <RegionPage
      regionName="경상북도"
      backgroundImages={[bg1, bg2, bg3]}
      cities={["경주", "안동", "포항"]}
    />
  );
}

export default GyeongsangbukPage;
