import bg1 from "../../assets/images/gangwondo_bg1.jpg";
import bg2 from "../../assets/images/gangwondo_bg2.jpg";
import bg3 from "../../assets/images/gangwondo_bg3.jpg";
import RegionPage from "./RegionPage";

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
