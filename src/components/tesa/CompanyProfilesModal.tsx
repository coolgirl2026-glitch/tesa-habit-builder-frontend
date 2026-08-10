import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Check, X, Users } from 'lucide-react';
import type { CompanyProfile, Role } from '@/types/tesa';
import { cn } from '@/lib/utils';

interface CompanyProfilesModalProps {
 open: boolean;
 onOpenChange: (open: boolean) => void;
 profiles: CompanyProfile[];
 selectedProfileId: string | null;
 onSelect: (profileId: string) => void;
 onCreate: (industry: string, description: string, roles: string[]) => void;
 onUpdate: (profileId: string, updates: Partial<CompanyProfile>) => void;
 onDelete: (profileId: string) => void;
 getRolesForCompany: (companyId: string) => Role[];
 onAddRoleToCompany: (companyId: string, roleName: string) => void;
}

export function CompanyProfilesModal({
 open,
 onOpenChange,
 profiles,
 selectedProfileId,
 onSelect,
 onCreate,
 onUpdate,
 onDelete,
 getRolesForCompany,
 onAddRoleToCompany,
}: CompanyProfilesModalProps) {
 const [showAddForm, setShowAddForm] = useState(false);
 const [editingId, setEditingId] = useState<string | null>(null);
 const [addingRoleToCompanyId, setAddingRoleToCompanyId] = useState<string | null>(null);
 const [newRoleInput, setNewRoleInput] = useState('');
 
 // Add form state
 const [newIndustry, setNewIndustry] = useState('');
 const [newDescription, setNewDescription] = useState('');
 const [newRoles, setNewRoles] = useState<string[]>([]);
 const [newRoleText, setNewRoleText] = useState('');
 
 // Edit form state
 const [editIndustry, setEditIndustry] = useState('');
 const [editDescription, setEditDescription] = useState('');

 const handleCreate = () => {
 if (newIndustry.trim() && newDescription.trim()) {
 onCreate(newIndustry.trim(), newDescription.trim(), newRoles);
 setNewIndustry('');
 setNewDescription('');
 setNewRoles([]);
 setNewRoleText('');
 setShowAddForm(false);
 }
 };

 const addNewRole = () => {
 if (newRoleText.trim() && !newRoles.includes(newRoleText.trim())) {
 setNewRoles(prev => [...prev, newRoleText.trim()]);
 setNewRoleText('');
 }
 };

 const removeNewRole = (role: string) => {
 setNewRoles(prev => prev.filter(r => r !== role));
 };

 const handleAddRoleToExistingCompany = (companyId: string) => {
 if (newRoleInput.trim()) {
 onAddRoleToCompany(companyId, newRoleInput.trim());
 setNewRoleInput('');
 setAddingRoleToCompanyId(null);
 }
 };

 const startEdit = (profile: CompanyProfile) => {
 setEditingId(profile.id);
 setEditIndustry(profile.industry);
 setEditDescription(profile.description);
 setShowAddForm(false);
 };

 const saveEdit = () => {
 if (editingId && editIndustry.trim() && editDescription.trim()) {
 onUpdate(editingId, {
 industry: editIndustry.trim(),
 description: editDescription.trim(),
 });
 setEditingId(null);
 }
 };

 const cancelEdit = () => {
 setEditingId(null);
 setEditIndustry('');
 setEditDescription('');
 };

 const handleSelect = (profileId: string) => {
 onSelect(profileId);
 onOpenChange(false);
 };

 return (
 <Dialog open={open} onOpenChange={onOpenChange}>
 <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
 <DialogHeader>
 <DialogTitle className="text-lg font-semibold">Company Profiles</DialogTitle>
 </DialogHeader>

 <div className="flex-1 overflow-auto py-4 space-y-3">
 {profiles.length === 0 && !showAddForm && (
 <p className="text-sm text-muted-foreground text-center py-8">
 No company profiles yet. Add one to get started.
 </p>
 )}

 {profiles.map((profile) => (
 <div key={profile.id}>
 {editingId === profile.id ? (
 <div className="p-4 rounded-lg border border-primary bg-accent space-y-3">
 <div>
 <Label className="text-sm font-medium">Industry</Label>
 <Input
 value={editIndustry}
 onChange={(e) => setEditIndustry(e.target.value)}
 placeholder="e.g., Technology, Healthcare"
 className="mt-1.5"
 autoFocus
 />
 </div>
 <div>
 <Label className="text-sm font-medium">Description</Label>
 <Textarea
 value={editDescription}
 onChange={(e) => setEditDescription(e.target.value)}
 placeholder="Brief description of your company"
 rows={3}
 className="mt-1.5"
 />
 </div>
 <div className="flex gap-2 justify-end">
 <Button variant="outline"size="sm"onClick={cancelEdit}>
 <X className="h-4 w-4 mr-1"/>
 Cancel
 </Button>
 <Button size="sm"onClick={saveEdit} disabled={!editIndustry.trim() || !editDescription.trim()}>
 <Check className="h-4 w-4 mr-1"/>
 Save
 </Button>
 </div>
 </div>
 ) : (
 <div
 className={cn(
"group p-4 rounded-lg border cursor-pointer transition-all",
 selectedProfileId === profile.id
 ?"border-primary bg-accent"
 :"border-border hover:border-primary/50"
 )}
 onClick={() => handleSelect(profile.id)}
 >
 <div className="flex items-start justify-between gap-3">
 <div className="flex-1 min-w-0">
 <p className="font-semibold text-foreground">{profile.industry || 'No industry'}</p>
 <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
 {profile.description || 'No description'}
 </p>
 
 {/* Display roles for this company */}
 {getRolesForCompany(profile.id).length > 0 && (
 <div className="flex flex-wrap gap-1.5 mt-2">
 <Users className="h-3.5 w-3.5 text-muted-foreground mt-0.5"/>
 {getRolesForCompany(profile.id).map((role) => (
 <Badge key={role.id} variant="secondary"className="text-xs">
 {role.role_name}
 </Badge>
 ))}
 </div>
 )}
 
 {/* Add role to existing company */}
 {addingRoleToCompanyId === profile.id ? (
 <div className="flex items-center gap-2 mt-2"onClick={(e) => e.stopPropagation()}>
 <Input
 value={newRoleInput}
 onChange={(e) => setNewRoleInput(e.target.value)}
 placeholder="Role name..."
 className="h-8 text-sm flex-1"
 autoFocus
 onKeyDown={(e) => {
 if (e.key === 'Enter') handleAddRoleToExistingCompany(profile.id);
 if (e.key === 'Escape') {
 setAddingRoleToCompanyId(null);
 setNewRoleInput('');
 }
 }}
 />
 <Button size="sm"className="h-8"onClick={() => handleAddRoleToExistingCompany(profile.id)}>
 <Check className="h-3.5 w-3.5"/>
 </Button>
 <Button size="sm"variant="ghost"className="h-8"onClick={() => {
 setAddingRoleToCompanyId(null);
 setNewRoleInput('');
 }}>
 <X className="h-3.5 w-3.5"/>
 </Button>
 </div>
 ) : (
 <Button
 variant="ghost"
 size="sm"
 className="h-7 text-xs text-muted-foreground hover:text-primary mt-2 px-2"
 onClick={(e) => {
 e.stopPropagation();
 setAddingRoleToCompanyId(profile.id);
 }}
 >
 <Plus className="h-3 w-3 mr-1"/>
 Add Role
 </Button>
 )}
 </div>
 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
 <Button
 size="icon"
 variant="ghost"
 className="h-8 w-8 text-muted-foreground hover:text-primary"
 onClick={(e) => {
 e.stopPropagation();
 startEdit(profile);
 }}
 >
 <Edit2 className="h-4 w-4"/>
 </Button>
 <Button
 size="icon"
 variant="ghost"
 className="h-8 w-8 text-muted-foreground hover:text-destructive"
 onClick={(e) => {
 e.stopPropagation();
 onDelete(profile.id);
 }}
 >
 <Trash2 className="h-4 w-4"/>
 </Button>
 </div>
 </div>
 </div>
 )}
 </div>
 ))}

 {showAddForm && (
 <div className="p-4 rounded-lg border border-primary bg-accent space-y-3">
 <div>
 <Label className="text-sm font-medium">Industry *</Label>
 <Input
 value={newIndustry}
 onChange={(e) => setNewIndustry(e.target.value)}
 placeholder="e.g., Technology, Healthcare, Finance"
 className="mt-1.5"
 autoFocus
 />
 </div>
 <div>
 <Label className="text-sm font-medium">Description *</Label>
 <Textarea
 value={newDescription}
 onChange={(e) => setNewDescription(e.target.value)}
 placeholder="Brief description of what your company does"
 rows={3}
 className="mt-1.5"
 />
 </div>
 
 {/* Roles section */} 
 <div className="flex gap-2 justify-end">
 <Button variant="outline"size="sm"onClick={() => {
 setShowAddForm(false);
 setNewIndustry('');
 setNewDescription('');
 setNewRoles([]);
 setNewRoleText('');
 }}>
 <X className="h-4 w-4 mr-1"/>
 Cancel
 </Button>
 <Button size="sm"onClick={handleCreate} disabled={!newIndustry.trim() || !newDescription.trim()}>
 <Check className="h-4 w-4 mr-1"/>
 Save
 </Button>
 </div>
 </div>
 )}
 </div>

 {!showAddForm && editingId === null && (
 <div className="pt-4 border-t border-border">
 <Button onClick={() => setShowAddForm(true)} className="w-full">
 <Plus className="h-4 w-4 mr-2"/>
 Add Profile
 </Button>
 </div>
 )}
 </DialogContent>
 </Dialog>
 );
}
