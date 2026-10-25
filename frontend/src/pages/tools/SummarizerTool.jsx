import { useCallback } from 'react';
import { Info } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { useAiRequest } from '../../hooks/useAiRequest.js';
import { useResultEntry } from '../../hooks/useResultEntry.js';
import { api } from '../../api/client.js';
import { getSettings } from '../../lib/storage.js';
import { validateLength } from '../../utils/validate.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import TextArea from '../../components/ui/TextArea.jsx';
import Select from '../../components/ui/Select.jsx';
import { SpinnerButtonText } from '../../components/ui/Spinner.jsx';
import Alert from '../../components/ui/Alert.jsx';
import LoadingState from '../../components/states/LoadingState.jsx';
import ErrorState from '../../components/states/ErrorState.jsx';
import SummaryResult from '../../components/results/SummaryResult.jsx';
import ResultActions from '../../components/results/ResultActions.jsx';
import { resultToText } from '../../utils/format.js';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext.jsx';

export default function SummarizerTool() {
  useDocumentTitle('Note Summarizer');
  const { toast } = useToast();
  const defaults = getSettings();
  const [text, setText] = useState('');
  const [length, setLength] = useState(defaults.defaultSummaryLength);
  const [errors, setErrors] = useState({});
  const [lastPayload, setLastPayload] = useState(null);
  const request = useAiRequest(api.summarize);
  const entry = useResultEntry('summarizer');

  const generate = useCallback(
    async (payloadOverride) => {
      const payload = payloadOverride || { text, summary_length: length };
      setLastPayload(payload);
      const data = await request.run(payload);
      if (data) {
        entry.record(data);
        toast({ type: 'success', title: 'Summary generated', message: 'Added to your study history.' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, length, request.run, entry.record]
  );

  function handleGenerate() {
    const errorMap = [
      { field: 'text', message: validateLength(text, { min: 20, max: 8000, label: 'Your notes' }) },
    ]
      .filter((item) => item.message)
      .reduce((acc, item) => ({ ...acc, [item.field]: item.message }), {});
    setErrors(errorMap);
    if (Object.keys(errorMap).length === 0) generate();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Note Summarizer"
        description="Paste a lecture, book excerpt, or notes and get a structured summary with key points, definitions, facts, and a quick revision line."
      />

      <Card className="p-5 sm:p-6">
        <TextArea
          id="notes"
          label="Your study material"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          maxLength={8000}
          showCounter
          placeholder="Paste the material you want summarized…"
          error={errors.text}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Select
            id="summary-length"
            label="Summary length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            options={[
              { value: 'short', label: 'Short — quick essentials' },
              { value: 'medium', label: 'Medium — balanced detail' },
              { value: 'detailed', label: 'Detailed — most thorough' },
            ]}
          />
          <div className="flex items-end">
            <Button
              onClick={handleGenerate}
              loading={request.status === 'loading'}
              className="w-full sm:w-auto"
            >
              {request.status === 'loading' ? <SpinnerButtonText>Summarizing…</SpinnerButtonText> : 'Generate summary'}
            </Button>
          </div>
        </div>
      </Card>

      {request.status === 'loading' && <LoadingState label="Summarizing your notes…" />}
      {request.status === 'error' && <ErrorState message={request.error.message} onRetry={() => generate(lastPayload)} />}
      {request.status === 'success' && request.data && (
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">Summary</h2>
            <ResultActions
              text={resultToText('summarizer', request.data)}
              saved={entry.saved}
              onToggleSave={() => {
                const savedNow = entry.toggleSave();
                toast({
                  type: savedNow ? 'success' : 'info',
                  title: savedNow ? 'Saved to Saved Results' : 'Removed from Saved Results',
                });
              }}
              onRegenerate={() => generate(lastPayload)}
            />
          </div>
          <SummaryResult data={request.data} />
        </Card>
      )}

      <Alert type="info" title="How this works">
        Your text is sent to the Gemini API for one-time processing and the result is kept only in
        this browser's storage. Nothing is stored on a server.
      </Alert>
    </div>
  );
}