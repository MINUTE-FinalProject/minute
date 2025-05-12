import RegionPage from "./RegionPage";
import bg1 from "../images/seoul_bg1.png";
import bg2 from "../images/seoul_bg2.png";
import bg3 from "../images/seoul_bg3.png";

function SeoulPage() {
  return (
    <RegionPage
      regionName="서울특별시"
      backgroundImages={[]}
      cities={["강남", "종로", "홍대"]}
    />
  );
}

export default SeoulPage;
