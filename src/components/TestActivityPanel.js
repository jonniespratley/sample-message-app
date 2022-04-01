import React from "react";
import { Panel } from "./Panel";
import { hooks } from "@webex/components/src";

const { useActivityStream, usePerson, useActivity } = hooks;

const TestActivityPanel = ({ title = "Test Panel", activityID }) => {
  const activity = useActivity(activityID);
  const person = {}; //usePerson(activity?.personID);

  return (
    <Panel>
      <h2>{title}</h2>
      <p>
        The following data is the result from the <code>activityID</code> hook.
      </p>
      <pre>activity: {JSON.stringify(activity, null, 2)}</pre>
      <pre>person: {JSON.stringify(person, null, 2)}</pre>
    </Panel>
  );
};
