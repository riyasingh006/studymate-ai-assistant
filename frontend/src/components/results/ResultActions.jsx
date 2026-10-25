import { RefreshCw } from 'lucide-react';
import Button from '../ui/Button.jsx';
import CopyButton from '../ui/CopyButton.jsx';
import SaveButton from '../ui/SaveButton.jsx';

export default function ResultActions({ text, saved, onToggleSave, onRegenerate, regenerateLabel = 'Regenerate' }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CopyButton text={text} />
      {onToggleSave && <SaveButton saved={saved} onClick={onToggleSave} />}
      {onRegenerate && (
        <Button variant="secondary" onClick={onRegenerate}>
          <RefreshCw size={15} />
          {regenerateLabel}
        </Button>
      )}
    </div>
  );
}