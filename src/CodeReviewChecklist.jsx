export default function CodeReviewChecklist() {
  return (
    <section className="p-6 text-left text-zinc-200">
      <h2 className="text-xl font-semibold mb-2">Code Review Checklist</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>✅ Types and props are correct</li>
        <li>✅ No unused imports or variables</li>
        <li>✅ Components remain small and readable</li>
        <li>✅ Handles loading and error states</li>
        <li>✅ Meets accessibility and responsiveness</li>
      </ul>
    </section>
  );
}
