import "./App.css";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import TodosList from "./pages/TodosList";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <main className="min-h-[calc(100vh-71px)] bg-slate-950 text-slate-100">
              <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">TodoApp</p>
                  <h1 className="mt-5 max-w-xl text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl">
                    Your day,<br />
                    <span className="text-cyan-400">under control.</span>
                  </h1>
                  <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
                    A calm place for the things you need to finish.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link to="/register" className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300">
                      Get started
                    </Link>
                    <Link to="/login" className="rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300">
                      Sign in
                    </Link>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-md">
                  <div className="absolute -inset-8 rounded-full bg-cyan-400/10 blur-3xl" />
                  <div className="relative rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-black/30">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Today</p><h2 className="mt-1 text-xl font-bold text-white">Focus list</h2></div>
                      <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-400">1 / 3 done</span>
                    </div>
                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-3 rounded-xl bg-slate-800/70 p-3"><span className="flex size-6 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-slate-950">✓</span><span className="text-sm text-slate-500 line-through">Plan the week</span></div>
                      <div className="flex items-center gap-3 rounded-xl border border-cyan-400/40 bg-cyan-400/10 p-3"><span className="size-6 rounded-full border-2 border-cyan-400" /><span className="text-sm font-semibold text-cyan-100">Ship the new dashboard</span></div>
                      <div className="flex items-center gap-3 rounded-xl bg-slate-800/70 p-3"><span className="size-6 rounded-full border-2 border-slate-600" /><span className="text-sm text-slate-300">Pick up groceries</span></div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={<TodosList />} />
      </Routes>
    </>
  );
}

export default App;
