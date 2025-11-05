const { useState, useEffect } = React;

const OfficePlaylist = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tracks, setTracks] = useState([
    // Morning Gentle Start (70-90 BPM) - 10 songs
    { id: 1, title: "Warm Brew", artist: "Khruangbin", genre: "Psychedelic Rock", bpm: 85, timeBlock: "morning" },
    { id: 2, title: "Saudade", artist: "João Gilberto", genre: "Bossa Nova", bpm: 78, timeBlock: "morning" },
    { id: 3, title: "Sometimes", artist: "My Bloody Valentine", genre: "Shoegaze", bpm: 82, timeBlock: "morning" },
    { id: 4, title: "Tezeta", artist: "Mulatu Astatke", genre: "Ethiopian Jazz", bpm: 88, timeBlock: "morning" },
    { id: 5, title: "The Girl from Ipanema", artist: "Stan Getz & Astrud Gilberto", genre: "Bossa Nova", bpm: 72, timeBlock: "morning" },
    { id: 6, title: "To Here Knows When", artist: "My Bloody Valentine", genre: "Shoegaze", bpm: 75, timeBlock: "morning" },
    { id: 7, title: "Midnight Rider", artist: "The Allman Brothers", genre: "Southern Rock", bpm: 84, timeBlock: "morning" },
    { id: 8, title: "A Case of You", artist: "Joni Mitchell", genre: "Folk", bpm: 76, timeBlock: "morning" },
    { id: 9, title: "Yegelle Tezeta", artist: "Mahmoud Ahmed", genre: "Ethiopian Jazz", bpm: 86, timeBlock: "morning" },
    { id: 10, title: "Dreams", artist: "Fleetwood Mac", genre: "Soft Rock", bpm: 89, timeBlock: "morning" },
    
    // Active Collaboration (100-110 BPM) - 10 songs
    { id: 11, title: "Plastic Love", artist: "Mariya Takeuchi", genre: "City Pop", bpm: 108, timeBlock: "active" },
    { id: 12, title: "Levitating", artist: "Dua Lipa", genre: "Contemporary Pop", bpm: 103, timeBlock: "active" },
    { id: 13, title: "Mambo No. 5", artist: "Pérez Prado", genre: "Salsa", bpm: 105, timeBlock: "active" },
    { id: 14, title: "Money Trees", artist: "Kendrick Lamar", genre: "Hip Hop", bpm: 110, timeBlock: "active" },
    { id: 15, title: "Stay With Me", artist: "Miki Matsubara", genre: "City Pop", bpm: 106, timeBlock: "active" },
    { id: 16, title: "Blue Monday", artist: "New Order", genre: "New Wave", bpm: 109, timeBlock: "active" },
    { id: 17, title: "Valerie", artist: "Amy Winehouse", genre: "Soul", bpm: 104, timeBlock: "active" },
    { id: 18, title: "Ain't No Mountain High Enough", artist: "Marvin Gaye & Tammi Terrell", genre: "Soul", bpm: 108, timeBlock: "active" },
    { id: 19, title: "Oye Como Va", artist: "Santana", genre: "Latin Rock", bpm: 102, timeBlock: "active" },
    { id: 20, title: "The Less I Know The Better", artist: "Tame Impala", genre: "Psychedelic Rock", bpm: 107, timeBlock: "active" },
    
    // Focus Flow (60-90 BPM) - 10 songs
    { id: 21, title: "Avril 14th", artist: "Aphex Twin", genre: "Beats", bpm: 68, timeBlock: "focus" },
    { id: 22, title: "Resonance", artist: "Home", genre: "Synth Wave", bpm: 75, timeBlock: "focus" },
    { id: 23, title: "Blue in Green", artist: "Miles Davis", genre: "Jazz", bpm: 70, timeBlock: "focus" },
    { id: 24, title: "Holocene", artist: "Bon Iver", genre: "Indie Folk", bpm: 82, timeBlock: "focus" },
    { id: 25, title: "Midnight in a Perfect World", artist: "DJ Shadow", genre: "Beats", bpm: 88, timeBlock: "focus" },
    { id: 26, title: "In a Sentimental Mood", artist: "Duke Ellington & John Coltrane", genre: "Jazz", bpm: 65, timeBlock: "focus" },
    { id: 27, title: "Flamingo", artist: "Kero Kero Bonito", genre: "Indie Pop", bpm: 78, timeBlock: "focus" },
    { id: 28, title: "Breathe", artist: "Télépopmusik", genre: "Downtempo", bpm: 72, timeBlock: "focus" },
    { id: 29, title: "Awake", artist: "Tycho", genre: "Synth Wave", bpm: 85, timeBlock: "focus" },
    { id: 30, title: "Comptine d'un autre été", artist: "Yann Tiersen", genre: "French Jazz", bpm: 63, timeBlock: "focus" },
    
    // Afternoon Energy (100-130 BPM) - 10 songs
    { id: 31, title: "Get Lucky", artist: "Daft Punk", genre: "Funk", bpm: 116, timeBlock: "afternoon" },
    { id: 32, title: "Gecko", artist: "Oliver Heldens", genre: "House", bpm: 128, timeBlock: "afternoon" },
    { id: 33, title: "Money Machine", artist: "100 gecs", genre: "Hyperpop", bpm: 125, timeBlock: "afternoon" },
    { id: 34, title: "L'Été Indien", artist: "Cortex", genre: "French Jazz", bpm: 118, timeBlock: "afternoon" },
    { id: 35, title: "September", artist: "Earth, Wind & Fire", genre: "Funk/Soul", bpm: 126, timeBlock: "afternoon" },
    { id: 36, title: "Don't Stop 'Til You Get Enough", artist: "Michael Jackson", genre: "Funk/Boogie", bpm: 119, timeBlock: "afternoon" },
    { id: 37, title: "Juice", artist: "Lizzo", genre: "Contemporary Pop", bpm: 124, timeBlock: "afternoon" },
    { id: 38, title: "One More Time", artist: "Daft Punk", genre: "House", bpm: 123, timeBlock: "afternoon" },
    { id: 39, title: "Riptide", artist: "Vance Joy", genre: "Indie Folk", bpm: 102, timeBlock: "afternoon" },
    { id: 40, title: "Feel It Still", artist: "Portugal. The Man", genre: "Indie Rock", bpm: 129, timeBlock: "afternoon" },
  ]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [newTrack, setNewTrack] = useState({
    title: '', artist: '', genre: '', bpm: '', timeBlock: 'morning'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentTimeBlock = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const time = hours + minutes / 60;

    if (time >= 9.5 && time < 11) return 'morning';
    if (time >= 11 && time < 13) return 'active';
    if (time >= 13 && time < 14) return 'focus';
    if (time >= 14 && time < 18) return 'afternoon';
    return 'off-hours';
  };

  const timeBlocks = {
    morning: {
      name: "Morning Warm-Up",
      time: "9:30 - 11:00 AM",
      bpm: "70-90 BPM",
      description: "Gentle start to ease into the day",
      color: "bg-amber-100 border-amber-300"
    },
    active: {
      name: "Active Collaboration",
      time: "11:00 AM - 1:00 PM",
      bpm: "100-110 BPM",
      description: "Energized teamwork and communication",
      color: "bg-blue-100 border-blue-300"
    },
    focus: {
      name: "Deep Focus",
      time: "1:00 - 2:00 PM",
      bpm: "60-90 BPM",
      description: "Heads down, concentration mode",
      color: "bg-purple-100 border-purple-300"
    },
    afternoon: {
      name: "Afternoon Energy",
      time: "2:00 - 6:00 PM",
      bpm: "100-130 BPM",
      description: "Sustained productivity through end of day",
      color: "bg-green-100 border-green-300"
    }
  };

  const currentBlock = getCurrentTimeBlock();

  const addTrack = () => {
    if (newTrack.title && newTrack.artist && newTrack.bpm) {
      setTracks([...tracks, {
        id: Date.now(),
        ...newTrack,
        bpm: parseInt(newTrack.bpm)
      }]);
      setNewTrack({ title: '', artist: '', genre: '', bpm: '', timeBlock: 'morning' });
    }
  };

  const deleteTrack = (id) => {
    setTracks(tracks.filter(t => t.id !== id));
  };

  const getTracksForBlock = (block) => {
    return tracks.filter(t => t.timeBlock === block);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">🎵</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sonos Playlist Curator</h1>
                <p className="text-gray-600">Time-optimized music for your team's flow</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-2xl">🕐</span>
                <span className="text-xl font-semibold">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    timeZone: 'America/New_York'
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-500">Eastern Time</p>
            </div>
          </div>
        </div>

        {currentBlock !== 'off-hours' && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold uppercase tracking-wide">Now Playing</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{timeBlocks[currentBlock].name}</h2>
            <p className="text-indigo-100">{timeBlocks[currentBlock].description} • {timeBlocks[currentBlock].bpm}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New Track</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <span>{isEditing ? '💾' : '✏️'}</span>
              {isEditing ? 'Done' : 'Edit Mode'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <input
              type="text"
              placeholder="Track Title"
              value={newTrack.title}
              onChange={(e) => setNewTrack({...newTrack, title: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Artist"
              value={newTrack.artist}
              onChange={(e) => setNewTrack({...newTrack, artist: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Genre"
              value={newTrack.genre}
              onChange={(e) => setNewTrack({...newTrack, genre: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="BPM"
              value={newTrack.bpm}
              onChange={(e) => setNewTrack({...newTrack, bpm: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <select
              value={newTrack.timeBlock}
              onChange={(e) => setNewTrack({...newTrack, timeBlock: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="morning">Morning</option>
              <option value="active">Active</option>
              <option value="focus">Focus</option>
              <option value="afternoon">Afternoon</option>
            </select>
            <button
              onClick={addTrack}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <span>➕</span> Add
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(timeBlocks).map(([key, block]) => (
            <div
              key={key}
              className={`rounded-2xl shadow-lg p-6 border-2 transition-all ${
                currentBlock === key 
                  ? 'ring-4 ring-indigo-300 ' + block.color 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{block.name}</h3>
                  {currentBlock === key && (
                    <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{block.time} • {block.bpm}</p>
                <p className="text-xs text-gray-500 mt-1">{block.description}</p>
              </div>

              <div className="space-y-2">
                {getTracksForBlock(key).map(track => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{track.title}</p>
                      <p className="text-sm text-gray-600">{track.artist}</p>
                      <p className="text-xs text-gray-500">{track.genre} • {track.bpm} BPM</p>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => deleteTrack(track.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
                {getTracksForBlock(key).length === 0 && (
                  <p className="text-center text-gray-400 py-4">No tracks yet</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🎵 Ready for Spotify Integration</h3>
          <p className="text-sm text-blue-800 mb-3">
            This site is structured to connect with Spotify's API. To enable automatic playlist sync:
          </p>
          <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
            <li>Create a Spotify Developer App at developer.spotify.com</li>
            <li>Get your Client ID and Client Secret</li>
            <li>Set up OAuth 2.0 authentication</li>
            <li>Use the Web API to fetch tracks from "Sonos Project" playlist</li>
            <li>Parse BPM from Spotify's audio features endpoint</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(OfficePlaylist));