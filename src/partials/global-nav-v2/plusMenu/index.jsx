import { useState, useCallback } from "react";
import { Menu, MenuItem, MenuList, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useCreateNewQuote } from "providers/CreateNewQuote";
import { QuickQuoteModals } from "components/CreateNewQuoteContainer";

import styles from "./styles.module.scss";

import ContactsIcon from "../assets/Icon-Contacts.svg";
import LeadIcon from "../assets/Icon-Lead.svg";
import QuoteIcon from "../assets/Icon-Quote.svg";
import PlusIcon from "../assets/icons-Plus.svg";

export default function PlusMenu() {
    const { setContactSearchModalOpen } = useCreateNewQuote();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleCreateQuote = useCallback(() => {
        setContactSearchModalOpen(true);
        setAnchorEl(null);
    }, [setContactSearchModalOpen]);

    const handleNavigateToContact = useCallback(() => {
        setAnchorEl(null);
        navigate("/contact/add-new");
    }, [navigate]);

    const handleNavigateToLeadCenter = useCallback(() => {
        setAnchorEl(null);
        window.location.href = `${process.env.REACT_APP_AUTH0_LEADS_REDIRECT_URI}/campaigns`;
    }, []);

    return (
        <>
            <button
                className={styles.plusIcon}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            >
                <img src={PlusIcon} alt="Plus Icon" />
            </button>
            <Menu
                id="plus-menu"
                aria-labelledby="plus-menu-button"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transition
            >
                <MenuList
                    sx={{ padding: "0px 8px" }}
                    className={styles.menuList}
                >
                    <Typography
                        fontWeight={600}
                        letterSpacing="normal"
                        className={`text-body text-navyblue ${styles.createNewTypography}`}
                    >
                        Create New
                    </Typography>
                    <MenuItem
                        onClick={handleCreateQuote}
                        className={styles.menuItem}
                        sx={{ padding: "6px 8px" }}
                    >
                        <img src={QuoteIcon} alt="Quote Icon" />
                        Quote
                    </MenuItem>
                    <MenuItem
                        onClick={handleNavigateToContact}
                        className={styles.menuItem}
                        sx={{ padding: "6px 8px" }}
                    >
                        <img src={ContactsIcon} alt="Contacts Icon" />
                        Contact
                    </MenuItem>
                    <MenuItem
                        onClick={handleNavigateToLeadCenter}
                        className={styles.menuItem}
                        sx={{ padding: "6px 8px" }}
                    >
                        <img src={LeadIcon} alt="Lead Icon" />
                        Lead in LeadCENTER
                    </MenuItem>
                </MenuList>
            </Menu>
            <QuickQuoteModals />
        </>
    );
}
