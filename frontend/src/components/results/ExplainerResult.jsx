function Block({ title, children }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-3">{title}</h3>
      {children}
    </section>
  );
}

export default function ExplainerResult({ data }) {
  return (
    <div className="space-y-5">
      <Block title="Explanation">
        <p className="text-sm leading-relaxed text-ink">{data.explanation}</p>
      </Block>

      {Array.isArray(data.steps) && data.steps.length > 0 && (
        <Block title="Step by step">
          <ol className="space-y-2">
            {data.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand">
                  {i + 1}
                </span>
                <span className="text-sm text-ink-2">{step}</span>
              </li>
            ))}
          </ol>
        </Block>
      )}

      {data.example && (
        <Block title="Example">
          <div className="whitespace-pre-wrap rounded-xl border border-line bg-canvas/50 px-4 py-3 text-sm leading-relaxed text-ink">
            {data.example}
          </div>
        </Block>
      )}

      {data.takeaway && (
        <Block title="Takeaway">
          <p className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm font-medium text-ink">
            {data.takeaway}
          </p>
        </Block>
      )}
    </div>
  );
}