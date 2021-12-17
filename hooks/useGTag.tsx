import { useRouter } from "next/router";
import * as React from "react";
import { useEffect, useState } from "react";

export type UseGTagHook = {};
export function useGTag() {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ;
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
}
