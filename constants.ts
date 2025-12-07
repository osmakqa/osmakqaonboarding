

import { Module, OrganizationalStructure } from './types';

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
  "Nursing Division": [], // "that's it"
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
  "Medical Directors Office": [] // "that's it"
};

export const MODULES: Module[] = [
  // SECTION A
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
      {
        id: 'q_m_qa_1_1',
        text: 'Ano ang isang pangunahing obligasyon ng Pasyente tungkol sa kanyang impormasyong pangkalusugan?',
        options: [
          'Itago ang mga nakaraang medikal na problema',
          'Magbigay ng sapat, tumpak, at kumpletong impormasyon',
          'Magbigay ng impormasyon kung hihilingin lamang',
          'Ibigay ang impormasyon sa pamamagitan lamang ng sulat'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_qa_1_2',
        text: 'Ano ang dapat ibigay ng Pasyente sa mga karapatan at kapakanan ng Health Care Providers, Health Care Institutions, at iba pang Pasyente?',
        options: [
          'Bayad',
          'Due respect (Nararapat na paggalang)',
          'Payo',
          'Pagsang-ayon'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_qa_1_3',
        text: 'May karapatan ang pasyente na malaman ang mga pangalan ng lahat ng kasaping health care team na kwalipikadong susuri, gagamot, at magbibigay ng ano?',
        options: [
          'Tulong pinansyal',
          'Payong medikal',
          'Pagsasangguni sa media',
          'Mga resibo'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_qa_1_4',
        text: 'Anong batas ang dapat sundin ng Ospital ng Makati upang panatilihin ang kumpidensyalidad ng impormasyon ng pasyente?',
        options: [
          'Revised Penal Code',
          'Anti-Detention Law',
          'Data Privacy Act of 2012',
          'Magna Carta of Patient’s Rights'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_qa_1_5',
        text: 'Ano ang dapat gawin ng Pasyente kung may hindi inaasahang pagbabago sa kanyang kondisyon o sintomas, kasama na ang pananakit?',
        options: [
          'Maghintay hanggang sa susunod na check-up',
          'Maghanap ng payo sa ibang ospital',
          'Iulat ito sa kanyang Health Care Provider',
          'Itago ito upang hindi mag-alala ang pamilya'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_qa_1_6',
        text: 'Kailan dapat humingi ng Informed Consent ang mga Healthcare providers mula sa mga pasyente o sa kanilang kinatawan?',
        options: [
          'Bago magbayad ng deposit',
          'Bago ang anumang medical procedure o paggamot',
          'Pagkatapos ng paggagamot',
          'Sa panahon lamang ng emerhensiya'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_qa_1_7',
        text: 'Ayon sa mga Karapatan ng Pasyente, kung may mga isyung hindi naaayon sa pasyente at nais niya ang tulong ng sinumang di-direktang sangkot, sino ang dapat niyang kausapin?',
        options: [
          'Ang tagapagsalita sa media',
          'Ang Doctor',
          'Ang kawani ng Ugnayang Pampasyente o Patient Experience Management Section',
          'Ang piskal'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_qa_1_8',
        text: 'Sa kaso ng mga bata o iba pang vulnerable patients, sino ang kukuha ng informed consent?',
        options: [
          'Ang kanilang mga magulang o legal na tagapag-alaga',
          'Ang Healthcare Provider',
          'Ang kinatawan ng Gender and Development (GAD)',
          'Ang Social Worker'
        ],
        correctAnswerIndex: 0 // A
      },
      {
        id: 'q_m_qa_1_9',
        text: 'Ayon sa patakaran ng Ospital ng Makati, kailan dapat ipaalam sa mga Pasyente ang kanilang mga karapatan at responsibilidad?',
        options: [
          'Isang linggo pagkatapos ng paglabas (discharge).',
          'Pagkatapos lamang ng paggaling.',
          'Sa pag-admit sa Ospital ng Makati (upon admission).',
          'Tuwing Lunes lamang.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_qa_1_10',
        text: 'Ayon sa patakaran ng Muslim Burial ng Ospital ng Makati, gaano katagal ang inaasahang paglilibing pagkatapos ng kumpirmasyon ng kamatayan ng isang pasyenteng Muslim?',
        options: [
          'Sa lalong madaling panahon, mas mainam sa loob ng 24 oras',
          'Sa loob ng tatlong araw',
          'Sa loob ng 48 oras, o bago mag-autopsy',
          'Walang paghihigpit sa oras'
        ],
        correctAnswerIndex: 0 // A
      }
    ]
  },
  {
    id: 'm_qa_dataprivacy',
    section: 'A. Quality Assurance',
    title: 'Data Privacy in Healthcare',
    description: 'An overview of the Data Privacy Act of 2012 (Republic Act No. 10173) and its critical role in protecting patient information within the healthcare setting.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    duration: '7 min',
    topics: ['Data Privacy Act', 'Republic Act No. 10173', 'National Privacy Commission (NPC)', 'Personal Information'],
    videoUrl: 'https://drive.google.com/file/d/1vUDby-oS6CDyFfGhrLvDiEjvkQ2vJCT_/view?usp=drive_link',
    questions: [
      {
        id: 'q_m_qa_dp_1',
        text: 'Ano ang buong pangalan ng batas na kilala bilang Republic Act No. 10173?',
        options: [
          'The Health Information Act of 2012',
          'The National Security Act',
          'The Data Privacy Act of 2012',
          'The Data Protection and Compliance Act'
        ],
        correctAnswerIndex: 2
      },
      {
        id: 'q_m_qa_dp_2',
        text: 'Ang karapatan ng isang indibidwal na kontrolin ang koleksyon, pag-access, at paggamit ng personal na impormasyon tungkol sa kanya na nasa ilalim ng kontrol o kustodiya ng gobyerno o pribadong sektor ay tinukoy bilang:',
        options: [
          'Data Sharing Agreement',
          'Data Processing Guideline',
          'Data Security Protocol',
          'Data privacy'
        ],
        correctAnswerIndex: 3
      },
      {
        id: 'q_m_qa_dp_3',
        text: 'Kapag ang mga kliyente ay nagtitiwala na ang kanilang impormasyon ay ligtas at secured, anong positibong resulta ang naipapakita?',
        options: [
          'Nangangailangan sila ng mas kaunting serbisyo.',
          'Nagbibigay sila ng kumpleto at tumpak na data.',
          'Sila ay exempted sa data processing.',
          'Kailangan nilang pumirma ng waiver.'
        ],
        correctAnswerIndex: 1
      },
      {
        id: 'q_m_qa_dp_4',
        text: 'Ano ang tawag sa independiyenteng ahensya ng gobyerno na inatasan na pangasiwaan at ipatupad ang Data Privacy Act?',
        options: [
          'Department of Health (DOH)',
          'Securities and Exchange Commission (SEC)',
          'National Privacy Commission (NPC)',
          'Philippine National Police (PNP)'
        ],
        correctAnswerIndex: 2
      },
      {
        id: 'q_m_qa_dp_5',
        text: 'Sa pangkalahatan, kanino inia-apply ang Data Privacy Act?',
        options: [
          'Sa pagproseso ng lahat ng uri ng personal na impormasyon',
          'Sa mga kompanya lamang na nasa labas ng Pilipinas',
          'Sa mga ahensya lamang ng gobyerno',
          'Sa pagproseso lamang ng sensitive personal information'
        ],
        correctAnswerIndex: 0
      }
    ]
  },

  // SECTION B
  {
    id: 'm1',
    section: 'B. Infection Prevention and Control',
    title: 'Hand Hygiene Practices',
    description: 'Guidelines and protocols for minimizing the risk of spreading infections within the hospital environment. Includes hand hygiene, PPE usage, and isolation precautions.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?q=80&w=3870&?auto=format&fit=crop&w=800&q=80',
    duration: '5 min',
    topics: ['Hand Hygiene', 'PPE', 'Isolation Protocols', 'Waste Disposal'],
    // Google Drive Link
    videoUrl: 'https://drive.google.com/file/d/1WlzIqgb8zGUQ3cCS9aKlz7jf3UGflmIa/view?usp=sharing',
    questions: [
      {
        id: 'q_m1_1',
        text: 'Which hand hygiene method is strictly recommended when exposure to spore-forming pathogens, such as during a suspected or proven outbreak of Clostridium difficile, is required, and what is the primary reason?',
        options: [
          'Alcohol-Based Hand Rub (ABHR), because its fast-acting nature is superior to soap against bacteria.',
          'Antiseptic Hand Wash, because antiseptic detergent preparations often have persistent antimicrobial activity.',
          'Washing hands with soap and water for 40–60 seconds, because mechanical friction helps physically remove spores, which ABHR does not reliably kill.',
          'Rinsing hands with water alone for at least 30 seconds.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m1_2',
        text: 'A lab technician has just completed collecting a blood sample and, after removing their gloves, notices a small splash of blood visibly contaminating their hands. Which hand hygiene procedure is mandatory in this situation, and what is the required minimum total duration?',
        options: [
          'Alcohol-Based Hand Rub (ABHR) for 20–30 seconds.',
          'Handwashing with plain soap and water for 20–30 seconds.',
          'Handwashing with soap and water for 40–60 seconds.',
          'Hygienic hand antisepsis with ABHR, which should last until the hands are dry.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m1_3',
        text: 'The healthcare worker is entering a patient\'s room to perform a short, non-invasive physical assessment. They must perform Moment 1 (Before touching a patient). What is the specific protective goal of this moment?',
        options: [
          'To protect the HCW and environment from harmful patient germs.',
          'To prevent the patient\'s resident flora from being transferred to the HCW\'s hands.',
          'To protect the patient against harmful germs carried on the HCW\'s hands.',
          'To ensure the critical site remains free of infectious risk.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m1_4',
        text: 'A nurse adjusts the tubing of an infusion pump, touches the patient\'s bedside table, and then prepares to leave the room, having had no physical contact with the patient. Which Hand Hygiene Moment is indicated?',
        options: [
          'Moment 1 (Before touching a patient).',
          'Moment 4 (After touching a patient).',
          'Hand hygiene is not required since the patient was not touched.',
          'Moment 5 (After touching patient surroundings).'
        ],
        correctAnswerIndex: 3 // D
      },
      {
        id: 'q_m1_5',
        text: 'The use of sterile or non-sterile gloves is required when contact with blood, body fluids, or potentially infectious materials is anticipated. What relationship does glove use have with hand hygiene requirements?',
        options: [
          'Glove use is recommended as an alternative to hand hygiene for highly contaminated activities.',
          'Hand hygiene is performed before putting on and after taking off gloves; glove use does not replace the need for hand hygiene.',
          'When wearing gloves, an HCW should use ABHR to decontaminate the gloves if moving between contaminated and non-contaminated sites on the same patient.',
          'Hand hygiene is only required after removing gloves if contamination is detected on the skin.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m1_6',
        text: 'What is the primary difference in indication between using Alcohol-Based Hand Rub (ABHR) and washing hands with soap and water?',
        options: [
          'ABHR is used when hands are contaminated with viruses; soap and water are used for bacteria.',
          'Soap and water are mandatory when hands are visibly soiled; ABHR is the preferred method for routine hand antisepsis when hands are not visibly soiled.',
          'ABHR is preferred for surgical procedures; soap and water are preferred for routine patient care.',
          'Soap and water are faster than ABHR.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m1_7',
        text: 'Which factor was identified in observational studies as being consistently associated with lower adherence to hand hygiene recommendations?',
        options: [
          'Working in paediatrics compared to intensive care units (ICUs).',
          'Being a nurse, as compared to a doctor or nursing assistant.',
          'Being a doctor or a nursing assistant.',
          'Working during the weekend.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m1_8',
        text: 'A healthcare provider finishes adjusting the height of a patient\'s bed (touching the surroundings) but has not touched the patient. They are now leaving the room. Which Hand Hygiene Moment must be observed?',
        options: [
          'Moment 1 (Before touching a patient).',
          'Moment 4 (After touching a patient).',
          'Moment 5 (After touching patient surroundings).',
          'No hand hygiene is strictly necessary since the patient was not touched.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m1_9',
        text: 'A healthcare worker is about to take a patient\'s pulse and blood pressure, requiring direct physical contact. Which of the Five Moments for Hand Hygiene must be performed before this action?',
        options: [
          'Moment 5 (After touching patient surroundings).',
          'Moment 3 (After body fluid exposure risk).',
          'Moment 1 (Before touching a patient).',
          'Moment 2 (Before a clean/aseptic procedure).'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m1_10',
        text: 'What is the final step immediately following rinsing hands with water during the handwashing procedure?',
        options: [
          'Use the towel to turn off the faucet.',
          'Rub rotational rubbing, backwards and forwards, with clasped fingers.',
          'Dry hands thoroughly with a single-use towel.',
          'Apply a palmful of ABHR to cover all hand surfaces.'
        ],
        correctAnswerIndex: 2 // C
      }
    ]
  },
  {
    id: 'm2',
    section: 'B. Infection Prevention and Control',
    title: 'Standard and Isolation Precautions',
    description: 'Comprehensive guide on standard precautions for all patient care and specific isolation protocols (Contact, Droplet, Airborne) to prevent transmission of infectious agents.',
    thumbnailUrl: 'https://plus.unsplash.com/premium_photo-1681995326134-cdc947934015?q=80&w=3870&auto=format&fit=crop&w=800&q=80',
    duration: '12 min',
    topics: ['Standard Precautions', 'Transmission-Based Precautions', 'PPE Selection'],
    // Google Drive Link
    videoUrl: 'https://drive.google.com/file/d/1pqynS_gOoSAxEfVx82103piBBlMepYhV/view?usp=sharing',
    questions: [
      {
        id: 'q_m2_1',
        text: 'Standard Precautions are defined as the minimum infection prevention practices applied to which patient group?',
        options: [
          'Only patients with visible infectious signs.',
          'Only patients requiring isolation rooms.',
          'All patients, regardless of suspected or confirmed infection status.',
          'Only immunocompromised patients.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m2_2',
        text: 'What is the primary method of transmission that requires Contact Precautions?',
        options: [
          'Microorganisms suspended in the air.',
          'Sprays or splashes of respiratory secretions.',
          'Direct physical contact or indirect contact with contaminated surfaces, equipment, or the patient\'s environment.',
          'Water-borne pathogens.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m2_3',
        text: 'What is the essential item of Personal Protective Equipment (PPE) required when entering the patient-care area for Droplet Precautions?',
        options: [
          'A fit-tested N95 respirator.',
          'A clean, non-sterile gown.',
          'A surgical or procedural mask.',
          'Shoe covers.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m2_4',
        text: 'When preparing for Contact Precautions in a multi-bed area, which rule must be followed regarding PPE?',
        options: [
          'The same gown may be reused if the healthcare worker performs hand hygiene.',
          'A new set of PPE (gown and gloves) must be used for each patient contact.',
          'Gloves should be changed, but the gown may be kept on if not visibly soiled.',
          'PPE is only required if the patient has active draining lesions.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m2_5',
        text: 'Which isolation environment is characterized by negative pressure airflow?',
        options: [
          'Standard patient rooms under Contact Precautions.',
          'Cohorting rooms under Droplet Precautions.',
          'Airborne Infection Isolation Room (AIIR).',
          'Ambulatory examination rooms.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m2_6',
        text: 'Droplets, which transmit infection under Droplet Precautions, usually travel a short distance, approximately within:',
        options: [
          '5 meters (15 feet).',
          '1 meter or 3 feet.',
          '10 meters (30 feet).',
          'The length of the hospital corridor.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m2_7',
        text: 'Patients with which of the following conditions are indicated for Contact Precautions?',
        options: [
          'Neisseria meningitidis.',
          'Multidrug-resistant organisms (e.g., MDR Acinetobacter baumannii).',
          'Measles virus.',
          'Seasonal influenza virus.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m2_8',
        text: 'Which action must be performed immediately after removing gloves and gowns but before exiting a patient\'s room under Transmission-Based Precautions?',
        options: [
          'Documenting the procedure.',
          'Changing into street clothes.',
          'Performing hand hygiene.',
          'Cleaning the bedside table.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m2_9',
        text: 'What is the primary method of transmission that requires Contact Precautions?',
        options: [
          'Microorganisms suspended in the air.',
          'Sprays or splashes of respiratory secretions.',
          'Direct physical contact or indirect contact with contaminated surfaces, equipment, or the patient\'s environment.',
          'Water-borne pathogens.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m2_10',
        text: 'During a Lumbar Puncture procedure, what specific PPE is required for the healthcare worker?',
        options: [
          'Shoe covers.',
          'A surgical mask.',
          'A full face shield only.',
          'A fit-tested N95 respirator.'
        ],
        correctAnswerIndex: 1 // B
      }
    ]
  },
  {
    id: 'm_ipc_safe_injection',
    section: 'B. Infection Prevention and Control',
    title: 'Safe Injection Practices',
    description: 'Essential protocols for injection safety, including the "One Needle, One Syringe, Only One Time" rule, medication preparation, and proper sharps disposal.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607326207820-989c6d53a0a2?q=80&w=3500&auto=format&fit=crop&w=800&q=8',
    duration: '6 min',
    topics: ['Injection Safety', 'Sharps Disposal', 'Aseptic Technique'],
    videoUrl: 'https://drive.google.com/file/d/1afg1XhiClidWjklgJulX40aD3ia4CO30/view?usp=sharing',
    questions: [
      {
        id: 'q_m_ipc_safe_1',
        text: "When preparing an injection, what state should the sterile injection equipment's packaging be in?",
        options: [
          "Slightly moist, indicating recent sterilization.",
          "Ripped, torn, or compromised, provided the needle inside is visibly clean.",
          "Intact and containing no moisture.",
          "Labeled with the manufacturer's name only."
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ipc_safe_2',
        text: "What must healthcare workers always use to access multi-dose vials?",
        options: [
          "The previous needle, provided it was used on the same patient.",
          "Sterile needles and syringes.",
          "Non-sterile gloves.",
          "A fingerstick device."
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ipc_safe_3',
        text: "What is the rule regarding the use of single syringes to administer medication to multiple patients?",
        options: [
          "It is acceptable if the needle or cannula is changed.",
          "It is only allowed in emergency situations.",
          "Do not administer medications from a single syringe to multiple patients, even if the needle or cannula on the syringe is changed.",
          "It is preferable for multi-dose vial medications."
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ipc_safe_4',
        text: "For routine intradermal, subcutaneous, or intramuscular injections, are gloves required?",
        options: [
          "Yes, always, to maintain sterility.",
          "No, gloves are not required.",
          "Only if the health worker's skin is nonintact.",
          "Only if the patient has a bloodborne virus."
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ipc_safe_5',
        text: "When should proper hand hygiene be practiced in relation to preparing and giving an injection?",
        options: [
          "Only after administering the injection (moment 3).",
          "Only before preparing the injection (moment 2).",
          "Before preparing and giving an injection (moment 2) and after administering the injection (moment 3).",
          "Hand hygiene is replaced by glove use, so it is not strictly necessary."
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ipc_safe_6',
        text: "When disposing of sharps, where must the container be placed relative to where the sharps are used?",
        options: [
          "In a centralized disposal room.",
          "Within arm’s reach.",
          "Out of reach of children and patients only.",
          "In the designated clean medication preparation area only."
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ipc_safe_7',
        text: "When preparing a medication vial, what type of substance should be used to wipe the rubber septum (stopper) before piercing it?",
        options: [
          "Water or saline solution.",
          "Methanol or methyl-alcohol solution.",
          "A cotton swab or ball soaked with 60–70% alcohol (isopropyl alcohol or ethanol).",
          "Any available disinfectant, then quickly fanned dry."
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ipc_safe_8',
        text: "Which of the following details must be included on the label for reconstituted medication stored in a multi-dose vial?",
        options: [
          "Patient name and hospital number.",
          "Date and time of preparation, Expiry date and time, Type and volume of reconstitution liquid (if applicable), and Name or signature of the person reconstituting the medication.",
          "Final concentration and the location of reconstitution.",
          "Only the expiry date and a contamination warning."
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ipc_safe_9',
        text: "What specific condition requires health workers to wear non-sterile gloves during injection procedures, besides vascular access?",
        options: [
          "If the patient requests it.",
          "If the patient is a child.",
          "If the health worker's skin is NOT intact (e.g. through eczema, or cracked or dry skin).",
          "If the injection preparation area is not designated as clean."
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ipc_safe_10',
        text: "If a health worker sustains an occupational exposure to blood (e.g., a needle-stick), what is the maximum recommended time frame for starting Post-Exposure Prophylaxis (PEP) for HIV to be effective?",
        options: [
          "Within 24 hours.",
          "Within 72 hours.",
          "Within one week.",
          "PEP remains effective indefinitely if the source is identified."
        ],
        correctAnswerIndex: 1 // B
      }
    ]
  },
  {
    id: 'm_ipc_ppe',
    section: 'B. Infection Prevention and Control',
    title: 'Personal Protective Equipment',
    description: 'Proper selection, donning, and doffing techniques for Personal Protective Equipment (PPE) to ensure healthcare worker and patient safety.',
    thumbnailUrl: 'https://plus.unsplash.com/premium_photo-1676325102985-e0ddd75244f0?q=80&w=3870&auto=format&fit=crop&w=800&q=8',
    duration: '9 min',
    topics: ['PPE Selection', 'Donning and Doffing', 'Hazard Protection'],
    videoUrl: 'https://drive.google.com/file/d/1NYQcoZZNnUnLF23vC73ui_WDHCyYp9vB/view?usp=sharing',
    questions: [
      {
        id: 'q_m_ipc_ppe_1',
        text: 'When must hand hygiene be performed in relation to donning and doffing PPE?',
        options: [
          'Only after doffing PPE.',
          'Only if gloves are visibly soiled.',
          'Before donning and after doffing PPE.',
          'Only before entering the patient room.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ipc_ppe_2',
        text: 'What does the acronym ABHR stand for?',
        options: [
          'Advanced Barrier Health Regulation.',
          'Airborne Biohazard Handling Routine.',
          'Alcohol-Based Hand Rub.',
          'Association of Biohazard Risk.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ipc_ppe_3',
        text: 'According to the recommended donning sequence, which item is generally donned first?',
        options: [
          'Gloves.',
          'Mask/Respirator.',
          'Gown.',
          'Eye Protection.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ipc_ppe_4',
        text: 'For Droplet Precautions (e.g., influenza or pertussis), what protective item must be worn upon room entry?',
        options: [
          'N95 respirator.',
          'Full coverall.',
          'A surgical mask.',
          'Sterile gloves.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ipc_ppe_5',
        text: 'What percentage of airborne particles does an N95 respirator filter?',
        options: [
          '85%.',
          '90%.',
          '95%.',
          '100%.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ipc_ppe_6',
        text: 'Examination gloves are non-sterile and used for which general purpose during patient interactions?',
        options: [
          'Procedures requiring a sterile environment like surgery.',
          'Procedures involving vascular access (central lines).',
          'Interactions that may involve contact with bodily fluids.',
          'Giving oral medications.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ipc_ppe_7',
        text: 'Coveralls, which fully cover the head, torso, arms, and legs, are indicated for use in what type of situation?',
        options: [
          'All standard care encounters.',
          'High-risk situations, such as managing highly infectious diseases (e.g., Ebola).',
          'Contact precautions only (e.g., MRSA).',
          'Indirect patient exposure activities.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ipc_ppe_8',
        text: 'Which specialized surgical procedure listed in the guidelines is classified as an Aerosol-Generating Procedure (AGP)?',
        options: [
          'Taking blood pressure.',
          'Giving oral medication.',
          'Endotracheal intubation and extubation.',
          'Bathing and dressing the patient.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ipc_ppe_9',
        text: 'When should N95 respirators, or equivalent, be used in high-risk situations?',
        options: [
          'When giving oral medications.',
          'During aerosol-generating procedures (AGPs) and when treating patients with airborne infectious diseases.',
          'When performing standard care outside sterile or high-risk areas.',
          'Only for patients with general respiratory symptoms.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ipc_ppe_10',
        text: 'Which items must be removed before donning PPE?',
        options: [
          'Scrubs.',
          'Glasses and safety goggles.',
          'Personal items such as jewelry and watches.',
          'Only clothing below the waist.'
        ],
        correctAnswerIndex: 2 // C
      }
    ]
  },
  {
    id: 'm_ipc_cleaning',
    section: 'B. Infection Prevention and Control',
    title: 'Cleaning, Disinfection, and Sterilization',
    description: 'Best practices for cleaning, disinfecting, and sterilizing medical equipment and environmental surfaces to prevent healthcare-associated infections.',
    thumbnailUrl: 'https://plus.unsplash.com/premium_photo-1661507189943-b87c6ea3589e?q=80&w=3870&uto=format&fit=crop&w=800&q=8',
    duration: '10 min',
    topics: ['Spaulding Classification', 'Disinfection Levels', 'Sterilization Methods', 'Environmental Cleaning'],
    videoUrl: 'https://drive.google.com/file/d/10rc_b-gN7iYTVmKLDBFaM9rbfPmRL9Cl/view?usp=sharing',
  },

  // SECTION C
  {
    id: 'm_ps_1',
    section: 'C. Patient Safety and Risk Management',
    title: 'Risk and Opportunities Management',
    description: 'Identifying, assessing, and mitigating clinical and non-clinical risks to improve patient safety outcomes and organizational resilience.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    duration: '11 min',
    topics: ['Risk Assessment', 'Incident Reporting', 'Mitigation Strategies'],
    videoUrl: 'https://drive.google.com/file/d/1tTvmBPBM5w4NKowf6EN5oxNPgrjaDQvl/view?usp=sharing',
    questions: [
      {
        id: 'q_m_ps_1_1',
        text: 'What is the definition of "Risk"?',
        options: [
          'Any condition that results in a service disruption.',
          'The effect of uncertainty on the achievement of intended results (can be positive or negative).',
          'A circumstance that guarantees improvement.',
          'An activity required for compliance correction.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_1_2',
        text: 'What is the minimum number of risks a Process Owner must identify and assess annually?',
        options: [
          'Zero',
          'At least five (5)',
          'At least one (1)',
          'As many as determined by the Internal Audit Team'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_1_3',
        text: 'Who has the authority for the approval of the Guidelines for Risk and Opportunities Management document?',
        options: [
          'Process Owner',
          'Top Management',
          'Department Quality Management Representative',
          'The Medical Director'
        ],
        correctAnswerIndex: 3 // D
      },
      {
        id: 'q_m_ps_1_4',
        text: 'All identified risks and opportunities must be documented in which controlled record?',
        options: [
          'Annual Planning and Review Minutes',
          'Internal Audit Report',
          'Risks and Opportunities Registry',
          'Management Review Document'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_1_5',
        text: 'What is the primary purpose of defining "Opportunity" in the QMS context?',
        options: [
          'To shift risk to a third party.',
          'A potential condition or circumstance that can lead to improvement, innovation, or enhanced outcomes.',
          'The immediate mitigation of high-scoring risks.',
          'Outsourcing preventive maintenance.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_1_6',
        text: 'The formula for calculating the Risk/Opportunity Score is:',
        options: [
          'Likelihood (1-5) + Severity (1-5)',
          'Likelihood (1-5) x Severity (1-5)',
          'Likelihood (1-5) / Severity (1-5)',
          'Likelihood (1-5) x Impact (1-5)'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_1_7',
        text: 'What is the description for a Likelihood score of 5?',
        options: [
          'Rare',
          'Possible',
          'Almost Certain – expected to occur frequently',
          'Unlikely'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_1_8',
        text: 'The strategy of outsourcing preventive maintenance of equipment to accredited service providers under performance contracts is an example of which risk management strategy?',
        options: [
          'Mitigate',
          'Transfer',
          'Avoid',
          'Exploit'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_1_9',
        text: 'Which specific action from the AMATE strategies aligns with the outcome: "Discontinue a high-risk medication formulation from the formulary if repeated adverse reactions are observed"?',
        options: [
          'Mitigate',
          'Transfer',
          'Avoid',
          'Accept'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_1_10',
        text: 'The risk strategy of Mitigate involves which primary action?',
        options: [
          'Eliminating the risk entirely by stopping processes.',
          'Reducing the likelihood or impact through controls and safeguards.',
          'Acknowledging the risk because it is within acceptable tolerance.',
          'Maximizing the benefit of a favorable condition.'
        ],
        correctAnswerIndex: 1 // B
      }
    ]
  },
  {
    id: 'm_ps_2',
    section: 'C. Patient Safety and Risk Management',
    title: 'International Patient Safety Goals',
    description: 'Overview of the IPSG standards designed to promote specific improvements in patient safety, highlighting problematic areas in health care.',
    thumbnailUrl: 'https://plus.unsplash.com/premium_photo-1665203568927-bf0e58ee3d20?q=80&w=3870&auto=format&fit=crop&w=800&q=80',
    duration: '15 min',
    topics: ['IPSG 1-6', 'Patient Identification', 'Communication', 'Medication Safety'],
    videoUrl: 'https://drive.google.com/file/d/1APNQ1jJdSNHwnZjE4Qr5KHdvzrVuG5Ao/view?usp=sharing',
    questions: [
      {
        id: 'q_m_ps_2_1',
        text: 'According to Goal 1 (Identify Patients Correctly), how many patient identifiers are required for use throughout the hospital?',
        options: [
          'One',
          'Two',
          'Three',
          'Four'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_2_2',
        text: 'Which of the following items is explicitly prohibited from being used as a patient identifier?',
        options: [
          'Patient\'s name',
          'Birth date',
          'Identification number',
          'The patient’s room number or location in the hospital'
        ],
        correctAnswerIndex: 3 // D
      },
      {
        id: 'q_m_ps_2_3',
        text: 'Goal 5 (Reduce the Risk of Health Care–Associated Infections) requires the hospital to implement evidence-based guidelines for what critical practice?',
        options: [
          'Sterilization of instruments',
          'Isolation of patients',
          'Hand-hygiene',
          'Prophylactic antibiotic administration'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_2_4',
        text: 'Goal 4 (Ensure Safe Surgery) involves a three-part protocol known as the Universal Protocol. This includes the preoperative verification process, surgical site marking, and what final step performed immediately before the procedure starts?',
        options: [
          'The sign-out',
          'Anesthesia induction',
          'The time-out',
          'Patient transport'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_2_5',
        text: 'Standard IPSG.02.00 requires a process for reporting critical results of diagnostic tests. What method of communication is required between the reporter and the receiver to ensure closed-loop communication?',
        options: [
          'An automated text alert',
          'Direct email confirmation',
          'A read-back',
          'A written order'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_2_6',
        text: 'What specific strategy is recommended to reduce confusion associated with look-alike/sound-alike (LASA) medication names by changing their appearance, such as using DOBUTamine and DOPamine?',
        options: [
          'Color coding',
          'TALLman lettering',
          'Double labeling',
          'Sequential storage'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_2_7',
        text: 'According to Goal 2 (Improve Effective Communication), when does the standardized process for handover communication occur?',
        options: [
          'Only when a patient is transferred to a different hospital',
          'Only between nurses during shift changes',
          'Only upon a physician\'s verbal order',
          'Between health care practitioners, between different levels of care in the same hospital, and between staff and patients/families'
        ],
        correctAnswerIndex: 3 // D
      },
      {
        id: 'q_m_ps_2_8',
        text: 'The use of concentrated electrolytes is covered under IPSG.03.02. Which of the following substances are explicitly included as a concentrated electrolyte requiring stringent management protocols?',
        options: [
          '3% Saline for infusion',
          'Calcium gluconate',
          'Dextrose 50%',
          'Potassium chloride'
        ],
        correctAnswerIndex: 3 // D
      },
      {
        id: 'q_m_ps_2_9',
        text: 'During the sign-out process, conducted after a surgical/invasive procedure, which of the following components is verbally confirmed?',
        options: [
          'The patient’s insurance information',
          'The planned time of discharge',
          'The patient\'s next of kin contact information',
          'Completion of instrument, sponge, and needle counts (as applicable)'
        ],
        correctAnswerIndex: 3 // D
      }
    ]
  },
  {
    id: 'm_ps_high_alert',
    section: 'C. Patient Safety and Risk Management',
    title: 'High-Alert Medications',
    description: 'Protocols for the safe storage, prescribing, and administration of high-alert medications to prevent serious patient harm.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    duration: '10 min',
    topics: ['High-Alert Medications', 'Medication Safety', 'Storage Protocols'],
    videoUrl: 'https://drive.google.com/file/d/18irpemN_A9wZuY-_2VMceHyZkCsg83fy/view?usp=drive_link',
    questions: [
      {
        id: 'q_m_ps_ham_1',
        text: 'What is the primary objective of the policy detailing the Independent Double Check (IDC) process?',
        options: [
          'To increase drug accessibility.',
          'To reduce the cost of medication handling.',
          'To provide a clear and consistent approach for conducting independent double checks to prevent medication errors and enhance patient safety.',
          'To limit the number of staff who can administer medications.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_ham_2',
        text: 'High-Alert Medications are defined as drugs with a high risk of significant harm, where even small errors can result in serious injury or death due to what characteristic?',
        options: [
          'Their high manufacturing cost.',
          'Their narrow therapeutic range.',
          'Their extremely long shelf life.',
          'Their rapid onset of action.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_ham_3',
        text: 'Which specific medication solution is explicitly noted as not included in the list of High-Alert Electrolytes and IV Solutions?',
        options: [
          'Sodium Bicarbonate IV.',
          'Potassium Chloride IV.',
          'Sodium Chloride 0.9%.',
          'Magnesium Sulfate.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_ham_4',
        text: 'Which document must both providers sign following the completion of an Independent Double Check?',
        options: [
          'The drug manufacturer\'s insert.',
          'The original physician\'s order sheet.',
          'The patient’s medication sheet.',
          'The facility audit log.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_ham_5',
        text: 'who is included in the scope of healthcare personnel required to follow the IDC procedures?',
        options: [
          'Only licensed nurses.',
          'Pharmacists, nurses, and physicians.',
          'Only physicians on duty.',
          'Medical interns and students.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_ham_6',
        text: 'To maintain objectivity during the IDC process, the sources mandate that a checker must not be involved in which specific action?',
        options: [
          'The pre-administration confirmation.',
          'The documentation sign-off.',
          'The initial preparation of the medication.',
          'The calculation check.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_ham_7',
        text: 'Which action is represented by the letter \'I\' in the "VERIFY" Mnemonic?',
        options: [
          'Inquire about patient history.',
          'Identify correct route and confirm appropriate infusion rate.',
          'Initiate the order.',
          'Inspect the label for damage.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_ham_8',
        text: 'When patient safety is at immediate risk, who may authorize an expedited IDC process in an emergency situation?',
        options: [
          'The Patient Safety Officer only.',
          'The hospital administrator.',
          'The attending physician or nurse.',
          'The Internal Quality Audit Team.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_ham_9',
        text: 'If an expedited IDC process is authorized during an emergency, what must happen post-administration, and by whom?',
        options: [
          'The dose is recorded and no further action is required.',
          'A secondary verification should be completed as soon as possible post-administration, with a senior nurse or pharmacist reviewing the medication given.',
          'The primary nurse must sign off within 72 hours.',
          'The drug must be immediately stopped and restarted with a standard IDC.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_ham_10',
        text: 'In the "VERIFY" Mnemonic, what is the action represented by the letter \'F\'?',
        options: [
          'Fulfill the medication order immediately.',
          'Forecast potential adverse reactions.',
          'Finalize by signing the patient’s medication sheet.',
          'Find the supervising physician.'
        ],
        correctAnswerIndex: 2 // C
      }
    ]
  },
  {
    id: 'm_ps_pedia_fall',
    section: 'C. Patient Safety and Risk Management',
    title: 'Pediatric Fall Prevention and Management',
    description: 'Guidelines for preventing and managing falls in pediatric patients using the Humpty Dumpty Scale and proper risk assessment protocols.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1708687044998-35e1afa39c58?q=80&w=2670&auto=format&fit=crop&w=800&q=80',
    duration: '10 min',
    topics: ['Humpty Dumpty Scale', 'Fall Risk Assessment', 'Pediatric Safety', 'Risk Management'],
    videoUrl: 'https://drive.google.com/file/d/1ivBR_H4D_agJTqITZ8A_GrgmPSaIcFi0/view?usp=drive_link',
    questions: [
      {
        id: 'q_m_ps_pedia_1',
        text: 'A "Fall event" is defined as a sudden, unintended, uncontrolled, downward displacement of a patient’s body to where?',
        options: [
          'The bed side rail.',
          'The floor or ground.',
          'A nearby chair.',
          'The closest staff member.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_pedia_2',
        text: 'Which of the following is a responsibility of the General Services Section staff?',
        options: [
          'Reviewing prescribed medications.',
          'Conducting a Root Cause Analysis for sentinel events.',
          'Assessing and managing environmental risks on a weekly basis.',
          'Conducting fall screening using the appropriate fall risk assessment form.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_pedia_3',
        text: 'All Neonates (ages 0 to 29 days) are automatically classified under which fall risk category for in-patients?',
        options: [
          'Low Risk.',
          'High Risk.',
          'Moderate Risk.',
          'Sentinel Event Risk.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_pedia_4',
        text: 'What assessment tool is specifically used to assess fall risk for pediatric in-patients below 19 years old at Ospital ng Makati?',
        options: [
          'Modified Morse Fall Risk Assessment tool.',
          'Fall Vulnerability Screening Tool.',
          'The Humpty Dumpty Scale.',
          'The Kinder 1 Fall Risk Assessment Tool.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_pedia_5',
        text: 'What is the frequency of fall risk reassessment for a pediatric inpatient identified as Low Risk?',
        options: [
          'Every Shift.',
          'Daily.',
          'Weekly.',
          'Upon discharge only.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_pedia_6',
        text: 'When a pediatric patient encounters a fall event, what immediate action must the healthcare provider implement?',
        options: [
          'Immediate transfer to the NICU.',
          'Post-fall assessment and management strategies.',
          'Root Cause Analysis within 48 hours.',
          'Waiting for the FPMC to convene.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_pedia_7',
        text: 'A pediatric inpatient patient with a total fall risk score of 9 would be classified under which risk status?',
        options: [
          'High Risk.',
          'Moderate Risk.',
          'Low Risk.',
          'Severe Risk.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_pedia_8',
        text: 'For a pediatric inpatient classified as High Fall Risk, how frequently must the patient be assessed?',
        options: [
          'Daily.',
          'Every shift.',
          'Weekly.',
          'Monthly.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_pedia_9',
        text: 'What is the specific score range used to determine a Low Risk status for an Inpatient Pediatric patient based on the Humpty Dumpty Scale?',
        options: [
          '0 to 6.',
          '7 to 11.',
          '12 or above.',
          '25 to 44.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_pedia_10',
        text: 'For a pediatric inpatient, what mandatory action is required of the Nursing Staff to communicate fall risk status to other members of the healthcare team?',
        options: [
          'Conducting a Root Cause Analysis.',
          'Educating patients and family members about the risk of injury from a fall.',
          'Reviewing and updating relevant sections of the policy.',
          'Facilitating training and awareness sessions.'
        ],
        correctAnswerIndex: 1 // B
      }
    ]
  },
  {
    id: 'm_ps_adult_fall',
    section: 'C. Patient Safety and Risk Management',
    title: 'Adult Fall Prevention and Management',
    description: 'Guidelines for preventing and managing falls in adult patients using the Modified Morse Fall Risk Assessment tool.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620790647593-b3a6916c7d60?q=80&w=2574&auto=format&fit=crop&w=800&q=80',
    duration: '10 min',
    topics: ['Modified Morse Scale', 'Fall Risk Assessment', 'Adult Safety', 'Risk Management'],
    videoUrl: 'https://drive.google.com/file/d/1m3eSq_BxMktFtz4fD90aAIfmRUgCN7mU/view?usp=sharing',
    questions: [
      {
        id: 'q_m_ps_adult_1',
        text: 'Which assessment tool is used for assessing in-patients aged 19 years old and above?',
        options: [
          'The Humpty Dumpty Scale.',
          'Modified Morse Fall Risk Assessment tool.',
          'The Kinder 1 Fall Risk Assessment Tool.',
          'The Fall Vulnerability Screening Tool.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_adult_2',
        text: 'What is the score range defining an adult Low Fall Risk patient?',
        options: [
          '45 to 125.',
          '7 to 11.',
          '25 to 44.',
          '0 to 24.'
        ],
        correctAnswerIndex: 3 // D
      },
      {
        id: 'q_m_ps_adult_3',
        text: 'What is the risk status assigned to an adult patient with a total fall risk score of 40?',
        options: [
          'Low Fall Risk.',
          'Moderate Fall Risk.',
          'High Fall Risk.',
          'Extreme Risk.'
        ],
        correctAnswerIndex: 1 // B
      },
      {
        id: 'q_m_ps_adult_4',
        text: 'According to the Modified Morse Fall Scale, what is the required score if an adult patient has an immediate history of falls within the current admission or the last three months?',
        options: [
          'Score 0.',
          'Score 15.',
          'Score 25.',
          'Score 45.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_adult_5',
        text: 'What is the minimum score required for an adult patient to be classified as High Fall Risk?',
        options: [
          '0.',
          '25.',
          '45.',
          '125.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_adult_6',
        text: 'If an adult patient is admitted to the Intensive Care Unit (ICU), what is their mandatory fall risk classification?',
        options: [
          'Low Risk.',
          'Moderate Risk.',
          'High Fall Risk.',
          'Needs a full assessment first.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_adult_7',
        text: 'For an adult outpatient who is screened as high fall risk, which factor relating to mobility is considered?',
        options: [
          'Using a cane, walker, or wheelchair.',
          'Being able to walk normally.',
          'Using a bed pan.',
          'Having only minor injuries previously.'
        ],
        correctAnswerIndex: 0 // A
      },
      {
        id: 'q_m_ps_adult_8',
        text: 'What is the definition of a Sentinel Event?',
        options: [
          'Any fall resulting in minor injury.',
          'A sudden, unintended, uncontrolled, downward displacement of a patient’s body to the ground.',
          'A patient safety event that has resulted in an unanticipated death or major permanent loss of function not primarily related to the natural course of the patient’s illness or underlying condition.',
          'An event that fails to achieve what was intended for the patient, regardless of outcome.'
        ],
        correctAnswerIndex: 2 // C
      },
      {
        id: 'q_m_ps_adult_9',
        text: 'If an adult inpatient is transferred to a different unit, what protocol dictates that a fall risk reassessment must be done?',
        options: [
          'Upon transfer to another Unit / Area.',
          'Every shift, regardless of transfer.',
          'Quarterly.',
          'Only if the patient\'s condition changes.'
        ],
        correctAnswerIndex: 0 // A
      },
      {
        id: 'q_m_ps_adult_10',
        text: 'If a fall event occurs in the Ambulatory Care area, the definition of a "Minor Injury" is listed as which of the following?',
        options: [
          'Hip fracture.',
          'Death.',
          'Head trauma.',
          'Abrasion, bruise, or minor laceration.'
        ],
        correctAnswerIndex: 3 // D
      }
    ]
  }
];

export const FALLBACK_QUESTIONS: any[] = [
  {
    id: 'fb1',
    text: 'Why is adherence to quality assurance protocols critical in a hospital setting?',
    options: [
      'To increase administrative paperwork',
      'To ensure patient safety and minimize risk',
      'To speed up patient discharge indiscriminately',
      'To reduce the number of staff needed'
    ],
    correctAnswerIndex: 1
  }
];