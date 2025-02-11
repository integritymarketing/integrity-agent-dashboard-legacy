import React from "react";
import CenteredSection from "components/CenteredSection";
import {
  ContentContainer,
  ParallaxContainer,
} from "@integritymarketing/ui-container-components";
import VideoPlayer from "components/VideoPlayer";

import useConstants from "./constants";

import image from "./image.png";

import styles from "./styles.module.scss";

const VideoSection = () => {
  const { CENTERED_TEXT, CENTERED_TITLE, VIDEO_URL } = useConstants();

  return (
    <div className={styles.videoSection}>
      <ParallaxContainer className={styles.parallaxContainer} image={image}>
        <ContentContainer>
          <CenteredSection text={CENTERED_TEXT} title={CENTERED_TITLE} />
        </ContentContainer>
      </ParallaxContainer>

      <VideoPlayer className={styles.videoPlayer} url={VIDEO_URL} />
    </div>
  );
};

export default VideoSection;
