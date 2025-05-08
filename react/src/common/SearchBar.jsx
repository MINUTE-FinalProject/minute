import divStyle from './SearchBar.module.css';
function SearchBar(){
    return(
        <div className={divStyle.search}>
            <h1>MIN:UTE</h1>
            <div className={divStyle.textbox}>
                <input type="text" />
                {/* <button>
                <img
                    src="/src/images/search_icon.png"
                    alt=""
                    className={divStyle.searchIcon}
                />
                </button> */}
            </div>
        </div>
    )
}
export default SearchBar;