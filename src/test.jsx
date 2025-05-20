import AppGlobalProvider from 'agentSharedContext/AppGlobalProvider';
import { useAgentDetails } from 'agentSharedContext/useAgentContext';

import React from 'react';

const Test = () => {
  const { agentState } = useAgentDetails();
  console.log('Agent State:', agentState);
  return (
    <AppGlobalProvider>
      <div>
        <h1>Test</h1>
        <p>Welcome to the Test!</p>
      </div>
    </AppGlobalProvider>
  );
};

Test.propTypes = {
  // No props needed for this component currently
};

export default Test;
