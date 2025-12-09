import { Module, OrganizationalStructure, Question } from './types';

export const PASSING_SCORE = 90;

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

// Fallback questions if Gemini fails or for modules without hardcoded questions
export const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 'fb1',
    text: 'What is the primary goal of this safety protocol?',
    options: ['To increase speed', 'To ensure patient safety', 'To reduce costs', 'To improve aesthetics'],
    correctAnswerIndex: 1
  },
  {
    id: 'fb2',
    text: 'When should this procedure be performed?',
    options: ['Only at night', 'When convenient', 'According to schedule/protocol', 'Never'],
    correctAnswerIndex: 2
  },
  {
    id: 'fb3',
    text: 'Who is responsible for reporting errors?',
    options: ['Only doctors', 'Only nurses', 'Everyone', 'No one'],
    correctAnswerIndex: 2
  }
];

export const MODULES: Module[] = [
  // --- SECTION A: Quality Assurance ---
  {
    id: 'm_qa_1',
    section: 'A. Quality Assurance',
    title: "Patient's Rights and Obligations",
    description: "Understanding the fundamental rights of patients and their corresponding responsibilities within the healthcare facility to ensure mutual respect and quality care.",
    thumbnailUrl: 'https://plus.unsplash.com/premium_photo-1682089159103-d09b46d1cce8?q=80&w=3870&auto=format&fit=crop&w=800&q=80',
    duration: '8 min',
    topics: ['Patient Rights', 'Consent', 'Privacy', 'Patient Responsibilities'],
    videoUrl: 'https://drive.google.com/file/d/1TVls_xjsGhdOhwtB_pT8IV32zTkGip1U/view?usp=sharing',
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
    description: 'Overview of the Data Privacy Act of 2012 (RA 10173) and protecting patient information.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    duration: '7 min',
    topics: ['Data Privacy Act', 'RA 10173', 'National Privacy Commission'],
    videoUrl: 'https://drive.google.com/file/d/1vUDby-oS6CDyFfGhrLvDiEjvkQ2vJCT_/view?usp=drive_link',
    questions: [
      { id: 'q_m_qa_dp_1', text: 'Ano ang buong pangalan ng batas na kilala bilang Republic Act No. 10173?', options: ['The Health Information Act of 2012', 'The National Security Act', 'The Data Privacy Act of 2012', 'The Data Protection and Compliance Act'], correctAnswerIndex: 2 },
      { id: 'q_m_qa_dp_2', text: 'Ang karapatan ng isang indibidwal na kontrolin ang koleksyon, pag-access, at paggamit ng personal na impormasyon tungkol sa kanya na nasa ilalim ng kontrol o kustodiya ng gobyerno o pribadong sektor ay tinukoy bilang:', options: ['Data Sharing Agreement', 'Data Processing Guideline', 'Data Security Protocol', 'Data privacy'], correctAnswerIndex: 3 },
      { id: 'q_m_qa_dp_3', text: 'Kapag ang mga kliyente ay nagtitiwala na ang kanilang impormasyon ay ligtas at secured, anong positibong resulta ang naipapakita?', options: ['Nangangailangan sila ng mas kaunting serbisyo.', 'Nagbibigay sila ng kumpleto at tumpak na data.', 'Sila ay exempted sa data processing.', 'Kailangan nilang pumirma ng waiver.'], correctAnswerIndex: 1 },
      { id: 'q_m_qa_dp_4', text: 'Ano ang tawag sa independiyenteng ahensya ng gobyerno na inatasan na pangasiwaan at ipatupad ang Data Privacy Act?', options: ['Department of Health (DOH)', 'Securities and Exchange Commission (SEC)', 'National Privacy Commission (NPC)', 'Philippine National Police (PNP)'], correctAnswerIndex: 2 },
      { id: 'q_m_qa_dp_5', text: 'Sa pangkalahatan, kanino inia-apply ang Data Privacy Act?', options: ['Sa pagproseso ng lahat ng uri ng personal na impormasyon', 'Sa mga kompanya lamang na nasa labas ng Pilipinas', 'Sa mga ahensya lamang ng gobyerno', 'Sa pagproseso lamang ng sensitive personal information'], correctAnswerIndex: 0 }
    ]
  },

  // --- SECTION B: Infection Prevention and Control ---
  {
    id: 'm1',
    section: 'B. Infection Prevention and Control',
    title: 'Hand Hygiene Practices',
    description: 'Protocols for minimizing the risk of spreading infections via hand hygiene.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?q=80&w=3870&auto=format&fit=crop&w=800&q=80',
    duration: '5 min',
    topics: ['Hand Hygiene', 'Five Moments'],
    videoUrl: 'https://drive.google.com/file/d/1WlzIqgb8zGUQ3cCS9aKlz7jf3UGflmIa/view?usp=sharing',
    questions: [
      { id: 'q_m1_1', text: 'Which hand hygiene method is strictly recommended when exposure to spore-forming pathogens, such as Clostridium difficile, is required?', options: ['Alcohol-Based Hand Rub (ABHR)', 'Antiseptic Hand Wash', 'Washing hands with soap and water for 40–60 seconds', 'Rinsing hands with water alone'], correctAnswerIndex: 2 },
      { id: 'q_m1_2', text: 'A lab technician has just completed collecting a blood sample and notices a small splash of blood on their hands. What is required?', options: ['Alcohol-Based Hand Rub (ABHR) for 20–30 seconds', 'Handwashing with plain soap', 'Handwashing with soap and water for 40–60 seconds', 'Hygienic hand antisepsis with ABHR'], correctAnswerIndex: 2 },
      { id: 'q_m1_3', text: 'What is the specific protective goal of Moment 1 (Before touching a patient)?', options: ['Protect HCW and environment', 'Prevent patient\'s resident flora transfer', 'Protect the patient against harmful germs carried on HCW\'s hands', 'Ensure critical site remains free of risk'], correctAnswerIndex: 2 },
      { id: 'q_m1_4', text: 'A nurse touches the patient\'s bedside table and leaves. Which Moment is indicated?', options: ['Moment 1', 'Moment 4', 'Hand hygiene is not required', 'Moment 5 (After touching patient surroundings)'], correctAnswerIndex: 3 }
    ]
  },
  {
    id: 'm_ipc_waste',
    section: 'B. Infection Prevention and Control',
    title: 'Healthcare Waste Management',
    description: 'Proper segregation, handling, and disposal of hospital waste.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1763100351709-77023f1db28d?q=80&w=2670&auto=format&fit=crop&w=800&q=80',
    duration: '12 min',
    topics: ['Waste Segregation', 'Color Coding', 'Sharps Safety'],
    videoUrl: 'https://drive.google.com/file/d/1Lg1IZW4c1GYfrZ8cF9dw-hXA_W5Zwkb8/view?usp=drive_link',
    questions: [
      { id: 'q_m_ipc_w_1', text: 'What is the initial step in the defined stream of the Healthcare Waste Management System?', options: ['Waste Collection', 'Waste Transport', 'Waste Storage', 'Waste Segregation'], correctAnswerIndex: 3 },
      { id: 'q_m_ipc_w_2', text: 'What color plastic trash bag is designated for the collection of Biodegradable waste?', options: ['Yellow', 'Black', 'Green', 'Clear'], correctAnswerIndex: 2 },
      { id: 'q_m_ipc_w_3', text: 'Hospital wastes are broadly classified into general waste and what other main classification?', options: ['Recyclable waste', 'Hazardous waste', 'Biodegradable waste', 'Sharps'], correctAnswerIndex: 1 },
      { id: 'q_m_ipc_w_4', text: 'Which category of waste is described as comparable to domestic waste and does not pose a special handling problem?', options: ['Infectious Waste', 'Sharps', 'General Waste', 'Radioactive Waste'], correctAnswerIndex: 2 },
      { id: 'q_m_ipc_w_5', text: 'All needles, scalpels, blades, and broken glass must be discarded in what specific type of container?', options: ['Green plastic trash bags', 'Puncture proof container', 'Clear plastic trash bags', 'Standard household garbage bins'], correctAnswerIndex: 1 },
      { id: 'q_m_ipc_w_6', text: 'What color plastic trash bag is designated for the collection of Infectious wastes (dry and wet)?', options: ['Green', 'Clear', 'Black', 'Yellow'], correctAnswerIndex: 3 },
      { id: 'q_m_ipc_w_7', text: 'Which type of waste includes kitchen leftover food, fruit peelings, and non-infectious leftover foods?', options: ['Infectious Waste', 'General Waste', 'Pharmaceutical Waste', 'Sharps'], correctAnswerIndex: 1 },
      { id: 'q_m_ipc_w_8', text: 'Infectious Waste is defined as waste that is suspected to contain pathogens in sufficient concentration to cause what?', options: ['Mutations', 'Environmental contamination', 'Property damage', 'Disease'], correctAnswerIndex: 3 },
      { id: 'q_m_ipc_w_9', text: 'Which waste minimization measure involves collecting waste and processing it into something new?', options: ['Re-use', 'Reduction at source', 'Residual disposal', 'Recycling'], correctAnswerIndex: 3 },
      { id: 'q_m_ipc_w_10', text: 'What must be done to plastic trash bags that are three-quarters (¾) full of waste?', options: ['They must be burned', 'They must be weighed only', 'They must be labeled with the area where collected and sealed', 'They must be immediately dumped'], correctAnswerIndex: 2 }
    ]
  },
  // Placeholder for PPE if needed in filtering
  {
    id: 'm_ipc_ppe',
    section: 'B. Infection Prevention and Control',
    title: 'Personal Protective Equipment',
    description: 'Proper donning and doffing procedures for PPE.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=800&q=80',
    duration: '10 min',
    topics: ['PPE', 'Donning', 'Doffing'],
    videoUrl: 'https://www.youtube.com/watch?v=s_t48eJqN5E'
  },

  // --- SECTION C: Patient Safety ---
  {
    id: 'm_ps_1',
    section: 'C. Patient Safety and Risk Management',
    title: 'Patient Safety Goals',
    description: 'Key goals for ensuring patient safety in the hospital.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    duration: '10 min',
    topics: ['IPSG', 'Safety Goals'],
    videoUrl: 'https://www.youtube.com/watch?v=lT1vL1wFhE0'
  },
  {
    id: 'm_ps_2',
    section: 'C. Patient Safety and Risk Management',
    title: 'International Patient Safety Goals',
    description: 'Detailed review of the International Patient Safety Goals (IPSG).',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
    duration: '15 min',
    topics: ['IPSG', 'Identification', 'Communication', 'High-Alert Meds'],
    videoUrl: 'https://www.youtube.com/watch?v=J9y5M6d8X40'
  },
  {
    id: 'm_ps_pedia_fall',
    section: 'C. Patient Safety and Risk Management',
    title: 'Pediatric Fall Prevention and Management',
    description: 'Fall prevention strategies specifically for pediatric patients.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=3840&auto=format&fit=crop&w=800&q=80',
    duration: '12 min',
    topics: ['Pediatrics', 'Fall Risk', 'Humpty Dumpty Scale'],
    videoUrl: 'https://drive.google.com/file/d/1ivBR_H4D_agJTqITZ8A_GrgmPSaIcFi0/view?usp=drive_link',
    questions: [
      { id: 'q_m_ps_ped_1', text: 'A "Fall event" is defined as a sudden, unintended, uncontrolled, downward displacement of a patient’s body to where?', options: ['The bed side rail', 'The floor or ground', 'A nearby chair', 'The closest staff member'], correctAnswerIndex: 1 },
      { id: 'q_m_ps_ped_2', text: 'Which of the following is a responsibility of the General Services Section staff?', options: ['Reviewing prescribed medications', 'Conducting a Root Cause Analysis', 'Assessing and managing environmental risks on a weekly basis', 'Conducting fall screening'], correctAnswerIndex: 2 },
      { id: 'q_m_ps_ped_3', text: 'All Neonates (ages 0 to 29 days) are automatically classified under which fall risk category for in-patients?', options: ['Low Risk', 'High Risk', 'Moderate Risk', 'Sentinel Event Risk'], correctAnswerIndex: 1 },
      { id: 'q_m_ps_ped_4', text: 'What assessment tool is specifically used to assess fall risk for pediatric in-patients below 19 years old at Ospital ng Makati?', options: ['Modified Morse Fall Risk Assessment tool', 'Fall Vulnerability Screening Tool', 'The Humpty Dumpty Scale', 'The Kinder 1 Fall Risk Assessment Tool'], correctAnswerIndex: 2 },
      { id: 'q_m_ps_ped_5', text: 'What is the frequency of fall risk reassessment for a pediatric inpatient identified as Low Risk?', options: ['Every Shift', 'Daily', 'Weekly', 'Upon discharge only'], correctAnswerIndex: 1 },
      { id: 'q_m_ps_ped_6', text: 'When a pediatric patient encounters a fall event, what immediate action must the healthcare provider implement?', options: ['Immediate transfer to the NICU', 'Post-fall assessment and management strategies', 'Root Cause Analysis within 48 hours', 'Waiting for the FPMC to convene'], correctAnswerIndex: 1 },
      { id: 'q_m_ps_ped_7', text: 'A pediatric inpatient patient with a total fall risk score of 9 would be classified under which risk status?', options: ['High Risk', 'Moderate Risk', 'Low Risk', 'Severe Risk'], correctAnswerIndex: 2 },
      { id: 'q_m_ps_ped_8', text: 'For a pediatric inpatient classified as High Fall Risk, how frequently must the patient be assessed?', options: ['Daily', 'Every shift', 'Weekly', 'Monthly'], correctAnswerIndex: 1 },
      { id: 'q_m_ps_ped_9', text: 'What is the specific score range used to determine a Low Risk status for an Inpatient Pediatric patient based on the Humpty Dumpty Scale?', options: ['0 to 6', '7 to 11', '12 or above', '25 to 44'], correctAnswerIndex: 1 },
      { id: 'q_m_ps_ped_10', text: 'For a pediatric inpatient, what mandatory action is required of the Nursing Staff to communicate fall risk status to other members of the healthcare team?', options: ['Conducting a Root Cause Analysis', 'Educating patients and family members about the risk of injury from a fall', 'Reviewing relevant sections of the policy', 'Facilitating training'], correctAnswerIndex: 1 }
    ]
  },
  {
    id: 'm_ps_adult_fall',
    section: 'C. Patient Safety and Risk Management',
    title: 'Adult Fall Prevention and Management',
    description: 'Protocols for assessing and preventing falls in adult patients.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=3827&auto=format&fit=crop&w=800&q=80',
    duration: '14 min',
    topics: ['Adult Falls', 'Morse Fall Scale'],
    videoUrl: 'https://drive.google.com/file/d/1m3eSq_BxMktFtz4fD90aAIfmRUgCN7mU/view?usp=sharing',
    questions: [
      { id: 'q_m_ps_ad_1', text: 'Which assessment tool is used for assessing in-patients aged 19 years old and above?', options: ['The Humpty Dumpty Scale', 'Modified Morse Fall Risk Assessment tool', 'The Kinder 1 Fall Risk Assessment Tool', 'The Fall Vulnerability Screening Tool'], correctAnswerIndex: 1 },
      { id: 'q_m_ps_ad_2', text: 'What is the score range defining an adult Low Fall Risk patient?', options: ['45 to 125', '7 to 11', '25 to 44', '0 to 24'], correctAnswerIndex: 3 },
      { id: 'q_m_ps_ad_3', text: 'What is the risk status assigned to an adult patient with a total fall risk score of 40?', options: ['Low Fall Risk', 'Moderate Fall Risk', 'High Fall Risk', 'Extreme Risk'], correctAnswerIndex: 1 },
      { id: 'q_m_ps_ad_4', text: 'According to the Modified Morse Fall Scale, what is the required score if an adult patient has an immediate history of falls within the current admission or the last three months?', options: ['Score 0', 'Score 15', 'Score 25', 'Score 45'], correctAnswerIndex: 2 },
      { id: 'q_m_ps_ad_5', text: 'What is the minimum score required for an adult patient to be classified as High Fall Risk?', options: ['0', '25', '45', '125'], correctAnswerIndex: 2 },
      { id: 'q_m_ps_ad_6', text: 'If an adult patient is admitted to the Intensive Care Unit (ICU), what is their mandatory fall risk classification?', options: ['Low Risk', 'Moderate Risk', 'High Fall Risk', 'Needs a full assessment first'], correctAnswerIndex: 2 },
      { id: 'q_m_ps_ad_7', text: 'For an adult outpatient who is screened as high fall risk, which factor relating to mobility is considered?', options: ['Using a cane, walker, or wheelchair', 'Being able to walk normally', 'Using a bed pan', 'Having only minor injuries previously'], correctAnswerIndex: 0 },
      { id: 'q_m_ps_ad_8', text: 'What is the definition of a Sentinel Event?', options: ['Any fall resulting in minor injury', 'A sudden downward displacement', 'A patient safety event resulting in unanticipated death or major permanent loss of function', 'An event that fails to achieve what was intended'], correctAnswerIndex: 2 },
      { id: 'q_m_ps_ad_9', text: 'If an adult inpatient is transferred to a different unit, what protocol dictates that a fall risk reassessment must be done?', options: ['Upon transfer to another Unit / Area', 'Every shift', 'Quarterly', 'Only if condition changes'], correctAnswerIndex: 0 },
      { id: 'q_m_ps_ad_10', text: 'If a fall event occurs in the Ambulatory Care area, the definition of a "Minor Injury" is listed as which of the following?', options: ['Hip fracture', 'Death', 'Head trauma', 'Abrasion, bruise, or minor laceration'], correctAnswerIndex: 3 }
    ]
  },
  {
    id: 'm_ps_error_abbrev',
    section: 'C. Patient Safety and Risk Management',
    title: 'Error Prone Abbreviation',
    description: 'Identifying and avoiding abbreviations that lead to medication errors.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=3870&auto=format&fit=crop&w=800&q=80',
    duration: '8 min',
    topics: ['Abbreviations', 'Medication Safety', 'Documentation'],
    videoUrl: 'https://drive.google.com/file/d/1F286B7XrGEgI7nW14F7TYgY_G_tpWe6z/view?usp=drive_link',
    questions: [
      { id: 'q_m_ps_ea_1', text: 'What does the intended meaning of the \'DO NOT USE\' abbreviation Q.D., QD, q.d., or qd?', options: ['Four times daily', 'Every other day', 'Every day', 'Nightly at bedtime'], correctAnswerIndex: 2 },
      { id: 'q_m_ps_ea_2', text: 'What is the recommended substitute for the error-prone abbreviation cc (cubic centimeters)?', options: ['CU', 'L', 'mL', 'Cm'], correctAnswerIndex: 2 },
      { id: 'q_m_ps_ea_3', text: 'When the abbreviation Per os (By mouth, orally) is used, what is the \'os\' specifically mistaken for?', options: ['Left ear (AS)', 'Left eye (OS)', 'Right eye (OD)', 'Once daily (o.d.)'], correctAnswerIndex: 1 },
      { id: 'q_m_ps_ea_4', text: 'What is the standard recommendation to avoid the risk of misinterpretation caused by lack of a leading zero (e.g., .5 mg)?', options: ['Do not use trailing zeros', 'Use a leading zero before a decimal point', 'Express all doses in whole numbers', 'Use fractions instead of decimals'], correctAnswerIndex: 1 },
      { id: 'q_m_ps_ea_5', text: 'The abbreviation l (lowercase L for liter) is listed as \'USE WITH CAUTION\' because it can be mistaken for what?', options: ['Milliliter (ml)', 'The letter \'I\'', 'The number 1', 'The number 7'], correctAnswerIndex: 2 },
      { id: 'q_m_ps_ea_6', text: 'What is the recommended substitute for the error-prone use of the abbreviation µg (microgram)?', options: ['Use Mg', 'Use mg', 'Use mcg', 'Use unit(s)'], correctAnswerIndex: 2 },
      { id: 'q_m_ps_ea_7', text: 'The primary objective of the policy on error-prone abbreviations is to promote patient safety by minimizing abbreviations prone to what?', options: ['Excessive charting time', 'Misinterpretation', 'Staff shortages', 'Conflict between departments'], correctAnswerIndex: 1 },
      { id: 'q_m_ps_ea_8', text: 'Which of the following describes the category \'DO NOT USE\'?', options: ['Abbreviations used with context', 'Only for physicians', 'Strictly prohibited abbreviations', 'Reviewed annually'], correctAnswerIndex: 2 },
      { id: 'q_m_ps_ea_9', text: 'Who is mandated to review and familiarize themselves with the updated list of error-prone abbreviations?', options: ['Only Risk Management', 'Only physicians', 'All healthcare personnel', 'Only administrative personnel'], correctAnswerIndex: 2 }
    ]
  },

  // --- SECTION D: Quality Management System ---
  {
    id: 'm_qms_iso',
    section: 'D. Quality Management System',
    title: 'ISO 9001 Standards',
    description: 'Introduction to ISO 9001:2015 and its application in healthcare.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    duration: '15 min',
    topics: ['ISO 9001', 'Quality Management', 'QMS'],
    videoUrl: 'https://www.youtube.com/watch?v=R990O_98S_o'
  },
  {
    id: 'm_qms_rca',
    section: 'D. Quality Management System',
    title: 'Root Cause Analysis',
    description: 'Methodologies for identifying the root causes of problems or events.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=800&q=80',
    duration: '12 min',
    topics: ['RCA', 'Fishbone', '5 Whys'],
    videoUrl: 'https://drive.google.com/file/d/1_9Gc1IdsRcvaGjCHFPaptBopVOWcGLa-/view?usp=drive_link',
    questions: [
      { id: 'q_m_qms_rca_1', text: 'In a Fishbone diagram, where is the specific problem or issue being analyzed placed?', options: ['At the center spine', 'At the far left, labeled as "Input"', 'At the head or mouth of the fish', 'On the branches'], correctAnswerIndex: 2 },
      { id: 'q_m_qms_rca_2', text: 'Pareto analysis is a decision-making tool fundamentally based on which concept?', options: ['PDCA cycle', 'The 80/20 principle', 'Six Sigma DMAIC', '5 Whys methodology'], correctAnswerIndex: 1 },
      { id: 'q_m_qms_rca_3', text: 'What is the primary objective of Root Cause Analysis (RCA)?', options: ['Report symptoms', 'Implement temporary fixes', 'Identify true origin or underlying factors', 'Increase production'], correctAnswerIndex: 2 },
      { id: 'q_m_qms_rca_4', text: 'According to ISO 9001 (Clause 10.2), what term is used for an output that does not conform to its requirements?', options: ['Concession', 'Risk', 'Nonconformity', 'Documented information'], correctAnswerIndex: 2 },
      { id: 'q_m_qms_rca_5', text: 'What is the purpose of Root Cause Analysis regarding observable issues?', options: ['Quantify magnitude', 'Look beyond visible signs or symptoms', 'Inform customer', 'Reorganize processes'], correctAnswerIndex: 1 }
    ]
  },
  {
    id: 'm_qms_risks',
    section: 'D. Quality Management System',
    title: 'Risks and Opportunities',
    description: 'Identifying and managing risks and opportunities in hospital processes.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    duration: '10 min',
    topics: ['Risk Assessment', 'Opportunities', 'SWOT'],
    videoUrl: 'https://www.youtube.com/watch?v=2Q8g5x2qE6Q'
  },
  {
    id: 'm_qms_car',
    section: 'D. Quality Management System',
    title: 'Corrective Action Requests',
    description: 'Process for issuing, responding to, and closing Corrective Action Requests (CARs).',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&q=80',
    duration: '12 min',
    topics: ['CAR', 'Nonconformity', 'Corrective Action'],
    videoUrl: 'https://drive.google.com/file/d/1TgY5Ncvj11HE1movNpq_lQyJRVI5yPcg/view?usp=drive_link',
    questions: [
      { id: 'q_m_qms_car_1', text: 'What is the definition of a Corrective Action Request (CAR)?', options: ['Short-term measure', 'Request by Medical Director only', 'Formal documented request detailing nonconformity and actions needed', 'Request for resources'], correctAnswerIndex: 2 },
      { id: 'q_m_qms_car_2', text: 'Action taken to eliminate a detected nonconformity or undesirable situation, which addresses only the symptom, is called what?', options: ['Corrective Action', 'Root Cause Analysis', 'Verification', 'Correction / Remedial Action'], correctAnswerIndex: 3 },
      { id: 'q_m_qms_car_3', text: 'Who is the Auditee in the CAR process?', options: ['Initiator of CAR', 'Hospital Director', 'Section/Unit/Dept Head responsible for response', 'Document Controller'], correctAnswerIndex: 2 },
      { id: 'q_m_qms_car_4', text: 'Which term refers to action taken specifically to eliminate the cause of a nonconformity to prevent recurrence?', options: ['Correction', 'Corrective Action', 'Effectiveness', 'Nonconformity'], correctAnswerIndex: 1 },
      { id: 'q_m_qms_car_5', text: 'A deviation from ISO 9001:2015 requirements or hospital policies is defined as:', options: ['CAR', 'Correction', 'Nonconformity', 'Appeal'], correctAnswerIndex: 2 },
      { id: 'q_m_qms_car_6', text: 'The systematic process for identifying the underlying cause(s) of a nonconformity is:', options: ['Verification', 'Correction', 'Root Cause Analysis (RCA)', 'Nonsubmission'], correctAnswerIndex: 2 },
      { id: 'q_m_qms_car_7', text: 'What is the standard timeframe to submit the completed CAR form with RCA and action plan?', options: ['7 calendar days', '2 working days', 'Five (5) working days', '30 calendar days'], correctAnswerIndex: 2 },
      { id: 'q_m_qms_car_8', text: 'Who is responsible for initiating the CAR?', options: ['Auditee', 'Medical Director', 'Document Controller', 'Auditor / Investigator / IQA'], correctAnswerIndex: 3 },
      { id: 'q_m_qms_car_9', text: 'If a CAR response is submitted on time, what is the next action for the Auditor?', options: ['Close CAR', 'Issue new CAR', 'Conduct verification immediately', 'Review submission for root cause/feasibility'], correctAnswerIndex: 3 },
      { id: 'q_m_qms_car_10', text: 'The verification process includes reviewing evidence and what third activity?', options: ['Updating Policy', 'Assessing sustained compliance', 'Calculating impact', 'Filing new CAR'], correctAnswerIndex: 1 }
    ]
  },

  // --- SECTION E: Advanced Infection Prevention and Control ---
  {
    id: 'm_ipc_vap',
    section: 'E. Advanced Infection Prevention and Control',
    title: 'VAP Bundle',
    description: 'Ventilator-Associated Pneumonia (VAP) prevention bundle protocols.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516574187841-693018f54fbd?auto=format&fit=crop&w=800&q=80',
    duration: '15 min',
    topics: ['VAP', 'Ventilator', 'Pneumonia Prevention'],
    videoUrl: 'https://www.youtube.com/watch?v=L2G3X_Yj1T8'
  },
  {
    id: 'm_ipc_cauti',
    section: 'E. Advanced Infection Prevention and Control',
    title: 'CAUTI Bundle',
    description: 'Catheter-Associated Urinary Tract Infection (CAUTI) prevention.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
    duration: '15 min',
    topics: ['CAUTI', 'Catheter', 'Infection Control'],
    videoUrl: 'https://www.youtube.com/watch?v=x-7jH9S_K1U'
  },
  {
    id: 'm_ipc_clabsi',
    section: 'E. Advanced Infection Prevention and Control',
    title: 'CLABSI Bundle',
    description: 'Central Line-Associated Bloodstream Infection (CLABSI) prevention.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=800&q=80',
    duration: '15 min',
    topics: ['CLABSI', 'Central Line', 'Infection Control'],
    videoUrl: 'https://www.youtube.com/watch?v=Y_1Y6Q6q_98'
  }
];