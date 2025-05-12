import RegionPage from "./RegionPage";
import bg1 from "../images/gyeonggido_bg1.png";
import bg2 from "../images/gyeonggido_bg2.png";
import bg3 from "../images/gyeonggido_bg3.png";

function GyeonggidoPage() {
  return (
    <RegionPage
      regionName="경기도"
      backgroundImages={[]}
      cities={["가평", "수원", "파주  "]}
    />
  );
}

export default GyeonggidoPage;
