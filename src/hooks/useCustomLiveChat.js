import { useEffect, useCallback } from "react";

const useCustomLiveChat = (firstName, lastName, email, phone, location, page = "/help") => {
    useEffect(() => {
        if (window.fcWidget && firstName) {
            window.fcWidget.on("widget:closed", function () {
                if (location.pathname === page) {
                    const fcFrame = document.getElementById("fc_frame");
                    if (fcFrame) {
                        fcFrame.style.display = "none";
                    }
                }
            });
            window.fcWidget.user.setProperties({
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
            });
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
        window.fcWidget.open();
    }, []);

    const handleCloseLiveChat = useCallback(() => {
        const fcFrame = document.getElementById("fc_frame");
        if (window.fcWidget) {
            window.fcWidget.close();
            if (fcFrame) {
                fcFrame.style.display = "none";
            }
        }
    }, []);

    return { handleOpenLiveChat, handleCloseLiveChat };
};

export default useCustomLiveChat;
