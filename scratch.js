console.log('test');
//const Webex = require('webex');
import Webex from 'webex';
import WebexSDKAdapter from '@webex/sdk-component-adapter';

console.log('WebexSDKAdapter');

const webex = new Webex({
  credentials: process.env.WEBEX_ACCESS_TOKEN,
});

// eslint-disable-next-line no-unused-vars
const webexSDKAdapter = new WebexSDKAdapter(webex);

console.log('webex', webex);

window.ROOMID =
  'Y2lzY29zcGFyazovL3VzL1JPT00vYmMyMjY2YjAtZDZjMy0xMWViLWFlZjUtNmQ3NzkwOGJmY2Ji';

// Subscribe
webexSDKAdapter.roomsAdapter.getPreviousActivities(ROOMID, 100).subscribe({
  next: (v) => console.log(`cache sub:`, v),
  complete: (v) => console.log(`complete: ${v}`),
});

// Fetch
webexSDKAdapter.roomsAdapter.fetchPastActivities(ROOMID);

// Cache
var cache = {};
var { activities } = webexSDKAdapter.roomsAdapter.roomActivities.get(ROOMID);
for (let [uuid, serverActivity] of activities) {
  let activity =
    webexSDKAdapter.activitiesAdapter.fromSDKActivity(serverActivity);
  cache[activity.ID] = activity;
  console.log(uuid, 'Obj =>', activity);
}

console.table(Object.values(cache));

function CacheMeOutside(adapter) {
  const cache = new Map();

  const cacheRoomActivities = (roomId) => {
    // Check if room has activities
    if (roomsAdapter.roomActivities.has(roomId)) {
      console.warn('Room has activities, lets cache them all');
      // If activites when get all activities and add to cache
    }

    //adapter.roomsAdapter.roomActivities.get()

    for (const [key, val] of adapter.roomsAdapter.roomActivities
      .get(roomId)
      .activities.entries()) {
      console.log('Cache key', key);

      const v = adapter.activitiesAdapter.fromSDKActivity(val);
      console.log(v);

      //webexSDKAdapter.activitiesAdapter.setActivityObservable(v.ID, v);
      adapter.activitiesAdapter.getActivity(v.ID).subscribe(console.log);
    }
  };

  return {
    cache,
    adapter,
    cacheRoomActivities,
  };
}