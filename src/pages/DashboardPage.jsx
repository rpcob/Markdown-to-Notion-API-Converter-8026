// Update the handleUpdateUser function in DashboardPage.jsx
const handleUpdateUser = async (userId, userData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: userData.name,
        email: userData.email
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    // Update local state
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, ...userData } : u
    ));

    // If the selected user is the one being updated, update that too
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prev => ({ ...prev, ...userData }));
    }

    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user details');
  }
};

// Add handleUpdateUser to the UserDetailsModal props
<UserDetailsModal 
  user={selectedUser} 
  isOpen={isModalOpen} 
  onClose={closeModal} 
  onToggleUserStatus={handleToggleUserStatus}
  onUpdateUser={handleUpdateUser}
  onUpdatePlan={handleUpdateUserPlan}
/>