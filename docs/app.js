const { useState, useEffect } = React;

const OfficePlaylist = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tracks, setTracks] = useState([
    // Default sample tracks
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
  ]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [isLoadingSpotify, setIsLoadingSpotify] = useState(false);
  const [spotifyError, setSpotifyError] = useState(null);
  const [spotifySuccess, setSpotifySuccess] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('');
  const [newTrack, setNewTrack] = useState({
    title: '', artist: '', genre: '', bpm: '', timeBlock: 'morning'
  });

  const PLAYLIST_ID = '77JYvxU7CqZrP15D9ZXGhr';

  // Genre to BPM mapping based on your requested genres
  const genreBPMMap = {
    // Morning genres (70-90 BPM)
    'bossa nova': 75,
    'folk': 78,
    'shoegaze': 80,
    'ethiopian jazz': 85,
    'soft rock': 88,
    'indie folk': 82,
    'psychedelic rock': 85,
    'jazz': 72,
    'blues': 75,
    'country': 80,
    'bluegrass': 85,
    
    // Active/Collaboration genres (100-110 BPM)
    'city pop': 106,
    'contemporary pop': 105,
    'pop': 105,
    'salsa': 105,
    'hip hop': 108,
    'new wave': 108,
    'soul': 104,
    'r&b': 105,
    'contemporary r&b': 105,
    'latin': 105,
    'indie': 107,
    'indie rock': 107,
    
    // Focus genres (60-90 BPM)
    'beats': 75,
    'synth wave': 80,
    'downtempo': 70,
    'ambient': 65,
    'classical': 70,
    'french jazz': 75,
    'lo-fi': 75,
    'chillout': 70,
    
    // Afternoon/Energy genres (100-130 BPM)
    'funk': 115,
    'house': 125,
    'hyperpop': 125,
    'electronic': 120,
    'dance': 125,
    'disco': 120,
    'boogie': 115,
    'drum and bass': 130,
    'techno': 128,
    'edm': 128,
    'rock': 120,
    'punk': 125,
    'alternative': 115,
    'indie pop': 115,
    'art rock': 110,
    'jazz rock': 115,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const saveToken = () => {
    if (tokenInput.trim()) {
      setSpotifyToken(tokenInput.trim());
      setSpotifyError(null);
    }
  };

  // Estimate BPM based on genre
  const estimateBPMFromGenre = (genres, albumType) => {
    if (!genres || genres.length === 0) {
      // Default BPM based on album type if no genre
      if (albumType === 'single') return 110;
      if (albumType === 'compilation') return 105;
      return 100; // Default
    }

    // Convert genre to lowercase and check our map
    for (let genre of genres) {
      const genreLower = genre.toLowerCase();
      
      // Check for exact matches first
      if (genreBPMMap[genreLower]) {
        return genreBPMMap[genreLower];
      }
      
      // Check for partial matches
      for (let [key, bpm] of Object.entries(genreBPMMap)) {
        if (genreLower.includes(key) || key.includes(genreLower)) {
          return bpm;
        }
      }
    }
    
    // Default if no genre match
    return 105;
  };

  const categorizeBPM = (bpm) => {
    if (bpm >= 70 && bpm <= 90) return 'morning';
    if (bpm >= 100 && bpm <= 110) return 'active';
    if (bpm >= 60 && bpm < 70) return 'focus';
    if (bpm > 90 && bpm < 100) return 'focus';
    if (bpm > 110 && bpm <= 130) return 'afternoon';
    if (bpm < 60) return 'focus';
    if (bpm > 130) return 'afternoon';
    return 'active';
  };

  const loadSpotifyPlaylist = async () => {
    if (!spotifyToken) {
      setSpotifyError('Please paste your Spotify token first!');
      return;
    }

    setIsLoadingSpotify(true);
    setSpotifyError(null);
    setSpotifySuccess(false);
    setLoadingProgress('Fetching playlist tracks...');

    try {
      // Fetch playlist tracks
      const playlistResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`,
        { headers: { 'Authorization': `Bearer ${spotifyToken}` } }
      );

      if (!playlistResponse.ok) {
        const errorData = await playlistResponse.json();
        throw new Error(`Failed to fetch playlist: ${errorData.error?.message || 'Token may be expired'}`);
      }

      const playlistData = await playlistResponse.json();
      setLoadingProgress(`Found ${playlistData.items.length} tracks. Assigning BPMs based on genre...`);

      // Map tracks with genre-based BPM estimation
      const spotifyTracks = playlistData.items
        .filter(item => item.track)
        .map((item, index) => {
          const track = item.track;
          
          // Get genres from track or artist
          let genres = [];
          if (track.artists && track.artists.length > 0) {
            // Note: Basic track info doesn't include artist genres
            // We'll use album type as a hint
            genres = [track.album.album_type || 'album'];
          }
          
          // Estimate BPM from genre
          const estimatedBPM = estimateBPMFromGenre(genres, track.album.album_type);
          
          return {
            id: track.id || `track-${index}`,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            genre: track.album.album_type || 'Various',
            bpm: estimatedBPM,
            timeBlock: categorizeBPM(estimatedBPM),
            spotifyUri: track.uri,
            isEstimated: true
          };
        });

      setTracks(spotifyTracks);
      setSpotifySuccess(true);
      setSpotifyError(null);
      setLoadingProgress('');
    } catch (error) {
      console.error('Spotify error:', error);
      setSpotifyError(error.message);
      setSpotifySuccess(false);
      setLoadingProgress('');
    } finally {
      setIsLoadingSpotify(false);
    }
  };

  const updateTrackBPM = (trackId, newBPM) => {
    setTracks(tracks.map(track => {
      if (track.id === trackId) {
        const bpm = parseInt(newBPM);
        return {
          ...track,
          bpm: bpm,
          timeBlock: categorizeBPM(bpm),
          isEstimated: false
        };
      }
      return track;
    }));
  };

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
        bpm: parseInt(newTrack.bpm),
        timeBlock: categorizeBPM(parseInt(newTrack.bpm))
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

        {/* Spotify Integration Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <h3 className="text-xl font-bold mb-4">🎧 Spotify Integration</h3>
          
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <p className="text-sm mb-3 text-green-50">
              Paste your Spotify access token below. BPMs will be estimated based on genre.
              <a href="https://developer.spotify.com/console/get-playlist/" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                Get token here
              </a>
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Paste your Spotify token here..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-300"
              />
              <button
                onClick={saveToken}
                className="px-6 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition"
              >
                Save Token
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">
                {spotifyToken 
                  ? "✅ Token saved! Click 'Load Playlist' to import" 
                  : "⚠️ No token saved yet"}
              </p>
              {loadingProgress && (
                <p className="text-green-200 text-xs mt-1">{loadingProgress}</p>
              )}
            </div>
            <button
              onClick={loadSpotifyPlaylist}
              disabled={isLoadingSpotify || !spotifyToken}
              className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingSpotify ? '⏳ Loading...' : '🔄 Load Playlist'}
            </button>
          </div>
          
          {spotifyError && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
              ❌ Error: {spotifyError}
            </div>
          )}
          
          {spotifySuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
              ✅ Successfully loaded {tracks.length} tracks! BPMs estimated by genre. Click any track to edit its BPM.
            </div>
          )}
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

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {getTracksForBlock(key).map(track => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{track.title}</p>
                      <p className="text-sm text-gray-600">{track.artist}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">{track.genre}</p>
                        {isEditing ? (
                          <input
                            type="number"
                            value={track.bpm}
                            onChange={(e) => updateTrackBPM(track.id, e.target.value)}
                            className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">
                            {track.bpm} BPM {track.isEstimated && '(est)'}
                          </span>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => deleteTrack(track.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition ml-2"
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
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(OfficePlaylist));
