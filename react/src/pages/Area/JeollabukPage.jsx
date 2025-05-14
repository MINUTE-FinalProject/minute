import RegionPage from "./RegionPage";
import bg1 from "../../assets/images/gangwondo_bg1.png";
import bg2 from "../../assets/images/gangwondo_bg2.png";
import bg3 from "../../assets/images/gangwondo_bg3.png";

function JeollabukPage() {
  return (
    <RegionPage
      regionName="전라북도"
      backgroundImages={[bg1, bg2, bg3]}
      cities={["전주", "군산", "남원"]}
    />
  );
}

export default JeollabukPage;
