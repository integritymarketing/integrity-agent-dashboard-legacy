import { ActionButton } from "@integritymarketing/ui-button-components";

import Styles from "./GetStarted.module.scss";

export default function GetStarted() {
    return (
        <div className={Styles.container}>
            <p className={Styles.heading}>Easy to Get Started</p>
            <p className={Styles.text}>
                Ready to reach your full potential as an agent? Integrity helps you make it happen. It’s simple to learn
                and free to use. Discover all the amazing ways it can empower you.
            </p>
            <div className={Styles.getStarted}>
                <ActionButton
                    text="Get Started"
                    onClick={() => {
                        window.open(`${import.meta.env.VITE_AUTH_BASE_URL}/register?client_id=AEPortal`);
                    }}
                />
            </div>
        </div>
    );
}
