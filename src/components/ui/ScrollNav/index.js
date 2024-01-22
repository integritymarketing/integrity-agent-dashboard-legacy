import React, { forwardRef, useEffect, useState } from "react";
import debounce from "debounce";
import "./index.scss";

const SCROLL_BEHAVIOR = {
    behavior: "smooth",
};

function getNavElements(sections, sectionRefs, activeSectionID, setActiveSectionID, setIsScrolling) {
    const rows = [];
    var key = 0;
    for (const section of sections) {
        if (section.header) {
            rows.push(
                <div className={"nav-header"} key={key++}>
                    {section.header}
                </div>
            );
        } else {
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
                </li>
            );
        }
    }
    return rows;
}

export default forwardRef(({ initialSectionID, sections, scrollToInitialSection = true }, refs) => {
    const [activeSectionID, setActiveSectionID] = useState(initialSectionID);
    const [isScrolling, setIsScrolling] = useState(false);
    const navElements = getNavElements(sections, refs, activeSectionID, setActiveSectionID, setIsScrolling);

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
            { threshold: 0.8 }
        );
        let debouncedOnScroll = debounce(onScroll, 100);
        window.addEventListener("scroll", debouncedOnScroll);
        return function cleanup() {
            window.removeEventListener("scroll", debouncedOnScroll);
            observer.disconnect();
        };
    }, [refs, isScrolling, activeSectionID, setIsScrolling]);

    return (
        <div className={"scroll-nav"}>
            <div className={"navigation-container"}>
                <ul className={"navigation"}>{navElements}</ul>
            </div>
        </div>
    );
});
