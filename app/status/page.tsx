import type { Metadata } from "next";
import { StatusContent } from "./status-content";

export const metadata: Metadata = {
  title: "Studium — Product Status Summary"
};

export default function StatusPage() {
  return <StatusContent />;
}
