import { Service } from './types';

export const OFFICIAL_SERVICES: Service[] = [
  {
    id: 'aadhaar-update',
    name: 'Aadhaar Identity Card Updates & Issuance',
    nameRegional: 'आधार कार्ड अपडेट और जारी करना',
    category: 'Identity',
    description:
      'Update your demographic details (Name, Address, DoB, Gender, Mobile Number, Email) or biometrics (Photo, Fingerprints, Iris) in your Aadhaar card, or apply for a fresh Aadhaar card.',
    eligibility: [
      'Any resident of India (including infants and children)',
      'Non-Resident Indians (NRIs) residing in India'
    ],
    documentsRequired: [
      'Proof of Identity (POI) (e.g., Passport, PAN Card, Voter ID, Driving License)',
      'Proof of Address (POA) (e.g., Utility Bills, Bank Statement, Rent Agreement, Voter ID)',
      'Proof of Date of Birth (DoB) (e.g., Birth Certificate, SSLC Book/Certificate, Passport)'
    ],
    processingTime: '15 to 30 days',
    benefits:
      'Provides a universally accepted, digital-first unique 12-digit identity card that forms the backbone for all welfare schemes and banking systems in India.',
    officialPortal: 'https://myaadhaar.uidai.gov.in/'
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    nameRegional: 'आयुष्मान भारत - राष्ट्रीय जन आरोग्य योजना',
    category: 'Health',
    description:
      'The national public health insurance scheme of India that aims to provide free access to healthcare for low-income earners in the country. It covers secondary and tertiary care hospitalization.',
    eligibility: [
      'Families identified under the Socio-Economic Caste Census (SECC) database',
      'Families living in active deprivation (kachha houses, no adult male earner, landless laborers, manual scavengers)',
      'Active members of unorganized sectors'
    ],
    documentsRequired: [
      'Aadhaar Card or Voter ID Card',
      'Ration Card / PM-JAY Family ID card',
      'Income Certificate / Caste Certificate (if applicable)'
    ],
    processingTime: '7 to 10 days for card generation',
    benefits:
      'Get cashless and paperless healthcare coverage of up to ₹5,00,000 per family per year for secondary and tertiary care hospitalizations across 25,000+ empaneled hospitals.',
    officialPortal: 'https://pmjay.gov.in/'
  },
  {
    id: 'pm-kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    nameRegional: 'प्रधानमंत्री किसान सम्मान निधि',
    category: 'Agriculture',
    description:
      'A direct benefit transfer scheme where small and marginal farmers across India receive direct financial assistance of ₹6,000 per year.',
    eligibility: [
      'All landholding farmers families who own cultivable land in India',
      'Must complete mandatory e-KYC on the PM-Kisan portal',
      'Excludes institutional landholders and high-income tax-paying professionals'
    ],
    documentsRequired: [
      'Land Ownership Papers (Jamabandi / Khatauni / land revenue receipt)',
      'Aadhaar Card (linked to mobile)',
      'Bank Account Details (linked to Aadhaar for Direct Benefit Transfer)'
    ],
    processingTime: '15 to 45 days for verification',
    benefits:
      'Direct direct-cash transfer of ₹6,000 per year, distributed in three equal installments of ₹2,000 directly into the bank accounts of the farming families.',
    officialPortal: 'https://pmkisan.gov.in/'
  },
  {
    id: 'pan-card',
    name: 'Permanent Account Number (PAN) Card',
    nameRegional: 'स्थाई खाता संख्या (पैन) कार्ड',
    category: 'Finance',
    description:
      'Get your unique 10-character alphanumeric identifier issued by the Income Tax Department of India for tax purposes, banking, and opening demat accounts.',
    eligibility: ['All Indian citizens, including minors, trusts, companies, and foreigners'],
    documentsRequired: [
      'Proof of Identity (e.g., Aadhaar, Voter ID, Passport)',
      'Proof of Address (e.g., Aadhaar, Voter ID, Passport, Utility bills)',
      'Proof of Date of Birth (e.g., Birth Certificate, Matriculation certificate)'
    ],
    processingTime: 'Instant (e-PAN in 10 minutes) or 10-15 days for physical card delivery',
    benefits:
      'Enables all monetary transactions, filing of income tax returns, opening bank accounts, investing in mutual funds, and buying assets.',
    officialPortal: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html'
  },
  {
    id: 'ration-card',
    name: 'Digital Ration Card / National Food Security Act (NFSA)',
    nameRegional: 'डिजिटल राशन कार्ड / राष्ट्रीय खाद्य सुरक्षा',
    category: 'Welfare',
    description:
      'An official document issued by State Governments that allows citizens to purchase subsidized food grains (rice, wheat, sugar, kerosene) from Fair Price Shops (Ration Shops).',
    eligibility: [
      'Families categorized as Antyodaya Anna Yojana (AAY) or Priority Households (PHH)',
      'Families whose income falls below state-determined poverty limits',
      'Must be a permanent resident of the issuing state'
    ],
    documentsRequired: [
      'Family photographs (head of family)',
      'Aadhaar Cards of all family members',
      'Address Proof (Electricity, water, or rent agreement)',
      'Income Certificate / BPL Certificate (if available)'
    ],
    processingTime: '15 to 30 days',
    benefits:
      'Provides highly subsidized essential food grains (Rice at ₹3/kg, Wheat at ₹2/kg, Coarse grains at ₹1/kg) under the One Nation One Ration Card (ONORC) portability program.',
    officialPortal: 'https://nfsa.gov.in/'
  },
  {
    id: 'pm-jan-dhan',
    name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
    nameRegional: 'प्रधानमंत्री जन धन योजना',
    category: 'Finance',
    description:
      'National Mission for Financial Inclusion to ensure access to financial services, namely, basic savings & deposit accounts, remittance, credit, insurance, and pension in an affordable manner.',
    eligibility: [
      'Any Indian citizen aged 10 years or above who does not have an active bank account'
    ],
    documentsRequired: [
      'Aadhaar Card or Voter ID Card',
      'Or any Official Valid Document (OVD) like Driving License, Passport, NREGA Card'
    ],
    processingTime: 'Opened instantly at bank branches or through Bank Mitras',
    benefits:
      'Zero balance savings account, free RuPay debit card, inbuilt accident insurance cover of ₹2 Lakh, overdraft facility of up to ₹10,000 for eligible account holders, and direct transfer of welfare subsidies.',
    officialPortal: 'https://pmjdy.gov.in/'
  },
  {
    id: 'rte-admission',
    name: 'RTE 25% Reserved Free School Admission',
    nameRegional: 'शिक्षा का अधिकार (आरटीई) दाखिला',
    category: 'Education',
    description:
      'Under section 12(1)(c) of the Right to Education Act, at least 25% of seats in private un-aided schools at entry-level classes (Nursery or Class 1) are reserved for children from weaker sections and disadvantaged groups.',
    eligibility: [
      'Children aged 3 to 6 years depending on the state entry-level class rules',
      'Family annual income must be below the specified state limit (usually less than ₹1 Lakh to ₹2.5 Lakh)',
      'Belonging to SC/ST, Orphan, Transgender, or children of landless laborers'
    ],
    documentsRequired: [
      "Child's Birth Certificate",
      "Parent's Aadhaar Card and Address Proof",
      'Income Certificate issued by a competent Revenue authority',
      'Caste Certificate / Disability Certificate (if applicable)'
    ],
    processingTime:
      'Through centralized state portal lottery cycles (usually Feb to April each year)',
    benefits:
      '100% free elementary education in top-tier private schools, with government-sponsored tuition, books, and uniforms till Class 8.',
    officialPortal: 'https://dsel.education.gov.in/'
  }
];
