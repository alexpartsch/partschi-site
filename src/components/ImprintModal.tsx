import { useTerminalStore } from '../stores/useTerminalStore';
import { Modal } from './Modal';
import imprintContent from '../content/imprint.md?raw';

export const ImprintModal = () => {
  const { showImprintModal, setShowImprintModal } = useTerminalStore();

  return (
    <Modal
      isOpen={showImprintModal}
      onClose={() => setShowImprintModal(false)}
      title="Imprint"
      markdown={imprintContent}
    />
  );
};
