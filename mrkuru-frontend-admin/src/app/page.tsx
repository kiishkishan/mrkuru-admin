"use client";

import Dashboard from "@/app/dashboard/page";
import { useEffect } from "react";
import { useAppDispatch } from "./redux";
import { startTokenExpirationCheck } from "@/state/slices/authSlice";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(startTokenExpirationCheck());
  }, [dispatch]);

  return <Dashboard />;
}
