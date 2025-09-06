import Wordle from "~/components/Wordle/Wordle";
import type { Route } from "./+types/home";
import AppHeader from "~/components/AppHeader";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Event Digi" },
    { name: "description", content: "Welcome to Event Digi!" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader />

      <Wordle />
    </div>
  );
}
