function Block({ title, children }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-3">{title}</h3>
      {children}
    </section>
  );
}

export default function SummaryResult({ data }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-line bg-canvas/50 px-4 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-3">Main topic</h3>
        <p className="mt-1 text-lg font-semibold text-ink">{data.main_topic}</p>
      </div>

      {Array.isArray(data.key_points) && data.key_points.length > 0 && (
        <Block title="Key points">
          <ul className="space-y-1.5">
            {data.key_points.map((point, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-2">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {Array.isArray(data.important_definitions) && data.important_definitions.length > 0 && (
        <Block title="Important definitions">
          <dl className="space-y-1.5">
            {data.important_definitions.map((item, i) => (
              <div key={i} className="rounded-lg border border-line bg-card px-3 py-2">
                <dt className="text-sm font-semibold text-brand">{item.term}</dt>
                <dd className="mt-0.5 text-sm text-ink-2">{item.definition}</dd>
              </div>
            ))}
          </dl>
        </Block>
      )}

      {Array.isArray(data.important_facts) && data.important_facts.length > 0 && (
        <Block title="Important facts">
          <ul className="space-y-1.5">
            {data.important_facts.map((fact, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-2">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {data.revision_summary && (
        <Block title="Revision summary">
          <p className="text-sm leading-relaxed text-ink">{data.revision_summary}</p>
        </Block>
      )}
    </div>
  );
}