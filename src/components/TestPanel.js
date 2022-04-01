import React from "react";
import { Panel } from "./Panel";

const TestPanel = ({ title = "Test Panel", roomID }) => {
  const [activitiesData, dispatch] = useActivityStream(roomID);
  return (
    <Panel>
      <h2>{title}</h2>
      <p>
        The following data is the result from the <code>useActivityStream</code>{" "}
        hook.
      </p>
      <pre>{JSON.stringify(activitiesData, null, 2)}</pre>
    </Panel>
  );
};
