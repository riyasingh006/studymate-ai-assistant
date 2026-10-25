import { useCallback, useState } from 'react';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { useAiRequest } from '../../hooks/useAiRequest.js';
import { useResultEntry } from '../../hooks/useResultEntry.js';
import { api } from '../../api/client.js';
import { getSettings } from '../../lib/storage.js';
import { validateLength } from '../../utils/validate.js';
import { useToast } from '../../context/ToastContext.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import TextInput from '../../components/ui/TextInput.jsx';
import Select from '../../components/ui/Select.jsx';
import { SpinnerButtonText as SpinnerText } from '../../components/ui/Spinner.jsx';
import Alert from '../../components/ui/Alert.jsx';
import LoadingState from '../../components/states/LoadingState.jsx';
import ErrorState from '../../components/states/ErrorState.jsx';
import ExplainerResult from '../../components/results/ExplainerResult.jsx';
import ResultActions from '../../components/results/ResultActions.jsx';
import { resultToText } from '../../utils/format.js';

export default function ExplainerTool() {
  useDocumentTitle('Concept Explainer');
  const { toast } = useToast();
  const defaults = getSettings();
  const [concept, setConcept] = useState('');
  const [level, setLevel] = useState(defaults.defaultExplanationLevel);
  const [errors, setErrors] = useState({});
  const [lastPayload, setLastPayload] = useState(null);
  const request = useAiRequest(api.explain);
  const entry = useResultEntry('explainer');

  const generate = useCallback(
    async (payloadOverride) => {
      const payload = payloadOverride || { concept, level };
      setLastPayload(payload);
      const data = await request.run(payload);
      if (data) {
        entry.record(data);
        toast({ type: 'success', title: 'Concept explained', message: 'Added to your study history.' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [concept, level, request.run, entry.record]
  );

  function handleGenerate() {
    const errorMap = [
      { field: 'concept', message: validateLength(concept, { min: 2, max: 300, label: 'Concept' }) },
    ]
      .filter((item) => item.message)
      .reduce((acc, item) => ({ ...acc, [item.field]: item.message }), {});
    setErrors(errorMap);
    if (Object.keys(errorMap).length === 0) generate();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Concept Explainer"
        description="Type any concept — from photosynthesis to supply and demand — and get a plain-language explanation with steps, an example, and a one-line takeaway."
      />

      <Card className="p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            id="concept"
            label="Concept to explain"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            maxLength={300}
            placeholder="e.g. Opportunity cost"
            error={errors.concept}
          />
          <Select
            id="explain-level"
            label="Explanation level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            options={[
              { value: 'beginner', label: 'Beginner — first introduction' },
              { value: 'intermediate', label: 'Intermediate — more depth' },
            ]}
          />
        </div>
        <div className="mt-4 flex items-end">
          <Button
            onClick={handleGenerate}
            loading={request.status === 'loading'}
          >
            {request.status === 'loading' ? <SpinnerText>Explaining…</SpinnerText> : 'Explain concept'}
          </Button>
        </div>
      </Card>

      {request.status === 'loading' && <LoadingState label="Preparing your explanation…" />}
      {request.status === 'error' && <ErrorState message={request.error.message} onRetry={() => generate(lastPayload)} />}
      {request.status === 'success' && request.data && (
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">Explanation</h2>
            <ResultActions
              text={resultToText('explainer', request.data)}
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
          <ExplainerResult data={request.data} />
        </Card>
      )}

      <Alert type="info" title="How this works">
        The concept is sent to the Gemini API for a one-time explanation. Results stay in this
        browser's local storage only.
      </Alert>
    </div>
  );
}