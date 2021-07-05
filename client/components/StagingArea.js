import React, { useEffect, useState } from 'react';

const StagingArea = (props) => {
  const { dips } = props;
  console.log(dips);
  return (
    <div>
      <h2>Staging Area</h2>
      {dips.map((dip) => {
        let { day, month, year } = dip.time;
        return (
          <div>
            {`${month}-${day}-${year}`} Low:{dip.low}
          </div>
        );
      })}
    </div>
  );
};

export default StagingArea;
