export type AuthRole =
  | 'user'
  | 'project_agency'
  | 'land_acquisition'
  | 'finance_officer'
  | 'district_officer'
  | 'master';

export interface AuthenticatedUser {
  user_id: string;
  name: string;
  email: string;
  role: AuthRole;
}

export type Permission =
  | 'acquisition_window'
  | 'projects_directory'
  | 'gis_land_parcels'
  | 'approved_projects'
  | 'district_monitoring'
  | 'affected_families'
  | 'documents'
  | 'alerts'
  | 'administration'
  | 'project_create'
  | 'project_update'
  | 'acquisition_review'
  | 'financial_approval'
  | 'district_review';

export type PageId =
  | 'district-dashboard'
  | 'projects'
  | 'project-detail'
  | 'project-route'
  | 'gis-parcels'
  | 'workflow'
  | 'compensation'
  | 'affected-families'
  | 'documents'
  | 'alerts'
  | 'analytics'
  | 'district-monitoring'
  | 'administration'
  | 'access-denied';

const ROLE_PERMISSIONS: Record<AuthRole, readonly Permission[] | '*'> = {
  user: [],
  project_agency: ['acquisition_window', 'projects_directory', 'gis_land_parcels', 'project_create', 'project_update'],
  land_acquisition: ['acquisition_window', 'projects_directory', 'gis_land_parcels', 'project_update', 'acquisition_review'],
  finance_officer: ['approved_projects', 'gis_land_parcels', 'financial_approval'],
  district_officer: ['acquisition_window', 'projects_directory', 'gis_land_parcels', 'approved_projects', 'district_monitoring', 'district_review'],
  master: '*',
};

export const PAGE_PERMISSIONS: Partial<Record<PageId, Permission>> = {
  'district-dashboard': 'district_monitoring',
  'district-monitoring': 'district_monitoring',
  analytics: 'district_monitoring',
  projects: 'projects_directory',
  'project-detail': 'projects_directory',
  'project-route': 'projects_directory',
  'gis-parcels': 'gis_land_parcels',
  workflow: 'acquisition_window',
  compensation: 'approved_projects',
  'affected-families': 'affected_families',
  documents: 'documents',
  alerts: 'alerts',
  administration: 'administration',
};

export const PAGE_PATHS: Record<PageId, string> = {
  'district-dashboard': '/district-monitoring',
  'district-monitoring': '/district-monitoring',
  analytics: '/district-monitoring',
  projects: '/projects',
  'project-detail': '/projects/detail',
  'project-route': '/projects/route',
  'gis-parcels': '/gis-land-parcels',
  workflow: '/acquisition-window',
  compensation: '/approved-projects',
  'affected-families': '/affected-families',
  documents: '/documents',
  alerts: '/alerts',
  administration: '/administration',
  'access-denied': '/unauthorized',
};

const PATH_PAGES: Record<string, PageId> = {
  '/acquisition-window': 'workflow',
  '/projects': 'projects',
  '/projects/detail': 'project-detail',
  '/projects/route': 'project-route',
  '/gis-land-parcels': 'gis-parcels',
  '/approved-projects': 'compensation',
  '/district-monitoring': 'district-monitoring',
  '/affected-families': 'affected-families',
  '/documents': 'documents',
  '/alerts': 'alerts',
  '/administration': 'administration',
  '/unauthorized': 'access-denied',
};

export const ROLE_LABELS: Record<AuthRole, string> = {
  user: 'System User',
  project_agency: 'Project Agency',
  land_acquisition: 'Land Acquisition Officer',
  finance_officer: 'Finance Officer',
  district_officer: 'District Officer',
  master: 'Master Administrator',
};

export function hasPermission(role: AuthRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions === '*' || permissions.includes(permission);
}

export function canAccessPage(role: AuthRole | undefined, page: PageId): boolean {
  if (page === 'access-denied') return true;
  const permission = PAGE_PERMISSIONS[page];
  return Boolean(permission && hasPermission(role, permission));
}

export function pageFromPath(pathname: string): PageId | undefined {
  const normalized = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  return PATH_PAGES[normalized];
}

export function firstAuthorizedPage(role: AuthRole): PageId {
  const preferred: PageId[] = ['workflow', 'projects', 'compensation', 'gis-parcels', 'district-monitoring'];
  return preferred.find((page) => canAccessPage(role, page)) || 'access-denied';
}
