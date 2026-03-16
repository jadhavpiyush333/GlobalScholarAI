import { Globe, GraduationCap, ShieldCheck, TrendingUp } from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";

export function LoginPage() {
  const { login } = useAuth();
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      </div>
      
      <div className="z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24">
        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 shadow-inner">
            <GraduationCap className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-foreground leading-tight">
            StudyAbroad AI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-lg mx-auto md:mx-0">
            Your 24/7 AI-powered study abroad counselor
          </p>
          
          <div className="flex flex-col gap-4 mt-8 max-w-md mx-auto md:mx-0">
            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-accent/20 rounded-xl text-accent-foreground"><Globe className="w-6 h-6"/></div>
              <span className="font-medium text-lg text-left">Knowledge base of 50+ top universities</span>
            </div>
            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-primary/20 rounded-xl text-primary"><ShieldCheck className="w-6 h-6"/></div>
              <span className="font-medium text-lg text-left">Accurate Visa guidance & requirements</span>
            </div>
            <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-green-500/20 rounded-xl text-green-600"><TrendingUp className="w-6 h-6"/></div>
              <span className="font-medium text-lg text-left">Real-time Field insights & job trends</span>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-[420px] bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-10 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent" />
          <GraduationCap className="w-20 h-20 text-primary mb-6 drop-shadow-md" />
          <h2 className="text-3xl font-serif font-bold mb-3 text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground text-center mb-10 text-lg leading-relaxed">Sign in to continue exploring your global education opportunities.</p>
          <button 
            onClick={() => login()}
            className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 active:translate-y-0"
          >
            Sign In to Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
