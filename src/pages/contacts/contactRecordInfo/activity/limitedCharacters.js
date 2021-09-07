import React, { useEffect, useState, useCallback } from "react";

export default ({ characters, size }) => {
  const [viewMore, setViewMore] = useState(true);
  const [viewText, setViewText] = useState("");

  const limitedCharacters = useCallback(
    (size) => {
      if (characters && characters.length > size) {
        const limitedValue = characters.slice(0, size);
        setViewText(limitedValue);
        setViewMore(true);
      } else {
        setViewText(characters);
        setViewMore(false);
      }
    },
    [characters]
  );
  useEffect(() => {
    limitedCharacters(size);
  }, [size, limitedCharacters]);

  function formattedText(value) {
    if (!value) {
      return;
    }
    return value.split(",").map((item) => <div>{item}</div>);
  }

  return (
    <span>
      {formattedText(viewText)}
      {characters.length > size && (
        <>
          {viewMore ? (
            <button onClick={() => limitedCharacters(characters.length)}>
              View More
            </button>
          ) : (
            <button onClick={() => limitedCharacters(size)}>View Less</button>
          )}
        </>
      )}
    </span>
  );
};
