import { useState } from "react";
import { Link } from "wouter";
import { Search, MapPin, Building, GraduationCap, ShieldCheck, ExternalLink } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { 
  useListUniversities, 
  useListPrograms, 
  useListVisaRequirements 
} from "@workspace/api-client-react";

type Tab = "universities" | "programs" | "visa";

export function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState<Tab>("universities");
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const { data: universities, isLoading: loadingUni } = useListUniversities({ search, country: countryFilter || undefined });
  const { data: programs, isLoading: loadingProg } = useListPrograms({ degree: search || undefined }); // basic filter adaptation
  const { data: visas, isLoading: loadingVisa } = useListVisaRequirements({ country: countryFilter || undefined });

  return (
    <MainLayout>
      <div className="w-full h-full flex flex-col relative">
        {/* Header with image */}
        <div className="relative h-64 w-full bg-primary overflow-hidden shrink-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-academy.png`} 
            alt="Academy Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">Knowledge Base</h1>
            <p className="text-lg text-muted-foreground">Verified data on universities, programs, and visa requirements.</p>
          </div>
        </div>

        <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 flex flex-col gap-6 -mt-8 relative z-10">
          {/* Controls */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex bg-muted p-1 rounded-xl w-full md:w-auto">
              <button 
                onClick={() => setActiveTab("universities")}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "universities" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Universities
              </button>
              <button 
                onClick={() => setActiveTab("programs")}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "programs" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Programs
              </button>
              <button 
                onClick={() => setActiveTab("visa")}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "visa" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Visa Rules
              </button>
            </div>

            <div className="flex w-full md:w-auto gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <select 
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="px-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All Countries</option>
                <option value="UK">United Kingdom</option>
                <option value="USA">United States</option>
                <option value="Germany">Germany</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 pb-12">
            {activeTab === "universities" && (
              loadingUni ? <LoadingSpinner /> : 
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {universities?.length === 0 && <EmptyState entity="universities" />}
                {universities?.map((uni) => (
                  <Link href={`/knowledge/university/${uni.id}`} key={uni.id}>
                    <div className="group h-full bg-card rounded-2xl border border-border/60 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 p-6 flex flex-col cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <Building className="w-6 h-6" />
                        </div>
                        {uni.ranking && (
                          <span className="px-3 py-1 bg-accent/20 text-accent-foreground text-xs font-semibold rounded-full">
                            Rank #{uni.ranking}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{uni.name}</h3>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                        <MapPin className="w-4 h-4" />
                        {uni.city}, {uni.country}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                        {uni.description || "Leading institution offering world-class education and research opportunities."}
                      </p>
                      <div className="flex items-center text-primary text-sm font-semibold mt-auto">
                        View Programs
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === "programs" && (
              loadingProg ? <LoadingSpinner /> :
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="py-4 px-6 text-sm font-semibold text-foreground">Program</th>
                        <th className="py-4 px-6 text-sm font-semibold text-foreground">University</th>
                        <th className="py-4 px-6 text-sm font-semibold text-foreground">Degree</th>
                        <th className="py-4 px-6 text-sm font-semibold text-foreground">Duration</th>
                        <th className="py-4 px-6 text-sm font-semibold text-foreground">Deadline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {programs?.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No programs found.</td></tr>
                      )}
                      {programs?.map(prog => (
                        <tr key={prog.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-6 font-medium text-foreground">{prog.name}</td>
                          <td className="py-4 px-6 text-muted-foreground text-sm">
                            <Link href={`/knowledge/university/${prog.universityId}`} className="hover:text-primary transition-colors">
                              {prog.universityName}
                            </Link>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-medium">
                              {prog.degree}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-muted-foreground">{prog.duration}</td>
                          <td className="py-4 px-6 text-sm text-destructive font-medium">{prog.applicationDeadline || "Rolling"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "visa" && (
              loadingVisa ? <LoadingSpinner /> :
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {visas?.length === 0 && <EmptyState entity="visa rules" />}
                {visas?.map(visa => (
                  <div key={visa.id} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 border-b border-border pb-4">
                      <div className="w-10 h-10 rounded-full bg-accent/20 text-accent-foreground flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{visa.country}</h3>
                        <p className="text-sm text-muted-foreground">{visa.visaType}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Key Requirements</h4>
                        <p className="text-sm text-foreground leading-relaxed">{visa.requirements}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-3 rounded-xl">
                          <h4 className="text-xs font-semibold text-muted-foreground mb-1">Processing Time</h4>
                          <p className="text-sm font-medium text-foreground">{visa.processingTime || "Varies"}</p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-xl">
                          <h4 className="text-xs font-semibold text-muted-foreground mb-1">Application Fee</h4>
                          <p className="text-sm font-medium text-foreground">{visa.fees || "Check embassy"}</p>
                        </div>
                      </div>
                      {visa.proofOfFunds && (
                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                          <h4 className="text-xs font-semibold text-primary mb-1">Proof of Funds Required</h4>
                          <p className="text-sm font-medium text-primary-foreground dark:text-primary">{visa.proofOfFunds}</p>
                        </div>
                      )}
                    </div>
                  </div>
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
  <div className="w-full py-20 flex flex-col items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
    <p className="text-muted-foreground animate-pulse">Loading knowledge base...</p>
  </div>
);

const EmptyState = ({ entity }: { entity: string }) => (
  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-2xl">
    <Search className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
    <h3 className="text-lg font-bold text-foreground">No {entity} found</h3>
    <p className="text-muted-foreground mt-2 max-w-md">Try adjusting your search or filters to find what you're looking for.</p>
  </div>
);

// Inline icon just for knowledge base page
const ArrowRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
