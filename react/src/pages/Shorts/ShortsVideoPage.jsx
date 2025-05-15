import { useState } from "react";
import Header from "../../components/Header/Header";
import styles from './ShortsVideoPage.module.css';

function ShortsVideoPage(){
    const [thumbUp, setThumbUp] = useState("/src/assets/images/b_thumbup.png")
    const [thumbDown, setThumbDown] = useState("/src/assets/images/b_thumbdowm.png")
    const [star, setStar] = useState("/src/assets/images/b_star.png")

    const handleThumbUpClick = () => {
        setThumbUp(prev => prev === "/src/assets/images/b_thumbup.png" 
            ? "/src/assets/images/thumbup.png" : "/src/assets/images/b_thumbup.png");
    }
    const handleThumbDownClick = () => {
        setThumbDown(prev => prev === "/src/assets/images/b_thumbdowm.png" 
            ? "/src/assets/images/thumbdowm.png" : "/src/assets/images/b_thumbdowm.png");
    }
    const handleStarClick= () =>{
        setStar(prev => prev === "/src/assets/images/b_star.png" 
            ? "/src/assets/images/star.png" : "/src/assets/images/b_star.png");
    }
    return(
        <>
            <Header/> 
            <div className={styles.container}>
                <div className={styles.searchbar}>
                    <input type="text" className={styles.searchInput} />
                </div>
                <div className={styles.mainContent}>
                    <div className={styles.contentWrap}>
                        <div className={styles.shortVideo}>
                        </div>
                        <div className={styles.reactionWrap}>
                            <ul>
                                <li>
                                    <img 
                                    src={thumbUp} 
                                    alt="thumbUp"
                                    onClick={handleThumbUpClick}
                                    className={styles.reactionIcon}/>
                                </li>
                                <li>
                                    <img 
                                    src={thumbDown} 
                                    alt="thumbDown"
                                    onClick={handleThumbDownClick} 
                                    className={styles.reactionIcon}/>
                                </li>
                                <li>
                                    <img 
                                    src={star} 
                                    alt="defaultStar"
                                    onClick={handleStarClick} 
                                    className={styles.reactionIcon}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.arrowWrap}>
                        <ul>
                            <li><img src="/src/assets/images/arrow.png" alt="arrowTop" className={styles.arrowTop} /></li>
                            <li><img src="/src/assets/images/arrow.png" alt="arrowBottom" className={styles.arrowBottom}/></li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ShortsVideoPage;