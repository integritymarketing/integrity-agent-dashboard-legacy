import PropTypes from "prop-types";
import { ConditionalCardLayout } from "@integritymarketing/clients-ui-kit";
import { Dialog, Paper, Stack, Typography } from "@mui/material";

function ConditionalPopupLayout({
    header,
    title,
    contentHeading,
    handleApplyClick,
    handleCancelClick,
    applyButtonDisabled,
    children,
    open,
    onClose,
}) {
    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm">
                <ConditionalCardLayout
                    header={header}
                    title={title}
                    submitLabel={"Next"}
                    handleApplyClick={handleApplyClick}
                    handleCancelClick={handleCancelClick}
                    applyButtonDisabled={applyButtonDisabled}
                >
                    <Paper sx={{ padding: 3, borderRadius: "8px", backgroundColor: "#FFFFF", boxShadow: "none" }}>
                        <Stack direction="column" spacing={1}>
                            <Stack>
                                <Typography variant="h5">{contentHeading}</Typography>
                            </Stack>
                            <Stack>{children}</Stack>
                        </Stack>
                    </Paper>
                </ConditionalCardLayout>
            </Dialog>
        </>
    );
}

ConditionalPopupLayout.propTypes = {
    header: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    contentHeading: PropTypes.string.isRequired,
    handleApplyClick: PropTypes.func.isRequired,
    handleCancelClick: PropTypes.func.isRequired,
    applyButtonDisabled: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};
export default ConditionalPopupLayout;
