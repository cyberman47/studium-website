function HeaderSkeleton({ titleWidth = "w-72" }: { titleWidth?: string }) {
  return <>
    <div className="skeleton h-6 w-28 rounded-full" />
    <div className={`skeleton mt-5 h-10 sm:h-12 ${titleWidth} rounded-2xl`} />
    <div className="mt-4 space-y-2">
      <div className="skeleton h-4 w-full max-w-xl rounded-full" />
      <div className="skeleton h-4 w-2/3 max-w-md rounded-full" />
    </div>
  </>;
}

export function SettingsSkeleton({ cards = 1 }: { cards?: number }) {
  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <HeaderSkeleton titleWidth="w-64" />
    <div className="mt-10 max-w-2xl space-y-6">
      {Array.from({ length: cards }).map((_, i) => <div key={i} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-white/[0.08] dark:bg-[#0d1917] dark:shadow-none sm:p-7">
        <div className="flex items-center gap-4">
          <div className="skeleton h-14 w-14 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="skeleton h-3.5 w-32 rounded-full" />
            <div className="skeleton h-3 w-40 rounded-full" />
          </div>
        </div>
        <div className="mt-5 space-y-2.5">
          <div className="skeleton h-3 w-full rounded-full" />
          <div className="skeleton h-3 w-5/6 rounded-full" />
          <div className="skeleton h-3 w-2/3 rounded-full" />
        </div>
      </div>)}
    </div>
  </section>;
}

export function SimplePageSkeleton() {
  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <HeaderSkeleton titleWidth="w-80" />
    <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-white py-20 dark:border-white/10 dark:bg-[#0d1917]">
      <div className="skeleton h-14 w-14 rounded-2xl" />
      <div className="skeleton h-4 w-48 rounded-full" />
      <div className="skeleton h-3 w-64 rounded-full" />
    </div>
  </section>;
}

export function CaseOfTheDaySkeleton() {
  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <div className="skeleton h-4 w-32 rounded-full" />
    <div className="skeleton mt-4 h-6 w-40 rounded-full" />
    <div className="skeleton mt-5 h-9 w-80 rounded-2xl" />
    <div className="mt-3 flex gap-2"><div className="skeleton h-6 w-24 rounded-full" /><div className="skeleton h-6 w-24 rounded-full" /></div>
    <div className="mt-8 max-w-2xl space-y-6">
      <div className="skeleton h-24 rounded-3xl" />
      <div className="skeleton h-64 rounded-3xl" />
    </div>
  </section>;
}

export function ProgressPageSkeleton() {
  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <HeaderSkeleton titleWidth="w-80" />
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-3xl" />)}
    </div>
    <div className="mt-8 space-y-8">
      <div className="skeleton h-64 rounded-3xl" />
      <div className="skeleton h-56 rounded-3xl" />
      <div className="skeleton h-48 rounded-3xl" />
    </div>
  </section>;
}

export function DashboardHomeSkeleton() {
  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(15,139,141,0.12),transparent_65%)]" />
    <div className="skeleton h-6 w-32 rounded-full" />
    <div className="skeleton mt-5 h-10 w-80 rounded-2xl sm:h-12 sm:w-96" />

    <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_340px] xl:items-start xl:gap-8">
      <div className="min-w-0 space-y-8">
        <div className="skeleton h-40 rounded-3xl sm:h-44" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="skeleton h-32 rounded-3xl" />
          <div className="skeleton h-32 rounded-3xl" />
          <div className="skeleton h-32 rounded-3xl" />
        </div>
        <div className="skeleton h-48 rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="skeleton h-28 rounded-3xl" />
          <div className="skeleton h-28 rounded-3xl" />
          <div className="skeleton h-28 rounded-3xl" />
        </div>
      </div>
      <aside className="space-y-6">
        <div className="skeleton h-48 rounded-3xl" />
        <div className="skeleton h-40 rounded-3xl" />
      </aside>
    </div>
  </section>;
}
