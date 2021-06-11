import React from "react";

import { action } from "@storybook/addon-actions"

import { ToastContextProvider } from "../../components/ui/Toast/ToastContext";
import useToast from "../../hooks/useToast";

const ShowToast = ({ message, time, type, link, onClickHandler }) => {
    const addToast = useToast()
    return <div>
        <button onClick={() => addToast({ message, time, type, link, onClickHandler })}>Show toast</button>
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

export const SuccessToastWithLink = Template.bind({});
SuccessToastWithLink.args = {
  type: 'success',
  message: 'Success message 1',
  link: 'Click here',
  onClickHandler: action('Success toast link clicked'),
  time: 30000
};

export const SuccessToastWithUndoLink = Template.bind({});
SuccessToastWithUndoLink.args = {
  type: 'success',
  message: 'Success message',
  link: 'Undo',
  onClickHandler: action('Action messaging goes here and here'),
  time: 45000
};

export const ErrorToast = Template.bind({});
ErrorToast.args = {
  type: 'error',
  message: 'Error, update unsuccessful.',
  time: 30000
};

export const ActionToast = Template.bind({});
ActionToast.args = {
  type: 'action',
  message: 'Action message 1',
  time: 30000
};
