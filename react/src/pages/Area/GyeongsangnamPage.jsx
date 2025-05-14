import bg1 from "../../assets/images/gangwondo_bg1.jpg";
import bg2 from "../../assets/images/gangwondo_bg2.jpg";
import bg3 from "../../assets/images/gangwondo_bg3.jpg";
import RegionPage from "./RegionPage";


function GyeongsangnamPage() {
  return (
    <RegionPage
      regionName="경상남도"
      backgroundImages={[bg1, bg2, bg3]}
      cities={["통영", "거제", "진주"]}
    />
  );
}

export default GyeongsangnamPage;
