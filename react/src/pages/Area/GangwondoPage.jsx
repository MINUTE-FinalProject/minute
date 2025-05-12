import RegionPage from "./RegionPage";
import bg1 from "../images/gangwondo_bg1.png";
import bg2 from "../images/gangwondo_bg2.png";
import bg3 from "../images/gangwondo_bg3.png";

function GangwondoPage() {
  return (
    <RegionPage
      regionName="강원도"
      backgroundImages={[bg1, bg2, bg3]}
      cities={["강릉", "속초", "평창"]}
    />
  );
}

export default GangwondoPage;
