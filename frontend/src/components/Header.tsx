import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { clearAuthSession, getCurrentUser, logout } from "../../api";
import Navigation from "./Navigation";

type CurrentUser = {
  id: number;
  user_name: string;
};

const Header = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUserQuery = useQuery<CurrentUser | null>({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    retry: false,
  });
  const isAuthenticated = Boolean(currentUserQuery.data);
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuthSession();
      queryClient.setQueryData(["current-user"], null);
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(`Logout failed: ${error.message}`);
    },
  });

  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="text-xl font-bold tracking-tight text-white"
        >
          TodoApp
        </NavLink>
        <Navigation
          isAuthenticated={isAuthenticated}
          isLoading={currentUserQuery.isPending}
          onLogout={() => logoutMutation.mutate()}
          isLoggingOut={logoutMutation.isPending}
        />
      </div>
    </header>
  );
};

export default Header;
