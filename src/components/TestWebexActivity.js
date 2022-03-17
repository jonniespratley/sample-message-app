import React from 'react';
import {useActivity, useRoom, useActivityStream, WebexActivityVirtualStream} from '@webex/components';

export const TestWebexActivity = ({ title = "Test Panel", roomID }) => {
    const [activitiesData, dispatch] = useActivityStream(roomID);
    
    return (
      <div>
        <h2>{title}</h2>
        <WebexActivityVirtualStream roomID={roomID}/>
        
      </div>
    );
  };
