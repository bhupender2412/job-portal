import {
  Link,
} from "react-router-dom";

function NotFound() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <div className="empty-state">
          <p className="eyebrow">
            404
          </p>

          <h1 className="mt-3 text-3xl font-black text-slate-900">
            Page not found
          </h1>

          <p className="mt-3 text-slate-500">
            The page you requested
            does not exist.
          </p>

          <Link
            to="/"
            className="btn-primary mt-6"
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;