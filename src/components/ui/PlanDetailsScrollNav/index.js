import { forwardRef, useEffect, useState } from "react";
import debounce from "debounce";
import "./index.scss";
import EffectiveDateFilter from "../EffectiveDateFilter";
import { getFirstEffectiveDateOption } from "utils/dates";
import getNextAEPEnrollmentYear from "utils/getNextAEPEnrollmentYear";
import PharmacyFilter from "../PharmacyFilter";

const SCROLL_BEHAVIOR = {
    behavior: "smooth",
};

function getNavElements(sections, sectionRefs, activeSectionID, setActiveSectionID, setIsScrolling, hidePharmacy) {
    const rows = [];
    let key = 0;
    for (const section of sections) {
        if (section.header) {
            rows.push(
                <div className={"nav-header"} key={key++}>
                    {section.header}
                </div>,
            );
        } else {
            if (hidePharmacy && section.label === "Pharmacy") {
                continue;
            }
            const ref = sectionRefs[section.id];
            rows.push(
                <li
                    onClick={() => {
                        setIsScrolling(true);
                        setActiveSectionID(section.id);
                        ref.current.scrollIntoView(SCROLL_BEHAVIOR);
                        setTimeout(() => setIsScrolling(false), 500);
                    }}
                    key={key++}
                    className={activeSectionID === section.id ? "selected" : undefined}
                >
                    {section.label}
                </li>,
            );
        }
    }
    return rows;
}

const currentYear = new Date().getFullYear();
const currentPlanYear = getNextAEPEnrollmentYear();

const EFFECTIVE_YEARS_SUPPORTED =
    currentPlanYear === currentYear ? [currentYear] : [currentYear, currentPlanYear].sort((a, b) => a - b);

export default forwardRef(function PlanDetailsScrollNav(
    { initialSectionID, sections, scrollToInitialSection = true, hidePharmacy = false },
    refs,
) {
    const initialeffDate = getFirstEffectiveDateOption(EFFECTIVE_YEARS_SUPPORTED);
    const [activeSectionID, setActiveSectionID] = useState(initialSectionID);
    const [effectiveDate] = useState(initialeffDate);
    const [isScrolling, setIsScrolling] = useState(false);
    const navElements = getNavElements(
        sections,
        refs,
        activeSectionID,
        setActiveSectionID,
        setIsScrolling,
        hidePharmacy,
    );

    useEffect(() => {
        if (initialSectionID && scrollToInitialSection) {
            refs[initialSectionID].current.scrollIntoView(SCROLL_BEHAVIOR);
        }
    }, [initialSectionID, refs, scrollToInitialSection]);

    useEffect(() => {
        function onScroll() {
            for (const id in refs) {
                if (refs[id]?.current) {
                    observer?.observe(refs[id]?.current);
                }
            }
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isScrolling) {
                    let lastActive = activeSectionID;
                    for (const id in refs) {
                        if (entry.target === refs[id]?.current) {
                            lastActive = id;
                        }
                    }
                    setActiveSectionID(lastActive);
                    observer.disconnect();
                }
            },
            { threshold: 0.8 },
        );
        const debouncedOnScroll = debounce(onScroll, 100);
        window.addEventListener("scroll", debouncedOnScroll);
        return function cleanup() {
            window.removeEventListener("scroll", debouncedOnScroll);
            observer.disconnect();
        };
    }, [refs, isScrolling, activeSectionID, setIsScrolling]);

    return (
        <div className={"scroll-nav"}>
            <div className={"navigation-container"}>
                <ul className={"navigation2"}>{navElements}</ul>
            </div>
            <div id="pharmacy-filter-section">
                <PharmacyFilter />
            </div>
            <div className={"plan-details-actions"}>
                <div className={"filter-section"}>
                    <EffectiveDateFilter
                        years={EFFECTIVE_YEARS_SUPPORTED}
                        initialValue={effectiveDate}
                        selectClassName={"plan-details-effective-date-select"}
                    />
                </div>
            </div>
        </div>
    );
});
