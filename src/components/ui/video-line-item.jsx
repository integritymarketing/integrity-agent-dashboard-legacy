import React, { useState } from "react";
import VideoModal from "components/ui/video-modal";
import LineItem from "components/ui/line-item";
import ComputerIcon from "components/icons/computer";

const VideoLineItem = ({ resource }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCloseModal = () => setModalOpen(false);

  return (
    <li key={resource.name}>
      <LineItem
        href={resource.videoUrl}
        icon={<ComputerIcon />}
        actionIcon={null}
        onClick={(e) => {
          e.preventDefault();
          if (!modalOpen) {
            setModalOpen(true);
          }
        }}
      >
        <VideoModal
          className="text-body text-bold"
          videoUrl={resource.videoUrl}
          modalOpen={modalOpen}
          testId="video-modal"
          handleCloseModal={handleCloseModal}
        >
          {resource.name}
        </VideoModal>
      </LineItem>
    </li>
  );
};

export default VideoLineItem;
