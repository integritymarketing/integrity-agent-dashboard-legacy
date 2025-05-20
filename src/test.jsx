// import AppGlobalProvider from 'agentSharedContext/AppGlobalProvider';
// import { useAgentDetails } from 'agentSharedContext/useAgentContext';

import userState from "hostContext/userState";

import React from 'react';

const Test = () => {
  // const { agentState } = useAgentDetails();
  // console.log('Agent State:', agentState);
  const [count, setCount] = userState();
  return (
      <div>
        <h1>Test</h1>
        <p>Welcome to the Test!</p>
        <button onClick={() => setCount((count) => count + 1)}>
          count in Dashboard Application: {count}
        </button>
      </div>
  );
};

Test.propTypes = {
  // No props needed for this component currently
};

export default Test;
