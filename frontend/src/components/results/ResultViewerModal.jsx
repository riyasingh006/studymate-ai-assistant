import { useMemo, useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import CopyButton from '../ui/CopyButton.jsx';
import SummaryResult from './SummaryResult.jsx';
import ImproverResult from './ImproverResult.jsx';
import ExplainerResult from './ExplainerResult.jsx';
import QuizRunner from './QuizRunner.jsx';
import { TOOL_META, describeResult, resultToText } from '../../utils/format.js';

// Read-only viewer for a stored result (from History or Saved). Renders the
// same presentation components used live, without the save/regenerate actions.
export default function ResultViewerModal({ entry, onClose }) {
  const meta = entry ? TOOL_META[entry.tool] : null;
  const text = useMemo(
    () => (entry ? resultToText(entry.tool, entry.data) : ''),
    [entry]
  );
  const [openQuiz, setOpenQuiz] = useState(false);

  if (!entry) return null;

  const { title } = describeResult(entry.tool, entry.data);

  function renderBody() {
    switch (entry.tool) {
      case 'summarizer':
        return <SummaryResult data={entry.data} />;
      case 'improver':
        return <ImproverResult data={entry.data} />;
      case 'explainer':
        return <ExplainerResult data={entry.data} />;
      case 'quiz':
        return openQuiz ? (
          <QuizRunner data={entry.data} />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-ink-2">
              Attempt this saved quiz in practice mode. Your progress stays in this
              session only.
            </p>
            <Button onClick={() => setOpenQuiz(true)}>Start practice</Button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={title}
      description={
        <span className="inline-flex items-center gap-2">
          <Badge tone="brand">{meta?.short || entry.tool}</Badge>
        </span>
      }
      footer={
        <>
          <CopyButton text={text} />
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      {renderBody()}
    </Modal>
  );
}