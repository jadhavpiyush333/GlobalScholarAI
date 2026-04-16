import { Link } from "wouter";
import { Globe, GraduationCap, ShieldCheck, Briefcase, MessageSquare } from "lucide-react";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row w-full overflow-hidden">
      {/* LEFT PANEL */}
      <div 
        className="hidden md:flex flex-col w-[60%] relative bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-12 lg:p-20 justify-between text-white"
      >
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/cover_hero.jpg)` }}
        />
        
        {/* Top Logo */}
        <div className="z-10 flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">GlobeScholar AI</span>
        </div>

        {/* Center Content */}
        <div className="z-10 max-w-2xl mt-auto mb-auto">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif font-bold leading-tight mb-8">
            Your 24/7 AI Counselor for Global Education
          </h1>
          <div className="space-y-6 text-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Globe className="w-6 h-6 text-blue-300" />
              </div>
              <span className="font-medium">54+ Top Universities Worldwide</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
              </div>
              <span className="font-medium">Visa Guidance & Field Insights</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Briefcase className="w-6 h-6 text-amber-300" />
              </div>
              <span className="font-medium">Real Job Opportunities & Salaries</span>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="z-10 pt-8 border-t border-white/20 mt-8">
          <p className="text-sm font-semibold tracking-wider uppercase text-white/80">
            54 Universities | 9 Study Fields | 45+ Career Paths | 10+ Countries
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-[40%] flex-1 bg-white flex flex-col items-center justify-center p-8 md:p-12 relative">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center text-center relative z-10">
          <GraduationCap className="w-12 h-12 text-indigo-600 mb-6" />
          <h2 className="text-3xl font-serif font-bold mb-3 text-gray-900">GlobeScholar AI Demo</h2>
          <p className="text-gray-500 mb-10 text-base">Explore global education opportunities instantly - no login required</p>
          
          <Link href="/" className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Start AI Chat Now
          </Link>
          
          <p className="mt-8 text-sm text-gray-400 font-medium">
            Public Demo • Powered by GPT
          </p>
        </div>
        
        {/* Badge */}
        <div className="absolute bottom-8 right-8">
          <div className="px-4 py-2 bg-gray-50 rounded-full border border-gray-100 text-xs font-bold text-gray-400 flex items-center shadow-sm">
            Live Demo
          </div>
        </div>
      </div>
    </div>
  );
}
