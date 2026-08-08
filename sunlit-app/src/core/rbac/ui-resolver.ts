import { UserRole } from '@/shared/types/database';

/**
 * UI Resolver Engine
 * 
 * Enforces role-based UI isolation. 
 * PROJECT_OWNER: FULL STITCH ACCESS
 * INSTALLER: LOCKED (Coming Soon)
 */
export function resolveUI(role: UserRole | undefined) {
  if (role === 'project_owner') {
    return 'STITCH_UI';
  }
  
  if (role === 'installer') {
    return 'LOCKED_UI';
  }

  return 'GUEST_UI';
}

export function isScreenAccessible(role: UserRole | undefined, screenId: string): boolean {
  // Currently, all Stitch screens in the registry are Project Owner ONLY.
  const PROJECT_OWNER_SCREENS = [
    "f745efd850f14264b68c22bd14de6d37", "5596fe1a462144d295ade4bb3279484d", "bab88f1e20e746948aa1797060bef4b8",
    "37237968a38b420c8b2f50dcceaa4706", "1ff2a15a4b80457eb11dcbdf9a6d199a", "12c47c36476542c795faf01398940afc",
    "43916564a61c4769a1866a228e73e78e", "9d945965f7b640a38afe8cebec9d3f7e", "e576adb7dd454c00abb60ecb51cd565e",
    "dc3a6e2479e3453fb48a2adb0775dd45", "e9aac477bcac4559a51c02fc095b3d37", "c3ed372a9e62477e8573b8f81b0e928a",
    "bc1404c10de142b2a1c8e975ca8f956f", "84b56ec160cd45fa95579b7e7c05be3b", "bfe32a32e71648fbadbe75c271468597",
    "343c5d88d33248a6a29ce8cba7a80448", "e6715ec065cc424e8fa0b2315b528720", "438e81ca32ff4fa5bd520b6b10a2ad36",
    "9cc6e4ef54d743e29bec85e0ed957dc3", "7f1eacbf318c40c6b14e25295524337d", "1b26c3a5cb7247cf9dcd5e78cd9a2246",
    "bef05de73e294dd9875c58999a17b982", "c23e14d64d674778a5531ee24df67192", "0534b908f7ae4ef5b70c98b9eaf7d4ec",
    "857ab5fd260e4093adb52517d5147fee", "74f4a293273143b2a472e7d337be8343", "55af10d99e494b839d855bd60a18075c",
    "1a3d98f8c6c84716a6e7e9ed85f4d6c2", "2ce2e919cb3040fcb30f55660d977947", "3e760a2a606747d5a349a0ff4995bd74",
    "7683c38b69ec40688ad3d2c6f4ba872c"
  ];

  if (PROJECT_OWNER_SCREENS.includes(screenId)) {
    return role === 'project_owner';
  }

  return false;
}
