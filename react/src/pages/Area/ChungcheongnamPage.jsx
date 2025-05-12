import RegionPage from "./RegionPage";
import bg1 from "../images/chungnam_bg1.png";
import bg2 from "../images/chungnam_bg2.png";
import bg3 from "../images/chungnam_bg3.png";

function ChungcheongnamPage() {
  return (
    <RegionPage
      regionName="충청남도"
      backgroundImages={[]}
      cities={["태안", "공주", "보령"]}
    />
  );
}

export default ChungcheongnamPage;
