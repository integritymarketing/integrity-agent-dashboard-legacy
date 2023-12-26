import React from "react";

import Box from "@mui/material/Box";

import PropTypes from "prop-types";

import SAPermissionModal from "./ActivePermissionModal";
import styles from "./styles.module.scss";

function LifeInfoModal({ isModalOpen, setIsModalOpen }) {
    return (
        <SAPermissionModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            title="Life Self-Attestation"
            subTitle="Final Expense"
            content={
                <>
                    <Box>
                        Etiam porta sem malesuada magna mollis euismod. Vestibulum id ligula porta felis euismod semper.
                        Nullam quis risus eget urna mollis ornare vel eu leo. Morbi leo risus, porta ac consectetur ac,
                        vestibulum at eros. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
                        erat a ante venenatis dapibus posuere velit aliquet.
                    </Box>
                    <ul className={styles.listStyle}>
                        <li>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</li>
                    </ul>
                </>
            }
        />
    );
}

LifeInfoModal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
};

export default LifeInfoModal;
