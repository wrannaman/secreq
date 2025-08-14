"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/toast-provider';
import { AuthenticatedNav } from '@/components/layout/authenticated-nav';
import { AuthGuard } from '@/components/auth-guard';
import { createClient } from '@/utils/supabase/client';

function TeamPageContent() {
  const { user, loading, currentOrganization } = useAuth();
  const { toast } = useToast();
  const [team, setTeam] = useState([]);
  const [invites, setInvites] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [selectedMember, setSelectedMember] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const supabase = useMemo(() => createClient(), []);
  const lastFetchKeyRef = useRef(null);

  useEffect(() => {
    const userId = user?.id;
    const orgId = currentOrganization?.org_id;
    const key = userId && orgId ? `${userId}:${orgId}` : null;
    if (!key) return;
    if (lastFetchKeyRef.current === key) return;
    lastFetchKeyRef.current = key;

    const fetchTeam = async () => {
      if (!orgId) return;

      try {
        const { data, error } = await supabase
          .from('organization_memberships')
          .select('*')
          .eq('organization_id', orgId);

        if (error) throw error;

        // Get user details from auth.users via our function
        if (data && data.length > 0) {
          const userIds = data.map(member => member.user_id);
          const { data: userDetails, error: userError } = await supabase
            .rpc('get_user_details', { user_ids: userIds });

          if (!userError && userDetails) {
            const teamWithProfiles = data.map(member => ({
              ...member,
              profile: userDetails.find(u => u.id === member.user_id) || {
                id: member.user_id,
                email: 'Unknown',
                full_name: 'Unknown User'
              }
            }));
            setTeam(teamWithProfiles);
          } else {
            console.warn('Could not get user details:', userError);
            setTeam(data.map(member => ({
              ...member,
              profile: {
                id: member.user_id,
                email: 'Email not available',
                full_name: 'User'
              }
            })));
          }
        } else {
          setTeam([]);
        }
      } catch (error) {
        toast.error('Failed to load team members', {
          description: error.message
        });
      }
    };

    const loadData = async () => {
      if (userId && orgId) {
        setLoadingData(true);
        await fetchTeam();
        setInvites([]);
        setLoadingData(false);
      }
    };

    loadData();
  }, [user?.id, currentOrganization?.org_id, supabase, toast]);

  const fetchInvites = async () => {
    const orgId = currentOrganization?.org_id;
    if (!orgId) return;

    try {
      const { data, error } = await supabase
        .from('organization_invites')
        .select('*')
        .eq('organization_id', orgId)
        .eq('status', 'pending');

      if (error) throw error;
      setInvites(data || []);
    } catch (error) {
      console.warn('Could not load invites:', error);
      setInvites([]);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();

    if (!currentOrganization) {
      toast.error('No organization selected');
      return;
    }

    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      // Check if there's already a pending invite
      const { data: existingInvite } = await supabase
        .from('organization_invites')
        .select('id')
        .eq('organization_id', currentOrganization.org_id)
        .eq('email', email.toLowerCase())
        .eq('status', 'pending');

      if (existingInvite?.length > 0) {
        toast.error('An invitation has already been sent to this email');
        return;
      }

      // Create the invite
      const { error } = await supabase
        .from('organization_invites')
        .insert({
          organization_id: currentOrganization.org_id,
          email: email.toLowerCase(),
          role,
          invited_by: user.id
        });

      if (error) throw error;

      toast.success('Invitation sent!', {
        description: `Invited ${email} as ${role}. They will receive an email to join.`
      });

      setEmail('');
      await fetchInvites();

    } catch (error) {
      toast.error('Failed to send invitation', {
        description: error.message
      });
    }
  };

  const cancelInvite = async (inviteId) => {
    try {
      const { error } = await supabase
        .from('organization_invites')
        .update({ status: 'cancelled' })
        .eq('id', inviteId);

      if (error) throw error;

      toast.success('Invitation cancelled');
      await fetchInvites();
    } catch (error) {
      toast.error('Failed to cancel invitation', {
        description: error.message
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedMember || !currentOrganization) return;

    try {
      const { error } = await supabase
        .from('organization_memberships')
        .update({ role: newRole })
        .eq('id', selectedMember.id)
        .eq('organization_id', currentOrganization.org_id);

      if (error) throw error;

      toast.success('Role updated', {
        description: `Updated member to ${newRole}`
      });

      // Reload the team data
      window.location.reload();

      setSelectedMember(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update role', {
        description: error.message
      });
    }
  };

  // Check if user is admin/owner of current organization
  const userRole = team.find(member => member.user_id === user?.id)?.role;
  const isAdmin = userRole === 'admin' || userRole === 'owner';

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedNav />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading team...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user || !currentOrganization) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedNav />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You need to be part of an organization to view this page.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedNav />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You need admin permissions to manage team members.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNav />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage team members for {currentOrganization.org_name}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Invite New Member</h2>
            <form onSubmit={handleInvite} className="flex gap-2 max-w-md">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Invite</Button>
            </form>
          </div>

          {invites.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pending Invitations</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Invited</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell>{invite.email}</TableCell>
                      <TableCell className="capitalize">{invite.role}</TableCell>
                      <TableCell>
                        {new Date(invite.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(invite.expires_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelInvite(invite.id)}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      {member.profile?.full_name || member.profile?.email?.split('@')[0] || 'Unknown User'}
                    </TableCell>
                    <TableCell>{member.profile?.email || 'No email'}</TableCell>
                    <TableCell className="capitalize">{member.role}</TableCell>
                    <TableCell>
                      {member.user_id !== user.id && userRole === 'owner' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMember(member);
                            setNewRole(member.role);
                            setIsDialogOpen(true);
                          }}
                        >
                          Edit Role
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Edit Role for {selectedMember?.profile?.email || 'Unknown User'}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateRole}>Save Changes</Button>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}

export default function TeamPage() {
  return (
    <AuthGuard>
      <TeamPageContent />
    </AuthGuard>
  );
} 