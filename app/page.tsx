import type { Metadata } from "next";
import { EngineeringApp } from "./components/EngineeringApp";

export const metadata: Metadata = {
  title: "Cellular Beam Professional",
  description: "Professional cellular beam analysis and design workspace.",
};

export default function Home() {
  return <EngineeringApp />;
}
