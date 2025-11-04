import { useTerminalStore } from '../stores/useTerminalStore';
import { Modal } from './Modal';
import profileContent from '../content/profile.md?raw';

export const WhoamiModal = () => {
  const { showWhoamiModal, setShowWhoamiModal } = useTerminalStore();

  return (
    <Modal
      isOpen={showWhoamiModal}
      onClose={() => setShowWhoamiModal(false)}
      markdown={profileContent}
    />
  );
};
