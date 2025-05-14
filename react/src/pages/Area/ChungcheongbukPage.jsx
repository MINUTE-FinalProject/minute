import RegionPage from "./RegionPage";
import bg1 from "../../assets/images/Chungcheongbuk_bg1.png";
import bg2 from "../../assets/images/Chungcheongbuk_bg2.png";
import bg3 from "../../assets/images/Chungcheongbuk_bg3.png";


function ChungcheongbukPage() {
  return (
    <RegionPage
      regionName="충청북도"
      backgroundImages={[bg1, bg2, bg3]}
      cities={["단양", "청주", "제천"]}
    />
  );
}

export default ChungcheongbukPage;
