import RegionPage from "./RegionPage";
import bg1 from "../../assets/images/Gyeongsangnam_bg1.png";
import bg2 from "../../assets/images/Gyeongsangnam_bg2.png";
import bg3 from "../../assets/images/Gyeongsangnam_bg3.png";


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
