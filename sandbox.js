let itemsIds = [
  'c0270a70-d841-11eb-9cb2-cfdb30c70966',
  'b94c20a0-d841-11eb-9efc-3f4590d442ae',
  '81a8f6a0-d841-11eb-a4e5-af1950fe4a84',
  '69128f70-d841-11eb-9511-0d3f153f12e6',
  'd33057d0-d831-11eb-a954-81c4a13d6973',
  'c0270a70-d841-11eb-9cb2-cfdb30c70966',
  'b94c20a0-d841-11eb-9efc-3f4590d442ae',
  '81a8f6a0-d841-11eb-a4e5-af1950fe4a84',
];
let activities = [
  'bc2266b2-d6c3-11eb-aef5-6d77908bfcbb',
  'c6d88ee0-d6c3-11eb-8b76-fb213805e947',
  '5f5ad4a0-d7b6-11eb-a8bc-1badfdac8742',
  'd33057d0-d831-11eb-a954-81c4a13d6973',
  '69128f70-d841-11eb-9511-0d3f153f12e6',
  '81a8f6a0-d841-11eb-a4e5-af1950fe4a84',
  'b94c20a0-d841-11eb-9efc-3f4590d442ae',
  'c0270a70-d841-11eb-9cb2-cfdb30c70966',
];
console.log(itemsIds.sort());
console.log(activities.sort());

let cache = new Map();

cache.set('name', 'value');
cache.get('name');

cache.has('name');
cache.size;
[...cache.keys()][0] === 'name';
[...cache.values()][0] === 'value';

class Room {
  constructor(sdkConvo) {
    //this.ID = constructHydraId('room', sdkConvo.id);
    this.type = '';
    this.title = sdkConvo.displayName;
    this.created = sdkConvo.published;
    this.lastActivity = '';
    this.lastSeenActivityDate = sdkConvo.lastSeenActivityDate;
    this.lastReadableActivityDate = sdkConvo.lastReadableActivityDate;
  }
}

let r = new Room({
  id: '123',
  displayName: 'JS',
  lastSeenActivityDate: '2022-03-16T15:57:15.696Z',
  lastReadableActivityDate: '2022-03-16T15:57:15.696Z',
  published: '2022-03-16T15:57:15.696Z',
});
console.log(JSON.stringify(r, null, 2));

function fromSDKRoom(sdkConvo) {
  return {
    type: sdkConvo.objectType,
    title: sdkConvo.displayName,
    created: sdkConvo.published,
    lastActivity: sdkConvo.lastReadableActivityDate,
    lastSeenActivityDate: sdkConvo.lastSeenActivityDate,
  };
}
