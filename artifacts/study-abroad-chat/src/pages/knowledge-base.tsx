import { useState } from "react";
import { Link, useSearch } from "wouter";
import { 
  Search, MapPin, Building, ShieldCheck, 
  Briefcase, GraduationCap, DollarSign, Award 
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { 
  useListUniversities, 
  useListPrograms, 
  useListVisaRequirements,
  useListFields
} from "@workspace/api-client-react";

type Tab = "universities" | "programs" | "visa" | "fields";

export function KnowledgeBasePage() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialField = searchParams.get("field");
  
  const [activeTab, setActiveTab] = useState<Tab>(initialField ? "universities" : "universities");
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [fieldFilter, setFieldFilter] = useState(initialField || "");

  const { data: universities, isLoading: loadingUni } = useListUniversities({ 
    search: search || undefined, 
    country: countryFilter || undefined,
    field: fieldFilter || undefined 
  });
  
  const { data: programs, isLoading: loadingProg } = useListPrograms({ 
    degree: search || undefined,
    field: fieldFilter || undefined 
  }); 
  
  const { data: visas, isLoading: loadingVisa } = useListVisaRequirements({ 
    country: countryFilter || undefined 
  });
  
  const { data: fieldsData } = useListFields();

  return (
    <MainLayout>
      <div className="w-full h-full flex flex-col relative overflow-y-auto bg-background/50 pb-20">
        {/* Header with gradient */}
        <div className="relative h-64 w-full bg-primary overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-primary to-primary shadow-inner" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary-foreground mb-4 drop-shadow-md">Knowledge Base</h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl font-medium">Verified, up-to-date data on top global universities, visa requirements, and academic programs.</p>
          </div>
        </div>

        <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 flex flex-col gap-6 -mt-8 relative z-10">
          {/* Controls */}
          <div className="bg-card rounded-3xl shadow-xl border border-border p-4 flex flex-col xl:flex-row gap-4 justify-between items-center backdrop-blur-xl">
            <div className="flex bg-muted p-1.5 rounded-2xl w-full xl:w-auto overflow-x-auto hide-scrollbar">
              <button 
                onClick={() => setActiveTab("universities")}
                className={`flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "universities" ? "bg-background shadow-md text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Universities
              </button>
              <button 
                onClick={() => setActiveTab("programs")}
                className={`flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "programs" ? "bg-background shadow-md text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Programs
              </button>
              <button 
                onClick={() => setActiveTab("visa")}
                className={`flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "visa" ? "bg-background shadow-md text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Visa Rules
              </button>
              <button 
                onClick={() => setActiveTab("fields")}
                className={`flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "fields" ? "bg-background shadow-md text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Study Fields
              </button>
            </div>

            <div className="flex flex-wrap w-full xl:w-auto gap-3">
              <div className="relative flex-grow md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                />
              </div>
              <select 
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="flex-grow md:w-48 px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm font-medium"
              >
                <option value="">All Countries</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="USA">🇺🇸 United States</option>
                <option value="Germany">🇩🇪 Germany</option>
                <option value="Canada">🇨🇦 Canada</option>
                <option value="Australia">🇦🇺 Australia</option>
              </select>
              {(activeTab === "universities" || activeTab === "programs") && (
                <select 
                  value={fieldFilter}
                  onChange={(e) => setFieldFilter(e.target.value)}
                  className="flex-grow md:w-48 px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm font-medium text-ellipsis"
                >
                  <option value="">All Fields</option>
                  {fieldsData?.map(f => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 mt-4">
            {activeTab === "universities" && (
              loadingUni ? <LoadingSpinner /> : 
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {universities?.length === 0 && <EmptyState entity="universities" />}
                {universities?.map((uni) => {
                  const imgSrc = uni.imageUrl 
                    ? (uni.imageUrl.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') + uni.imageUrl : uni.imageUrl)
                    : null;

                  return (
                    <Link href={`/knowledge/university/${uni.id}`} key={uni.id}>
                      <div className="group h-full bg-card rounded-3xl border border-border shadow-sm hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
                        
                        <div className="p-6 pb-0 flex flex-col sm:flex-row items-start gap-4 mb-4">
                          {imgSrc ? (
                            <img src={imgSrc} alt={uni.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-border shrink-0" />
                          ) : (
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary flex items-center justify-center shadow-inner border border-primary/10 shrink-0">
                              <span className="text-3xl font-serif font-bold">{uni.name.charAt(0)}</span>
                            </div>
                          )}
                          <div className="flex flex-col items-start sm:items-end sm:ml-auto gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                            {uni.ranking && (
                              <span className="px-3 py-1 bg-accent/10 text-accent-foreground border border-accent/20 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                                <Award className="w-3.5 h-3.5" /> Rank #{uni.ranking}
                              </span>
                            )}
                            <span className="text-2xl" title={uni.country}>
                              {getFlag(uni.country)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="px-6 flex-1 flex flex-col">
                          <h3 className="text-2xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{uni.name}</h3>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium mb-4">
                            <MapPin className="w-4 h-4" />
                            {uni.city}, {uni.country}
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                            {uni.description || "Leading institution offering world-class education and research opportunities."}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                            {uni.scholarshipsAvailable && (
                              <span className="px-2 py-1 bg-green-500/10 text-green-700 text-xs font-bold rounded-md flex items-center gap-1">
                                <DollarSign className="w-3 h-3" /> Scholarships
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between text-primary text-sm font-bold group-hover:bg-primary/5 transition-colors">
                          View Details
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {activeTab === "programs" && (
              loadingProg ? <LoadingSpinner /> :
              <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="py-5 px-6 text-sm font-bold text-muted-foreground uppercase tracking-wider">Program</th>
                        <th className="py-5 px-6 text-sm font-bold text-muted-foreground uppercase tracking-wider">University</th>
                        <th className="py-5 px-6 text-sm font-bold text-muted-foreground uppercase tracking-wider">Degree</th>
                        <th className="py-5 px-6 text-sm font-bold text-muted-foreground uppercase tracking-wider">Requirements</th>
                        <th className="py-5 px-6 text-sm font-bold text-muted-foreground uppercase tracking-wider">Deadline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {programs?.length === 0 && (
                        <tr><td colSpan={5} className="py-12 text-center text-muted-foreground font-medium"><EmptyState entity="programs" /></td></tr>
                      )}
                      {programs?.map(prog => (
                        <tr key={prog.id} className="hover:bg-muted/30 transition-colors group">
                          <td className="py-4 px-6 font-bold text-foreground text-lg">{prog.name}</td>
                          <td className="py-4 px-6 text-muted-foreground text-sm font-medium">
                            <Link href={`/knowledge/university/${prog.universityId}`} className="hover:text-primary transition-colors flex items-center gap-2">
                              <Building className="w-4 h-4 opacity-50" />
                              {prog.universityName}
                            </Link>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg text-xs font-bold border shadow-sm">
                              {prog.degree}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col gap-1">
                              {(prog.ieltsMin || prog.toeflMin) ? (
                                <div className="flex gap-2">
                                  {prog.ieltsMin && <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">IELTS {prog.ieltsMin}</span>}
                                  {prog.toeflMin && <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">TOEFL {prog.toeflMin}</span>}
                                </div>
                              ) : <span className="text-xs text-muted-foreground">Standard</span>}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-destructive font-bold">{prog.applicationDeadline || "Rolling"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "visa" && (
              <div className="space-y-8">
                {countryFilter && (
                  <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex items-start gap-4">
                    <div className="p-3 bg-primary text-primary-foreground rounded-xl shadow-md"><ShieldCheck className="w-6 h-6"/></div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">Visa Counselor Tips for {countryFilter}</h3>
                      <p className="text-sm text-muted-foreground">Always apply at least 3 months before your program start date. Proof of funds must be in an account under your name or a direct sponsor's name for at least 28 consecutive days.</p>
                    </div>
                  </div>
                )}
                
                {loadingVisa ? <LoadingSpinner /> :
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {visas?.length === 0 && <EmptyState entity="visa rules" />}
                  {visas?.map(visa => (
                    <div key={visa.id} className="bg-card rounded-3xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 mb-6 border-b border-border pb-6">
                        <div className="w-14 h-14 rounded-2xl bg-accent/20 text-accent-foreground flex items-center justify-center border border-accent/20">
                          <span className="text-2xl">{getFlag(visa.country)}</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-serif font-bold text-foreground">{visa.country}</h3>
                          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1">{visa.visaType}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" /> Key Requirements
                          </h4>
                          <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-xl">{visa.requirements}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-background border border-border p-4 rounded-2xl shadow-sm">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Processing Time</h4>
                            <p className="text-lg font-bold text-foreground">{visa.processingTime || "Varies"}</p>
                          </div>
                          <div className="bg-background border border-border p-4 rounded-2xl shadow-sm">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Application Fee</h4>
                            <p className="text-lg font-bold text-foreground">{visa.fees || "Check embassy"}</p>
                          </div>
                        </div>
                        
                        {visa.proofOfFunds && (
                          <div className="bg-green-500/5 p-5 rounded-2xl border border-green-500/20">
                            <h4 className="text-xs font-bold text-green-700 uppercase mb-2 flex items-center gap-2">
                              <DollarSign className="w-4 h-4" /> Proof of Funds Required
                            </h4>
                            <p className="text-sm font-bold text-green-800 dark:text-green-400">{visa.proofOfFunds}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                }
              </div>
            )}

            {activeTab === "fields" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fieldsData?.map(field => (
                   <Link href={`/fields/${field.slug}`} key={field.id}>
                    <div className="group bg-card rounded-3xl border border-border shadow-sm p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold mb-2">{field.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">{field.description}</p>
                      <div className="flex items-center text-primary font-bold text-sm mt-auto">
                        Explore Insights <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"/>
                      </div>
                    </div>
                   </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const LoadingSpinner = () => (
  <div className="w-full py-32 flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6 shadow-lg" />
    <p className="text-muted-foreground font-bold tracking-widest uppercase text-sm animate-pulse">Loading Database...</p>
  </div>
);

const EmptyState = ({ entity }: { entity: string }) => (
  <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-3xl bg-card/50">
    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
      <Search className="w-10 h-10 text-muted-foreground opacity-50" />
    </div>
    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">No {entity} found</h3>
    <p className="text-muted-foreground text-lg max-w-md">Try adjusting your search terms or filters to find what you're looking for.</p>
  </div>
);

const ArrowRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

function getFlag(country: string) {
  if (country.includes("UK") || country.includes("United Kingdom")) return "🇬🇧";
  if (country.includes("USA") || country.includes("United States")) return "🇺🇸";
  if (country.includes("Germany")) return "🇩🇪";
  if (country.includes("Canada")) return "🇨🇦";
  if (country.includes("Australia")) return "🇦🇺";
  return "🌍";
}
