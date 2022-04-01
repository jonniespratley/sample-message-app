import React, { useEffect, useState } from "react";
import Webex from "webex";
import WebexSDKAdapter from "@webex/sdk-component-adapter";
import {
  ActivityHeader,
  WebexDataProvider,
  WebexActivity,
  WebexAvatar,
  hooks,
  WebexActivityStream,
} from "@webex/components";

import { constructHydraId } from "@webex/common";
import { TestWebexActivity, TestActivityPanel } from "./components";

import "./App.css";
import { Panel } from "./components/Panel";

const { useActivityStream, usePerson, useActivity } = hooks;

if (window.webexSDKAdapterSetLogLevel) {
  //window.webexSDKAdapterSetLogLevel("debug");
}

const webexUtils = {
  constructHydraId,
};

window.webexUtils = webexUtils;

function fromSDKRoom(sdkConvo) {
  return {
    _id: sdkConvo.id,
    ID: constructHydraId("room", sdkConvo.id),
    type: sdkConvo.objectType,
    title: sdkConvo.displayName,
    created: sdkConvo.published,
    lastActivity: sdkConvo.lastReadableActivityDate,
    lastSeenActivityDate: sdkConvo.lastSeenActivityDate,
  };
}

const sampleIds = [
  "Y2lzY29zcGFyazovL3VzL01FU1NBR0UvOTNmN2IyYzAtOWIyMi0xMWVjLTkwNWUtMTllMzg2MDZhOGEw",
];

function App() {
  const [adapterConnected, setAdapterConnected] = useState(false);
  const [adapterConnecting, setAdapterConnecting] = useState(false);
  const [accessToken, setAccessToken] = useState(
    `${process.env.WEBEX_ACCESS_TOKEN}`
  );
  const [roomID, setRoomID] = useState(
    "Y2lzY29zcGFyazovL3VzL1JPT00vYmMyMjY2YjAtZDZjMy0xMWViLWFlZjUtNmQ3NzkwOGJmY2Ji"
  );
  const [personID, setPersonID] = useState(
    "Y2lzY29zcGFyazovL3VzL1BFT1BMRS82NTZlNzE0NS0xMzk2LTRhMzctYjFiOC1iYzYxMTU1NzQ5ZTA"
  );

  const [activityID, setActivityID] = useState(sampleIds[0]);
  const [text, setText] = useState("");
  const [formData, setFormData] = useState({});
  const [activityIDs, setActivityIDs] = useState(sampleIds);
  const adapter = React.useRef();
  const [rooms, setRooms] = useState([]);


  const loadRooms = (e) => {
    return adapter.current.datasource.internal.conversation
      .list()
      .then((convos) => {
        const data = convos
          .filter((c) => c.displayName !== undefined)
          .map((c) => fromSDKRoom(c));

        console.table(data);

        setRooms(data);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      roomID,
      personID,
      activityID,
      activityIDs,
    };
    window.ROOMID = data.roomID;
    setFormData(data);

    console.log("Submit Form", data);
    return false;
  };

  const handleConnect = async () => {
    const webex = new Webex({
      credentials: accessToken,
    });
    adapter.current = new WebexSDKAdapter(webex);
    setAdapterConnecting(true);
    await adapter.current.connect();
    setAdapterConnected(true);
    setAdapterConnecting(false);
    window.webexSDKAdapter = adapter.current;
    console.log("window.webexSDKAdapter", window.webexSDKAdapter);
  };

  const handleDisconnect = async () => {
    console.log("Disconnecting....");
    setAdapterConnecting(false);
    await adapter.current.disconnect();
    setAdapterConnected(false);
  };

  const handleCreateMessage = (e) => {
    e.preventDefault();
    adapter.current.datasource.messages
      .create({ text, roomId: roomID })
      .then(() => {
        setText("");
      });
    return false;
  };

  const handleRoomChange = (e) => {
    setRoomID(e.currentTarget.value);
  };

  let pastHandle = null;
  const handleLoadingPastActivities = () => {
    if (pastHandle) {
      pastHandle.unsubscribe();
    }
    pastHandle = adapter.current.roomsAdapter
      .getPastActivities(roomID, 25)
      .subscribe(console.table);
    adapter.current.roomsAdapter.hasMoreActivities(roomID);
  };

  useEffect(() => {
    async function doConnect() {
      await handleConnect();
      //await loadRooms();
    }

    doConnect();

    return () => {
      handleDisconnect();
    };
  }, []);

  function handleRowRender(id) {
    return <div>{id}</div>;
  }



  return (
    <div className="App">
      <div className="App-header">
        <div className="flex"></div>
      </div>
      <div className="App-layout">
        <div className="App-sidebar">
          <Panel title="Settings">
            <fieldset className="flex__item">
              <legend>Access Token</legend>
              <input
                type="text"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
              <p>
                Status:{" "}
                <span>
                  {!adapterConnected && !adapterConnecting && (
                    <span>Disconnected</span>
                  )}
                  {adapterConnecting && <span>Connecting...</span>}
                  {adapterConnected && (
                    <span className="success">Connected</span>
                  )}
                </span>
              </p>
              <button onClick={handleConnect} disabled={adapterConnected}>
                Connect
              </button>
              <button onClick={handleDisconnect} disabled={!adapterConnected}>
                Disconnect
              </button>
            </fieldset>
            <form onSubmit={handleSubmit}>
              <fieldset>
                <legend>Rooms</legend>
                <select onChange={handleRoomChange}>
                  {rooms &&
                    rooms.map((r) => (
                      <option key={r.ID} value={r.ID}>
                        {r.title}
                      </option>
                    ))}
                </select>
                <button onClick={loadRooms} type="button">
                  Load rooms
                </button>
              </fieldset>

              <fieldset>
                <legend>Room ID</legend>
                <input
                  type="text"
                  value={roomID}
                  onChange={(e) => setRoomID(e.target.value)}
                />
              </fieldset>
              <fieldset>
                <legend>Person ID</legend>
                <input
                  type="text"
                  value={personID}
                  onChange={(e) => setPersonID(e.target.value)}
                />
              </fieldset>
              <fieldset>
                <legend>Activity ID</legend>
                <input
                  type="text"
                  value={activityIDs.join(",")}
                  onChange={(e) => {
                    let ids = e.target.value.split(",");
                    let [id] = ids;
                    setActivityID(id);
                    setActivityIDs(ids);
                  }}
                />
              </fieldset>
              <button type="submit">Update</button>
              <button type="reset" onClick={() => setFormData({})}>
                Reset
              </button>
            </form>
            <fieldset>
              <legend>Past Activities</legend>
              <button onClick={handleLoadingPastActivities}>
                Fetch Past Activities
              </button>
            </fieldset>
            <fieldset>
              <legend>Debug</legend>
              <pre>formData: {JSON.stringify(formData, null, 2)}</pre>
            </fieldset>
          </Panel>
        </div>

        <div className="App-content">
        

          {adapterConnected && (
            <WebexDataProvider adapter={adapter.current}>
              <TestActivityPanel activityID={activityID} />
              {/*
              
              formData.personID && (
                <Panel title="WebexAvatar">
                  <WebexAvatar personID={formData.personID} />
                </Panel>
              )*/}

              {/*formData.personID && (
                <Panel title="ActivityHeader">
                  <ActivityHeader personID={formData.personID} />
                </Panel>
              )*/}



              {/*formData.activityID && (
                <Panel title="WebexActivity">
                  {activityIDs &&
                    activityIDs.map((o, index) => (
                      <WebexActivity activityID={o} key={index} />
                    ))}
                </Panel>
                    )*/}
              <Panel>
                {formData.roomID && (
                  <WebexActivityStream
                    roomID={formData.roomID}
                    style={{ height: 600 }}
                  />
                )}
                <form onSubmit={handleCreateMessage}>
                  <fieldset className="flex">
                    <input
                      type="text"
                      placeholder="Write a message..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <button type="submit">Send</button>
                  </fieldset>
                </form>
              </Panel>

              {/*<ErrorBoundary FallbackComponent={ErrorFallback}>
                <TestWebexActivity roomID={formData.roomID || roomID} />
              </ErrorBoundary>
                */}
            </WebexDataProvider>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
