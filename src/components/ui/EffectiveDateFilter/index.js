import React, { useState } from "react";
import Textfield from "components/ui/textfield";
import "./index.scss";
import "scss/_forms.scss";

export default function EffectiveDateFilter({ onChange, date }) {
  var [isCustom, setIsCustom] = useState(false);
  return (
    <div
      class="effective-date-filter"
      onChange={(e) => setIsCustom(e.target.value === "custom")}
    >
      <div class="header">Effective Date</div>
      <label class="option" for="annual">
        <input
          type="radio"
          id="annual"
          name="type"
          value="annual"
          defaultChecked
          onChange={() => onChange()}
        />
        Annual
      </label>
      <label class="option" for="custom">
        <input
          type="radio"
          id="custom"
          name="type"
          value="custom"
          onChange={() => onChange(date)}
        />
        Custom
      </label>
      <Textfield
        value={isCustom ? date : null}
        format="mm/dd/yyyy"
        placeholder="mm/dd/yyyy"
        type="date"
        disabled={!isCustom}
        onDateChange={(date) => onChange(date)}
      />
    </div>
  );
}
