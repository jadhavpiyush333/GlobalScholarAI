import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { MessageSquare, BookOpen, Menu, X, LogOut, GraduationCap, Compass } from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";

export function MainLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const NavLinks = () => (
    <div className="flex flex-col md:flex-row gap-2 md:gap-6">
      <Link 
        href="/" 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          location === "/" || location.startsWith("/?id=") 
            ? "text-primary font-bold bg-primary/5" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        Chat
      </Link>
      <Link 
        href="/knowledge" 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          location.startsWith("/knowledge") 
            ? "text-primary font-bold bg-primary/5" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        <BookOpen className="w-4 h-4" />
        Knowledge Base
      </Link>
      <Link 
        href="/fields" 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          location.startsWith("/fields") 
            ? "text-primary font-bold bg-primary/5" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        <Compass className="w-4 h-4" />
        Field Insights
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b bg-card/80 backdrop-blur-md z-40 shrink-0 shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif font-bold text-xl hidden sm:block text-foreground group-hover:text-primary transition-colors">StudyAbroad AI</span>
          </Link>
          <nav className="hidden md:flex">
            <NavLinks />
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-3 pr-4 border-r">
              <span className="text-sm font-medium text-foreground">{user.name}</span>
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full border border-border shadow-sm" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>
          )}
          <button 
            onClick={() => logout()}
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground bg-muted/50 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bottom-0 bg-background z-50 p-4 flex flex-col border-b shadow-xl animate-in slide-in-from-top-2">
          <NavLinks />
          <div className="mt-auto border-t pt-4">
             {user && (
              <div className="flex items-center gap-3 mb-4 p-3 bg-muted rounded-xl">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full border border-border shadow-sm" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {user.name?.charAt(0)}
                  </div>
                )}
                <span className="font-bold text-foreground">{user.name}</span>
              </div>
            )}
            <button 
              onClick={() => logout()}
              className="flex w-full items-center justify-center gap-2 p-3 text-destructive font-bold bg-destructive/10 hover:bg-destructive/20 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
