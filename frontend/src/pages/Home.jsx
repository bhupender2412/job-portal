function Home() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <div className="grid min-h-[75vh] items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">
              Find Your Next Opportunity
            </p>

            <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Connect talent with the
              right opportunities.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
              A modern recruitment
              platform for job seekers,
              recruiters and growing
              companies.
            </p>
          </div>

          <div className="portal-card p-8">
            <p className="eyebrow">
              Platform
            </p>

            <h2 className="mt-3 text-2xl font-black text-slate-900">
              Job Portal is running.
            </h2>

            <p className="mt-3 text-slate-500">
              Routing, state management
              and API architecture are
              being configured.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;