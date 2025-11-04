import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useTerminalStore } from '../stores/useTerminalStore';

export const TerminalHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const { sessionStartTime, setShowImprintModal } = useTerminalStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());

      const now = new Date();
      const diff = now.getTime() - sessionStartTime.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setSessionTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStartTime]);

  return (
    <div className="bg-[#1e1e1e] border-b border-[#333333] px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4 text-sm">
        <span className="text-[#cccccc]">
          {format(currentTime, 'PPpp')}
        </span>
        <span className="text-[#00ff00]">
          Session: {sessionTime}
        </span>
      </div>
      <button
        onClick={() => setShowImprintModal(true)}
        className="text-[#cccccc] hover:text-[#00ff00] transition-colors text-sm underline"
      >
        Imprint
      </button>
    </div>
  );
};
