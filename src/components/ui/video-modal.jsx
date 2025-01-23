import Modal from "components/ui/modal";
import React from "react";

const VideoModal = ({
  modalOpen,
  handleCloseModal,
  videoUrl,
  testId,
  ...props
}) => {
  return (
    <React.Fragment>
      <div {...props}></div>
      {modalOpen && (
        <Modal
          open={true}
          wide
          onClose={() => handleCloseModal()}
          labeledById="dialog_video_label"
          descById="dialog_video_desc"
          testId={testId}
          isVideo={true}
        >
          <iframe
            title="vimeo-player"
            src={`${videoUrl}?autoplay=1`}
            width="100%"
            height="320"
            frameBorder="0"
            allow="autoplay"
            allowFullScreen
          />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default VideoModal;
