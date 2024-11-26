import { useEffect, useCallback } from "react";

const useCustomLiveChat = (firstName, lastName, email, phone, location, page = "/help") => {
    useEffect(() => {
        if (window.fcWidget && firstName) {
            const handleWidgetClosed = () => {
                const fcFrame = document.getElementById("fc_frame");
                if (fcFrame) {
                    fcFrame.style.display = "none";
                }
            };

            window.fcWidget.on("widget:closed", handleWidgetClosed);

            window.fcWidget.user.setProperties({
                firstName,
                lastName,
                email,
                phone,
            });

            return () => {
                window.fcWidget.off("widget:closed", handleWidgetClosed);
            };
        }
    }, [firstName, lastName, email, phone, location.pathname, page]);

    useEffect(() => {
        const fcFrame = document.getElementById("fc_frame");
        if (location.pathname === page) {
            // Hide the floating icon when on the specified page
            if (fcFrame) {
                fcFrame.style.display = "none";
            }
        } else {
            if (fcFrame) {
                fcFrame.style.display = "block";
            }
        }
    }, [location.pathname, page]);

    const handleOpenLiveChat = useCallback(() => {
        const fcFrame = document.getElementById("fc_frame");
        if (fcFrame) {
            fcFrame.style.display = "block";
        }
        if (window.fcWidget) {
            window.fcWidget.open();
        }
    }, []);

    const handleCloseLiveChat = useCallback(() => {
        if (window.fcWidget) {
            window.fcWidget.close();
        }
    }, []);

    return { handleOpenLiveChat, handleCloseLiveChat };
};

export default useCustomLiveChat;
