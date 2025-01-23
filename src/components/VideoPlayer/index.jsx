import React, { useCallback, useState } from "react";

import image from "./integrityThumbnail.jpg";
import styles from "./styles.module.scss";

const VideoPlayer = ({ className = "", title, url }) => {
    const [showVideo, setShowVideo] = useState(false);

    const handleClick = useCallback(() => {
        setShowVideo(!showVideo);
    }, [showVideo]);

    return (
        <div className={className} onClick={handleClick}>
            {!showVideo ? (
                <img alt="poster" className={styles.image} src={image} />
            ) : (
                <iframe
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen=""
                    className={styles.videoPlayer}
                    frameBorder="0"
                    src={url}
                    title={title}
                />
            )}
        </div>
    );
};

export default VideoPlayer;
