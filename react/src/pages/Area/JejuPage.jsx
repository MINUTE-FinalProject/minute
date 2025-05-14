import bg1 from "../../assets/images/gangwondo_bg1.jpg";
import bg2 from "../../assets/images/gangwondo_bg2.jpg";
import bg3 from "../../assets/images/gangwondo_bg3.jpg";
import RegionPage from "./RegionPage";

function JejuPage() {
  return (
    <RegionPage
      regionName="제주특별자치도"
      backgroundImages={[bg1, bg2, bg3]}
      cities={["서귀포", "성산", "애월"]}
    />
  );
}

export default JejuPage;
