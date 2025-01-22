import TrackPageviews from "components/functional/track-pageviews";
import ScrollToTop from "components/functional/scroll-to-top";
import { FlashProvider } from "contexts/flash";
import FlashMessage from "partials/flash-message";

const AppRouter = ({ children }) => (
    <>
        <TrackPageviews />
        <ScrollToTop />
        <FlashProvider>
            <FlashMessage />
            {children}
        </FlashProvider>
    </>
);

export default AppRouter;
