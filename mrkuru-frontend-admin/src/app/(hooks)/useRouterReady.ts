"use client";

import { usePathname, useRouter } from "next/navigation";

const useRouterReady = () => {
  const pathname = usePathname();
  const router = useRouter();

  return {
    pathname,
    router,
  };
};

export default useRouterReady;
