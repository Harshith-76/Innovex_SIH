export const ROLES = [
  'user',
  'project_agency',
  'land_acquisition',
  'finance_officer',
  'district_officer',
  'master',
] as const;

export type Role = (typeof ROLES)[number];

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

const ROLE_PERMISSIONS: Record<Role, readonly Permission[] | '*'> = {
  user: [],
  project_agency: [
    'acquisition_window',
    'projects_directory',
    'gis_land_parcels',
    'project_create',
    'project_update',
  ],
  land_acquisition: [
    'acquisition_window',
    'projects_directory',
    'gis_land_parcels',
    'project_update',
    'acquisition_review',
  ],
  finance_officer: ['approved_projects', 'gis_land_parcels', 'financial_approval'],
  district_officer: [
    'acquisition_window',
    'projects_directory',
    'gis_land_parcels',
    'approved_projects',
    'district_monitoring',
    'district_review',
  ],
  master: '*',
};

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions === '*' || permissions.includes(permission);
}
