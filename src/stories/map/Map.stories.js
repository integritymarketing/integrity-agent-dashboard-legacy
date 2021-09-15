import React from "react";

import MapComponent from "../../pages/contacts/contactRecordInfo/mapbox";

export default {
  title: "Design System/Map",
  component: MapComponent,
};

const Template = (args) => <MapComponent {...args} />;

export const Map = Template.bind({});
Map.args = {
  data: [
    {
      lat: -77.10853099823,
      lng: 38.880100922392,
    },
    {
      lat: -75.28784,
      lng: 40.008008,
    },
    {
      lat: -77.043959498405,
      lng: 38.903883387232,
    },
  ],
};
