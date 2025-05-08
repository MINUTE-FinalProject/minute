import { useEffect } from "react";
import { useState } from "react";
import bg1 from '../images/gangwondo_bg1.png';
import bg2 from '../images/gangwondo_bg2.png';
import bg3 from '../images/gangwondo_bg3.png';

import styles from './Gangwondopage.module.css'
import Header from "../common/Header";

function GangwondoPage(){
    
    const images = [bg1,bg2,bg3];

    const [selectImage, setSelectImage] = useState('');

    useEffect(()=>{
        const randomImage = Math.floor(Math.random()*images.length);
        setSelectImage(images[randomImage]);
    },[]);

    return(
        <>
            <Header/>
            <div className={styles.container} 
            style={{ backgroundImage: selectImage ? `url(${selectImage})` : 'none' }}>
                <h1>강원도</h1>
                 <div className={styles.searchbar}>
                    <input type="text" className={styles.searchInput} />
                    <button className={styles.searchButton}>
                    <img
                        src="/src/images/search_icon.png"
                        alt=""
                        className={styles.searchIcon}
                    />
                    </button>
                </div>
                <ul className={styles.list}>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            <div className={styles.section}>
                <h3>강릉</h3>
                <ul className={styles.cityList}>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <button className={styles.moreButton}>더보기</button>
            </div>
            <div className={styles.section}>
                <h3>속초</h3>
                <ul className={styles.cityList}>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <button className={styles.moreButton}>더보기</button>
            </div>
            <div className={styles.section}>
                <h3>평창</h3>
                <ul className={styles.cityList}>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <button className={styles.moreButton}>더보기</button>
            </div>
        </>
    )
}
export default GangwondoPage;