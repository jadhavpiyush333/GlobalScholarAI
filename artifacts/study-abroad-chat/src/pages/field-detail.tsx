import { useRoute, Link } from "wouter";
import { 
  ArrowLeft, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Globe2, 
  Lightbulb, 
  Target, 
  CheckCircle2,
  Building
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { useGetField } from "@workspace/api-client-react";

export function FieldDetailPage() {
  const [, params] = useRoute("/fields/:slug");
  const slug = params?.slug || "";

  const { data: field, isLoading, error } = useGetField(slug, {
    query: { enabled: !!slug }
  });

  const getCompetitionColor = (level?: string) => {
    switch(level?.toLowerCase()) {
      case 'very high': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getDemandColor = (level?: string) => {
    switch(level?.toLowerCase()) {
      case 'critical': return 'bg-red-500/10 text-red-600';
      case 'very high': return 'bg-orange-500/10 text-orange-600';
      case 'high': return 'bg-yellow-500/10 text-yellow-600';
      case 'medium': return 'bg-green-500/10 text-green-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="h-full w-full flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full" />
        </div>
      </MainLayout>
    );
  }

  if (error || !field) {
    return (
      <MainLayout>
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <Briefcase className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-3xl font-serif font-bold mb-2">Field Not Found</h2>
          <p className="text-muted-foreground mb-8 text-lg">The field of study you're looking for doesn't exist.</p>
          <Link href="/fields" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all">
            Back to Fields
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full h-full overflow-y-auto bg-background/50 pb-20">
        <Link href="/fields" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors m-6 mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Insights
        </Link>

        <div className="max-w-5xl mx-auto px-6">
          {/* Hero */}
          <div className="bg-card rounded-3xl border border-border shadow-md p-8 md:p-12 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-inner">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  {field.competitionLevel && (
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getCompetitionColor(field.competitionLevel)}`}>
                      {field.competitionLevel} Competition
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">{field.name}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                  {field.description}
                </p>
              </div>
              
              <div className="w-full md:w-64 flex flex-col gap-4 shrink-0">
                <div className="bg-background border border-border rounded-2xl p-4 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 text-green-600 rounded-xl"><TrendingUp className="w-6 h-6"/></div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase">Growth Rate</p>
                    <p className="text-xl font-bold text-foreground">{field.growthRate || "N/A"}</p>
                  </div>
                </div>
                <div className="bg-background border border-border rounded-2xl p-4 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-accent/20 text-accent-foreground rounded-xl"><DollarSign className="w-6 h-6"/></div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase">Avg Salary</p>
                    <p className="text-xl font-bold text-foreground">{field.avgStartingSalaryUSD ? `$${field.avgStartingSalaryUSD}` : "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Future Scope */}
            {field.futureScope && (
              <div className="bg-gradient-to-br from-card to-primary/5 rounded-3xl border border-border p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-serif font-bold">Future Scope</h2>
                </div>
                <p className="text-foreground leading-relaxed">{field.futureScope}</p>
              </div>
            )}

            {/* Global Competition */}
            {field.globalCompetition && (
              <div className="bg-gradient-to-br from-card to-accent/5 rounded-3xl border border-border p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-accent" />
                  <h2 className="text-2xl font-serif font-bold">Global Landscape</h2>
                </div>
                <p className="text-foreground leading-relaxed">{field.globalCompetition}</p>
              </div>
            )}
          </div>

          {/* Top Skills */}
          {field.topSkillsRequired && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" /> Top Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {field.topSkillsRequired.split(',').map((skill, i) => (
                  <span key={i} className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium shadow-sm">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job Opportunities */}
          {field.jobOpportunities && field.jobOpportunities.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-serif font-bold mb-6">Job Opportunities</h2>
              <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="py-4 px-6 text-sm font-bold text-muted-foreground uppercase tracking-wider">Role Title</th>
                        <th className="py-4 px-6 text-sm font-bold text-muted-foreground uppercase tracking-wider">Demand Level</th>
                        <th className="py-4 px-6 text-sm font-bold text-muted-foreground uppercase tracking-wider">Avg Salary</th>
                        <th className="py-4 px-6 text-sm font-bold text-muted-foreground uppercase tracking-wider">Top Hiring Countries</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {field.jobOpportunities.map(job => (
                        <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-5 px-6 font-bold text-foreground text-lg">{job.title}</td>
                          <td className="py-5 px-6">
                            <span className={`px-3 py-1 rounded-md text-xs font-bold ${getDemandColor(job.demandLevel)}`}>
                              {job.demandLevel}
                            </span>
                          </td>
                          <td className="py-5 px-6 font-medium">${job.avgSalaryUSD}</td>
                          <td className="py-5 px-6 text-sm text-muted-foreground">{job.topHiringCountries}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 text-center flex flex-col items-center shadow-xl">
            <Building className="w-12 h-12 mb-6 opacity-80" />
            <h2 className="text-3xl font-serif font-bold mb-4">Ready to start your journey?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl text-lg">
              Explore the top universities globally offering programs in {field.name} and begin planning your study abroad adventure.
            </p>
            <Link href={`/knowledge?field=${encodeURIComponent(field.name)}`} className="px-8 py-4 bg-background text-foreground font-bold rounded-xl shadow-md hover:scale-105 transition-transform">
              Find Top Universities
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
