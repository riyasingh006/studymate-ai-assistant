import { useCallback, useState } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { useAiRequest } from '../../hooks/useAiRequest.js';
import { useResultEntry } from '../../hooks/useResultEntry.js';
import { api } from '../../api/client.js';
import { validateLength } from '../../utils/validate.js';
import { useToast } from '../../context/ToastContext.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import TextArea from '../../components/ui/TextArea.jsx';
import { SpinnerButtonText as SpinnerText } from '../../components/ui/Spinner.jsx';
import Alert from '../../components/ui/Alert.jsx';
import LoadingState from '../../components/states/LoadingState.jsx';
import ErrorState from '../../components/states/ErrorState.jsx';
import ImproverResult from '../../components/results/ImproverResult.jsx';
import ResultActions from '../../components/results/ResultActions.jsx';
import { resultToText } from '../../utils/format.js';

export default function ImproverTool() {
  useDocumentTitle('Answer Improver');
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [errors, setErrors] = useState({});
  const [lastPayload, setLastPayload] = useState(null);
  const request = useAiRequest(api.improve);
  const entry = useResultEntry('improver');

  const generate = useCallback(
    async (payloadOverride) => {
      const payload = payloadOverride || { question, answer };
      setLastPayload(payload);
      const data = await request.run(payload);
      if (data) {
        entry.record(data);
        toast({ type: 'success', title: 'Answer improved', message: 'Added to your study history.' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question, answer, request.run, entry.record]
  );

  function handleGenerate() {
    const errorMap = [
      { field: 'question', message: validateLength(question, { min: 5, max: 2000, label: 'Question' }) },
      { field: 'answer', message: validateLength(answer, { min: 1, max: 5000, label: 'Your answer' }) },
    ]
      .filter((item) => item.message)
      .reduce((acc, item) => ({ ...acc, [item.field]: item.message }), {});
    setErrors(errorMap);
    if (Object.keys(errorMap).length === 0) generate();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Answer Improver"
        description="Paste a question and a draft answer. StudyMate honors what you got right, fills in what was missing, and explains the upgrade."
      />

      <Card className="p-5 sm:p-6">
        <TextArea
          id="question"
          label="The question or prompt"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          maxLength={2000}
          showCounter
          placeholder="e.g. Explain the causes of the Industrial Revolution…"
          error={errors.question}
        />
        <div className="mt-4">
          <TextArea
            id="answer"
            label="Your draft answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            maxLength={5000}
            showCounter
            placeholder="Type or paste your attempt…"
            error={errors.answer}
          />
        </div>
        <div className="mt-4 flex items-end">
          <Button
            onClick={handleGenerate}
            loading={request.status === 'loading'}
          >
            {request.status === 'loading' ? <SpinnerText>Improving…</SpinnerText> : 'Improve my answer'}
          </Button>
        </div>
      </Card>

      {request.status === 'loading' && <LoadingState label="Improving your answer…" />}
      {request.status === 'error' && <ErrorState message={request.error.message} onRetry={() => generate(lastPayload)} />}
      {request.status === 'success' && request.data && (
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">Improved answer</h2>
            <ResultActions
              text={resultToText('improver', request.data)}
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
          <ImproverResult data={request.data} />
        </Card>
      )}

      <Alert type="info" title="How this works">
        Your question and draft are sent to the Gemini API once, and the improved version is kept
        only in this browser's local storage.
      </Alert>
    </div>
  );
}