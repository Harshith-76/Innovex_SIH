/** Temporary UI adapter until the shared authentication module exposes currentUser.role. */
export const isFinancialOfficer = (): boolean =>
  new URLSearchParams(window.location.search).get('role') === 'financial_officer';
