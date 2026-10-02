export default function FamilyAlertPanel() {
  return (
    <section className="rounded-2xl border-2 border-stone-300 bg-white p-6">
      <p className="text-lg font-semibold text-stone-600">Demo simulation</p>
      <p className="mt-3 text-xl leading-relaxed text-stone-900">
        Text sent to Maria (daughter):
      </p>
      <p className="mt-3 rounded-2xl bg-stone-100 p-4 text-xl leading-relaxed text-stone-900">
        Mom may be on a suspicious call right now. It has several scam warning
        signs. Please check in.
      </p>
    </section>
  );
}
