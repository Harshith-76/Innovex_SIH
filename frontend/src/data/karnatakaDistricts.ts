export interface DistrictLocation {
  name: string;
  code: string;
  center: [number, number]; // [lat, lng]
}

export const KARNATAKA_DISTRICTS: DistrictLocation[] = [
  { name: 'Bagalkote', code: 'KA-BG', center: [16.1853, 75.6961] },
  { name: 'Ballari', code: 'KA-BL', center: [15.1394, 76.9214] },
  { name: 'Belagavi', code: 'KA-BV', center: [15.8497, 74.4977] },
  { name: 'Bengaluru Rural', code: 'KA-BR', center: [13.2257, 77.5750] },
  { name: 'Bengaluru Urban', code: 'KA-BU', center: [12.9716, 77.5946] },
  { name: 'Bidar', code: 'KA-BD', center: [17.9104, 77.5199] },
  { name: 'Chamarajanagara', code: 'KA-CJ', center: [11.9261, 76.9437] },
  { name: 'Chikkaballapura', code: 'KA-CB', center: [13.4355, 77.7275] },
  { name: 'Chikkamagaluru', code: 'KA-CK', center: [13.3161, 75.7720] },
  { name: 'Chitradurga', code: 'KA-CTA', center: [14.2251, 76.3980] },
  { name: 'Dakshina Kannada', code: 'KA-DK', center: [12.8702, 74.8806] },
  { name: 'Davanagere', code: 'KA-DVG', center: [14.4644, 75.9218] },
  { name: 'Dharwad', code: 'KA-DWD', center: [15.4589, 75.0078] },
  { name: 'Gadag', code: 'KA-GDG', center: [15.4319, 75.6322] },
  { name: 'Hassan', code: 'KA-HSN', center: [13.0072, 76.1011] },
  { name: 'Haveri', code: 'KA-HVR', center: [14.7958, 75.3992] },
  { name: 'Kalaburagi', code: 'KA-KLB', center: [17.3297, 76.8343] },
  { name: 'Kodagu', code: 'KA-KDG', center: [12.4244, 75.7382] },
  { name: 'Kolar', code: 'KA-KLR', center: [13.1367, 78.1291] },
  { name: 'Koppal', code: 'KA-KPL', center: [15.3533, 76.1554] },
  { name: 'Mandya', code: 'KA-MDY', center: [12.5244, 76.8958] },
  { name: 'Mysuru', code: 'KA-MYS', center: [12.2958, 76.6394] },
  { name: 'Raichur', code: 'KA-RCR', center: [16.2076, 77.3463] },
  { name: 'Ramanagara', code: 'KA-RMG', center: [12.7209, 77.2799] },
  { name: 'Shivamogga', code: 'KA-SMG', center: [13.9299, 75.5681] },
  { name: 'Tumakuru', code: 'KA-TMK', center: [13.3392, 77.1017] },
  { name: 'Udupi', code: 'KA-UDP', center: [13.3409, 74.7421] },
  { name: 'Uttara Kannada', code: 'KA-UK', center: [14.8142, 74.1297] },
  { name: 'Vijayanagara', code: 'KA-VJN', center: [15.2754, 76.3876] },
  { name: 'Vijayapura', code: 'KA-VJP', center: [16.8302, 75.7100] },
  { name: 'Yadgir', code: 'KA-YGR', center: [16.7645, 77.1378] }
];

export const getDistrictCenter = (districtName: string): [number, number] => {
  const found = KARNATAKA_DISTRICTS.find(
    (d) => d.name.toLowerCase() === districtName.toLowerCase().trim()
  );
  return found ? found.center : [12.9716, 77.5946]; // Default to Karnataka central region
};
