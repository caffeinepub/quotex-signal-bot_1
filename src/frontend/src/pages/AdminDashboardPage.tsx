// Legacy redirect
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/admin" });
  }, [navigate]);
  return null;
}
