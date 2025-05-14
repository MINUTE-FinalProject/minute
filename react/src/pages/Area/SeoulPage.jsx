import RegionPage from "./RegionPage";
import bg1 from "../../assets/images/gangwondo_bg1.png";
import bg2 from "../../assets/images/gangwondo_bg2.png";
import bg3 from "../../assets/images/gangwondo_bg3.png";

function SeoulPage() {
  return (
    <RegionPage
      regionName="서울특별시"
       backgroundImages={[bg1, bg2, bg3]}
      cities={["강남", "종로", "홍대"]}
    />
  );
}

export default SeoulPage;
