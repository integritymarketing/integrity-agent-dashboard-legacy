import * as React from "react";
import Heading3 from "packages/Heading3";
import styles from "./Tags.module.scss";

export default function Tags({ words, flexDirection = "row", className = "" }) {
    return (
        <div className={styles.tagsContainer} style={{ flexDirection: flexDirection }}>
            <Heading3 className={className} text="Tags" />
            <div className={styles.tagsContainer}>
                {words &&
                    words?.length > 0 &&
                    words?.map((word, i) => (
                        <div key={`${word?.tagLabel}-${i}`} className={styles.tags}>
                            <div className={styles.tagText}>{word?.tagLabel}</div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
