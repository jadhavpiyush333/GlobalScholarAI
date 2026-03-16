import { useRoute, Link } from "wouter";
import { ArrowLeft, MapPin, Globe, Trophy, CheckCircle2, AlertCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { useGetUniversity } from "@workspace/api-client-react";

export function UniversityDetailPage() {
  const [, params] = useRoute("/knowledge/university/:id");
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: uni, isLoading, error } = useGetUniversity(id, {
    query: { enabled: !!id }
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="h-full w-full flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full" />
        </div>
      </MainLayout>
    );
  }

  if (error || !uni) {
    return (
      <MainLayout>
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <AlertCircle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">University Not Found</h2>
          <p className="text-muted-foreground mb-6">The institution you're looking for doesn't exist in our database.</p>
          <Link href="/knowledge" className="px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors">
            Back to Knowledge Base
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
        <Link href="/knowledge" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Knowledge Base
        </Link>

        {/* Header Profile */}
        <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-lg mb-8">
          <div className="h-48 bg-gradient-to-r from-primary to-primary/80 relative">
            {/* Optional cover pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
          </div>
          <div className="px-8 pb-8 pt-0 relative">
            <div className="w-24 h-24 bg-card rounded-2xl border-4 border-card shadow-lg -mt-12 mb-4 flex items-center justify-center overflow-hidden">
               <span className="text-4xl font-serif text-primary">{uni.name.charAt(0)}</span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">{uni.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {uni.city}, {uni.country}
                  </div>
                  {uni.website && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4" />
                      <a href={uni.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                        Official Website
                      </a>
                    </div>
                  )}
                  {uni.ranking && (
                    <div className="flex items-center gap-1.5 text-accent-foreground font-semibold bg-accent/20 px-3 py-1 rounded-full">
                      <Trophy className="w-4 h-4 text-accent" />
                      Rank #{uni.ranking}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-lg font-bold mb-3">About the University</h3>
              <p className="text-foreground leading-relaxed">
                {uni.description || `${uni.name} is a leading institution located in ${uni.city}, ${uni.country}. Known for its excellent academic programs and research facilities, it attracts students from all over the world.`}
              </p>
            </div>
          </div>
        </div>

        {/* Programs List */}
        <h2 className="text-2xl font-serif font-bold mb-6">Available Programs</h2>
        
        {uni.programs.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">No specific programs listed for this university yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uni.programs.map(prog => (
              <div key={prog.id} className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-foreground pr-4">{prog.name}</h3>
                  <span className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-lg text-xs font-bold whitespace-nowrap">
                    {prog.degree}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Duration</p>
                    <p className="text-sm font-medium">{prog.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Language</p>
                    <p className="text-sm font-medium">{prog.language}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Tuition / Year</p>
                    <p className="text-sm font-medium">{prog.tuitionPerYear || "Varies"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold text-destructive">Deadline</p>
                    <p className="text-sm font-medium text-destructive">{prog.applicationDeadline || "Rolling"}</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Entry Requirements
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">{prog.requirements || "Standard university entry requirements apply."}</p>
                  
                  {(prog.ieltsMin || prog.toeflMin) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {prog.ieltsMin && (
                        <span className="bg-background border border-border px-2 py-1 rounded text-xs font-medium">
                          IELTS: {prog.ieltsMin}+
                        </span>
                      )}
                      {prog.toeflMin && (
                        <span className="bg-background border border-border px-2 py-1 rounded text-xs font-medium">
                          TOEFL: {prog.toeflMin}+
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
