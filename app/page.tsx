import Navbar from "@/components/Navbar";
import FrontPage from "@/components/FrontPage";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500/30">
      <Navbar />
      <FrontPage />
    </div>
  );
}
