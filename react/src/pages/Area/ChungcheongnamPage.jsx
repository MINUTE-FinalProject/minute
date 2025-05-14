import RegionPage from "./RegionPage";
import bg1 from "../../assets/images/Chungcheongnam_bg1.png";
import bg2 from "../../assets/images/Chungcheongnam_bg2.png";
import bg3 from "../../assets/images/Chungcheongnam_bg3.png";


function ChungcheongnamPage() {
  return (
    <RegionPage
      regionName="충청남도"
      backgroundImages={[bg1, bg2, bg3]}
      cities={["태안", "공주", "보령"]}
    />
  );
}

export default ChungcheongnamPage;
