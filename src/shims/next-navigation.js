import { useMemo } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();
  return useMemo(
    () => ({
      push: (url) => navigate(url),
      replace: (url) => navigate(url, { replace: true }),
      back: () => navigate(-1),
    }),
    [navigate],
  );
}

export function usePathname() {
  return useLocation().pathname;
}

export function useParamsCompat() {
  return useParams();
}

export { useParamsCompat as useParams };

export function useSearchParamsCompat() {
  const [params] = useSearchParams();
  return params;
}

export { useSearchParamsCompat as useSearchParams };
