// Legacy redirect
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export default function SignalsPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/" });
  }, [navigate]);
  return null;
}
