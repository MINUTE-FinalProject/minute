import divStyle from './SearchBar.module.css';
function SearchBar(){
    return(
        <div className={divStyle.search}>
            <h1 className={divStyle.mainTitle}>MIN:UTE</h1>
            <div className={divStyle.textbox}>
                <input type="text" className={divStyle.searchInput}/>
            </div>
        </div>
    )
}
export default SearchBar;