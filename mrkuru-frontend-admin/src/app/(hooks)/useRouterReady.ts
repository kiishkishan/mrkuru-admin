"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

const useRouterData = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  return {
    pathname,
    searchParams,
    router,
  };
};

export default useRouterData;
