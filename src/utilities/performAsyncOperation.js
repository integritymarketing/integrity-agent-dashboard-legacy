import * as Sentry from "@sentry/react";
const performAsyncOperation = async (
    operation,
    setLoading,
    onSuccess,
    onError
) => {
    setLoading(true);
    try {
        const data = await operation();
        onSuccess(data);
    } catch (err) {
        Sentry.captureException(err);
        onError && onError(err);
    } finally {
        setLoading(false);
    }
};

export default performAsyncOperation;