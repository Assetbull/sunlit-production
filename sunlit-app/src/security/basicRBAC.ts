export function basicRBAC(user: any, action: string) {
  if (!user) return false;
  if (user.role === 'project_owner') return true;
  return false;
}
