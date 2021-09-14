import React from "react";
import { action } from "@storybook/addon-actions";

import DetailsTable from "components/ui/DetailsTable";
import CellData from "components/ui/DetailsTable/CellData";

export default {
  title: "Design System/DetailsTable",
  component: DetailsTable,
};

const Template = (args) => (
  <div style={{ marginTop: 30, width: 835, maxWidth:'100%' }}>
    <DetailsTable {...args} />
  </div>
);

const Row = ({ item, className }) => {
    return (<div className={className}>
        <CellData header={item.name} subText={item.sub1} secondarySubText={item.sub2} />
        <CellData header={item.location} subText={item.address1} secondarySubText={item.address2} />
    </div>)
}

const items = [{
    name: 'Paul McKnight, MD',
    sub1: 'General Practitioner',
    sub2: 'paulmcknight@doctor.com',
    location: '(809) 444-5678',
    address1: '4567 Doctor Street NW,',
    address2: 'Brooklyn, NY 11223',
}, {
    name: 'Client 2',
    sub1: 'client2 subheader',
    sub2: 'client2 subheader2',
    location: 'Client 2 location 2',
    address1: 'XYZ',
    address2: 'PQR',
}, {
    name: 'Client 3',
    sub1: 'client3 subheader',
    location: 'Client 3 location 1',
    address1: 'XYZ',
},{
    name: 'Client 4',
    sub1: 'client4 subheader',
    sub2: 'client4 subheader2',
    location: 'Client 4 location 2',
    address1: 'XYZ',
    address2: 'PQR',
}]

export const DetailsTableWithItems = Template.bind({});
DetailsTableWithItems.args = {
    items,
    Row,
    onDelete: action('Delete button'),
    onEdit: action('Edit button'),
};
