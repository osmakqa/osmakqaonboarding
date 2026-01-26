
import { Module, OrganizationalStructure, UserRole } from './types';

export const PASSING_SCORE = 90;

export const USER_ROLES: UserRole[] = [
  'QA Admin', 
  'Head / Assistant Head',
  'Doctor', 
  'Nurse', 
  'Nurse (High-risk Area)', 
  'Other Clinical (Med Tech, Rad Tech, etc)', 
  'Non-clinical', 
  'Medical Intern'
];

export const ORGANIZATIONAL_STRUCTURE: OrganizationalStructure = {
  "Clinical Division": [
    "Department of Anaesthesiology",
    "Department of Emergency, Pre-hospital and Disaster Medicine",
    "Department of Family and Community Medicine",
    "Department of Internal Medicine",
    "Department of Obstetrics and Gynecology",
    "Department of Otorhinolaryngology – Head and Neck Surgery",
    "Department of Ophthalmology",
    "Department of Pathology and Laboratories",
    "Department of Pediatrics",
    "Department of Radiology",
    "Department of Physical and Rehabilitation Medicine",
    "Department of Surgery",
    "Graduate Medical Education"
  ],
  "Ancillary Division": [
    "Cardiovascular Diagnostic Section",
    "Respiratory Diagnostic Section",
    "Laboratory Section",
    "Radiology Section",
    "Physical and Occupational Therapy Section",
    "Others"
  ],
  "Nursing Division": [], 
  "Quality Assurance Division": [
    "Infection Prevention and Control Section",
    "Patient Safety and Risk Management Section",
    "Program Planning and Management Section",
    "Regulation and Accreditation Section",
    "Process and Performance Improvement Section"
  ],
  "Central Information Management Division": [
    "Admitting and Information Section",
    "Health Records & Documentation Management Section",
    "Communication Section",
    "Information Technology Section",
    "Others"
  ],
  "Internal Administrative Division": [
    "Human Resource Management Section",
    "Legal/Medico-legal Section",
    "General Service Section",
    "Property Management Section",
    "Requisition Section",
    "Supply Management Section",
    "Others"
  ],
  "Allied Health Division": [
    "Food and Nutrition Management Section",
    "Pharmacy Section",
    "Medical Social Service Section",
    "Patient Experience Management Section",
    "Housekeeping / Laundry and Linen Section",
    "Chaplaincy Section",
    "Others"
  ],
  "Research Development and Innovation Division": [],
  "Financial Management Division": [
    "Accounting Section",
    "Budget Section",
    "Cash Management Section",
    "Billing Section",
    "Claims Section"
  ],
  "Medical Directors Office": [] 
};

// Helper to get roles excluding non-clinical/intern for general modules
const CLINICAL_ROLES: UserRole[] = ['QA Admin', 'Head / Assistant Head', 'Doctor', 'Nurse', 'Nurse (High-risk Area)', 'Other Clinical (Med Tech, Rad Tech, etc)', 'Medical Intern'];
const ALL_ROLES: UserRole[] = [...USER_ROLES];

export const MODULES: Module[] = [
  {
    id: 'm_qa_1',
    section: "A. Quality Assurance",
    title: "Patient's Rights and Obligations",
    description: "Understanding the fundamental rights of patients and their corresponding responsibilities within the healthcare facility to ensure mutual respect and quality care.",
    thumbnailUrl: 'https://plus.unsplash.com/premium_photo-1682089159103-d09b46d1cce8?q=80&w=3870&auto=format&fit=crop&w=800&q=80',
    topics: ['Patient Rights', 'Consent', 'Privacy', 'Patient Responsibilities'],
    videoUrl: 'https://drive.google.com/file/d/1TVls_xjsGhdOhwtB_pT8IV32zTkGip1U/view?usp=sharing',
    allowedRoles: ALL_ROLES,
    questions: [
      { id: 'q_m_qa_1_1', text: 'Ano ang isang pangunahing obligasyon ng Pasyente tungkol sa kanyang impormasyong pangkalusugan?', options: ['Itago ang mga nakaraang medikal na problema', 'Magbigay ng sapat, tumpak, at kumpletong impormasyon', 'Magbigay ng impormasyon kung hihilingin lamang', 'Ibigay ang impormasyon sa pamamagitan lamang ng sulat'], correctAnswerIndex: 1 },
      { id: 'q_m_qa_1_2', text: 'Ano ang dapat ibigay ng Pasyente sa mga karapatan at kapakanan ng Health Care Providers, Health Care Institutions, at iba pang Pasyente?', options: ['Bayad', 'Due respect (Nararapat na paggalang)', 'Payo', 'Pagsang-ayon'], correctAnswerIndex: 1 },
      { id: 'q_m_qa_1_3', text: 'May karapatan ang pasyente na malaman ang mga pangalan ng lahat ng kasaping health care team na kwalipikadong susuri, gagamot, at magbibigay ng ano?', options: ['Tulong pinansyal', 'Payong medikal', 'Pagsasangguni sa media', 'Mga resibo'], correctAnswerIndex: 1 },
      { id: 'q_m_qa_1_4', text: 'Anong batas ang dapat sundin ng Ospital ng Makati upang panatilihin ang kumpidensyalidad ng impormasyon ng pasyente?', options: ['Revised Penal Code', 'Anti-Detention Law', 'Data Privacy Act of 2012', 'Magna Carta of Patient’s Rights'], correctAnswerIndex: 2 },
      { id: 'q_m_qa_1_5', text: 'Ano ang dapat gawin ng Pasyente kung may hindi inaasahang pagbabago sa kanyang kondisyon o sintomas, kasama na ang pananakit?', options: ['Maghintay hanggang sa susunod na check-up', 'Maghanap ng payo sa ibang ospital', 'Iulat ito sa kanyang Health Care Provider', 'Itago ito upang hindi mag-alala ang pamilya'], correctAnswerIndex: 2 },
      { id: 'q_m_qa_1_6', text: 'Kailan dapat humingi ng Informed Consent ang mga Healthcare providers mula sa mga pasyente o sa kanilang kinatawan?', options: ['Bago magbayad ng deposit', 'Bago ang anumang medical procedure o paggamot', 'Pagkatapos ng paggagamot', 'Sa panahon lamang ng emerhensiya'], correctAnswerIndex: 1 },
      { id: 'q_m_qa_1_7', text: 'Ayon sa mga Karapatan ng Pasyente, kung may mga isyung hindi naaayon sa pasyente at nais niya ang tulong ng sinumang di-direktang sangkot, sino ang dapat niyang kausapin?', options: ['Ang tagapagsalita sa media', 'Ang Doctor', 'Ang kawani ng Ugnayang Pampasyente o Patient Experience Management Section', 'Ang piskal'], correctAnswerIndex: 2 },
      { id: 'q_m_qa_1_8', text: 'Sa kaso ng mga bata o iba pang vulnerable patients, sino ang kukuha ng informed consent?', options: ['Ang kanilang mga magulang o legal na tagapag-alaga', 'Ang Healthcare Provider', 'Ang kinatawan ng Gender and Development (GAD)', 'Ang Social Worker'], correctAnswerIndex: 0 },
      { id: 'q_m_qa_1_9', text: 'Ayon sa patakaran ng Ospital ng Makati, kailan dapat ipaalam sa mga Pasyente ang kanilang mga karapatan at responsibilidad?', options: ['Isang linggo pagkatapos ng paglabas (discharge).', 'Pagkatapos lamang ng paggaling.', 'Sa pag-admit sa Ospital ng Makati (upon admission).', 'Tuwing Lunes lamang.'], correctAnswerIndex: 2 },
      { id: 'q_m_qa_1_10', text: 'Ayon sa patakaran ng Muslim Burial ng Ospital ng Makati, gaano katagal ang inaasahang paglilibing pagkatapos ng kumpirmasyon ng kamatayan ng isang pasyenteng Muslim?', options: ['Sa lalong madaling panahon, mas mainam sa loob ng 24 oras', 'Sa loob ng tatlong araw', 'Sa loob ng 48 oras, o bago mag-autopsy', 'Walang paghihigpit sa oras'], correctAnswerIndex: 0 }
    ]
  },
  {
    id: 'm_qa_dataprivacy',
    section: 'A. Quality Assurance',
    title: 'Data Privacy in Healthcare',
    description: 'An overview of the Data Privacy Act of 2012 (Republic Act No. 10173) and its critical role in protecting patient information within the healthcare setting.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    topics: ['Data Privacy Act', 'Republic Act No. 10173', 'National Privacy Commission (NPC)', 'Personal Information'],
    videoUrl: 'https://drive.google.com/file/d/1vUDby-oS6CDyFfGhrLvDiEjvkQ2vJCT_/view?usp=drive_link',
    allowedRoles: ALL_ROLES,
    questions: [
      { id: 'q_m_qa_dp_1', text: 'Ano ang buong pangalan ng batas na kilala bilang Republic Act No. 10173?', options: ['The Health Information Act of 2012', 'The National Security Act', 'The Data Privacy Act of 2012', 'The Data Protection and Compliance Act'], correctAnswerIndex: 2 },
      { id: 'q_m_qa_dp_2', text: 'Ang karapatan ng isang indibidwal na kontrolin ang koleksyon, pag-access, at paggamit ng personal na impormasyon tungkol sa kanya na nasa ilalim ng kontrol o kustodiya ng gobyerno o pribadong sektor ay tinukoy bilang:', options: ['Data Sharing Agreement', 'Data Processing Guideline', 'Data Security Protocol', 'Data privacy'], correctAnswerIndex: 3 },
      { id: 'q_m_qa_dp_3', text: 'Kapag ang mga kliyente ay nagtitiwala na ang kanilang impormasyon ay ligtas at secured, anong positibong resulta ang naipapakita?', options: ['Nangangailangan sila ng mas kaunting serbisyo.', 'Nagbibigay sila ng kumpleto at tumpak na data.', 'Sila ay exempted sa data processing.', 'Kailangan nilang pumirma ng waiver.'], correctAnswerIndex: 1 },
      { id: 'q_m_qa_dp_4', text: 'Ano ang tawag sa independiyenteng ahensya ng gobyerno na inatasan na pangasiwaan at ipatupad ang Data Privacy Act?', options: ['Department of Health (DOH)', 'Securities and Exchange Commission (SEC)', 'National Privacy Commission (NPC)', 'Philippine National Police (PNP)'], correctAnswerIndex: 2 },
      { id: 'q_m_qa_dp_5', text: 'Sa pangkalahatan, kanino inia-apply ang Data Privacy Act?', options: ['Sa pagproseso ng lahat ng uri ng personal na impormasyon', 'Sa mga kompanya lamang na nasa labas ng Pilipinas', 'Sa mga ahensya lamang ng gobyerno', 'Sa pagproseso lamang ng sensitive personal information'], correctAnswerIndex: 0 }
    ]
  },
  {
    id: 'm1',
    section: 'B. Infection Prevention and Control',
    title: 'Hand Hygiene Practices',
    description: 'Guidelines and protocols for minimizing the risk of spreading infections within the hospital environment.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?q=80&w=3870&?auto=format&fit=crop&w=800&q=80',
    topics: ['Hand Hygiene', 'PPE', 'Isolation Protocols', 'Waste Disposal'],
    videoUrl: 'https://drive.google.com/file/d/1WlzIqgb8zGUQ3cCS9aKlz7jf3UGflmIa/view?usp=sharing',
    allowedRoles: ALL_ROLES,
    questions: [
      { id: 'q_m1_1', text: 'Which hand hygiene method is strictly recommended when exposure to spore-forming pathogens is required?', options: ['ABHR', 'Antiseptic Hand Wash', 'Washing with soap and water', 'Rinsing with water alone'], correctAnswerIndex: 2 }
    ]
  },
  {
    id: 'm2',
    section: 'B. Infection Prevention and Control',
    title: 'Standard and Isolation Precautions',
    description: 'Comprehensive guide on standard precautions for all patient care.',
    thumbnailUrl: 'https://plus.unsplash.com/premium_photo-1681995326134-cdc947934015?q=80&w=3870&auto=format&fit=crop&w=800&q=80',
    topics: ['Standard Precautions', 'Transmission-Based Precautions', 'PPE Selection'],
    videoUrl: 'https://drive.google.com/file/d/1pqynS_gOoSAxEfVx82103piBBlMepYhV/view?usp=sharing',
    allowedRoles: CLINICAL_ROLES
  },
  {
    id: 'm_qms_iso',
    section: 'D. Quality Management System',
    title: 'ISO 9001 Standards',
    description: 'An introduction to the ISO 9001:2015 Quality Management System.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=3870&auto=format&fit=crop&w=800&q=80',
    topics: ['ISO 9001:2015', 'Quality Management', 'Continuous Improvement', 'PDCA Cycle'],
    videoUrl: 'https://www.youtube.com/watch?v=JpM2w546dAQ',
    allowedRoles: ['QA Admin', 'Head / Assistant Head', 'Medical Intern']
  },
  {
    id: 'm_adv_ipc_vap',
    section: 'E. Advanced Infection Prevention and Control',
    title: 'VAP Bundle',
    description: 'Evidence-based practices to prevent Ventilator-Associated Pneumonia.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516574187841-69301976e499?q=80&w=3870&auto=format&fit=crop&w=800&q=80',
    topics: ['Ventilator-Associated Pneumonia', 'Oral Care', 'Sedation Vacation', 'Head of Bed'],
    videoUrl: 'https://www.youtube.com/watch?v=Fj2FqKjRz1I',
    allowedRoles: ['QA Admin', 'Head / Assistant Head', 'Doctor', 'Nurse', 'Nurse (High-risk Area)', 'Medical Intern']
  }
];

export const FALLBACK_QUESTIONS: any[] = [
  {
    id: 'fb1',
    text: 'Why is adherence to quality assurance protocols critical in a hospital setting?',
    options: ['To increase administrative paperwork', 'To ensure patient safety and minimize risk', 'To speed up patient discharge indiscriminately', 'To reduce the number of staff needed'],
    correctAnswerIndex: 1
  }
];
