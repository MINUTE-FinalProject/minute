import RegionPage from "./RegionPage";
import bg1 from "../images/chungbuk_bg1.png";
import bg2 from "../images/chungbuk_bg2.png";
import bg3 from "../images/chungbuk_bg3.png";

function ChungcheongbukPage() {
  return (
    <RegionPage
      regionName="충청북도"
      backgroundImages={[]}
      cities={["단양", "청주", "제천"]}
    />
  );
}

export default ChungcheongbukPage;
