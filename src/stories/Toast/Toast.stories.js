import React from "react";

import { ToastContextProvider } from "../../components/ui/Toast/ToastContext";
import useToast from "../../hooks/useToast";

const ShowToast = ({ message, time, type }) => {
    const addToast = useToast()
    return <div>
        <button onClick={() => addToast({ message, time, type })}>Show toast</button>
    </div>
}

export default {
  title: "Design System/useToast",
  component: ShowToast
};

const Template = (args) => <ToastContextProvider><ShowToast {...args} /></ToastContextProvider>;

export const SuccessToast = Template.bind({});
SuccessToast.args = {
  type: 'success',
  message: 'Success message 1',
  time: 3000
};
