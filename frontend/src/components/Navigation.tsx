import { NavLink } from "react-router-dom";

type NavigationProps = {
  isAuthenticated: boolean;
  isLoading: boolean;
  onLogout: () => void;
  isLoggingOut: boolean;
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "border-cyan-400 text-cyan-300"
      : "border-transparent text-slate-400 hover:border-slate-600 hover:text-white"
  }`;

const Navigation = ({
  isAuthenticated,
  isLoading,
  onLogout,
  isLoggingOut,
}: NavigationProps) => (
  <nav aria-label="Main navigation" className="flex items-center gap-4 sm:gap-6">
    <NavLink to="/" end className={navLinkClass}>
      Home
    </NavLink>

    {!isLoading && !isAuthenticated && (
      <>
        <NavLink to="/register" className={navLinkClass}>
          Register
        </NavLink>
        <NavLink to="/login" className={navLinkClass}>
          Login
        </NavLink>
      </>
    )}

    {!isLoading && isAuthenticated && (
      <>
        <NavLink to="/todos" className={navLinkClass}>
          My todos
        </NavLink>
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </>
    )}
  </nav>
);

export default Navigation;
