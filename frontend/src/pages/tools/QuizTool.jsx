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
import TextArea from '../../components/ui/TextArea.jsx';
import Select from '../../components/ui/Select.jsx';
import { SpinnerButtonText as SpinnerText } from '../../components/ui/Spinner.jsx';
import Alert from '../../components/ui/Alert.jsx';
import LoadingState from '../../components/states/LoadingState.jsx';
import ErrorState from '../../components/states/ErrorState.jsx';
import QuizRunner from '../../components/results/QuizRunner.jsx';
import ResultActions from '../../components/results/ResultActions.jsx';
import { resultToText } from '../../utils/format.js';

export default function QuizTool() {
  useDocumentTitle('Quiz Generator');
  const { toast } = useToast();
  const defaults = getSettings();
  const [text, setText] = useState('');
  const [numQuestions, setNumQuestions] = useState('5');
  const [difficulty, setDifficulty] = useState(defaults.defaultQuizDifficulty);
  const [errors, setErrors] = useState({});
  const [lastPayload, setLastPayload] = useState(null);
  const request = useAiRequest(api.quiz);
  const entry = useResultEntry('quiz');

  const generate = useCallback(
    async (payloadOverride) => {
      const payload = payloadOverride || {
        text,
        num_questions: Number(numQuestions),
        difficulty,
      };
      setLastPayload(payload);
      const data = await request.run(payload);
      if (data) {
        entry.record(data);
        toast({ type: 'success', title: 'Quiz generated', message: 'Added to your study history.' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, numQuestions, difficulty, request.run, entry.record]
  );

  function handleGenerate() {
    const errorMap = [
      { field: 'text', message: validateLength(text, { min: 20, max: 8000, label: 'Your study material' }) },
    ]
      .filter((item) => item.message)
      .reduce((acc, item) => ({ ...acc, [item.field]: item.message }), {});
    setErrors(errorMap);
    if (Object.keys(errorMap).length === 0) generate();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quiz Generator"
        description="Generate practice questions from your study material, then answer them right here with instant explanations."
      />

      <Card className="p-5 sm:p-6">
        <TextArea
          id="quiz-notes"
          label="Your study material"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          maxLength={8000}
          showCounter
          placeholder="Paste the material you want to be quizzed on…"
          error={errors.text}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Select
            id="num-questions"
            label="Number of questions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            options={[
              { value: '3', label: '3 questions' },
              { value: '4', label: '4 questions' },
              { value: '5', label: '5 questions' },
              { value: '6', label: '6 questions' },
              { value: '7', label: '7 questions' },
              { value: '8', label: '8 questions' },
              { value: '9', label: '9 questions' },
              { value: '10', label: '10 questions' },
            ]}
          />
          <Select
            id="quiz-difficulty"
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' },
            ]}
          />
          <div className="flex items-end">
            <Button
              onClick={handleGenerate}
              loading={request.status === 'loading'}
              className="w-full sm:w-auto"
            >
              {request.status === 'loading' ? <SpinnerText>Generating…</SpinnerText> : 'Generate quiz'}
            </Button>
          </div>
        </div>
      </Card>

      {request.status === 'loading' && <LoadingState label="Generating your quiz…" />}
      {request.status === 'error' && <ErrorState message={request.error.message} onRetry={() => generate(lastPayload)} />}
      {request.status === 'success' && request.data?.questions?.length > 0 && (
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink">Practice quiz</h2>
            <ResultActions
              text={resultToText('quiz', request.data)}
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
          <QuizRunner data={request.data} />
        </Card>
      )}

      <Alert type="info" title="How this works">
        Your material is sent to the Gemini API to create questions. Your answers and score in the
        practice runner stay in this browser tab and are not sent anywhere.
      </Alert>
    </div>
  );
}