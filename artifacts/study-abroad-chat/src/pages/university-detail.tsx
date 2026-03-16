import { useRoute, Link } from "wouter";
import { 
  ArrowLeft, MapPin, Globe, Trophy, CheckCircle2, 
  AlertCircle, Mail, Phone, ExternalLink, Calendar,
  DollarSign, GraduationCap, ShieldCheck, Clock
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { useGetUniversity, useListVisaRequirements } from "@workspace/api-client-react";

export function UniversityDetailPage() {
  const [, params] = useRoute("/knowledge/university/:id");
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: uni, isLoading, error } = useGetUniversity(id, {
    query: { enabled: !!id }
  });

  const { data: visas } = useListVisaRequirements({ 
    country: uni?.country 
  }, { 
    query: { enabled: !!uni?.country } 
  });

  const visaTips = visas?.[0]; // Getting the primary visa rules for that country

  if (isLoading) {
    return (
      <MainLayout>
        <div className="h-full w-full flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full" />
        </div>
      </MainLayout>
    );
  }

  if (error || !uni) {
    return (
      <MainLayout>
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <AlertCircle className="w-20 h-20 text-destructive mb-6" />
          <h2 className="text-3xl font-serif font-bold mb-2">University Not Found</h2>
          <p className="text-muted-foreground mb-8 text-lg">The institution you're looking for doesn't exist in our database.</p>
          <Link href="/knowledge" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all">
            Back to Knowledge Base
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full h-full overflow-y-auto bg-background/50 pb-20">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <Link href="/knowledge" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Knowledge Base
          </Link>

          {/* Header Profile */}
          <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-xl mb-12">
            <div className="h-56 bg-gradient-to-r from-primary to-accent relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            </div>
            <div className="px-8 md:px-12 pb-12 pt-0 relative">
              <div className="w-32 h-32 bg-card rounded-3xl border-8 border-card shadow-xl -mt-16 mb-6 flex items-center justify-center overflow-hidden z-10 relative bg-background">
                 <span className="text-5xl font-serif text-primary font-bold">{uni.name.charAt(0)}</span>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">{uni.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm font-medium mb-6">
                    <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg text-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      {uni.city}, {uni.country}
                    </span>
                    {uni.website && (
                      <a href={uni.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-lg text-foreground hover:text-primary transition-colors">
                        <Globe className="w-4 h-4 text-primary" />
                        Official Website <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}
                    {uni.ranking && (
                      <span className="flex items-center gap-1.5 bg-accent/20 text-accent-foreground px-3 py-1.5 rounded-lg font-bold border border-accent/20">
                        <Trophy className="w-4 h-4 text-accent" />
                        Rank #{uni.ranking}
                      </span>
                    )}
                    {uni.scholarshipsAvailable && (
                      <span className="flex items-center gap-1.5 bg-green-500/10 text-green-700 px-3 py-1.5 rounded-lg font-bold border border-green-500/20">
                        <DollarSign className="w-4 h-4" />
                        Scholarships Available
                      </span>
                    )}
                  </div>
                  <p className="text-foreground text-lg leading-relaxed max-w-4xl">
                    {uni.description || `${uni.name} is a leading institution located in ${uni.city}, ${uni.country}. Known for its excellent academic programs and research facilities.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Programs Table */}
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6 flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-primary" /> Available Programs
                </h2>
                
                {uni.programs.length === 0 ? (
                  <div className="text-center py-16 bg-card rounded-3xl border border-dashed border-border shadow-sm">
                    <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium text-muted-foreground">No specific programs listed yet.</p>
                  </div>
                ) : (
                  <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="py-4 px-6 text-sm font-bold text-muted-foreground uppercase">Program & Degree</th>
                            <th className="py-4 px-6 text-sm font-bold text-muted-foreground uppercase">Details</th>
                            <th className="py-4 px-6 text-sm font-bold text-muted-foreground uppercase">Requirements</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {uni.programs.map(prog => {
                            const isDeadlineSoon = prog.applicationDeadline && !prog.applicationDeadline.toLowerCase().includes('rolling'); // simplistic check
                            
                            return (
                              <tr key={prog.id} className="hover:bg-muted/30 transition-colors">
                                <td className="py-5 px-6 align-top">
                                  <div className="font-bold text-foreground text-lg mb-2">{prog.name}</div>
                                  <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-bold shadow-sm border border-border">
                                    {prog.degree}
                                  </span>
                                </td>
                                <td className="py-5 px-6 align-top">
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground"/> {prog.duration}</div>
                                    <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-muted-foreground"/> {prog.language}</div>
                                    <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-muted-foreground"/> {prog.tuitionPerYear || "Varies"}</div>
                                    <div className={`flex items-center gap-2 font-bold ${isDeadlineSoon ? 'text-destructive' : 'text-muted-foreground'}`}>
                                      <Calendar className="w-4 h-4"/> {prog.applicationDeadline || "Rolling"}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-5 px-6 align-top">
                                  <div className="space-y-3">
                                    <div className="flex gap-2">
                                      {prog.ieltsMin && <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold border border-primary/20">IELTS {prog.ieltsMin}</span>}
                                      {prog.toeflMin && <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold border border-primary/20">TOEFL {prog.toeflMin}</span>}
                                      {!prog.ieltsMin && !prog.toeflMin && <span className="text-xs text-muted-foreground font-medium">Standard English Req.</span>}
                                    </div>
                                    <details className="text-sm cursor-pointer group">
                                      <summary className="font-semibold text-primary hover:underline">View Requirements</summary>
                                      <div className="mt-2 text-muted-foreground p-3 bg-muted rounded-xl text-xs leading-relaxed border border-border">
                                        {prog.requirements || "Standard university entry requirements apply. Please check official website."}
                                      </div>
                                    </details>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Financial Services Section */}
              {uni.financialServices && (
                <div>
                  <h2 className="text-3xl font-serif font-bold mb-6 flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-green-600" /> Financial Services
                  </h2>
                  <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
                    <ul className="space-y-4">
                      {uni.financialServices.split(',').map((service, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-lg text-foreground font-medium">{service.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Content */}
            <div className="space-y-8">
              {/* Contact Card */}
              <div className="bg-card rounded-3xl border border-border p-8 shadow-lg">
                <h3 className="text-2xl font-serif font-bold mb-6 border-b pb-4">Contact Directory</h3>
                
                <div className="space-y-6">
                  {/* General / Admissions */}
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Admissions & General</h4>
                    <div className="flex gap-2 mb-2">
                      <a href={`mailto:admissions@university.edu`} className="flex-1 flex items-center justify-center gap-2 bg-muted hover:bg-primary/10 hover:text-primary px-3 py-2 rounded-xl text-sm font-bold transition-colors">
                        <Mail className="w-4 h-4"/> Email
                      </a>
                      <a href={`tel:+1234567890`} className="flex-1 flex items-center justify-center gap-2 bg-muted hover:bg-primary/10 hover:text-primary px-3 py-2 rounded-xl text-sm font-bold transition-colors">
                        <Phone className="w-4 h-4"/> Call
                      </a>
                    </div>
                  </div>

                  {/* International Office */}
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">International Office</h4>
                    <div className="flex gap-2">
                      <a href={`mailto:international@university.edu`} className="flex-1 flex items-center justify-center gap-2 bg-muted hover:bg-primary/10 hover:text-primary px-3 py-2 rounded-xl text-sm font-bold transition-colors">
                        <Mail className="w-4 h-4"/> Email
                      </a>
                    </div>
                  </div>

                  {/* Visa Counselor - Highlighted */}
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4"/> Visa Counselor
                    </h4>
                    <div className="flex gap-2">
                      <a href={`mailto:visa@university.edu`} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all">
                        <Mail className="w-4 h-4"/> Contact Now
                      </a>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-3 text-sm text-muted-foreground">
                      <MapPin className="w-5 h-5 shrink-0" />
                      <span>{uni.city}, {uni.country} (Main Campus)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visa Tips Card */}
              {visaTips && (
                <div className="bg-gradient-to-b from-card to-accent/5 rounded-3xl border border-border p-8 shadow-lg relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
                  <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2 text-foreground">
                    <ShieldCheck className="w-6 h-6 text-accent" />
                    Visa Tips for {uni.country}
                  </h3>
                  <div className="space-y-4 mb-6 relative z-10">
                    <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl text-sm border shadow-sm">
                      <span className="font-bold block mb-1">Processing Time:</span>
                      {visaTips.processingTime || "Varies"}
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl text-sm border shadow-sm">
                      <span className="font-bold block mb-1">Proof of Funds:</span>
                      {visaTips.proofOfFunds || "Required. Check embassy details."}
                    </div>
                  </div>
                  <Link href={`/knowledge?country=${uni.country}`} className="inline-flex items-center text-accent-foreground font-bold text-sm hover:underline">
                    View Full Requirements <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
