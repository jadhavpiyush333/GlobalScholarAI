import { Link } from "wouter";
import { Compass, TrendingUp, DollarSign, Globe2, Briefcase, ArrowRight } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { useListFields } from "@workspace/api-client-react";

export function FieldInsightsPage() {
  const { data: fields, isLoading } = useListFields();

  const getCompetitionColor = (level?: string) => {
    switch(level?.toLowerCase()) {
      case 'very high': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <MainLayout>
      <div className="w-full h-full overflow-y-auto bg-background/50">
        <div className="relative overflow-hidden bg-card border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Compass className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Field Insights</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Explore data-driven insights into top fields of study, including global competition levels, salary trends, and top hiring countries.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-72 bg-card border border-border rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : fields?.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
              <Compass className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">No Fields Found</h2>
              <p className="text-muted-foreground">Check back later for updated field insights.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields?.map(field => (
                <div key={field.id} className="group bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      {field.competitionLevel && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCompetitionColor(field.competitionLevel)}`}>
                          {field.competitionLevel}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2 line-clamp-2">{field.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                      {field.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                          <TrendingUp className="w-3.5 h-3.5" /> Growth
                        </div>
                        <span className="font-medium text-foreground">{field.growthRate || "N/A"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                          <DollarSign className="w-3.5 h-3.5" /> Avg Salary
                        </div>
                        <span className="font-medium text-foreground">{field.avgStartingSalaryUSD ? `$${field.avgStartingSalaryUSD}` : "N/A"}</span>
                      </div>
                      <div className="col-span-2 flex flex-col gap-1 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                          <Globe2 className="w-3.5 h-3.5" /> Top Countries
                        </div>
                        <span className="font-medium text-sm text-foreground line-clamp-1">{field.topCountriesForJobs || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/fields/${field.slug}`}
                    className="p-4 bg-muted/30 border-t border-border flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary/5 transition-colors"
                  >
                    Explore Field
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
