import RegionPage from "./RegionPage";
import bg1 from "../../assets/images/Busan_bg1.png";
import bg2 from "../../assets/images/Busan_bg2.png";
import bg3 from "../../assets/images/Busan_bg3.png";

function BusanPage() {
  return (
    <RegionPage
      regionName="부산광역시"
      backgroundImages={[bg1, bg2, bg3]}
      cities={["해운대", "광안리", "서면"]}
    />
  );
}

export default BusanPage;
