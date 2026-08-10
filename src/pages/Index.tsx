import { useState } from 'react';
import { Logo } from '@/components/tesa/Logo';
import { MainContent } from '@/components/tesa/MainContent';
import { useTesa } from '@/hooks/useTesa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CompanyProfilesModal } from '@/components/tesa/CompanyProfilesModal';
import { Building, ChevronRight, Search, Sparkles, Plus, Edit2, Trash2, Check, X, History, Target, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const Index = () => {
 const {
 companyProfiles,
 activeProfile,
 selectedProfileId,
 roles,
 selectedRole,
 selectedRoleId,
 rolePrograms,
 programs,
 preseededCompanies,
 preseededRoles,
 loadingPreseeded,
 selectPreseededCompany,
 setSelectedRoleId,
 createCompanyProfile,
 updateCompanyProfile,
 deleteCompanyProfile,
 selectCompanyProfile,
 createRole,
 updateRoleName,
 deleteRole,
 saveProgram,
 getRolesForCompany,
 addRoleToCompany,
 generateCompetencies,
 generateHabitProgram,
 fetchOutcomeChips,
 problemChips,
 loadingProblemChips,
 } = useTesa();

 const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
 const [companySearch, setCompanySearch] = useState('');
 const [roleSearch, setRoleSearch] = useState('');
 const [recentSearch, setRecentSearch] = useState('');
 const [editingId, setEditingId] = useState<string | null>(null);
 const [editValue, setEditValue] = useState('');
 const [profilesModalOpen, setProfilesModalOpen] = useState(false);
 const [isCreatingRole, setIsCreatingRole] = useState(false);
 const [newRoleName, setNewRoleName] = useState('');

 // Lifted selection states for programs to allow loading from Recents
 const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
 const [creatingNew, setCreatingNew] = useState(true);
 const [leftPanelTab, setLeftPanelTab] = useState<'roles' | 'recents'>('roles');

 const filteredCompanies = preseededCompanies.filter(c =>
 c.name.toLowerCase().includes(companySearch.toLowerCase())
 );

 const filteredRoles = roles.filter(role =>
 role.role_name.toLowerCase().includes(roleSearch.toLowerCase())
 );

 const filteredRecents = programs.filter(program =>
 program.program_name.toLowerCase().includes(recentSearch.toLowerCase())
 );

 const activePreseededCompany = preseededCompanies.find(c => 
 activeProfile && c.industry === activeProfile.industry && c.description === activeProfile.description
 ) || null;

 const handleSelectCompany = (companyId: string) => {
 selectPreseededCompany(companyId);
 setCompanyDropdownOpen(false);
 setCompanySearch('');
 // Reset selection when company changes
 setSelectedProgramId(null);
 setCreatingNew(true);
 };

 const startEdit = (role: any) => {
 setEditingId(role.id);
 setEditValue(role.role_name);
 };

 const saveEdit = () => {
 if (editingId && editValue.trim()) {
 updateRoleName(editingId, editValue.trim());
 }
 setEditingId(null);
 setEditValue('');
 };

 const cancelEdit = () => {
 setEditingId(null);
 setEditValue('');
 };

 const confirmCreateRole = () => {
 if (newRoleName.trim()) {
 createRole(newRoleName.trim());
 setIsCreatingRole(false);
 setNewRoleName('');
 }
 };

 const handleSelectRecentProgram = (program: any) => {
 // 1. Select the role associated with the program
 setSelectedRoleId(program.role_id);
 // 2. Select the program ID in MainContent
 setSelectedProgramId(program.id);
 setCreatingNew(false);
 };

 return (
 <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-white text-slate-900 flex flex-col font-sans antialiased">
 {/* Premium Glassmorphic Navigation Header */}
 <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
 <Logo />

 {/* Global Company Selector Dropdown */}
 <div className="relative w-72">
 <button
 onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
 className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/70 hover:border-blue-200 transition-all flex items-center justify-between text-left group"
 >
 <div className="flex items-center gap-2.5 min-w-0">
 <Building className="h-4.5 w-4.5 text-primary shrink-0"/>
 <span className="truncate text-sm font-medium text-slate-800">
 {activePreseededCompany ? activePreseededCompany.name : (activeProfile ? 'Custom Profile' : 'Choose Company...')}
 </span>
 </div>
 <ChevronRight className={cn("h-4 w-4 text-slate-500 group-hover:text-primary transition-transform shrink-0", companyDropdownOpen &&"rotate-90")} />
 </button>

 {companyDropdownOpen && (
 <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
 <div className="p-2 border-b border-slate-200">
 <div className="relative">
 <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500"/>
 <Input
 placeholder="Search companies..."
 value={companySearch}
 onChange={(e) => setCompanySearch(e.target.value)}
 className="pl-8 h-8 text-xs bg-white border-slate-200 text-slate-800 focus-visible:ring-primary"
 />
 </div>
 </div>
 <ScrollArea className="max-h-56">
 <div className="p-1.5 space-y-0.5">
 {filteredCompanies.map(c => (
 <button
 key={c.id}
 onClick={() => handleSelectCompany(c.id)}
 className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
 >
 <Sparkles className="h-3 w-3 text-primary shrink-0"/>
 <span className="truncate">{c.name}</span>
 </button>
 ))}
 {filteredCompanies.length === 0 && (
 <p className="text-[11px] text-slate-500 text-center py-4">No companies found</p>
 )}
 </div>
 </ScrollArea>
 <div className="p-2 bg-white border-t border-slate-200">
 <Button
 size="sm"
 variant="ghost"
 onClick={() => {
 setProfilesModalOpen(true);
 setCompanyDropdownOpen(false);
 }}
 className="w-full text-xs hover:bg-blue-50 text-slate-700 hover:text-primary"
 >
 Custom Profiles Database
 </Button>
 </div>
 </div>
 )}
 </div>
 </header>

 {/* Main Two-Column Layout */}
 <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-8 grid grid-cols-12 gap-8 items-start">
 {/* Left Column: Active context details, roles, and recents tab */}
 <section className="col-span-12 lg:col-span-4 space-y-6">
 {/* Active Company Metadata Card */}
 {activeProfile ? (
 <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-xl">
 <div className="flex items-center justify-between">
 <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Company Profile</h2>
 <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Active</span>
 </div>
 <div className="space-y-2">
 <div>
 <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Company Name</p>
 <p className="text-xs font-semibold text-slate-800 mt-0.5">{activeProfile.industry}</p>
 </div>
 <div>
 <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Company Description</p>
 <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{activeProfile.description}</p>
 </div>
 </div>
 </div>
 ) : (
 <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xl">
 <Building className="h-8 w-8 text-slate-500 mx-auto mb-3"/>
 <p className="text-sm font-medium text-slate-700">No company context loaded</p>
 <p className="text-xs text-slate-500 mt-1">Please select or type a company name in the top selector to get started.</p>
 </div>
 )}

 {/* Roles / Recents Tabbed Card */}
 <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col max-h-[500px]">
 <div className="flex gap-2 p-1 bg-blue-50 border border-slate-200 rounded-xl">
 <button
 onClick={() => setLeftPanelTab('roles')}
 className={cn(
"flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
 leftPanelTab === 'roles'
 ?"bg-primary text-white shadow-lg shadow-primary/20"
 :"text-slate-500 hover:text-slate-700"
 )}
 >
 Roles
 </button>
 <button
 onClick={() => setLeftPanelTab('recents')}
 className={cn(
"flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
 leftPanelTab === 'recents'
 ?"bg-primary text-white shadow-lg shadow-primary/20"
 :"text-slate-500 hover:text-slate-700"
 )}
 >
 Recents
 </button>
 </div>

 {leftPanelTab === 'roles' ? (
 // ROLES TAB
 <>
 <div className="flex items-center justify-between">
 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Roles Context</h3>
 {activeProfile && !isCreatingRole && (
 <Button
 onClick={() => setIsCreatingRole(true)}
 size="sm"
 variant="ghost"
 className="h-7 px-2 text-slate-500 hover:text-primary hover:bg-blue-50 rounded-lg text-xs"
 >
 <Plus className="h-3.5 w-3.5 mr-1"/>
 Add Role
 </Button>
 )}
 </div>

 {isCreatingRole && (
 <div className="flex items-center gap-2">
 <Input
 placeholder="Role name..."
 value={newRoleName}
 onChange={(e) => setNewRoleName(e.target.value)}
 className="h-8 text-xs bg-white border-slate-200 text-slate-900"
 autoFocus
 onKeyDown={(e) => {
 if (e.key === 'Enter') confirmCreateRole();
 if (e.key === 'Escape') setIsCreatingRole(false);
 }}
 />
 <Button size="icon"className="h-8 w-8 shrink-0 rounded-lg"onClick={confirmCreateRole} disabled={!newRoleName.trim()}>
 <Check className="h-4 w-4"/>
 </Button>
 <Button size="icon"variant="ghost"className="h-8 w-8 shrink-0 rounded-lg hover:bg-white"onClick={() => setIsCreatingRole(false)}>
 <X className="h-4 w-4"/>
 </Button>
 </div>
 )}

 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500"/>
 <Input
 placeholder="Search roles..."
 value={roleSearch}
 onChange={(e) => setRoleSearch(e.target.value)}
 className="pl-9 h-9 text-xs bg-white border-slate-200 text-slate-900 focus-visible:ring-primary/40"
 />
 </div>

 <div className="flex-1 overflow-y-auto max-h-[320px] pr-1.5 space-y-2">
 {filteredRoles.map((role) => {
 const matchedPreseededRole = preseededRoles.find(pr => pr.role_name === role.role_name);
 return (
 <div
 key={role.id}
 className={cn(
"group flex flex-col gap-1.5 p-3.5 rounded-xl cursor-pointer transition-all border text-left",
 selectedRoleId === role.id
 ?"border-primary bg-primary/10 text-white"
 :"border-slate-200 bg-white hover:bg-blue-50/70 text-slate-700"
 )}
 onClick={() => editingId !== role.id && setSelectedRoleId(role.id)}
 >
 {editingId === role.id ? (
 <div className="flex items-center gap-1.5 w-full"onClick={(e) => e.stopPropagation()}>
 <Input
 value={editValue}
 onChange={(e) => setEditValue(e.target.value)}
 className="h-8 text-xs bg-white border-slate-200"
 autoFocus
 onKeyDown={(e) => {
 if (e.key === 'Enter') saveEdit();
 if (e.key === 'Escape') cancelEdit();
 }}
 />
 <Button size="icon"className="h-8 w-8 shrink-0"onClick={saveEdit}>
 <Check className="h-3.5 w-3.5"/>
 </Button>
 <Button size="icon"variant="ghost"className="h-8 w-8 shrink-0 hover:bg-white"onClick={cancelEdit}>
 <X className="h-3.5 w-3.5"/>
 </Button>
 </div>
 ) : (
 <>
 <div className="flex items-center justify-between w-full">
 <span className="font-semibold text-xs truncate">{role.role_name}</span>
 <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
 <Button
 size="icon"
 variant="ghost"
 className="h-6 w-6 text-slate-500 hover:text-primary hover:bg-blue-50 rounded-md"
 onClick={(e) => {
 e.stopPropagation();
 startEdit(role);
 }}
 >
 <Edit2 className="h-3 w-3"/>
 </Button>
 <Button
 size="icon"
 variant="ghost"
 className="h-6 w-6 text-slate-500 hover:text-destructive hover:bg-blue-50/70 rounded-md"
 onClick={(e) => {
 e.stopPropagation();
 deleteRole(role.id);
 }}
 >
 <Trash2 className="h-3 w-3"/>
 </Button>
 </div>
 </div>
 {matchedPreseededRole && (
 <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 mt-0.5">
 {matchedPreseededRole.role_description}
 </p>
 )}
 </>
 )}
 </div>
 );
 })}
 {filteredRoles.length === 0 && (
 <p className="text-xs text-slate-500 text-center py-8">
 {roleSearch ? 'No roles found' : 'No roles. Select a company context to populate roles.'}
 </p>
 )}
 </div>
 </>
 ) : (
 // RECENTS (HISTORY) TAB
 <>
 <div className="flex items-center justify-between">
 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
 <History className="h-3.5 w-3.5 text-primary"/>
 Saved Programs History
 </h3>
 </div>

 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500"/>
 <Input
 placeholder="Search saved programs..."
 value={recentSearch}
 onChange={(e) => setRecentSearch(e.target.value)}
 className="pl-9 h-9 text-xs bg-white border-slate-200 text-slate-900 focus-visible:ring-primary/40"
 />
 </div>

 <div className="flex-1 overflow-y-auto max-h-[320px] pr-1.5 space-y-2">
 {filteredRecents.map((program) => (
 <div
 key={program.id}
 onClick={() => handleSelectRecentProgram(program)}
 className={cn(
"group flex flex-col gap-1.5 p-3.5 rounded-xl cursor-pointer transition-all border text-left",
 selectedProgramId === program.id && !creatingNew
 ?"border-primary bg-primary/10 text-white"
 :"border-slate-200 bg-white hover:bg-blue-50/70 text-slate-700"
 )}
 >
 <div className="flex items-center gap-2">
 <Target className="h-3.5 w-3.5 text-primary shrink-0"/>
 <span className="font-semibold text-xs truncate flex-1">{program.program_name}</span>
 </div>
 <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
 {program.program_description}
 </p>
 <div className="flex items-center justify-between pt-1 text-[9px] text-slate-500">
 <span className="flex items-center gap-1">
 <Calendar className="h-3 w-3"/>
 {format(new Date(program.created_at), 'MMM d, yyyy')}
 </span>
 <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-primary font-bold">
 {program.selected_habits.length} sets
 </span>
 </div>
 </div>
 ))}
 {filteredRecents.length === 0 && (
 <p className="text-xs text-slate-500 text-center py-8">
 No saved programs found.
 </p>
 )}
 </div>
 </>
 )}
 </div>
 </section>

 {/* Right Column: Progressive Flow steps */}
 <section className="col-span-12 lg:col-span-8">
 <MainContent
 selectedRole={selectedRole}
 rolePrograms={rolePrograms}
 onSaveProgram={saveProgram}
 activeProfile={activeProfile}
 onGenerateCompetencies={generateCompetencies}
 onGenerateHabitProgram={generateHabitProgram}
 problemChips={problemChips}
 loadingProblemChips={loadingProblemChips}
 onFetchOutcomeChips={fetchOutcomeChips}
 selectedProgramId={selectedProgramId}
 setSelectedProgramId={setSelectedProgramId}
 creatingNew={creatingNew}
 setCreatingNew={setCreatingNew}
 />
 </section>
 </main>

 <CompanyProfilesModal
 open={profilesModalOpen}
 onOpenChange={setProfilesModalOpen}
 profiles={companyProfiles}
 selectedProfileId={selectedProfileId}
 onSelect={selectCompanyProfile}
 onCreate={createCompanyProfile}
 onUpdate={updateCompanyProfile}
 onDelete={deleteCompanyProfile}
 getRolesForCompany={getRolesForCompany}
 onAddRoleToCompany={addRoleToCompany}
 />
 </div>
 );
};

export default Index;
