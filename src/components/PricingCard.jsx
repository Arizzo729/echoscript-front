export default function PricingCard({
  price,
  title,
  blurb,
  features = [],
  highlight = false,
}) {
  return (
    <div className={`rounded-lg p-6 ${highlight ? 'bg-teal-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className={`mt-1 text-sm ${highlight ? 'text-teal-100' : 'text-zinc-600 dark:text-zinc-400'}`}>{blurb}</p>
      <p className="mt-4">
        <span className="text-4xl font-bold tracking-tight">${price}</span>
        <span className="text-sm font-semibold">/month</span>
      </p>
      <button className={`mt-6 w-full rounded-md py-2 text-sm font-semibold ${highlight ? 'bg-white text-teal-600' : 'bg-teal-600 text-white'}`}>
        Buy plan
      </button>
      <ul className="mt-6 space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );
}
