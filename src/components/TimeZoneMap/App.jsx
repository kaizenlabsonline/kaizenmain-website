import React, { useState, useEffect } from 'react';

// Common Time Zones DB
const TIME_ZONES = [
    { label: 'Los Angeles (PST)', zone: 'America/Los_Angeles' },
    { label: 'New York (EST)', zone: 'America/New_York' },
    { label: 'London (GMT)', zone: 'Europe/London' },
    { label: 'Paris (CET)', zone: 'Europe/Paris' },
    { label: 'Berlin (CET)', zone: 'Europe/Berlin' },
    { label: 'Dubai (GST)', zone: 'Asia/Dubai' },
    { label: 'Mumbai (IST)', zone: 'Asia/Kolkata' },
    { label: 'Singapore (SGT)', zone: 'Asia/Singapore' },
    { label: 'Tokyo (JST)', zone: 'Asia/Tokyo' },
    { label: 'Sydney (AEDT)', zone: 'Australia/Sydney' },
];

const App = () => {
    const [selectedZones, setSelectedZones] = useState(() => {
        try {
            const saved = localStorage.getItem('timezone_cities');
            return saved ? JSON.parse(saved) : [TIME_ZONES[2], TIME_ZONES[9]]; // London & Sydney default
        } catch {
            return [TIME_ZONES[2], TIME_ZONES[9]];
        }
    });

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        localStorage.setItem('timezone_cities', JSON.stringify(selectedZones));
    }, [selectedZones]);

    // Clock Ticker
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute is enough for this view
        return () => clearInterval(timer);
    }, []);

    const addZone = (e) => {
        const zoneName = e.target.value;
        if (!zoneName) return;
        const zone = TIME_ZONES.find(z => z.zone === zoneName);
        if (zone && !selectedZones.find(z => z.zone === zoneName)) {
            setSelectedZones([...selectedZones, zone]);
        }
    };

    const removeZone = (index) => {
        setSelectedZones(selectedZones.filter((_, i) => i !== index));
    };

    // Helper to get hour in a zone
    const getHours = (date, timeZone) => {
        return parseInt(new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            hour12: false,
            timeZone
        }).format(date));
    };

    const getDisplayTime = (date, timeZone) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone
        }).format(date);
    };

    // 0-23 Hour Grid
    const HOURS = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="w-full max-w-6xl mx-auto p-4 content-start text-slate-100">
            <header className="mb-8 text-center bg-gray-900 bg-opacity-80 p-6 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-md">
                <h1 className="text-3xl font-bold text-white mb-2">🌍 Team Time Zone Map</h1>
                <p className="text-slate-400">Find the golden hour for your distributed team meeting.</p>
            </header>

            {/* Controls */}
            <div className="flex justify-center mb-8">
                <select
                    onChange={addZone}
                    className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                    defaultValue=""
                >
                    <option value="" disabled>+ Add City</option>
                    {TIME_ZONES.map(z => (
                        <option key={z.zone} value={z.zone}>{z.label}</option>
                    ))}
                </select>
            </div>

            {/* Timeline Grid */}
            <div className="bg-gray-800 bg-opacity-90 rounded-2xl p-6 shadow-2xl border border-gray-700 overflow-x-auto">
                {selectedZones.map((city, idx) => {
                    const localHour = getHours(currentTime, city.zone);

                    return (
                        <div key={idx} className="flex items-center mb-6 min-w-[800px]">
                            {/* Label */}
                            <div className="w-48 flex-shrink-0 pr-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-white text-lg">{city.label.split('(')[0]}</h3>
                                    <button onClick={() => removeZone(idx)} className="text-gray-500 hover:text-red-400 ml-2">×</button>
                                </div>
                                <p className="text-blue-400 font-mono text-sm">{getDisplayTime(currentTime, city.zone)}</p>
                            </div>

                            {/* Bar */}
                            <div className="flex-1 flex rounded-lg overflow-hidden border border-gray-600 h-12 relative">
                                {HOURS.map(h => {
                                    // Offset hour based on current time difference
                                    // We simulate the 24h day relative to UTC or simple shift?
                                    // Let's simplify: Display a static 24h strip shifted by the city's offset?
                                    // PROACH: render 24 blocks. Calculate what hour it is in that city for slot 0 (midnight UTC? No, usually localized).
                                    // Easier Approach: The strip represents "Absolute Time" (UTC 00:00 to 23:00).
                                    // We highlight the user's business hours (9-5).

                                    // But that's hard to read.
                                    // Better Approach: The strip is 00:00 - 23:00 LOCAL time? No, then they don't align vertically.

                                    // Best Approach: The strip is 00:00 - 23:00 "Reference Time" (e.g. user's local, or UTC).
                                    // Let's use UTC as reference for alignment.

                                    // Actually, simpler: 
                                    // Column 1 is "Right Now". Column 2 is "+1h".
                                    // That way they are always aligned vertically at "Now".

                                    const dateAtOffset = new Date(currentTime.getTime() + h * 3600000);
                                    const hourInCity = getHours(dateAtOffset, city.zone);

                                    // Color logic: 9-5 is Green (Work), 8-9/5-20 is Yellow (Stretch), 21-7 is Gray (Sleep)
                                    let bg = 'bg-gray-700 opacity-50'; // Night
                                    if (hourInCity >= 9 && hourInCity <= 17) bg = 'bg-green-600'; // Work
                                    else if ((hourInCity >= 7 && hourInCity < 9) || (hourInCity > 17 && hourInCity <= 22)) bg = 'bg-yellow-600'; // Stretch

                                    return (
                                        <div key={h} className={`${bg} flex-1 border-r border-black/20 flex items-center justify-center text-xs font-mono relative group`}>
                                            <span className="opacity-80 group-hover:opacity-100 transition-opacity">{hourInCity}</span>
                                            {/* Tooltip */}
                                            <div className="absolute -top-8 bg-black/90 p-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                                                {hourInCity}:00
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* "Now" Marker - always at index 0? No, index 0 is "Now". */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 z-10 shadow-[0_0_10px_red]"></div>
                            </div>
                        </div>
                    )
                })}

                {/* Legend */}
                <div className="flex gap-4 justify-end mt-4 text-xs text-slate-400">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Now</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-600 rounded"></div> 9am - 5pm</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-600 rounded"></div> 7am-9am / 5pm-10pm</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-700 rounded"></div> Night</div>
                </div>
            </div>

            <div className="mt-8 text-center text-slate-500 text-sm">
                <p>Columns represent hours from "Now" (+0h, +1h, +2h...)</p>
            </div>
        </div>
    );
};

export default App;
