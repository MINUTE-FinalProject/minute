import RegionPage from "./RegionPage";
import bg1 from "../images/busan_bg1.png";
import bg2 from "../images/busan_bg2.png";
import bg3 from "../images/busan_bg3.png";

function BusanPage() {
  return (
    <RegionPage
      regionName="부산광역시"
      backgroundImages={[]}
      cities={["해운대", "광안리", "서면"]}
    />
  );
}

export default BusanPage;
