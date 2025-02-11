import React from "react";

import Styles from "./Testimonial.module.scss";

export default function Testimonial() {
    return (
        <div className={Styles.container}>
            <img src="/images/landingPage/inset.png" alt="" className={Styles.image} />
            <img src="/images/landingPage/Quote.svg" alt="" width="57px" height="37px" />
            <p className={Styles.text}>
                Integrity has been life changing for our agency. It saves us time and money of no more faxing. We know
                when we finalize an application it will be error free and issued faster. We would not want be without
                it!
            </p>
            <p className={Styles.subText}>Robin Grimm</p>
            <p className={Styles.subText}>RLG Financial Concepts</p>
        </div>
    );
}
