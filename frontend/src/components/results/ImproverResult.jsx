function Block({ title, children }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-3">{title}</h3>
      {children}
    </section>
  );
}

export default function ImproverResult({ data }) {
  return (
    <div className="space-y-5">
      <Block title="Improved answer">
        <p className="whitespace-pre-wrap rounded-xl border border-line bg-canvas/50 px-4 py-3 text-sm leading-relaxed text-ink">
          {data.improved_answer}
        </p>
      </Block>

      <Block title="Update explanation">
        <p className="text-sm leading-relaxed text-ink-2">{data.improvement_explanation}</p>
      </Block>

      {Array.isArray(data.missing_points) && data.missing_points.length > 0 && (
        <Block title="Points you missed">
          <ul className="space-y-1.5">
            {data.missing_points.map((point, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-2">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}
    </div>
  );
}