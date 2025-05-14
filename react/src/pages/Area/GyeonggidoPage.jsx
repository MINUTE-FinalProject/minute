import RegionPage from "./RegionPage";
import bg1 from "../../assets/images/Gyeonggido_bg1.png";
import bg2 from "../../assets/images/Gyeonggido_bg2.png";
import bg3 from "../../assets/images/gangwondo_bg3.png";


function GyeonggidoPage() {
  return (
    <RegionPage
      regionName="경기도"
      backgroundImages={[bg1, bg2, bg3]}
      cities={["가평", "수원", "파주  "]}
    />
  );
}

export default GyeonggidoPage;
