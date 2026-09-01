export type Language = 'en' | 'kn';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // TopHeader & Navigation
    'app.title': 'Land Acquisition Management System',
    'app.portal': 'LAMS Portal',
    'header.search_placeholder': 'Search Survey No., Project Code, Khata No., Village, Beneficiary...',
    'header.search_clear': 'Clear',
    'header.nic_gateway': 'NIC-Bhoomi Gateway',
    'header.notifications_title': 'Notifications & Operational Alerts',
    'header.sign_out': 'Sign out',
    'header.translate_en': 'Translate (ಕನ್ನಡ)',
    'header.translate_kn': 'Translate (English)',
    'header.translate_title': 'Toggle Language (English / ಕನ್ನಡ)',
    
    // Sidebar Section & Items
    'nav.section_title': 'OPERATIONS PORTAL',
    'nav.workflow': 'Acquisition Window',
    'nav.projects': 'Projects Directory',
    'nav.gis-parcels': 'GIS & Land Parcels',
    'nav.compensation': 'Approved Projects',
    'nav.affected-families': 'Landowner',
    'nav.documents': 'Documents',
    'nav.alerts': 'Alerts',
    'nav.district-monitoring': 'District Monitoring',
    'nav.administration': 'Administration',

    // Role Labels
    'role.user': 'Generic User',
    'role.project_agency': 'Project Agency',
    'role.land_acquisition': 'Land Acquisition Officer',
    'role.finance_officer': 'Finance Officer',
    'role.district_officer': 'District Officer',
    'role.master': 'Master Administrator',

    // Page Names & Breadcrumbs
    'page.district-dashboard': 'District Monitoring',
    'page.district-monitoring': 'District Monitoring',
    'page.projects': 'Land Acquisition Projects',
    'page.project-detail': 'Project Workspace',
    'page.project-route': 'Project Route & GIS Alignment',
    'page.gis-parcels': 'GIS & Land Parcels',
    'page.workflow': 'Acquisition Window',
    'page.compensation': 'Compensation Management',
    'page.affected-families': 'Landowner Directory & Compensation',
    'page.documents': 'Documents & Records Repository',
    'page.alerts': 'Operational Alerts & Notifications',
    'page.analytics': 'District Monitoring',
    'page.administration': 'Administration & Access Control',
    'page.access-denied': 'Access Denied',
    'page.access-denied_message': 'You do not have permission to access this module.',
    'page.go_authorized': 'Go to an authorized module',

    // Projects Page
    'projects.title': 'PROJECTS DIRECTORY',
    'projects.subtitle': 'Manage land acquisition projects, project scope, route alignment and acquisition progress.',
    'projects.registered_title': 'REGISTERED LAND ACQUISITION PROJECTS',
    'projects.col_code': 'PROJECT CODE',
    'projects.col_title': 'PROJECT TITLE & SCOPE',
    'projects.col_district': 'DISTRICT / LOCATION',
    'projects.col_land': 'REQUIRED LAND',
    'projects.col_progress': 'PROGRESS',
    'projects.col_stage': 'CURRENT STAGE',
    'projects.col_status': 'STATUS',
    'projects.col_risk': 'RISK LEVEL',
    'projects.btn_view': 'VIEW PROJECT',
    'projects.btn_export': 'EXPORT CSV',
    'projects.btn_register': 'REGISTER NEW PROJECT',
    'projects.filter_all': 'All Statuses',
    'projects.filter_in_progress': 'In Progress',
    'projects.filter_verified': 'Verified',
    'projects.filter_approved': 'Approved',

    // Landowner Page (Affected Families)
    'landowner.title': 'LANDOWNER DIRECTORY & COMPENSATION',
    'landowner.subtitle': 'View affected landowners, compensation records, bank account details, and disbursement status.',
    'landowner.registered_title': 'AFFECTED LANDOWNERS & BENEFICIARIES',
    'landowner.col_owner': 'Owner Name',
    'landowner.col_survey': 'Survey Number',
    'landowner.col_village': 'Village',
    'landowner.col_taluk': 'Taluk',
    'landowner.col_extent': 'Extent (Acres)',
    'landowner.col_compensation': 'Assessed Compensation',
    'landowner.col_status': 'Payment Status',
    'landowner.col_bank': 'Bank Account',
    'landowner.col_ifsc': 'IFSC Code',
    'landowner.status_disbursed': 'Disbursed',
    'landowner.status_unpaid': 'Pending Disbursement',

    // Documents Page
    'documents.title': 'DOCUMENTS & RECORDS REPOSITORY',
    'documents.subtitle': 'Centralized repository of land notices, gazette publications, mutation records, and SIA reports.',
    'documents.col_title': 'DOCUMENT TITLE',
    'documents.col_type': 'DOCUMENT TYPE',
    'documents.col_date': 'UPLOADED DATE',
    'documents.col_by': 'UPLOADED BY',
    'documents.col_hash': 'SHA-256 HASH',
    'documents.btn_view': 'View Document',
    'documents.btn_upload': 'Upload New Document',

    // Alerts Page
    'alerts.title': 'OPERATIONAL ALERTS & NOTIFICATIONS',
    'alerts.subtitle': 'System alerts, high risk acquisition warnings, boundary disputes, and pending reviews.',
    'alerts.col_title': 'ALERT TITLE',
    'alerts.col_severity': 'SEVERITY',
    'alerts.col_category': 'CATEGORY',
    'alerts.col_date': 'TIMESTAMP',
    'alerts.col_status': 'STATUS',
    'alerts.btn_resolve': 'Resolve Alert',
    'alerts.status_open': 'Open',
    'alerts.status_resolved': 'Resolved',

    // GIS Parcels Page
    'gis.title': 'GIS & LAND PARCELS',
    'gis.subtitle': 'Cadastral map visualization, parcel boundary pegging, and Hissa record details.',
    'gis.filter_parcels': 'Filter Parcels',
    'gis.legend_acquired': 'Acquired',
    'gis.legend_pending': 'Pending',
    'gis.hissa_details': 'Hissa Owner Details',

    // Acquisition Window (Workflow Page)
    'workflow.title': 'ACQUISITION WINDOW',
    'workflow.subtitle': 'Land acquisition stage progression, SLAO review, and High Power Committee approvals.',
    'workflow.stage_proposal': 'Proposal',
    'workflow.stage_verification': 'Verification',
    'workflow.stage_approval': 'Approval',
    'workflow.stage_notification': 'Notification',
    'workflow.stage_award': 'Award Order',
    'workflow.stage_compensation': 'Compensation',
    'workflow.btn_approve': 'Approve & Forward',
    'workflow.btn_reject': 'Return for Re-verification',

    // Approved Projects & Compensation Page
    'compensation.title': 'APPROVED PROJECTS & DISBURSEMENT',
    'compensation.subtitle': 'Financial sanctions, SLAO approved projects, e-Kuber treasury integrations, and compensation DBT.',
    'compensation.approved_projects_title': 'PROJECTS APPROVED BY LAND ACQUISITION OFFICER',
    'compensation.col_project': 'PROJECT',
    'compensation.col_agency': 'AGENCY',
    'compensation.col_estimated': 'ESTIMATED COST (CR)',
    'compensation.col_slao_status': 'SLAO VERIFICATION',
    'compensation.col_action': 'ACTION',
    'compensation.btn_disburse': 'Disburse via e-Kuber',

    // District Monitoring Page
    'district.title': 'DISTRICT MONITORING',
    'district.subtitle': 'District-level monitoring dashboard, project approvals, SLA tracking, and audit trails.',
    'district.stat_total_projects': 'Total Projects',
    'district.stat_land_required': 'Land Required (Acres)',
    'district.stat_pending_reviews': 'Pending SLAO Reviews',
    'district.stat_disbursed_comp': 'Disbursed Compensation (Cr)',
    'district.btn_review': 'Review Project',

    // Administration Page
    'admin.title': 'ADMINISTRATION & ACCESS CONTROL',
    'admin.subtitle': 'Manage user roles, system permissions matrix, district assignments, and security audit logs.',
    'admin.col_name': 'USER NAME',
    'admin.col_email': 'EMAIL',
    'admin.col_role': 'ASSIGNED ROLE',
    'admin.col_status': 'ACCOUNT STATUS',

    // Common Buttons & Labels
    'common.actions': 'Actions',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.status': 'Status',
    'common.acres': 'Acres',
    'common.acres_short': 'Acres',
    'common.crores': 'Cr',
    'common.details': 'Details',
    'common.search': 'Search',
    'common.filter': 'Filter',
  },
  kn: {
    // TopHeader & Navigation
    'app.title': 'ಭೂಸ್ವಾಧೀನ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ',
    'app.portal': 'ಎಲ್‌ಎಎಂಎಸ್ ಪೋರ್ಟಲ್',
    'header.search_placeholder': 'ಸರ್ವೇ ನಂ., ಯೋಜನೆ ಕೋಡ್, ಖಾತಾ ನಂ., ಗ್ರಾಮ, ಫಲಾನುಭವಿ ಹುಡುಕಿ...',
    'header.search_clear': 'ತೆರವುಗೊಳಿಸಿ',
    'header.nic_gateway': 'ಎನ್‌ಐಸಿ-ಭೂಮಿ ಗೇಟ್‌ವೇ',
    'header.notifications_title': 'ಸೂಚನೆಗಳು ಮತ್ತು ಕಾರ್ಯಾಚರಣೆ ಎಚ್ಚರಿಕೆಗಳು',
    'header.sign_out': 'ನಿರ್ಗಮಿಸಿ',
    'header.translate_en': 'Translate (ಕನ್ನಡ)',
    'header.translate_kn': 'Translate (English)',
    'header.translate_title': 'ಭಾಷೆ ಬದಲಾಯಿಸಿ (English / ಕನ್ನಡ)',
    
    // Sidebar Section & Items
    'nav.section_title': 'ಕಾರ್ಯಾಚರಣೆಗಳ ಪೋರ್ಟಲ್',
    'nav.workflow': 'ಭೂಸ್ವಾಧೀನ ಕಿಟಕಿ',
    'nav.projects': 'ಯೋಜನೆಗಳ ಡೈರೆಕ್ಟರಿ',
    'nav.gis-parcels': 'ಜಿಐಎಸ್ ಮತ್ತು ಭೂಮಿ ಪಾರ್ಸೆಲ್‌ಗಳು',
    'nav.compensation': 'ಅನುಮೋದಿತ ಯೋಜನೆಗಳು',
    'nav.affected-families': 'ಭೂಮಾಲೀಕರು',
    'nav.documents': 'ದಾಖಲೆಗಳು',
    'nav.alerts': 'ಎಚ್ಚರಿಕೆಗಳು',
    'nav.district-monitoring': 'ಜಿಲ್ಲಾ ಮೇಲ್ವಿಚಾರಣೆ',
    'nav.administration': 'ಆಡಳಿತ',

    // Role Labels
    'role.user': 'ಸಾಮಾನ್ಯ ಬಳಕೆದಾರ',
    'role.project_agency': 'ಯೋಜನೆ ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆ',
    'role.land_acquisition': 'ಭೂಸ್ವಾಧೀನ ಅಧಿಕಾರಿ',
    'role.finance_officer': 'ಹಣಕಾಸು ಅಧಿಕಾರಿ',
    'role.district_officer': 'ಜಿಲ್ಲಾಧಿಕಾರಿ',
    'role.master': 'ಮುಖ್ಯ ಆಡಳಿತಗಾರ',

    // Page Names & Breadcrumbs
    'page.district-dashboard': 'ಜಿಲ್ಲಾ ಮೇಲ್ವಿಚಾರಣೆ',
    'page.district-monitoring': 'ಜಿಲ್ಲಾ ಮೇಲ್ವಿಚಾರಣೆ',
    'page.projects': 'ಭೂಸ್ವಾಧೀನ ಯೋಜನೆಗಳು',
    'page.project-detail': 'ಯೋಜನೆಯ ಕಾರ್ಯಕ್ಷೇತ್ರ',
    'page.project-route': 'ಯೋಜನೆ ಮಾರ್ಗ ಮತ್ತು ಜಿಐಎಸ್ ಜೋಡಣೆ',
    'page.gis-parcels': 'ಜಿಐಎಸ್ ಮತ್ತು ಭೂಮಿ ಪಾರ್ಸೆಲ್‌ಗಳು',
    'page.workflow': 'ಭೂಸ್ವಾಧೀನ ಕಿಟಕಿ',
    'page.compensation': 'ಪರಿಹಾರ ನಿರ್ವಹಣೆ',
    'page.affected-families': 'ಭೂಮಾಲೀಕರ ಡೈರೆಕ್ಟರಿ ಮತ್ತು ಪರಿಹಾರ',
    'page.documents': 'ದಾಖಲೆಗಳು ಮತ್ತು ದಾಖಲೆಗಳ ಭಂಡಾರ',
    'page.alerts': 'ಕಾರ್ಯಾಚರಣೆ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಸೂಚನೆಗಳು',
    'page.analytics': 'ಜಿಲ್ಲಾ ಮೇಲ್ವಿಚಾರಣೆ',
    'page.administration': 'ಆಡಳಿತ ಮತ್ತು ಪ್ರವೇಶ ನಿಯಂತ್ರಣ',
    'page.access-denied': 'ಪ್ರವೇಶವನ್ನು ನಿರಾಕರಿಸಲಾಗಿದೆ',
    'page.access-denied_message': 'ಈ ಮಾಡ್ಯೂಲ್ ಪ್ರವೇಶಿಸಲು ನಿಮಗೆ ಅನುಮತಿಯಿಲ್ಲ.',
    'page.go_authorized': 'ಅಧಿಕೃತ ಮಾಡ್ಯೂಲ್‌ಗೆ ಹೋಗಿ',

    // Projects Page
    'projects.title': 'ಯೋಜನೆಗಳ ಡೈರೆಕ್ಟರಿ',
    'projects.subtitle': 'ಭೂಸ್ವಾಧೀನ ಯೋಜನೆಗಳು, ಯೋಜನೆಯ ವ್ಯಾಪ್ತಿ, ಮಾರ್ಗ ಜೋಡಣೆ ಮತ್ತು ಪ್ರಗತಿಯನ್ನು ನಿರ್ವಹಿಸಿ.',
    'projects.registered_title': 'ನೊಂದಾಯಿತ ಭೂಸ್ವಾಧೀನ ಯೋಜನೆಗಳು',
    'projects.col_code': 'ಯೋಜನೆ ಕೋಡ್',
    'projects.col_title': 'ಯೋಜನೆ ಶೀರ್ಷಿಕೆ ಮತ್ತು ವ್ಯಾಪ್ತಿ',
    'projects.col_district': 'ಜಿಲ್ಲೆ / ಸ್ಥಳ',
    'projects.col_land': 'ಅಗತ್ಯವಿರುವ ಭೂಮಿ',
    'projects.col_progress': 'ಪ್ರಗತಿ',
    'projects.col_stage': 'ಪ್ರಸ್ತುತ ಹಂತ',
    'projects.col_status': 'ಸ್ಥಿತಿ',
    'projects.col_risk': 'ಅಪಾಯ ಮಟ್ಟ',
    'projects.btn_view': 'ಯೋಜನೆ ವೀಕ್ಷಿಸಿ',
    'projects.btn_export': 'ಸಿಎಸ್‌ವಿ ರಫ್ತು',
    'projects.btn_register': 'ಹೊಸ ಯೋಜನೆ ನೋಂದಾಯಿಸಿ',
    'projects.filter_all': 'ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು',
    'projects.filter_in_progress': 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    'projects.filter_verified': 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    'projects.filter_approved': 'ಅನುಮೋದಿಸಲಾಗಿದೆ',

    // Landowner Page (Affected Families)
    'landowner.title': 'ಭೂಮಾಲೀಕರ ಡೈರೆಕ್ಟರಿ ಮತ್ತು ಪರಿಹಾರ',
    'landowner.subtitle': 'ಬಾಧಿತ ಭೂಮಾಲೀಕರು, ಪರಿಹಾರ ದಾಖಲೆಗಳು, ಬ್ಯಾಂಕ್ ವಿವರಗಳು ಮತ್ತು ಹಣ ಪಾವತಿ ಸ್ಥಿತಿಯನ್ನು ವೀಕ್ಷಿಸಿ.',
    'landowner.registered_title': 'ಬಾಧಿತ ಭೂಮಾಲೀಕರು ಮತ್ತು ಫಲಾನುಭವಿಗಳು',
    'landowner.col_owner': 'ಮಾಲೀಕರ ಹೆಸರು',
    'landowner.col_survey': 'ಸರ್ವೇ ಸಂಖ್ಯೆ',
    'landowner.col_village': 'ಗ್ರಾಮ',
    'landowner.col_taluk': 'ತಾಲೂಕು',
    'landowner.col_extent': 'ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)',
    'landowner.col_compensation': 'ಮೌಲ್ಯಮಾಪನ ಮಾಡಿದ ಪರಿಹಾರ',
    'landowner.col_status': 'ಪಾವತಿ ಸ್ಥಿತಿ',
    'landowner.col_bank': 'ಬ್ಯಾಂಕ್ ಖಾತೆ',
    'landowner.col_ifsc': 'ಐಎಫ್‌ಎಸ್‌ಸಿ ಕೋಡ್',
    'landowner.status_disbursed': 'ವಿತರಿಸಲಾಗಿದೆ',
    'landowner.status_unpaid': 'ಪಾವತಿ ಬಾಕಿ ಇದೆ',

    // Documents Page
    'documents.title': 'ದಾಖಲೆಗಳು ಮತ್ತು ದಾಖಲೆಗಳ ಭಂಡಾರ',
    'documents.subtitle': 'ಭೂ ನೋಟೀಸ್‌ಗಳು, ಗೆಜೆಟ್ ಪ್ರಕಟಣೆಗಳು, ಹಕ್ಕು ಬದಲಾವಣೆ ದಾಖಲೆಗಳು ಮತ್ತು ಎಸ್‌.ಐ.ಎ ವರದಿಗಳು.',
    'documents.col_title': 'ದಾಖಲೆಯ ಶೀರ್ಷಿಕೆ',
    'documents.col_type': 'ದಾಖಲೆಯ ಪ್ರಕಾರ',
    'documents.col_date': 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಿನಾಂಕ',
    'documents.col_by': 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿದವರು',
    'documents.col_hash': 'ಎಸ್‌ಎಚ್‌ಎ-256 ಹ್ಯಾಶ್',
    'documents.btn_view': 'ದಾಖಲೆ ವೀಕ್ಷಿಸಿ',
    'documents.btn_upload': 'ಹೊಸ ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',

    // Alerts Page
    'alerts.title': 'ಕಾರ್ಯಾಚರಣೆ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಸೂಚನೆಗಳು',
    'alerts.subtitle': 'ಸಿಸ್ಟಮ್ ಎಚ್ಚರಿಕೆಗಳು, ಹೆಚ್ಚಿನ ಅಪಾಯದ ಸ್ವಾಧೀನ ಎಚ್ಚರಿಕೆಗಳು, ಗಡಿ ವಿವಾದಗಳು ಮತ್ತು ಪರಿಶೀಲನೆ ಬಾಕಿ.',
    'alerts.col_title': 'ಎಚ್ಚರಿಕೆಯ ಶೀರ್ಷಿಕೆ',
    'alerts.col_severity': 'ತೀವ್ರತೆ',
    'alerts.col_category': 'ವರ್ಗ',
    'alerts.col_date': 'ಸಮಯ',
    'alerts.col_status': 'ಸ್ಥಿತಿ',
    'alerts.btn_resolve': 'ಎಚ್ಚರಿಕೆ ಪರಿಹರಿಸಿ',
    'alerts.status_open': 'ತೆರೆದಿದೆ',
    'alerts.status_resolved': 'ಪರಿಹರಿಸಲಾಗಿದೆ',

    // GIS Parcels Page
    'gis.title': 'ಜಿಐಎಸ್ ಮತ್ತು ಭೂಮಿ ಪಾರ್ಸೆಲ್‌ಗಳು',
    'gis.subtitle': 'ಕ್ಯಾಡಸ್ಟ್ರಲ್ ನಕ್ಷೆ ವೀಕ್ಷಣೆ, ಪಾರ್ಸೆಲ್ ಗಡಿ ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಹಿಸ್ಸಾ ದಾಖಲೆ ವಿವರಗಳು.',
    'gis.filter_parcels': 'ಪಾರ್ಸೆಲ್‌ಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಿ',
    'gis.legend_acquired': 'ಸ್ವಾಧೀನಪಡಿಸಿಕೊಳ್ಳಲಾಗಿದೆ',
    'gis.legend_pending': 'ಬಾಕಿ ಇದೆ',
    'gis.hissa_details': 'ಹಿಸ್ಸಾ ಮಾಲೀಕರ ವಿವರಗಳು',

    // Acquisition Window (Workflow Page)
    'workflow.title': 'ಭೂಸ್ವಾಧೀನ ಕಿಟಕಿ',
    'workflow.subtitle': 'ಭೂಸ್ವಾಧೀನ ಹಂತದ ಪ್ರಗತಿ, ಎಸ್‌ಎಲ್‌ಎಒ ಪರಿಶೀಲನೆ ಮತ್ತು ಉನ್ನತ ಮಟ್ಟದ ಸಮಿತಿ ಅನುಮೋದನೆಗಳು.',
    'workflow.stage_proposal': 'ಪ್ರಸ್ತಾಪ',
    'workflow.stage_verification': 'ಪರಿಶೀಲನೆ',
    'workflow.stage_approval': 'ಅನುಮೋದನೆ',
    'workflow.stage_notification': 'ಅಧಿಸೂಚನೆ',
    'workflow.stage_award': 'ಅವಾರ್ಡ್ ಆದೇಶ',
    'workflow.stage_compensation': 'ಪರಿಹಾರ',
    'workflow.btn_approve': 'ಅನುಮೋದಿಸಿ ಮತ್ತು ಮುನ್ನಡೆಸಿ',
    'workflow.btn_reject': 'ಮರುಪರಿಶೀಲನೆಗೆ ಹಿಂತಿರುಗಿಸಿ',

    // Approved Projects & Compensation Page
    'compensation.title': 'ಅನುಮೋದಿತ ಯೋಜನೆಗಳು ಮತ್ತು ಪಾವತಿ',
    'compensation.subtitle': 'ಹಣಕಾಸು ಮಂಜೂರಾತಿಗಳು, ಎಸ್‌ಎಲ್‌ಎಒ ಅನುಮೋದಿತ ಯೋಜನೆಗಳು ಮತ್ತು ಇ-ಕುಬೇರ್ ಖಜಾನೆ ಪಾವತಿ.',
    'compensation.approved_projects_title': 'ಭೂಸ್ವಾಧೀನ ಅಧಿಕಾರಿಯಿಂದ ಅನುಮೋದಿಸಲ್ಪಟ್ಟ ಯೋಜನೆಗಳು',
    'compensation.col_project': 'ಯೋಜನೆ',
    'compensation.col_agency': 'ಸಂಸ್ಥೆ',
    'compensation.col_estimated': 'ಅಂದಾಜು ವೆಚ್ಚ (ಕೋಟಿ)',
    'compensation.col_slao_status': 'ಎಸ್‌ಎಲ್‌ಎಒ ಪರಿಶೀಲನೆ',
    'compensation.col_action': 'ಕ್ರಿಯೆ',
    'compensation.btn_disburse': 'ಇ-ಕುಬೇರ್ ಮೂಲಕ ವಿತರಿಸಿ',

    // District Monitoring Page
    'district.title': 'ಜಿಲ್ಲಾ ಮೇಲ್ವಿಚಾರಣೆ',
    'district.subtitle': 'ಜಿಲ್ಲಾ ಮಟ್ಟದ ಮೇಲ್ವಿಚಾರಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್, ಯೋಜನೆ ಅನುಮೋದನೆಗಳು ಮತ್ತು ಆಡಿಟ್ ವಿವರಗಳು.',
    'district.stat_total_projects': 'ಒಟ್ಟು ಯೋಜನೆಗಳು',
    'district.stat_land_required': 'ಅಗತ್ಯವಿರುವ ಭೂಮಿ (ಎಕರೆ)',
    'district.stat_pending_reviews': 'ಬಾಕಿ ಇರುವ ಎಸ್‌ಎಲ್‌ಎಒ ಪರಿಶೀಲನೆಗಳು',
    'district.stat_disbursed_comp': 'ವಿತರಿಸಲಾದ ಪರಿಹಾರ (ಕೋಟಿ)',
    'district.btn_review': 'ಯೋಜನೆ ವೀಕ್ಷಿಸಿ',

    // Administration Page
    'admin.title': 'ಆಡಳಿತ ಮತ್ತು ಪ್ರವೇಶ ನಿಯಂತ್ರಣ',
    'admin.subtitle': 'ಬಳಕೆದಾರರ ಪಾತ್ರಗಳು, ಸಿಸ್ಟಮ್ ಅನುಮತಿ ಮ್ಯಾಟ್ರಿಕ್ಸ್ ಮತ್ತು ಭದ್ರತಾ ಆಡಿಟ್ ಲಾಗ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
    'admin.col_name': 'ಬಳಕೆದಾರರ ಹೆಸರು',
    'admin.col_email': 'ಇಮೇಲ್',
    'admin.col_role': 'ನಿಯೋಜಿಸಲಾದ ಪಾತ್ರ',
    'admin.col_status': 'ಖಾತೆಯ ಸ್ಥಿತಿ',

    // Common Buttons & Labels
    'common.actions': 'ಕ್ರಿಯೆಗಳು',
    'common.close': 'ಮುಚ್ಚಿ',
    'common.save': 'ಉಳಿಸಿ',
    'common.submit': 'ಸಲ್ಲಿಸಿ',
    'common.cancel': 'ರದ್ದುಗೊಳಿಸಿ',
    'common.status': 'ಸ್ಥಿತಿ',
    'common.acres': 'ಎಕರೆಗಳು',
    'common.acres_short': 'ಎಕರೆ',
    'common.crores': 'ಕೋಟಿ',
    'common.details': 'ವಿವರಗಳು',
    'common.search': 'ಹುಡುಕಿ',
    'common.filter': 'ಫಿಲ್ಟರ್',
  }
};

export function translateKey(key: string, lang: Language, fallback?: string): string {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS.en;
  if (dictionary[key]) {
    return dictionary[key];
  }
  const defaultDict = TRANSLATIONS.en;
  if (defaultDict[key]) {
    return defaultDict[key];
  }
  return fallback !== undefined ? fallback : key;
}
