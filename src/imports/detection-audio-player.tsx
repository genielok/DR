Add audio player functionality to the Random Sample detection list with playback controls and progress bar.

REQUIREMENTS:

1. **Click Detection Row to Play Audio:**
   - When user clicks on a detection row, expand it to show audio player
   - Only one audio player active at a time (clicking another row closes previous)
   - Play button changes to Pause when playing

2. **Audio Player UI (Expanded State):**
```tsx
<div className="space-y-2">
  {samples.map((sample, index) => (
    <div key={sample.id} className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Detection Row - Clickable */}
      <button
        onClick={() => togglePlayer(sample.id)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-white">
            {playingId === sample.id && isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white" />
            )}
          </div>
          <span className="text-foreground font-medium">{sample.sensorId}</span>
          <span className="text-muted-foreground">· {sample.date} · {sample.time}</span>
        </div>
        <span 
          className="px-2.5 py-1 rounded text-sm font-medium"
          style={{
            backgroundColor: getConfidenceColor(sample.confidence, 0.2),
            color: getConfidenceColor(sample.confidence, 1)
          }}
        >
          {sample.confidence}%
        </span>
      </button>

      {/* Audio Player - Expanded when playing */}
      {playingId === sample.id && (
        <div className="px-4 pb-4 pt-2 bg-secondary/30">
          {/* Waveform or Progress Bar */}
          <div className="flex items-center gap-3">
            {/* Current Time */}
            <span className="text-muted-foreground text-sm font-mono w-12">
              {formatTime(currentTime)}
            </span>

            {/* Progress Bar */}
            <div className="flex-1 relative group cursor-pointer" onClick={handleSeek}>
              {/* Background track */}
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                {/* Played portion */}
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              
              {/* Draggable handle */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${(currentTime / duration) * 100}% - 6px)` }}
              />

              {/* Hover preview (optional) */}
              <div className="absolute -top-8 left-0 right-0 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-full bg-gradient-to-b from-primary/20 to-transparent rounded-t" />
              </div>
            </div>

            {/* Total Duration */}
            <span className="text-muted-foreground text-sm font-mono w-12">
              {formatTime(duration)}
            </span>

            {/* Volume Control (optional) */}
            <button 
              onClick={toggleMute}
              className="text-muted-foreground hover:text-foreground"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Playback Speed (optional) */}
            <select 
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="bg-secondary border border-border rounded px-2 py-1 text-xs text-foreground"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>

          {/* Spectrogram (optional - if available) */}
          <div className="mt-3 h-20 bg-secondary rounded overflow-hidden">
            <img 
              src={sample.spectrogramUrl} 
              alt="Audio spectrogram" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  ))}
</div>
```

3. **Audio Player State Management:**
```tsx
const [playingId, setPlayingId] = useState<string | null>(null);
const [isPlaying, setIsPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const [isMuted, setIsMuted] = useState(false);
const [playbackSpeed, setPlaybackSpeed] = useState(1);
const audioRef = useRef<HTMLAudioElement>(null);

const togglePlayer = (sampleId: string) => {
  if (playingId === sampleId) {
    // Toggle play/pause for current audio
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  } else {
    // Switch to new audio
    setPlayingId(sampleId);
    setCurrentTime(0);
    setIsPlaying(true);
    // Load and play new audio
    if (audioRef.current) {
      audioRef.current.src = getSampleAudioUrl(sampleId);
      audioRef.current.play();
    }
  }
};

const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!audioRef.current) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percentage = x / rect.width;
  const newTime = percentage * duration;
  audioRef.current.currentTime = newTime;
  setCurrentTime(newTime);
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getConfidenceColor = (confidence: number, opacity: number) => {
  if (confidence >= 90) return `rgba(34, 197, 94, ${opacity})`; // green
  if (confidence >= 70) return `rgba(234, 179, 8, ${opacity})`; // yellow/warning
  return `rgba(239, 68, 68, ${opacity})`; // red/error
};

// Audio element with event listeners
useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const updateTime = () => setCurrentTime(audio.currentTime);
  const updateDuration = () => setDuration(audio.duration);
  const handleEnded = () => setIsPlaying(false);

  audio.addEventListener('timeupdate', updateTime);
  audio.addEventListener('loadedmetadata', updateDuration);
  audio.addEventListener('ended', handleEnded);

  return () => {
    audio.removeEventListener('timeupdate', updateTime);
    audio.removeEventListener('loadedmetadata', updateDuration);
    audio.removeEventListener('ended', handleEnded);
  };
}, []);

// Update playback speed
useEffect(() => {
  if (audioRef.current) {
    audioRef.current.playbackRate = playbackSpeed;
  }
}, [playbackSpeed]);
```

4. **Hidden Audio Element:**
```tsx
<audio ref={audioRef} className="hidden" />
```

5. **Confidence Color Coding:**
```tsx
const getConfidenceBgColor = (confidence: number) => {
  if (confidence >= 90) return 'bg-success/20';
  if (confidence >= 70) return 'bg-warning/20';
  return 'bg-error/20';
};

const getConfidenceTextColor = (confidence: number) => {
  if (confidence >= 90) return 'text-success';
  if (confidence >= 70) return 'text-warning';
  return 'text-error';
};
```

6. **Import Required Icons:**
```tsx
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
```

7. **Enhanced Progress Bar (with drag):**
```tsx
const [isDragging, setIsDragging] = useState(false);

const handleMouseDown = () => setIsDragging(true);

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging || !audioRef.current) return;
  const rect = progressBarRef.current?.getBoundingClientRect();
  if (!rect) return;
  const x = e.clientX - rect.left;
  const percentage = Math.max(0, Math.min(1, x / rect.width));
  const newTime = percentage * duration;
  audioRef.current.currentTime = newTime;
  setCurrentTime(newTime);
};

const handleMouseUp = () => setIsDragging(false);

useEffect(() => {
  if (isDragging) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }
}, [isDragging]);
```

8. **Styling:**
- Play button: bg-primary (blue), rounded-full
- Progress bar background: bg-secondary
- Progress bar fill: bg-primary
- Draggable handle: bg-primary, appears on hover
- Time display: font-mono for monospaced numbers
- Expanded area: bg-secondary/30 for subtle background

FEATURES IMPLEMENTED:
- ✅ Click to play/pause audio
- ✅ Visual progress bar
- ✅ Draggable/seekable progress bar
- ✅ Current time / total duration display
- ✅ Play/Pause button toggle
- ✅ Playback speed control
- ✅ Volume/mute control
- ✅ Only one audio plays at a time
- ✅ Confidence color coding (green/yellow/red)
- ✅ Smooth transitions and hover states

Use CSS variables for all colors: bg-primary, bg-secondary, text-foreground, text-muted-foreground, border-border