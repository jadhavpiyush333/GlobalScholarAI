import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { MessageSquare, BookOpen, Menu, X, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { 
  useListOpenaiConversations, 
  useCreateOpenaiConversation,
  useDeleteOpenaiConversation 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListOpenaiConversationsQueryKey } from "@workspace/api-client-react";

export function MainLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: conversations, isLoading: isLoadingConvos } = useListOpenaiConversations();
  const createConvo = useCreateOpenaiConversation();
  const deleteConvo = useDeleteOpenaiConversation();

  const handleNewChat = async () => {
    try {
      const result = await createConvo.mutateAsync({ data: { title: "New Conversation" } });
      queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
      setLocation(`/?id=${result.id}`);
      setIsMobileMenuOpen(false);
    } catch (e) {
      console.error("Failed to create conversation", e);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteConvo.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
      if (location.includes(`id=${id}`)) {
        setLocation("/");
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const NavLinks = () => (
    <div className="space-y-1">
      <Link 
        href="/" 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          location === "/" || location.startsWith("/?id=") 
            ? "bg-primary text-primary-foreground font-medium shadow-md" 
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        AI Counselor
      </Link>
      <Link 
        href="/knowledge" 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          location.startsWith("/knowledge") 
            ? "bg-primary text-primary-foreground font-medium shadow-md" 
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
      >
        <BookOpen className="w-5 h-5" />
        Knowledge Base
      </Link>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-72 bg-sidebar border-r border-sidebar-border
        transform transition-transform duration-300 ease-in-out
        flex flex-col h-full
        ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif font-bold text-lg text-sidebar-foreground">GlobalEd AI</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <NavLinks />
        </div>

        <div className="px-4 py-2 border-t border-sidebar-border flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-3 mt-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Chats</h3>
            <button 
              onClick={handleNewChat}
              disabled={createConvo.isPending}
              className="p-1 text-primary hover:bg-primary/10 rounded-md transition-colors"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-1">
            {isLoadingConvos ? (
              <div className="animate-pulse space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-10 bg-sidebar-accent rounded-lg" />)}
              </div>
            ) : conversations?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent chats</p>
            ) : (
              conversations?.map((conv) => (
                <div key={conv.id} className="group relative">
                  <Link 
                    href={`/?id=${conv.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm truncate transition-colors ${
                      location.includes(`id=${conv.id}`)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    {conv.title || "New Conversation"}
                    <span className="block text-xs text-muted-foreground mt-0.5 font-normal">
                      {format(new Date(conv.createdAt), "MMM d, yyyy")}
                    </span>
                  </Link>
                  <button 
                    onClick={(e) => handleDelete(e, conv.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-serif font-bold text-foreground">GlobalEd AI</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto relative">
          {children}
        </div>
      </main>
    </div>
  );
}
