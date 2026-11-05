'use strict';
// Official public track links and Bandcamp og:video embeds, checked 2026-11-05.
const PJVI_CATALOG=[
  {
    "id": "vol1-1",
    "volume": 1,
    "number": 1,
    "title": "R&B Vocal Warm Up #1",
    "duration": "04:09",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-warm-up-1",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-1",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=2649935890/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol1-2",
    "volume": 1,
    "number": 2,
    "title": "R&B Vocal Warm Up #2",
    "duration": "04:52",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-warm-up-2",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-1",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=2130022359/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol1-3",
    "volume": 1,
    "number": 3,
    "title": "R&B Vocal Warm Up #3",
    "duration": "04:34",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-warm-up-3",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-1",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=2379554372/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol1-4",
    "volume": 1,
    "number": 4,
    "title": "R&B Vocal Warm Up #4",
    "duration": "11:35",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-warm-up-4",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-1",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=2773250707/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol1-5",
    "volume": 1,
    "number": 5,
    "title": "R&B Vocal Warm Up #5",
    "duration": "06:12",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-warm-up-5",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-1",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=2341245701/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol1-6",
    "volume": 1,
    "number": 6,
    "title": "R&B Vocal Warm Up #6",
    "duration": "04:28",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-warm-up-6",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-1",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=37353568/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol1-7",
    "volume": 1,
    "number": 7,
    "title": "R&B Vocal Warm Up #7",
    "duration": "03:51",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-warm-up-7",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-1",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=3992413231/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol1-8",
    "volume": 1,
    "number": 8,
    "title": "R&B Vocal Warm Up #8",
    "duration": "06:09",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-warm-up-8",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-1",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=1201637406/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol1-9",
    "volume": 1,
    "number": 9,
    "title": "R&B Vocal Warm Up #9",
    "duration": "06:44",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-warm-up-9",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-1",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=2798335858/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol1-10",
    "volume": 1,
    "number": 10,
    "title": "R&B Vocal Warm Up #10",
    "duration": "06:11",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-warm-up-10",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-1",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=1976050094/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol1-11",
    "volume": 1,
    "number": 11,
    "title": "R&B Vocal Warm Up #11",
    "duration": "06:57",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-warm-up-11",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-1",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=103669323/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol1-12",
    "volume": 1,
    "number": 12,
    "title": "R&B Vocal Warm Up #12",
    "duration": "08:01",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-warm-up-12",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-1",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=2483040183/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol2-1",
    "volume": 2,
    "number": 1,
    "title": "R&B Vocal Exercise #1",
    "duration": "03:27",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-exercise-1",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-2",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=606610158/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol2-2",
    "volume": 2,
    "number": 2,
    "title": "R&B Vocal Exercise #2",
    "duration": "03:01",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-exercise-2",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-2",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=1014215841/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol2-3",
    "volume": 2,
    "number": 3,
    "title": "R&B Vocal Exercise #3",
    "duration": "04:54",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-exercise-3",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-2",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=3315049845/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol2-4",
    "volume": 2,
    "number": 4,
    "title": "R&B Vocal Exercise #4",
    "duration": "03:27",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-exercise-4",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-2",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=709564574/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol2-5",
    "volume": 2,
    "number": 5,
    "title": "R&B Vocal Exercise #5",
    "duration": "04:08",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-exercise-5",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-2",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=1997645014/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol2-6",
    "volume": 2,
    "number": 6,
    "title": "R&B Vocal Exercise #6",
    "duration": "02:24",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-exercise-6",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-2",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=3038857858/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol2-7",
    "volume": 2,
    "number": 7,
    "title": "R&B Vocal Exercise #7",
    "duration": "02:40",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-exercise-7",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-2",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=197388953/size=large/tracklist=false/artwork=small/"
  },
  {
    "id": "vol2-8",
    "volume": 2,
    "number": 8,
    "title": "R&B Vocal Exercise #8",
    "duration": "06:51",
    "url": "https://pjvivocalstudio.bandcamp.com/track/r-b-vocal-exercise-8",
    "albumUrl": "https://pjvivocalstudio.bandcamp.com/album/r-b-vocal-exercises-vol-2",
    "embedUrl": "https://bandcamp.com/EmbeddedPlayer/v=2/track=2686325283/size=large/tracklist=false/artwork=small/"
  }
];
if(typeof module!=='undefined')module.exports=PJVI_CATALOG;
