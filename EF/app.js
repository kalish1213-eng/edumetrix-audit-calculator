const STORAGE_VALUES = "ef-beginner-fullbook-values";
const STORAGE_CUSTOM = "ef-beginner-fullbook-custom-fields";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

const pagesHost = document.querySelector("#pagesHost");
const pageTemplate = document.querySelector("#pageTemplate");
const statusLine = document.querySelector("#statusLine");
const pageInput = document.querySelector("#pageInput");
const pageTotal = document.querySelector("#pageTotal");
const lessonSelect = document.querySelector("#lessonSelect");
const prevPage = document.querySelector("#prevPage");
const nextPage = document.querySelector("#nextPage");
const zoomSelect = document.querySelector("#zoomSelect");
const spreadMode = document.querySelector("#spreadMode");
const fieldType = document.querySelector("#fieldType");
const addField = document.querySelector("#addField");
const templateSelect = document.querySelector("#templateSelect");
const addTemplate = document.querySelector("#addTemplate");
const editFields = document.querySelector("#editFields");
const checkPage = document.querySelector("#checkPage");
const showAnswers = document.querySelector("#showAnswers");
const clearPage = document.querySelector("#clearPage");
const importAnswers = document.querySelector("#importAnswers");
const importFile = document.querySelector("#importFile");
const exportAnswers = document.querySelector("#exportAnswers");

let manifest;
let currentPage = getStartPage();
let addMode = false;
let templateMode = false;
let editMode = false;
let resetScrollTimer;
resetIfRequested();
let savedValues = loadJson(STORAGE_VALUES, {});
let customFields = loadJson(STORAGE_CUSTOM, {});

const lessonIndex = [
  { title: "English File Beginner", page: 1 },
  { title: "Contents", page: 3 },
  { title: "Book Start", page: 5 },
  { title: "1A A cappuccino, please", page: 7 },
  { title: "1B World music", page: 9 },
  { title: "Practical English 1", page: 11 },
  { title: "2A Are you on holiday?", page: 13 },
  { title: "2B That's my bus!", page: 15 },
  { title: "Revise and Check 1&2", page: 17 },
  { title: "3A Where are my keys?", page: 19 },
  { title: "3B Souvenirs", page: 21 },
  { title: "Practical English 2", page: 23 },
  { title: "4A Meet the family", page: 25 },
  { title: "4B The perfect car", page: 27 },
  { title: "Revise and Check 3&4", page: 29 },
  { title: "5A A big breakfast?", page: 31 },
  { title: "5B A very long flight", page: 33 },
  { title: "Practical English 3", page: 35 },
  { title: "6A A school reunion", page: 37 },
  { title: "6B Good morning, goodnight", page: 39 },
  { title: "Revise and Check 5&6", page: 41 },
  { title: "7A Have a nice weekend!", page: 43 },
  { title: "7B Lights, camera, action!", page: 45 },
  { title: "Practical English 4", page: 47 },
  { title: "8A Can I park here?", page: 49 },
  { title: "8B I love cooking", page: 51 },
  { title: "Revise and Check 7&8", page: 53 },
  { title: "9A Everything's fine!", page: 55 },
  { title: "9B Working undercover", page: 57 },
  { title: "Practical English 5", page: 59 },
  { title: "10A A room with a view", page: 61 },
  { title: "10B Where were you?", page: 63 },
  { title: "Revise and Check 9&10", page: 65 },
  { title: "11A A new life in the USA", page: 67 },
  { title: "11B How was your day?", page: 69 },
  { title: "Practical English 6", page: 71 },
  { title: "12A Strangers on a train", page: 73 },
  { title: "12B Revise the past", page: 75 },
  { title: "Revise and Check 11&12", page: 77 },
  { title: "Communication", page: 79 },
  { title: "Writing", page: 87 },
  { title: "Listening", page: 89 },
  { title: "Grammar Bank", page: 93 },
  { title: "Vocabulary Bank", page: 117 },
  { title: "Words and phrases to learn", page: 132 },
  { title: "Regular and irregular verbs", page: 134 },
  { title: "Sound Bank", page: 135 },
  { title: "Credits", page: 137 }
];

const nativeLessons = [
  {
    startPage: 1,
    endPage: 2,
    title: "English File Beginner",
    url: "public/native/book-cover/index.html?v=20260612-bookmatter1"
  },
  {
    startPage: 3,
    endPage: 4,
    title: "Contents",
    url: "public/native/contents/index.html?v=20260612-contents1"
  },
  {
    startPage: 5,
    endPage: 6,
    title: "Book Start",
    url: "public/native/book-start/index.html?v=20260612-bookmatter1"
  },
  {
    startPage: 7,
    endPage: 8,
    title: "1A A cappuccino, please",
    url: "public/native/1a-cappuccino-please/index.html?v=20260613-1aphotoall2"
  },
  {
    startPage: 9,
    endPage: 10,
    title: "1B World music",
    url: "public/native/1b-world-music/index.html?v=20260613-1bphoto2"
  },
  {
    startPage: 11,
    endPage: 12,
    title: "Practical English 1",
    url: "public/native/practical-english-1/index.html?v=20260613-pe1photo2"
  },
  {
    startPage: 13,
    endPage: 14,
    title: "2A Are you on holiday?",
    url: "public/native/2a-are-you-on-holiday/index.html?v=20260613-2aphoto1"
  },
  {
    startPage: 15,
    endPage: 16,
    title: "2B That's my bus!",
    url: "public/native/2b-thats-my-bus/index.html?v=20260613-2bphoto1"
  },
  {
    startPage: 17,
    endPage: 18,
    title: "Revise and Check 1&2",
    url: "public/native/revise-check-1-2/index.html?v=20260613-revise12photo1"
  },
  {
    startPage: 19,
    endPage: 20,
    title: "3A Where are my keys?",
    url: "public/native/3a-where-are-my-keys/index.html?v=20260613-3aphoto1"
  },
  {
    startPage: 21,
    endPage: 22,
    title: "3B Souvenirs",
    url: "public/native/3b-souvenirs/index.html?v=20260613-3bphoto1"
  },
  {
    startPage: 23,
    endPage: 24,
    title: "Practical English 2",
    url: "public/native/practical-english-2/index.html?v=20260613-pe2photo1"
  },
  {
    startPage: 25,
    endPage: 26,
    title: "4A Meet the family",
    url: "public/native/4a-meet-the-family/index.html?v=20260613-4aphoto1"
  },
  {
    startPage: 27,
    endPage: 28,
    title: "4B The perfect car",
    url: "public/native/4b-the-perfect-car/index.html?v=20260613-4bphoto1"
  },
  {
    startPage: 29,
    endPage: 30,
    title: "Revise and Check 3&4",
    url: "public/native/revise-check-3-4/index.html?v=20260613-revise34photo1"
  },
  {
    startPage: 31,
    endPage: 32,
    title: "5A A big breakfast?",
    url: "public/native/5a-a-big-breakfast/index.html?v=20260613-5aphoto1"
  },
  {
    startPage: 33,
    endPage: 34,
    title: "5B A very long flight",
    url: "public/native/5b-a-very-long-flight/index.html?v=20260613-5bphoto1"
  },
  {
    startPage: 35,
    endPage: 36,
    title: "Practical English 3",
    url: "public/native/practical-english-3/index.html?v=20260613-pe3photo1"
  },
  {
    startPage: 37,
    endPage: 38,
    title: "6A A school reunion",
    url: "public/native/6a-a-school-reunion/index.html?v=20260613-6aphoto1"
  },
  {
    startPage: 39,
    endPage: 40,
    title: "6B Good morning, goodnight",
    url: "public/native/6b-good-morning-goodnight/index.html?v=20260613-6bphoto1"
  },
  {
    startPage: 41,
    endPage: 42,
    title: "Revise and Check 5&6",
    url: "public/native/revise-check-5-6/index.html?v=20260613-revise56photo1"
  },
  {
    startPage: 43,
    endPage: 44,
    title: "7A Have a nice weekend!",
    url: "public/native/7a-have-a-nice-weekend/index.html?v=20260613-7aphoto1"
  },
  {
    startPage: 45,
    endPage: 46,
    title: "7B Lights, camera, action!",
    url: "public/native/7b-lights-camera-action/index.html?v=20260613-7bphoto1"
  },
  {
    startPage: 47,
    endPage: 48,
    title: "Practical English 4",
    url: "public/native/practical-english-4/index.html?v=20260613-pe4photo1b"
  },
  {
    startPage: 49,
    endPage: 50,
    title: "8A Can I park here?",
    url: "public/native/8a-can-i-park-here/index.html?v=20260612-8a4"
  },
  {
    startPage: 51,
    endPage: 52,
    title: "8B I love cooking",
    url: "public/native/8b-i-love-cooking/index.html?v=20260612-8b2"
  },
  {
    startPage: 53,
    endPage: 54,
    title: "Revise and Check 7&8",
    url: "public/native/revise-check-7-8/index.html?v=20260612-revise78a"
  },
  {
    startPage: 55,
    endPage: 56,
    title: "9A Everything's fine!",
    url: "public/native/9a-everythings-fine/index.html?v=20260612-9a3"
  },
  {
    startPage: 57,
    endPage: 58,
    title: "9B Working undercover",
    url: "public/native/9b-working-undercover/index.html?v=20260612-9b2"
  },
  {
    startPage: 59,
    endPage: 60,
    title: "Practical English 5",
    url: "public/native/practical-english-5/index.html?v=20260612-pe5b"
  },
  {
    startPage: 61,
    endPage: 62,
    title: "10A A room with a view",
    url: "public/native/10a-a-room-with-a-view/index.html?v=20260612-10a4"
  },
  {
    startPage: 63,
    endPage: 64,
    title: "10B Where were you?",
    url: "public/native/10b-where-were-you/index.html?v=20260612-10b2"
  },
  {
    startPage: 65,
    endPage: 66,
    title: "Revise and Check 9&10",
    url: "public/native/revise-check-9-10/index.html?v=20260612-revise910c"
  },
  {
    startPage: 67,
    endPage: 68,
    title: "11A A new life in the USA",
    url: "public/native/11a-a-new-life-in-the-usa/index.html?v=20260612-11a4"
  },
  {
    startPage: 69,
    endPage: 70,
    title: "11B How was your day?",
    url: "public/native/11b-how-was-your-day/index.html?v=20260612-11b1"
  },
  {
    startPage: 71,
    endPage: 72,
    title: "Practical English 6",
    url: "public/native/practical-english-6/index.html?v=20260612-pe6b"
  },
  {
    startPage: 73,
    endPage: 74,
    title: "12A Strangers on a train",
    url: "public/native/12a-strangers-on-a-train/index.html?v=20260612-12a1"
  },
  {
    startPage: 75,
    endPage: 76,
    title: "12B Revise the past",
    url: "public/native/12b-revise-the-past/index.html?v=20260612-12b2"
  },
  {
    startPage: 77,
    endPage: 78,
    title: "Revise and Check 11&12",
    url: "public/native/revise-check-11-12/index.html?v=20260612-revise1112c"
  },
  {
    startPage: 79,
    endPage: 86,
    title: "Communication",
    url: "public/native/communication/index.html?v=20260612-comm1"
  },
  {
    startPage: 87,
    endPage: 88,
    title: "Writing",
    url: "public/native/writing/index.html?v=20260612-writing1"
  },
  {
    startPage: 89,
    endPage: 92,
    title: "Listening",
    url: "public/native/listening/index.html?v=20260612-listening1"
  },
  {
    startPage: 93,
    endPage: 94,
    title: "Grammar Bank 1A-1B",
    url: "public/native/grammar-bank-1/index.html?v=20260612-grammar1"
  },
  {
    startPage: 95,
    endPage: 96,
    title: "Grammar Bank 2A-2B",
    url: "public/native/grammar-bank-2/index.html?v=20260612-grammar2"
  },
  {
    startPage: 97,
    endPage: 98,
    title: "Grammar Bank 3A-3B",
    url: "public/native/grammar-bank-3/index.html?v=20260612-grammar3"
  },
  {
    startPage: 99,
    endPage: 100,
    title: "Grammar Bank 4A-4B",
    url: "public/native/grammar-bank-4/index.html?v=20260612-grammar4"
  },
  {
    startPage: 101,
    endPage: 102,
    title: "Grammar Bank 5A-5B",
    url: "public/native/grammar-bank-5/index.html?v=20260612-grammar5"
  },
  {
    startPage: 103,
    endPage: 104,
    title: "Grammar Bank 6A-6B",
    url: "public/native/grammar-bank-6/index.html?v=20260612-grammar6"
  },
  {
    startPage: 105,
    endPage: 106,
    title: "Grammar Bank 7A-7B",
    url: "public/native/grammar-bank-7/index.html?v=20260612-grammar7"
  },
  {
    startPage: 107,
    endPage: 108,
    title: "Grammar Bank 8A-8B",
    url: "public/native/grammar-bank-8/index.html?v=20260612-grammar8"
  },
  {
    startPage: 109,
    endPage: 110,
    title: "Grammar Bank 9A-9B",
    url: "public/native/grammar-bank-9/index.html?v=20260612-grammar9"
  },
  {
    startPage: 111,
    endPage: 112,
    title: "Grammar Bank 10A-10B",
    url: "public/native/grammar-bank-10/index.html?v=20260612-grammar10"
  },
  {
    startPage: 113,
    endPage: 114,
    title: "Grammar Bank 11A-11B",
    url: "public/native/grammar-bank-11/index.html?v=20260612-grammar11"
  },
  {
    startPage: 115,
    endPage: 116,
    title: "Grammar Bank 12A-12B",
    url: "public/native/grammar-bank-12/index.html?v=20260612-grammar12"
  },
  {
    startPage: 117,
    endPage: 118,
    title: "Vocabulary Bank: Numbers; Countries and nationalities",
    url: "public/native/vocabulary-bank-1/index.html?v=20260612-vocab1a"
  },
  {
    startPage: 119,
    endPage: 120,
    title: "Vocabulary Bank: The classroom; Small things",
    url: "public/native/vocabulary-bank-2/index.html?v=20260612-vocab2"
  },
  {
    startPage: 121,
    endPage: 122,
    title: "Vocabulary Bank: People and family; Adjectives",
    url: "public/native/vocabulary-bank-3/index.html?v=20260612-vocab3"
  },
  {
    startPage: 123,
    endPage: 124,
    title: "Vocabulary Bank: Food and drink; Common verb phrases 1",
    url: "public/native/vocabulary-bank-4/index.html?v=20260612-vocab4"
  },
  {
    startPage: 125,
    endPage: 126,
    title: "Vocabulary Bank: Jobs and places of work; A typical day",
    url: "public/native/vocabulary-bank-5/index.html?v=20260612-vocab5"
  },
  {
    startPage: 127,
    endPage: 128,
    title: "Vocabulary Bank: Common verb phrases 2; Months and ordinal numbers",
    url: "public/native/vocabulary-bank-6/index.html?v=20260612-vocab6"
  },
  {
    startPage: 129,
    endPage: 130,
    title: "Vocabulary Bank: Activities; Clothes",
    url: "public/native/vocabulary-bank-7/index.html?v=20260612-vocab7"
  },
  {
    startPage: 131,
    endPage: 131,
    title: "Vocabulary Bank: Hotels",
    url: "public/native/vocabulary-bank-8/index.html?v=20260612-vocab8"
  },
  {
    startPage: 132,
    endPage: 133,
    title: "Words and phrases to learn",
    url: "public/native/words-phrases/index.html?v=20260612-phrases1"
  },
  {
    startPage: 134,
    endPage: 134,
    title: "Regular and irregular verbs",
    url: "public/native/regular-verbs/index.html?v=20260612-verbs1"
  },
  {
    startPage: 135,
    endPage: 136,
    title: "Sound Bank",
    url: "public/native/sound-bank/index.html?v=20260612-sound1"
  },
  {
    startPage: 137,
    endPage: 137,
    title: "Credits",
    url: "public/native/book-end/index.html?v=20260612-bookmatter1"
  }
];

const builtInWidgets = {
  7: [
    {
      id: "p7-dialogue-1",
      label: "Диалог 1",
      type: "select",
      x: 6,
      y: 62,
      w: 22,
      options: ["Good morning", "A cappuccino, please", "Here you are", "Thanks"],
      answer: "Good morning"
    },
    {
      id: "p7-dialogue-2",
      label: "Диалог 2",
      type: "select",
      x: 29,
      y: 62,
      w: 24,
      options: ["Good morning", "A cappuccino, please", "Here you are", "Thanks"],
      answer: "A cappuccino, please"
    },
    {
      id: "p7-dialogue-3",
      label: "Диалог 3",
      type: "select",
      x: 6,
      y: 69,
      w: 22,
      options: ["Good morning", "A cappuccino, please", "Here you are", "Thanks"],
      answer: "Here you are"
    },
    {
      id: "p7-dialogue-4",
      label: "Диалог 4",
      type: "select",
      x: 29,
      y: 69,
      w: 24,
      options: ["Good morning", "A cappuccino, please", "Here you are", "Thanks"],
      answer: "Thanks"
    },
    {
      id: "p7-grammar-i",
      label: "I ... Monica",
      type: "select",
      x: 7,
      y: 82,
      w: 15,
      options: ["am", "is", "are"],
      answer: "am",
      compact: true
    },
    {
      id: "p7-grammar-he",
      label: "He ... Italian",
      type: "select",
      x: 23,
      y: 82,
      w: 16,
      options: ["am", "is", "are"],
      answer: "is",
      compact: true
    },
    {
      id: "p7-grammar-they",
      label: "They ... students",
      type: "select",
      x: 40,
      y: 82,
      w: 18,
      options: ["am", "is", "are"],
      answer: "are",
      compact: true
    },
    {
      id: "p7-grammar-you",
      label: "You ... in room 2",
      type: "select",
      x: 7,
      y: 90,
      w: 17,
      options: ["am", "is", "are"],
      answer: "are",
      compact: true
    },
    {
      id: "p7-grammar-she",
      label: "She ... from Spain",
      type: "select",
      x: 25,
      y: 90,
      w: 18,
      options: ["am", "is", "are"],
      answer: "is",
      compact: true
    },
    {
      id: "p7-grammar-we",
      label: "We ... in a cafe",
      type: "select",
      x: 44,
      y: 90,
      w: 17,
      options: ["am", "is", "are"],
      answer: "are",
      compact: true
    }
  ],
  8: [
    ...[
      ["0", "zero"],
      ["1", "one"],
      ["2", "two"],
      ["3", "three"],
      ["4", "four"],
      ["5", "five"],
      ["6", "six"],
      ["7", "seven"],
      ["8", "eight"],
      ["9", "nine"],
      ["10", "ten"]
    ].map(([label, answer], index) => ({
      id: `p8-number-${label}`,
      label,
      type: "text",
      x: index % 2 === 0 ? 6 : 25,
      y: 24 + Math.floor(index / 2) * 5.4,
      w: 16,
      answer,
      compact: true
    })),
    {
      id: "p8-pron-i",
      label: "/i:/",
      type: "select",
      x: 6,
      y: 77,
      w: 18,
      options: ["three", "six", "zero"],
      answer: "three",
      compact: true
    },
    {
      id: "p8-pron-s",
      label: "/s/",
      type: "select",
      x: 25,
      y: 77,
      w: 18,
      options: ["three", "six", "zero"],
      answer: "six",
      compact: true
    },
    {
      id: "p8-pron-z",
      label: "/z/",
      type: "select",
      x: 44,
      y: 77,
      w: 18,
      options: ["three", "six", "zero"],
      answer: "zero",
      compact: true
    },
    {
      id: "p8-speaking",
      label: "Speaking: диалог в кафе",
      type: "textarea",
      x: 55,
      y: 82,
      w: 33,
      answer: "",
      free: true
    }
  ],
  9: [
    {
      id: "p9-2a-country-1",
      label: "2a: He's from...",
      type: "text",
      x: 31,
      y: 56.8,
      w: 15,
      answer: "Brazil",
      compact: true
    },
    {
      id: "p9-2a-country-2",
      label: "2a: Lila from...",
      type: "text",
      x: 40,
      y: 59.5,
      w: 15,
      answer: "Brazil",
      compact: true
    },
    {
      id: "p9-2a-country-3",
      label: "2a: She's from...",
      type: "text",
      x: 36,
      y: 62.1,
      w: 15,
      answer: "Mexico",
      compact: true
    },
    {
      id: "p9-2d-she",
      label: "2d she",
      type: "text",
      x: 6.5,
      y: 76.7,
      w: 8,
      answer: "2",
      compact: true
    },
    {
      id: "p9-2d-it",
      label: "2d it",
      type: "text",
      x: 6.5,
      y: 79.3,
      w: 8,
      answer: "3",
      compact: true
    },
    {
      id: "p9-2d-he",
      label: "2d he",
      type: "text",
      x: 6.5,
      y: 81.8,
      w: 8,
      answer: "1",
      compact: true
    },
    {
      id: "p9-2e-hes",
      label: "he is",
      type: "text",
      x: 26,
      y: 90.4,
      w: 10,
      answer: "'s|s|he's",
      compact: true
    },
    {
      id: "p9-2e-shes",
      label: "she is",
      type: "text",
      x: 27,
      y: 93.1,
      w: 10,
      answer: "'s|s|she's",
      compact: true
    },
    {
      id: "p9-2e-its",
      label: "it is",
      type: "text",
      x: 24,
      y: 95.6,
      w: 10,
      answer: "'s|s|it's",
      compact: true
    },
    {
      id: "p9-2e-he-isnt",
      label: "he is not",
      type: "text",
      x: 50,
      y: 90.4,
      w: 13,
      answer: "isn't|is not",
      compact: true
    },
    {
      id: "p9-2e-she-isnt",
      label: "she is not",
      type: "text",
      x: 51,
      y: 93.1,
      w: 13,
      answer: "isn't|is not",
      compact: true
    },
    {
      id: "p9-2e-it-isnt",
      label: "it is not",
      type: "text",
      x: 49,
      y: 95.6,
      w: 13,
      answer: "isn't|is not",
      compact: true
    }
  ],
  10: [
    ...Array.from({ length: 5 }).map((_, index) => ({
      id: `p10-4c-${index + 1}`,
      label: `4c ${index + 1}: a/b`,
      type: "text",
      x: 7,
      y: 58.5 + index * 3.1,
      w: 10,
      answer: "",
      free: true,
      compact: true
    })),
    ...Array.from({ length: 6 }).map((_, index) => ({
      id: `p10-4d-${index + 1}`,
      label: `4d ${index + 1}`,
      type: "text",
      x: 7,
      y: 75.7 + index * 3.1,
      w: 32,
      answer: index === 0 ? "He's from Egypt.|He is from Egypt." : "",
      free: index !== 0,
      compact: true
    }))
  ],
  11: [
    {
      id: "p11-2a-1",
      label: "2a 1",
      type: "text",
      x: 51,
      y: 55.3,
      w: 16,
      answer: "What's|What is",
      compact: true
    },
    {
      id: "p11-2a-2",
      label: "2a 2",
      type: "text",
      x: 66,
      y: 55.3,
      w: 15,
      answer: "English",
      compact: true
    },
    {
      id: "p11-2a-3",
      label: "2a 3",
      type: "text",
      x: 51,
      y: 58.1,
      w: 16,
      answer: "Book",
      compact: true
    },
    {
      id: "p11-2a-4",
      label: "2a 4",
      type: "text",
      x: 64,
      y: 61.2,
      w: 14,
      answer: "spell",
      compact: true
    },
    {
      id: "p11-2c-1-open",
      label: "2c 1",
      type: "text",
      x: 57,
      y: 72.2,
      w: 14,
      answer: "Open",
      compact: true
    },
    {
      id: "p11-2c-1-go",
      label: "2c 1",
      type: "text",
      x: 70,
      y: 72.2,
      w: 13,
      answer: "Go",
      compact: true
    },
    {
      id: "p11-2c-1-sorry",
      label: "2c 1",
      type: "text",
      x: 49,
      y: 74.9,
      w: 13,
      answer: "Sorry",
      compact: true
    },
    {
      id: "p11-2c-1-say",
      label: "2c 1",
      type: "text",
      x: 65,
      y: 74.9,
      w: 13,
      answer: "say",
      compact: true
    },
    {
      id: "p11-2c-2-excuse",
      label: "2c 2",
      type: "text",
      x: 49,
      y: 80.3,
      w: 14,
      answer: "Excuse",
      compact: true
    },
    {
      id: "p11-2c-2-how",
      label: "2c 2",
      type: "text",
      x: 62,
      y: 80.3,
      w: 13,
      answer: "How",
      compact: true
    },
    {
      id: "p11-2c-3-sorry",
      label: "2c 3",
      type: "text",
      x: 49,
      y: 86.3,
      w: 14,
      answer: "Sorry",
      compact: true
    },
    {
      id: "p11-2c-3-down",
      label: "2c 3",
      type: "text",
      x: 66,
      y: 89.2,
      w: 13,
      answer: "down",
      compact: true
    }
  ],
  12: [
    ...Array.from({ length: 3 }).map((_, index) => ({
      id: `p12-3a-${index + 1}`,
      label: `3a ${index + 1}`,
      type: "text",
      x: 23,
      y: 10.3 + index * 5.4,
      w: 16,
      answer: "",
      free: true,
      compact: true
    })),
    ...Array.from({ length: 10 }).map((_, index) => ({
      id: `p12-3b-${index + 1}`,
      label: `3b ${index + 1}`,
      type: "text",
      x: 7,
      y: 53.1 + index * 2.9,
      w: 8,
      answer: index === 0 ? "7" : index === 3 ? "1" : "",
      free: index !== 0 && index !== 3,
      compact: true
    })),
    ...Array.from({ length: 3 }).map((_, index) => ({
      id: `p12-4a-${index + 1}`,
      label: `4a ${index + 1}`,
      type: "text",
      x: 62,
      y: 32.3 + index * 5.4,
      w: 16,
      answer: "",
      free: true,
      compact: true
    })),
    {
      id: "p12-booking-day",
      label: "Booking: day",
      type: "text",
      x: 67,
      y: 60.8,
      w: 17,
      answer: "",
      free: true,
      compact: true
    },
    {
      id: "p12-booking-table",
      label: "Booking: table",
      type: "text",
      x: 70,
      y: 65.4,
      w: 18,
      answer: "",
      free: true,
      compact: true
    },
    {
      id: "p12-booking-time",
      label: "Booking: time",
      type: "text",
      x: 67,
      y: 70.1,
      w: 17,
      answer: "",
      free: true,
      compact: true
    }
  ],
  13: [
    {
      id: "p13-1b-2",
      label: "1b 2",
      type: "text",
      x: 27,
      y: 39.1,
      w: 18,
      answer: "the United States|the USA|USA|United States",
      compact: true
    },
    {
      id: "p13-1b-3",
      label: "1b 3",
      type: "text",
      x: 12,
      y: 41.9,
      w: 15,
      answer: "China",
      compact: true
    },
    {
      id: "p13-1b-4",
      label: "1b 4",
      type: "text",
      x: 27,
      y: 41.9,
      w: 18,
      answer: "Switzerland",
      compact: true
    },
    {
      id: "p13-3a-2",
      label: "3a 2",
      type: "text",
      x: 70,
      y: 58.4,
      w: 12,
      answer: "sit",
      compact: true
    },
    {
      id: "p13-3a-3",
      label: "3a 3",
      type: "text",
      x: 47,
      y: 61.3,
      w: 13,
      answer: "Thanks",
      compact: true
    },
    {
      id: "p13-3a-4",
      label: "3a 4",
      type: "text",
      x: 53,
      y: 64.2,
      w: 10,
      answer: "I'm|I am",
      compact: true
    },
    {
      id: "p13-3a-5",
      label: "3a 5",
      type: "text",
      x: 56,
      y: 67,
      w: 15,
      answer: "American",
      compact: true
    },
    {
      id: "p13-3a-6",
      label: "3a 6",
      type: "text",
      x: 55,
      y: 69.9,
      w: 12,
      answer: "aren't|are not",
      compact: true
    },
    {
      id: "p13-3a-7",
      label: "3a 7",
      type: "text",
      x: 56,
      y: 72.8,
      w: 13,
      answer: "English",
      compact: true
    },
    {
      id: "p13-3a-8",
      label: "3a 8",
      type: "text",
      x: 56,
      y: 78.5,
      w: 11,
      answer: "meet",
      compact: true
    },
    {
      id: "p13-3b-youre",
      label: "you are",
      type: "text",
      x: 55,
      y: 88.9,
      w: 12,
      answer: "you're|you are",
      compact: true
    },
    {
      id: "p13-3b-theyre",
      label: "they are",
      type: "text",
      x: 56,
      y: 92.1,
      w: 12,
      answer: "they're|they are",
      compact: true
    },
    {
      id: "p13-3b-you-arent",
      label: "you are not",
      type: "text",
      x: 77,
      y: 88.9,
      w: 13,
      answer: "aren't|are not",
      compact: true
    },
    {
      id: "p13-3b-they-arent",
      label: "they are not",
      type: "text",
      x: 78,
      y: 92.1,
      w: 13,
      answer: "aren't|are not",
      compact: true
    }
  ],
  14: [
    ...Array.from({ length: 5 }).map((_, index) => ({
      id: `p14-4a-${index + 1}`,
      label: `4a ${String.fromCharCode(65 + index)}`,
      type: "text",
      x: index < 2 ? 12 + index * 24 : index === 2 ? 12 : index === 3 ? 12 : 37,
      y: index < 2 ? 34.8 : index === 2 ? 55.2 : 78.2,
      w: 8,
      answer: "",
      free: true,
      compact: true
    })),
    {
      id: "p14-4b-1",
      label: "4b 1",
      type: "text",
      x: 66,
      y: 11.1,
      w: 22,
      answer: "they aren't|they are not",
      compact: true
    },
    {
      id: "p14-4b-2",
      label: "4b 2",
      type: "text",
      x: 62,
      y: 17,
      w: 22,
      answer: "Yes, they are|they are",
      compact: true
    },
    {
      id: "p14-4b-3",
      label: "4b 3",
      type: "text",
      x: 62,
      y: 22.5,
      w: 22,
      answer: "Yes, it is|it is",
      compact: true
    },
    {
      id: "p14-4b-4",
      label: "4b 4",
      type: "text",
      x: 62,
      y: 28.2,
      w: 22,
      answer: "No, she isn't|she isn't|she is not",
      compact: true
    },
    {
      id: "p14-4c-1",
      label: "4c 1",
      type: "text",
      x: 73,
      y: 39.9,
      w: 14,
      answer: "free",
      compact: true
    },
    {
      id: "p14-4c-2",
      label: "4c 2",
      type: "text",
      x: 70,
      y: 43.1,
      w: 16,
      answer: "holiday",
      compact: true
    },
    {
      id: "p14-4c-3",
      label: "4c 3",
      type: "text",
      x: 70,
      y: 46.1,
      w: 16,
      answer: "business",
      compact: true
    },
    {
      id: "p14-4c-4",
      label: "4c 4",
      type: "text",
      x: 69,
      y: 49.2,
      w: 16,
      answer: "that",
      compact: true
    },
    {
      id: "p14-4c-5",
      label: "4c 5",
      type: "text",
      x: 72,
      y: 52.4,
      w: 15,
      answer: "day",
      compact: true
    },
    {
      id: "p14-4c-6",
      label: "4c 6",
      type: "text",
      x: 74,
      y: 55.5,
      w: 15,
      answer: "too",
      compact: true
    },
    ...Array.from({ length: 4 }).map((_, index) => ({
      id: `p14-5a-${index + 1}`,
      label: `5a ${index + 1}`,
      type: "text",
      x: 60,
      y: 79.7 + index * 3.6,
      w: 24,
      answer: "",
      free: true,
      compact: true
    }))
  ],
  15: [
    {
      id: "p15-1a-name",
      label: "1a name",
      type: "text",
      x: 16,
      y: 28.2,
      w: 15,
      answer: "Alex",
      compact: true
    },
    {
      id: "p15-1a-nationality",
      label: "1a nationality",
      type: "text",
      x: 16,
      y: 31.1,
      w: 15,
      answer: "Mexican",
      compact: true
    },
    {
      id: "p15-1a-age",
      label: "1a age",
      type: "text",
      x: 16,
      y: 33.9,
      w: 10,
      answer: "22",
      compact: true
    },
    {
      id: "p15-1b-1",
      label: "1b 1",
      type: "text",
      x: 41,
      y: 58.2,
      w: 16,
      answer: "class",
      compact: true
    },
    {
      id: "p15-1b-2",
      label: "1b 2",
      type: "text",
      x: 18,
      y: 62.4,
      w: 14,
      answer: "What",
      compact: true
    },
    {
      id: "p15-1b-3",
      label: "1b 3",
      type: "text",
      x: 39,
      y: 69.2,
      w: 14,
      answer: "later",
      compact: true
    },
    {
      id: "p15-1b-4",
      label: "1b 4",
      type: "text",
      x: 25,
      y: 72.1,
      w: 14,
      answer: "Where",
      compact: true
    },
    {
      id: "p15-1b-5",
      label: "1b 5",
      type: "text",
      x: 29,
      y: 75,
      w: 14,
      answer: "Germany",
      compact: true
    },
    {
      id: "p15-1b-6",
      label: "1b 6",
      type: "text",
      x: 45,
      y: 81.1,
      w: 16,
      answer: "phone",
      compact: true
    },
    {
      id: "p15-2b-2",
      label: "2b 2",
      type: "text",
      x: 65,
      y: 68.2,
      w: 14,
      answer: "How",
      compact: true
    },
    {
      id: "p15-2b-3",
      label: "2b 3",
      type: "text",
      x: 65,
      y: 72.5,
      w: 14,
      answer: "Who",
      compact: true
    },
    {
      id: "p15-2b-4",
      label: "2b 4",
      type: "text",
      x: 65,
      y: 76.8,
      w: 14,
      answer: "What",
      compact: true
    },
    {
      id: "p15-2b-5",
      label: "2b 5",
      type: "text",
      x: 65,
      y: 81.2,
      w: 14,
      answer: "Where",
      compact: true
    },
    {
      id: "p15-2b-6",
      label: "2b 6",
      type: "text",
      x: 65,
      y: 86,
      w: 14,
      answer: "How",
      compact: true
    },
    {
      id: "p15-2b-7",
      label: "2b 7",
      type: "text",
      x: 65,
      y: 91,
      w: 14,
      answer: "What",
      compact: true
    }
  ],
  16: [
    ...Array.from({ length: 8 }).map((_, index) => ({
      id: `p16-3a-${index + 1}`,
      label: `3a ${index + 1}`,
      type: "text",
      x: 9 + index * 4.1,
      y: 11.8,
      w: 4.1,
      answer: "",
      free: true,
      compact: true
    })),
    ...Array.from({ length: 10 }).map((_, index) => ({
      id: `p16-3e-${index + 1}`,
      label: `3e ${index + 1}`,
      type: "text",
      x: 8 + index * 4.6,
      y: 37.7,
      w: 4.5,
      answer: "",
      free: true,
      compact: true
    })),
    ...["address", "age", "email", "phone"].map((label, index) => ({
      id: `p16-4c-${label}`,
      label: `4c ${index + 1}`,
      type: "text",
      x: index % 2 === 0 ? 8 : 31,
      y: index < 2 ? 72.3 : 75.4,
      w: 17,
      answer: "",
      free: true,
      compact: true
    })),
    ...Array.from({ length: 4 }).map((_, index) => ({
      id: `p16-4d-${index + 1}`,
      label: `4d ${index + 1}`,
      type: "text",
      x: index === 0 ? 13 : index === 1 ? 8 : index === 2 ? 15 : 18,
      y: 83.6 + index * 3.6,
      w: index === 0 ? 20 : 14,
      answer: "",
      free: true,
      compact: true
    })),
    ...Array.from({ length: 8 }).map((_, index) => ({
      id: `p16-6b-${index + 1}`,
      label: `6b ${index + 1}`,
      type: "text",
      x: 61,
      y: 47.8 + index * 3.1,
      w: 18,
      answer: "",
      free: true,
      compact: true
    })),
    {
      id: "p16-6c-1",
      label: "6c 1",
      type: "text",
      x: 73,
      y: 80.7,
      w: 15,
      answer: "south",
      compact: true
    },
    {
      id: "p16-6c-2",
      label: "6c 2",
      type: "text",
      x: 68,
      y: 84.3,
      w: 14,
      answer: "big",
      compact: true
    },
    {
      id: "p16-6c-3",
      label: "6c 3",
      type: "text",
      x: 68,
      y: 88.2,
      w: 14,
      answer: "small",
      compact: true
    },
    {
      id: "p16-6c-4a",
      label: "6c 4",
      type: "text",
      x: 72,
      y: 92.1,
      w: 14,
      answer: "canteen",
      compact: true
    },
    {
      id: "p16-6c-4b",
      label: "6c 4",
      type: "text",
      x: 71,
      y: 95,
      w: 18,
      answer: "computer room",
      compact: true
    },
    {
      id: "p16-6c-5a",
      label: "6c 5",
      type: "text",
      x: 75,
      y: 98.1,
      w: 14,
      answer: "bedrooms",
      compact: true
    },
    {
      id: "p16-6c-5b",
      label: "6c 5",
      type: "text",
      x: 61,
      y: 99.4,
      w: 12,
      answer: "kitchen",
      compact: true
    },
    {
      id: "p16-6c-5c",
      label: "6c 5",
      type: "text",
      x: 77,
      y: 99.4,
      w: 12,
      answer: "garden",
      compact: true
    }
  ],
  17: [
    ...[
      ["1", "Are"],
      ["2", "I'm not|I am not"],
      ["3", "You're|You are"],
      ["4", "Where are you"],
      ["5", "It's|It is"],
      ["6", "he isn't|he is not"],
      ["7", "Is she"],
      ["8", "aren't|are not"],
      ["9", "we're|we are"],
      ["10", "They're|They are"],
      ["11", "Are"],
      ["12", "are you"],
      ["13", "How"],
      ["14", "What's your|What is your"],
      ["15", "do you spell"]
    ].map(([label, answer], index) => ({
      id: `p17-grammar-${label}`,
      label: `Grammar ${label}`,
      type: "text",
      x: 8,
      y: 22.7 + index * 4.85,
      w: label === "4" || label === "14" || label === "15" ? 20 : 14,
      answer,
      compact: true
    })),
    ...[
      ["1", "Turkish", 65, 25.2],
      ["2", "Switzerland", 48, 28.8],
      ["3", "American", 66, 32.5],
      ["4", "England", 48, 36.2],
      ["5", "Egypt", 48, 39.8],
      ["6", "Japanese", 66, 43.3]
    ].map(([label, answer, x, y]) => ({
      id: `p17-vocab-a-${label}`,
      label: `Vocab a ${label}`,
      type: "text",
      x,
      y,
      w: 15,
      answer,
      compact: true
    })),
    ...[
      ["1", "two"],
      ["2", "seven"],
      ["3", "thirteen"],
      ["4", "twenty-one|twenty one|21"],
      ["5", "Thursday"],
      ["6", "Sunday"]
    ].map(([label, answer], index) => ({
      id: `p17-vocab-b-${label}`,
      label: `Vocab b ${label}`,
      type: "text",
      x: 62,
      y: 52.7 + index * 3.4,
      w: 16,
      answer,
      compact: true
    })),
    ...[
      ["1-open", "Open", 62, 68.8],
      ["2-sorry", "Sorry", 51, 73.2],
      ["2-down", "down", 59, 75.8],
      ["3-know", "know", 61, 80.4],
      ["4-me", "me", 54, 84.8],
      ["4-whats", "what's|what is", 65, 84.8],
      ["4-repeat", "repeat", 57, 90.2],
      ["5-number", "number", 67, 94.7],
      ["5-email", "email", 68, 98.1]
    ].map(([label, answer, x, y]) => ({
      id: `p17-vocab-c-${label}`,
      label: `Vocab c ${label}`,
      type: "text",
      x,
      y,
      w: 14,
      answer,
      compact: true
    })),
    ...[
      ["1", "chair"],
      ["2", "door"],
      ["3", "pen"],
      ["4", "board|whiteboard"]
    ].map(([label, answer], index) => ({
      id: `p17-vocab-d-${label}`,
      label: `Vocab d ${label}`,
      type: "text",
      x: 48 + index * 12,
      y: 97.1,
      w: 12,
      answer,
      compact: true
    }))
  ],
  18: [
    ...[
      ["1", "tree"],
      ["2", "phone"],
      ["3", "fish"],
      ["4", "shower"],
      ["5", "house"]
    ].map(([label, answer], index) => ({
      id: `p18-pron-a-${label}`,
      label: `Pron a ${label}`,
      type: "text",
      x: index < 2 ? 18 : 38,
      y: index < 2 ? 16.5 + index * 5.8 : 11.6 + (index - 2) * 5.8,
      w: 16,
      answer,
      compact: true
    })),
    ...[
      ["1", "Chinese"],
      ["2", "fifty"],
      ["3", "fifteen"],
      ["4", "tomorrow"],
      ["5", "German"]
    ].map(([label, answer], index) => ({
      id: `p18-pron-c-${label}`,
      label: `Stress ${label}`,
      type: "text",
      x: index < 2 ? 12 : 34,
      y: index < 2 ? 38.6 + index * 2.5 : 37.1 + (index - 2) * 2.5,
      w: 15,
      answer,
      free: true,
      compact: true
    })),
    ...[
      ["mark-surname", "Davis", 17, 84.4],
      ["mark-nationality", "American", 17, 90.8],
      ["mark-marital", "single", 17, 94.2],
      ["mark-job", "teacher", 17, 97.5],
      ["bianca-surname", "Costa", 27, 84.4],
      ["bianca-age", "20|twenty", 27, 87.6],
      ["bianca-nationality", "Brazilian", 27, 90.8],
      ["bianca-job", "student", 27, 97.5],
      ["jacek-surname", "Popko", 38, 84.4],
      ["jacek-age", "40|forty", 38, 87.6],
      ["jacek-nationality", "Polish", 38, 90.8],
      ["jacek-marital", "married", 38, 94.2]
    ].map(([label, answer, x, y]) => ({
      id: `p18-text-${label}`,
      label: `Text ${label}`,
      type: "text",
      x,
      y,
      w: 10,
      answer,
      compact: true
    })),
    ...Array.from({ length: 5 }).map((_, index) => ({
      id: `p18-video-${index + 1}`,
      label: `Video ${index + 1}`,
      type: "text",
      x: 73,
      y: 21.4 + index * 6.2,
      w: 18,
      answer: "",
      free: true,
      compact: true
    })),
    ...Array.from({ length: 9 }).map((_, index) => ({
      id: `p18-can-${index + 1}`,
      label: `Can ${index + 1}`,
      type: "checkbox",
      x: 87.5,
      y: 65.5 + index * 3.1,
      w: 8,
      answer: "",
      free: true,
      compact: true
    }))
  ],
  19: [
    ...[
      ["1", "book", 12.8, 31.3],
      ["2", "laptop", 34.2, 31.4],
      ["3", "phone", 13.6, 54.8],
      ["4", "photo", 35.3, 54.2]
    ].map(([label, answer, x, y]) => ({
      id: `p19-vocab-a-${label}`,
      label: `1a ${label}`,
      type: "text",
      x,
      y,
      w: 11,
      answer,
      compact: true
    })),
    ...Array.from({ length: 8 }).map((_, index) => ({
      id: `p19-top-four-${index + 1}`,
      label: `${index + 1}`,
      type: "checkbox",
      x: 8.3,
      y: 81 + index * 2.45,
      w: 5,
      answer: "",
      free: true,
      compact: true
    })),
    ...[
      ["2-single", "laptop", 68.1, 38.6],
      ["3-single", "umbrella", 81.9, 38.6],
      ["1-plural", "pencils", 53.8, 49.8],
      ["2-plural", "laptops", 67.9, 49.8],
      ["3-plural", "umbrellas", 81.5, 49.8]
    ].map(([label, answer, x, y]) => ({
      id: `p19-chart-${label}`,
      label: "2c",
      type: "text",
      x,
      y,
      w: 11,
      answer,
      compact: true
    }))
  ],
  20: [
    ...[
      ["A", 44.4, 5.3],
      ["B", 62.4, 5.3],
      ["C", 80.3, 5.3],
      ["D", 44.4, 16.1],
      ["E", 80.4, 16.1]
    ].map(([label, x, y]) => ({
      id: `p20-listening-photo-${label}`,
      label,
      type: "text",
      x,
      y,
      w: 4.5,
      answer: "",
      free: true,
      compact: true
    })),
    ...Array.from({ length: 5 }).map((_, index) => ({
      id: `p20-listening-thing-${index + 1}`,
      label: `4b ${index + 1}`,
      type: "text",
      x: 10.8,
      y: 16.6 + index * 1.95,
      w: 12,
      answer: "",
      free: true,
      compact: true
    })),
    ...Array.from({ length: 12 }).map((_, index) => ({
      id: `p20-bag-${index + 1}`,
      label: `${index + 1}`,
      type: "checkbox",
      x: 9.1,
      y: 52.3 + index * 2.08,
      w: 5,
      answer: "",
      free: true,
      compact: true
    })),
    ...[
      ["1", 42.2, 48.4],
      ["2", 60.3, 48.4],
      ["3", 78.4, 48.4],
      ["4", 42.2, 65.1],
      ["5", 60.3, 65.1],
      ["6", 78.4, 65.1],
      ["7", 42.2, 81.9],
      ["8", 60.3, 81.9],
      ["9", 78.4, 81.9],
      ["10", 42.2, 94.4],
      ["11", 60.3, 94.4],
      ["12", 78.4, 94.4]
    ].map(([label, x, y]) => ({
      id: `p20-photo-label-${label}`,
      label: `5a ${label}`,
      type: "text",
      x,
      y,
      w: 12,
      answer: "",
      free: true,
      compact: true
    })),
    {
      id: "p20-speaking-c",
      label: "5c",
      type: "textarea",
      x: 9.2,
      y: 79.4,
      w: 24,
      answer: "",
      free: true,
      compact: true
    }
  ],
  21: [
    ...[
      ["1", "cap|a cap", 15.4, 52.7],
      ["2", "key rings|key ring|a key ring", 21.7, 70.3],
      ["3", "plate|a plate", 31.8, 80.2],
      ["4", "teddy|a teddy", 37.3, 59.8],
      ["5", "mugs|mug|a mug", 42.6, 70.5],
      ["6", "football scarf|a football scarf", 58.8, 79.4],
      ["7", "T-shirt|a T-shirt|t-shirt|a t-shirt", 86.3, 56.3],
      ["8", "football shirt|a football shirt", 87.3, 79.4]
    ].map(([label, answer, x, y]) => ({
      id: `p21-stall-${label}`,
      label: `1b ${label}`,
      type: "text",
      x,
      y,
      w: 13,
      answer,
      compact: true
    })),
    {
      id: "p21-country-souvenirs",
      label: "1c",
      type: "textarea",
      x: 62.4,
      y: 44.9,
      w: 24,
      answer: "",
      free: true,
      compact: true
    }
  ],
  22: [
    ...[
      ["1", 28.7, 31.1],
      ["2", 28.7, 45.8],
      ["3", 28.7, 50.6],
      ["4", 29.2, 65.2]
    ].map(([label, x, y]) => ({
      id: `p22-listening-price-${label}`,
      label: `2a ${label}`,
      type: "text",
      x,
      y,
      w: 13,
      answer: "",
      free: true,
      compact: true
    })),
    {
      id: "p22-woman-buys",
      label: "2c",
      type: "text",
      x: 24.2,
      y: 79.7,
      w: 22,
      answer: "",
      free: true,
      compact: true
    },
    ...[
      ["singular-there", "that", 79.4, 25.1],
      ["plural-here", "these", 65.3, 28.5],
      ["plural-there", "those", 79.4, 28.5]
    ].map(([label, answer, x, y]) => ({
      id: `p22-grammar-${label}`,
      label: "3a",
      type: "text",
      x,
      y,
      w: 11,
      answer,
      compact: true
    })),
    ...[
      ["1-thing", 70.5, 53.4, 13],
      ["1-price", 61.2, 56.2, 13],
      ["2-thing", 70.2, 59.3, 13],
      ["2-price", 61.2, 62.1, 13],
      ["3-thing", 72.1, 65.3, 13],
      ["3-price", 61.2, 68.2, 13],
      ["4-thing", 72.1, 71.4, 13],
      ["4-price", 61.2, 74.3, 13],
      ["5-thing", 61.7, 77.4, 13],
      ["5-price", 61.2, 80.3, 13]
    ].map(([label, x, y, w]) => ({
      id: `p22-pron-b-${label}`,
      label: "4b",
      type: "text",
      x,
      y,
      w,
      answer: "",
      free: true,
      compact: true
    }))
  ],
  23: [
    ...[
      ["2", "D", 11.3, 59.6],
      ["3", "F", 11.3, 61.8],
      ["4", "C", 11.3, 64.1],
      ["5", "A", 11.3, 66.3],
      ["6", "G", 11.3, 68.5],
      ["7", "J", 11.3, 70.8],
      ["8", "I", 11.3, 73.1],
      ["9", "E", 11.3, 75.3],
      ["10", "B", 11.3, 77.6]
    ].map(([label, answer, x, y]) => ({
      id: `p23-prices-match-${label}`,
      label: `1b ${label}`,
      type: "text",
      x,
      y,
      w: 3.2,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["newspaper", "$2.50", "$2.15", 24.7, 87.6],
      ["umbrella", "€15", "€50", 24.7, 89.6],
      ["memory-card", "$4.99", "$9.49", 24.7, 91.7],
      ["train-ticket", "£13.20", "£30.20", 24.7, 92.8]
    ].map(([label, first, second, x, y], index) => ({
      id: `p23-audio-price-${label}`,
      label: `1e ${index + 1}`,
      type: "select",
      options: [first, second],
      x,
      y,
      w: 13,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  24: [
    {
      id: "p24-rob-orders",
      label: "3c",
      type: "text",
      x: 9.2,
      y: 40.9,
      w: 25,
      answer: "",
      free: true,
      compact: true
    },
    ...[
      ["1", "cheese", 28.8, 51.7, 8.5],
      ["2", "Coke|coke", 26.2, 55.5, 8.5],
      ["3", "No|no", 16.8, 59.1, 8.5],
      ["4", "six pounds seventy-five|£6.75|6.75|six seventy-five", 16.9, 67.0, 12],
      ["5", "are", 20.8, 70.5, 7]
    ].map(([label, answer, x, y, w]) => ({
      id: `p24-dialogue-${label}`,
      label: `3d ${label}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p24-jenny-lunch-price",
      label: "3g",
      type: "text",
      x: 74.8,
      y: 31.8,
      w: 14,
      answer: "",
      free: true,
      compact: true
    },
    ...[
      ["jenny", 66.2, 65.1],
      ["amy", 66.2, 68.9]
    ].map(([label, x, y]) => ({
      id: `p24-deli-chart-${label}`,
      label: `3h ${label}`,
      type: "text",
      x,
      y,
      w: 22,
      answer: "",
      free: true,
      compact: true
    }))
  ],
  25: [
    ...[
      ["boy", "4", 10.3, 23.2],
      ["girl", "3", 18.2, 23.2],
      ["man", "1", 27.4, 23.2],
      ["woman", "2", 36.6, 23.2]
    ].map(([label, answer, x, y]) => ({
      id: `p25-vocab-${label}`,
      label: `1a ${label}`,
      type: "text",
      x,
      y,
      w: 3.2,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p25-sarah-role",
      label: "3a",
      type: "select",
      options: ["a", "b"],
      x: 83.2,
      y: 23.2,
      w: 5,
      answer: "b",
      compact: true,
      mini: true
    },
    ...[
      ["you", "your number", 64.7, 41.6],
      ["he", "his name", 64.7, 43.7],
      ["she", "her name", 64.7, 45.9],
      ["it", "its name", 64.7, 48.1],
      ["you-plural", "your babysitter", 64.7, 52.4],
      ["they", "their names", 64.7, 54.6]
    ].map(([label, answer, x, y]) => ({
      id: `p25-grammar-${label}`,
      label: `3c ${label}`,
      type: "text",
      x,
      y,
      w: 15,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["restaurant", "Mario's|Marios", 73.2, 59.3, 12],
      ["phone", "husband's|husbands", 57.4, 61.7, 11]
    ].map(([label, answer, x, y, w]) => ({
      id: `p25-sentence-${label}`,
      label: "3d",
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p25-good-babysitter",
      label: "3e",
      type: "text",
      x: 79.8,
      y: 65.4,
      w: 13,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }
  ],
  26: [
    ...[
      ["2-name", 64.4, 54.3, 10],
      ["2-relation", 76.1, 54.3, 14],
      ["3-name", 64.4, 56.3, 10],
      ["3-relation", 76.1, 56.3, 14],
      ["4-name", 64.4, 58.4, 10],
      ["4-relation", 76.1, 58.4, 14],
      ["5-name", 64.4, 60.4, 10],
      ["5-relation", 76.1, 60.4, 14]
    ].map(([label, x, y, w]) => ({
      id: `p26-card-${label}`,
      label: `4a ${label}`,
      type: "text",
      x,
      y,
      w,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    ...[
      ["paul-nicole-age", 61.8, 66.1],
      ["sally-max", 61.8, 68.4]
    ].map(([label, x, y]) => ({
      id: `p26-listening-${label}`,
      label: "4b",
      type: "text",
      x,
      y,
      w: 27,
      answer: "",
      free: true,
      compact: true
    })),
    {
      id: "p26-family-writing",
      label: "5b",
      type: "text",
      x: 61.7,
      y: 80.2,
      w: 29,
      answer: "",
      free: true,
      compact: true
    }
  ],
  27: [
    ...[
      ["1", "Jaguar", 31.4, 45.1],
      ["2", "Chevrolet", 17.6, 45.1],
      ["3", "Mercedes", 26.4, 45.1],
      ["4", "Peugeot", 42.7, 45.1],
      ["5", "Ferrari", 28.4, 48.2],
      ["6", "Honda", 19.6, 48.2]
    ].map(([label, answer, x, y]) => ({
      id: `p27-logo-${label}`,
      label: `1a ${label}`,
      type: "text",
      x,
      y,
      w: 11,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p27-perfect-opinion",
      label: "1c",
      type: "select",
      options: ["a", "b"],
      x: 8.9,
      y: 61.5,
      w: 5,
      answer: "a",
      compact: true,
      mini: true
    },
    ...[
      ["blue-1", "blue", 28.8, 84.8],
      ["blue-2", "small", 28.8, 87.5],
      ["blue-3", "easy", 28.8, 90.2],
      ["blue-4", "slow", 28.8, 92.8],
      ["red-1", "red", 8.3, 84.8],
      ["red-2", "fast", 8.3, 87.5],
      ["red-3", "expensive", 8.3, 90.2],
      ["red-4", "beautiful", 8.3, 92.8]
    ].map(([label, answer, x, y]) => ({
      id: `p27-car-word-${label}`,
      label: "1d",
      type: "text",
      x,
      y,
      w: 11,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p27-your-car",
      label: "1g",
      type: "text",
      x: 69.2,
      y: 57.9,
      w: 24,
      answer: "",
      free: true,
      compact: true
    }
  ],
  28: [
    ...[
      ["1", "a", 8.7, 10.5],
      ["2", "b", 8.7, 14.2]
    ].map(([label, answer, x, y]) => ({
      id: `p28-grammar-${label}`,
      label: `2a ${label}`,
      type: "select",
      options: ["a", "b"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 5 }).map((_, index) => ({
      id: `p28-pron-phrase-${index + 1}`,
      label: `3c ${index + 1}`,
      type: "text",
      x: 10.4,
      y: 55.8 + index * 2.1,
      w: 22,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    {
      id: "p28-favourite-car",
      label: "5a",
      type: "text",
      x: 22.4,
      y: 72.2,
      w: 20,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    ...Array.from({ length: 8 }).map((_, index) => ({
      id: `p28-video-tf-${index + 1}`,
      label: `5b ${index + 1}`,
      type: "select",
      options: ["T", "F"],
      x: 9.3,
      y: 76.5 + index * 1.9,
      w: 5,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    {
      id: "p28-museum-opinion",
      label: "5c",
      type: "text",
      x: 17.5,
      y: 91.8,
      w: 23,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }
  ],
  29: [
    ...[
      ["1", "a", 11.6],
      ["2", "b", 15.0],
      ["3", "b", 18.4],
      ["4", "b", 22.0],
      ["5", "a", 26.1],
      ["6", "a", 29.9],
      ["7", "b", 33.7],
      ["8", "b", 37.8],
      ["9", "a", 41.5],
      ["10", "a", 45.6],
      ["11", "b", 49.7],
      ["12", "b", 53.8],
      ["13", "a", 58.0],
      ["14", "b", 62.0],
      ["15", "a", 66.0]
    ].map(([label, answer, y]) => ({
      id: `p29-grammar-${label}`,
      label: `Grammar ${label}`,
      type: "select",
      options: ["a", "b"],
      x: 10.9,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "a credit card|credit card", 26.3, 87.8],
      ["2", "a teddy|teddy", 38.8, 87.8],
      ["3", "an umbrella|umbrella", 9.8, 95.3],
      ["4", "a key|key", 25.7, 95.3],
      ["5", "a cap|cap", 38.5, 95.3]
    ].map(([label, answer, x, y]) => ({
      id: `p29-vocab-a-${label}`,
      label: `Vocab a ${label}`,
      type: "text",
      x,
      y,
      w: 12,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "mother", 61.5, 20.9],
      ["2", "husband", 66.9, 18.5],
      ["3", "daughter", 74.1, 20.9],
      ["4", "brother", 80.0, 18.5],
      ["5", "girlfriend", 87.9, 20.9]
    ].map(([label, answer, x, y]) => ({
      id: `p29-vocab-chart-${label}`,
      label: `Vocab b ${label}`,
      type: "text",
      x,
      y,
      w: 10,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "women", 65.8, 29.0],
      ["2", "children", 65.8, 31.1],
      ["3", "men", 65.8, 33.2],
      ["4", "people", 65.8, 35.4]
    ].map(([label, answer, x, y]) => ({
      id: `p29-plural-${label}`,
      label: `Plural ${label}`,
      type: "text",
      x,
      y,
      w: 12,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "blue", 61.4, 42.3],
      ["2", "green", 61.4, 44.4],
      ["3", "red", 61.4, 46.6],
      ["4", "yellow", 80.0, 42.3],
      ["5", "black", 80.0, 44.4],
      ["6", "pink", 80.0, 46.6]
    ].map(([label, answer, x, y]) => ({
      id: `p29-colour-${label}`,
      label: `Colour ${label}`,
      type: "text",
      x,
      y,
      w: 10,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "small", 65.8, 53.0],
      ["2", "cheap", 65.8, 55.3],
      ["3", "short", 83.6, 50.7],
      ["4", "old", 83.6, 53.0],
      ["5", "beautiful", 83.6, 55.3]
    ].map(([label, answer, x, y]) => ({
      id: `p29-opposite-${label}`,
      label: `Opposite ${label}`,
      type: "text",
      x,
      y,
      w: 11,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "computer", 57.0, 70.1],
      ["2", "up", 57.0, 77.3],
      ["3", "horse", 78.4, 63.2],
      ["4", "car", 78.4, 70.1],
      ["5", "cat", 78.4, 77.3]
    ].map(([label, answer, x, y]) => ({
      id: `p29-pron-sound-${label}`,
      label: `Pron ${label}`,
      type: "text",
      x,
      y,
      w: 13,
      answer,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 5 }).map((_, index) => ({
      id: `p29-stress-${index + 1}`,
      label: `Stress ${index + 1}`,
      type: "text",
      x: 57 + (index % 2) * 20,
      y: 90.1 + Math.floor(index / 2) * 2.2,
      w: 12,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  30: [
    ...[
      ["jeremy-1", "Jeremy", 11.1, 17.6],
      ["jeremy-2", "Anna", 21.4, 21.0],
      ["jeremy-3", "Matthew", 27.0, 17.6],
      ["jeremy-4", "Susanna", 37.3, 21.0],
      ["claire-1", "Louise", 10.8, 50.8],
      ["claire-2", "Claire", 25.5, 50.8],
      ["claire-3", "Anne", 39.7, 50.8]
    ].map(([label, answer, x, y]) => ({
      id: `p30-name-${label}`,
      label: `Text a ${label}`,
      type: "text",
      x,
      y,
      w: 12,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "Fisher", 12.8, 72.5],
      ["2", "Liverpool|the UK|Liverpool in the UK", 12.8, 77.2],
      ["3", "Matthew", 12.8, 82.0],
      ["4", "19|nineteen", 12.8, 86.7],
      ["5", "French", 12.8, 91.4],
      ["6", "Claire's sister|Claires sister|Anne is Claire's sister", 12.8, 96.0],
      ["7", "No, she isn't|No|No she isn't", 33.8, 72.5],
      ["8", "31|thirty-one|thirty one", 33.8, 77.2]
    ].map(([label, answer, x, y]) => ({
      id: `p30-question-${label}`,
      label: `Text b ${label}`,
      type: "text",
      x,
      y,
      w: 22,
      answer,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 5 }).map((_, index) => ({
      id: `p30-people-${index + 1}`,
      label: `People ${index + 1}`,
      type: "select",
      options: ["a", "b", "c"],
      x: 57.1,
      y: 23.4 + index * 7.0,
      w: 5,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 7 }).map((_, index) => ({
      id: `p30-can-${index + 1}`,
      label: `Can ${index + 1}`,
      type: "checkbox",
      x: 91.6,
      y: 65.1 + index * 2.6,
      w: 5,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  31: [
    ...[
      ["1-letter", "D", 11.5, 40.4, 4],
      ["1-word", "tea", 13.2, 42.3, 12],
      ["2-letter", "E", 11.5, 47.4, 4],
      ["2-word", "cheese", 13.2, 49.3, 12],
      ["3-letter", "A", 11.5, 54.6, 4],
      ["3-word", "orange juice", 13.2, 56.5, 16],
      ["4-letter", "B", 11.5, 61.8, 4],
      ["4-word", "sandwich", 13.2, 63.7, 14],
      ["5-letter", "C", 11.5, 68.8, 4],
      ["5-word", "eggs", 13.2, 70.7, 12]
    ].map(([label, answer, x, y, w]) => ({
      id: `p31-vocab-${label}`,
      label: `1a ${label}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["important", "Marta, Paulo, Sakura|Marta Paulo Sakura|Marta, Sakura, Paulo", 9.2, 77.2],
      ["not-important", "Rob", 9.2, 79.5]
    ].map(([label, answer, x, y]) => ({
      id: `p31-reading-${label}`,
      label: "2a",
      type: "text",
      x,
      y,
      w: 21,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["2", "milk", 57.0, 48.0],
      ["3", "fruit", 55.6, 62.8],
      ["4", "yogurt|yoghurt", 57.2, 65.1],
      ["5", "coffee", 56.6, 78.2],
      ["6", "rice", 54.5, 93.8],
      ["7", "fish", 64.2, 93.8]
    ].map(([label, answer, x, y]) => ({
      id: `p31-comment-${label}`,
      label: `2b ${label}`,
      type: "text",
      x,
      y,
      w: 11,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["marta", "cafe|a cafe|office cafe", 73.8, 45.5],
      ["paulo", "home", 73.8, 59.9],
      ["rob", "work", 73.8, 76.2],
      ["sakura", "home", 73.8, 92.5]
    ].map(([label, answer, x, y]) => ({
      id: `p31-place-${label}`,
      label: `2c ${label}`,
      type: "text",
      x,
      y,
      w: 12,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p31-your-breakfast",
      label: "2d",
      type: "text",
      x: 9.2,
      y: 92.8,
      w: 26,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }
  ],
  32: [
    ...[
      ["1", "have", 15.0, 17.7],
      ["2", "like", 19.5, 22.0],
      ["3", "have", 17.2, 24.1],
      ["4a", "don't", 15.0, 28.9],
      ["4b", "have", 25.2, 28.9],
      ["5a", "don't", 15.0, 33.3],
      ["5b", "eat", 25.2, 33.3],
      ["6a", "don't", 17.2, 37.7],
      ["6b", "drink", 27.5, 37.7]
    ].map(([label, answer, x, y]) => ({
      id: `p32-grammar-${label}`,
      label: `3a ${label}`,
      type: "text",
      x,
      y,
      w: 9,
      answer,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 9 }).map((_, index) => ({
      id: `p32-listening-${index + 1}`,
      label: `4a ${index + 1}`,
      type: "text",
      x: [15.2, 15.2, 15.2, 27.4, 28.8, 27.8, 40.2, 40.2, 40.2][index],
      y: [65.4, 74.6, 87.9, 65.4, 75.8, 88.2, 65.4, 75.7, 88.2][index],
      w: [14, 14, 11, 13, 12, 11, 12, 13, 12][index],
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    ...[
      ["you-where", 71.5, 52.6, 20],
      ["you-breakfast", 67.8, 55.1, 22],
      ["you-lunch", 67.8, 57.5, 22],
      ["you-dinner", 72.1, 59.8, 18],
      ["you-eat", 67.8, 62.4, 22],
      ["you-love", 63.5, 64.9, 26],
      ["you-dont-like", 67.8, 67.4, 22],
      ["country-breakfast", 72.0, 71.6, 15],
      ["country-meal", 74.5, 74.0, 15],
      ["country-eat", 72.8, 76.4, 12],
      ["country-food", 70.4, 79.0, 20],
      ["country-drink", 70.4, 81.6, 20]
    ].map(([label, x, y, w]) => ({
      id: `p32-speaking-${label}`,
      label: "6a",
      type: "text",
      x,
      y,
      w,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    {
      id: "p32-writing",
      label: "7",
      type: "text",
      x: 58.2,
      y: 91.8,
      w: 29,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }
  ],
  33: [
    ...[
      ["A", "3", 55.5, 15.0],
      ["B", "1", 55.5, 36.5],
      ["C", "4", 55.5, 57.0],
      ["D", "2", 55.5, 79.3]
    ].map(([label, answer, x, y]) => ({
      id: `p33-picture-${label}`,
      label: `1a ${label}`,
      type: "text",
      x,
      y,
      w: 4,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "book", 35.4, 30.0],
      ["2", "New York", 35.8, 36.8],
      ["3", "children", 35.8, 41.3],
      ["4", "meat", 35.8, 54.6],
      ["5", "pasta", 35.8, 66.3],
      ["6", "time", 35.8, 74.9]
    ].map(([label, answer, x, y]) => ({
      id: `p33-dialogue-${label}`,
      label: `1b ${label}`,
      type: "text",
      x,
      y,
      w: 12,
      answer,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 6 }).map((_, index) => ({
      id: `p33-underlined-${index + 1}`,
      label: `1d ${index + 1}`,
      type: "text",
      x: 13 + (index % 2) * 21,
      y: 89.6 + Math.floor(index / 2) * 1.9,
      w: 18,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  34: [
    ...[
      ["2", "a", 16.2],
      ["3", "c", 18.2],
      ["4", "e", 20.2],
      ["5", "b", 22.2]
    ].map(([label, answer, y]) => ({
      id: `p34-verb-match-${label}`,
      label: `2a ${label}`,
      type: "text",
      x: 16.0,
      y,
      w: 4,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p34-your-sentences",
      label: "2c",
      type: "text",
      x: 9.2,
      y: 32.4,
      w: 30,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    ...Array.from({ length: 10 }).map((_, index) => ({
      id: `p34-taxi-${index + 1}`,
      label: `3a ${index + 1}`,
      type: "select",
      options: ["a", "b"],
      x: 9.2,
      y: 61.9 + index * 2.8,
      w: 5,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    {
      id: "p34-surprise",
      label: "3b",
      type: "text",
      x: 9.2,
      y: 93.7,
      w: 30,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    ...Array.from({ length: 5 }).map((_, index) => ({
      id: `p34-pron-d-${index + 1}`,
      label: `4d ${index + 1}`,
      type: "text",
      x: 56.8,
      y: 45.4 + index * 2.5,
      w: 23,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    ...[
      ["2", "have", 57.0, 61.0],
      ["3", "watch", 57.0, 63.3],
      ["4", "listen", 57.0, 65.6],
      ["5", "read", 57.0, 67.9],
      ["6", "eat", 57.0, 70.2],
      ["7", "drink", 57.0, 72.5],
      ["8", "speak", 57.0, 74.8],
      ["9", "need", 57.0, 77.1],
      ["10", "go", 57.0, 79.4]
    ].map(([label, answer, x, y]) => ({
      id: `p34-do-you-${label}`,
      label: `4e ${label}`,
      type: "text",
      x,
      y,
      w: 9,
      answer,
      compact: true,
      mini: true
    }))
  ],
  35: [
    ...[
      ["A", "1", 24.8, 37.3],
      ["B", "3", 45.2, 45.1],
      ["C", "2", 29.6, 56.9]
    ].map(([photo, answer, x, y]) => ({
      id: `p35-photo-${photo}`,
      label: `1a ${photo}`,
      type: "text",
      x,
      y,
      w: 4,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      [1, 55.0, 74.4],
      [2, 70.6, 74.4],
      [3, 85.5, 74.4],
      [4, 55.0, 83.8],
      [5, 70.6, 83.8],
      [6, 85.5, 83.8]
    ].map(([number, x, y]) => ({
      id: `p35-draw-time-${number}`,
      label: `2c ${number}`,
      type: "text",
      x,
      y,
      w: 10,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  36: [
    ...[
      ["a", "3", 11.2, 81.1],
      ["b", "1", 11.2, 83.2],
      ["c", "2", 11.2, 85.4],
      ["d", "5", 11.2, 87.5],
      ["e", "4", 11.2, 89.7]
    ].map(([letter, answer, x, y]) => ({
      id: `p36-feel-${letter}`,
      label: `4b ${letter}`,
      type: "text",
      x,
      y,
      w: 4,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["bar", 55.4, 53.1],
      ["cafe", 55.4, 55.2],
      ["theatre", 55.4, 57.3],
      ["cinema", 55.4, 59.4],
      ["restaurant", 55.4, 61.5]
    ].map(([place, x, y]) => ({
      id: `p36-place-${place}`,
      label: `5a ${place}`,
      type: "checkbox",
      x,
      y,
      w: 3,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    ...[
      [1, 74.0, 68.8],
      [2, 75.6, 71.9],
      [3, 74.0, 75.0]
    ].map(([number, x, y]) => ({
      id: `p36-night-time-${number}`,
      label: `5b ${number}`,
      type: "text",
      x,
      y,
      w: 17,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  37: [
    ...[
      ["1a-1-job", "taxi", 16.6, 34.8, 8],
      ["1a-1-place", "driver", 27.2, 34.8, 10],
      ["1a-2", "teacher", 16.7, 36.7, 11],
      ["1a-3", "receptionist", 16.7, 38.6, 14]
    ].map(([id, answer, x, y, w]) => ({
      id: `p37-job-${id}`,
      label: `1a ${id}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p37-reunion-reason",
      label: "2a",
      type: "text",
      x: 9.2,
      y: 58.9,
      w: 27,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    ...[
      ["1", "T", 63.9],
      ["2", "F", 65.8],
      ["3", "T", 67.7],
      ["4", "F", 69.6],
      ["5", "F", 71.5]
    ].map(([number, answer, y]) => ({
      id: `p37-tf-${number}`,
      label: `2b ${number}`,
      type: "select",
      options: ["T", "F"],
      x: 7.0,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["works", "works", 25.7, 87.6, 10],
      ["doesnt-wear", "doesn't wear|does not wear", 24.7, 91.1, 13],
      ["does", "does", 24.7, 94.6, 8]
    ].map(([id, answer, x, y, w]) => ({
      id: `p37-chart-${id}`,
      label: `2d ${id}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    }))
  ],
  38: [
    ...[
      ["finishes", 14.0],
      ["teaches", 39.2],
      ["watches", 47.2]
    ].map(([word, x]) => ({
      id: `p38-es-${word}`,
      label: `3a ${word}`,
      type: "checkbox",
      x,
      y: 11.4,
      w: 3,
      answer: "true",
      compact: true,
      mini: true
    })),
    {
      id: "p38-change-sentences",
      label: "3b",
      type: "text",
      x: 11.5,
      y: 19.0,
      w: 29,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    ...[
      ["antonio", "waiter", 20.4, 52.4, 13],
      ["charlotte", "receptionist", 23.4, 64.2, 15]
    ].map(([name, answer, x, y, w]) => ({
      id: `p38-reading-${name}`,
      label: `4b ${name}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 5 }).map((_, index) => ({
      id: `p38-reading-question-${index + 1}`,
      label: `4d ${index + 1}`,
      type: "text",
      x: 35.2,
      y: 78.7 + index * 2.35,
      w: 19,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 2 }).map((_, index) => ({
      id: `p38-speaking-person-${index + 1}`,
      label: `5c ${index + 1}`,
      type: "text",
      x: 62.0,
      y: 67.8 + index * 3.2,
      w: 29,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    {
      id: "p38-writing",
      label: "6",
      type: "textarea",
      x: 62.0,
      y: 79.2,
      w: 31,
      answer: "",
      free: true,
      compact: true
    }
  ],
  39: [
    {
      id: "p39-hannah-likes-mornings",
      label: "1b",
      type: "text",
      x: 9.0,
      y: 24.8,
      w: 30,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    ...Array.from({ length: 8 }).map((_, index) => ({
      id: `p39-morning-answer-${index + 1}`,
      label: `1c ${index + 1}`,
      type: "text",
      x: 56.5,
      y: 25.8 + index * 5.4,
      w: 37,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 5 }).map((_, index) => ({
      id: `p39-typical-day-${index + 1}`,
      label: `2b ${index + 1}`,
      type: "text",
      x: 9.2 + (index % 2) * 20.5,
      y: 82.5 + Math.floor(index / 2) * 3.0,
      w: 18,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    ...[
      ["2", "d", 83.0],
      ["3", "a", 85.4],
      ["4", "b", 87.8]
    ].map(([number, answer, y]) => ({
      id: `p39-frequency-${number}`,
      label: `3a ${number}`,
      type: "text",
      x: 72.0,
      y,
      w: 4,
      answer,
      compact: true,
      mini: true
    }))
  ],
  40: [
    ...Array.from({ length: 8 }).map((_, index) => ({
      id: `p40-true-sentence-${index + 1}`,
      label: `4d ${index + 1}`,
      type: "text",
      x: 9.5,
      y: 54.0 + index * 2.1,
      w: 31,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    {
      id: "p40-typical-evening",
      label: "5a",
      type: "text",
      x: 9.5,
      y: 81.7,
      w: 34,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    {
      id: "p40-writing",
      label: "5b",
      type: "textarea",
      x: 9.5,
      y: 90.4,
      w: 34,
      answer: "",
      free: true,
      compact: true
    },
    ...[
      ["A", 47.0, 26.8],
      ["B", 70.8, 26.8],
      ["C", 47.0, 37.9],
      ["D", 70.8, 37.9],
      ["E", 47.0, 49.0],
      ["F", 70.8, 49.0]
    ].map(([photo, x, y]) => ({
      id: `p40-photo-order-${photo}`,
      label: `6a ${photo}`,
      type: "text",
      x,
      y,
      w: 4,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 10 }).map((_, index) => ({
      id: `p40-video-tf-${index + 1}`,
      label: `6c ${index + 1}`,
      type: "select",
      options: ["T", "F"],
      x: 45.0,
      y: 63.0 + index * 2.1,
      w: 5,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    ...[
      [1, 48.6, 87.0, 15],
      [2, 48.6, 89.4, 12],
      [3, 48.6, 91.8, 12]
    ].map(([number, x, y, w]) => ({
      id: `p40-time-phrase-${number}`,
      label: `6d ${number}`,
      type: "text",
      x,
      y,
      w,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    {
      id: "p40-peter-job-opinion",
      label: "6e",
      type: "text",
      x: 45.0,
      y: 95.0,
      w: 35,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }
  ],
  41: [
    ...[
      ["1", "a", 23.5],
      ["2", "a", 28.0],
      ["3", "b", 32.7],
      ["4", "a", 37.7],
      ["5", "b", 42.1],
      ["6", "a", 46.5],
      ["7", "b", 51.8],
      ["8", "a", 56.3],
      ["9", "b", 61.6],
      ["10", "a", 66.0],
      ["11", "b", 70.4],
      ["12", "b", 74.7],
      ["13", "a", 79.1],
      ["14", "b", 83.5],
      ["15", "b", 87.9]
    ].map(([number, answer, y]) => ({
      id: `p41-grammar-${number}`,
      label: `Grammar ${number}`,
      type: "select",
      options: ["a", "b"],
      x: 7.2,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "water", 63.0, 28.8, 12],
      ["2", "sugar", 80.8, 28.8, 11],
      ["3", "milk", 49.0, 40.6, 10],
      ["4", "cheese", 66.5, 40.6, 11],
      ["5", "orange juice|juice", 82.6, 40.6, 12]
    ].map(([number, answer, x, y, w]) => ({
      id: `p41-food-${number}`,
      label: `Vocab a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "read", 49.5, 48.0, 10],
      ["2", "listen", 49.5, 50.3, 10],
      ["3", "go", 49.5, 52.6, 8],
      ["4", "live", 49.5, 54.9, 10],
      ["5", "get", 49.5, 57.2, 9],
      ["6", "watch", 72.7, 48.0, 11],
      ["7", "do", 72.7, 50.3, 8],
      ["8", "speak", 72.7, 52.6, 11],
      ["9", "have", 72.7, 54.9, 10],
      ["10", "drink", 72.7, 57.2, 10]
    ].map(([number, answer, x, y, w]) => ({
      id: `p41-verb-${number}`,
      label: `Vocab b ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "unemployed", 73.2, 63.0, 15],
      ["2", "waiter", 57.0, 65.3, 11],
      ["3", "retired", 74.0, 67.6, 12],
      ["4", "nurse", 62.0, 69.9, 10],
      ["5", "journalist", 58.5, 72.2, 13]
    ].map(([number, answer, x, y, w]) => ({
      id: `p41-job-${number}`,
      label: `Vocab c ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "quarter to eight|7:45|seven forty-five", 64.0, 82.1, 16],
      ["2", "ten past nine|9:10|nine ten", 81.0, 82.1, 16],
      ["3", "twenty-five past six|twenty five past six|6:25|six twenty-five|six twenty five", 49.2, 93.2, 19],
      ["4", "half past three|3:30|three thirty", 66.0, 93.2, 17],
      ["5", "five to seven|6:55|six fifty-five|six fifty five", 82.2, 93.2, 17]
    ].map(([number, answer, x, y, w]) => ({
      id: `p41-time-${number}`,
      label: `Time ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    }))
  ],
  42: [
    ...[
      ["1", "yacht", 17.5, 17.6],
      ["2", "jazz", 17.5, 22.5],
      ["3", "witch", 50.2, 12.7],
      ["4", "vase", 50.2, 17.6],
      ["5", "girl", 50.2, 22.5]
    ].map(([number, answer, x, y]) => ({
      id: `p42-sound-${number}`,
      label: `Pron a ${number}`,
      type: "text",
      x,
      y,
      w: 14,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "2", 9.5, 41.9],
      ["2", "2", 25.8, 40.1],
      ["3", "1", 25.8, 42.3],
      ["4", "1", 39.0, 40.1],
      ["5", "1", 39.0, 42.3]
    ].map(([number, answer, x, y]) => ({
      id: `p42-stress-${number}`,
      label: `Pron c ${number}`,
      type: "select",
      options: ["1", "2", "3"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "meat", 24.0, 67.5, 9],
      ["2", "vegetables", 31.8, 72.7, 13],
      ["3", "good", 21.0, 75.5, 10],
      ["4", "potatoes", 21.0, 83.8, 12],
      ["5", "don't|do not", 19.6, 87.3, 9],
      ["6", "hamburgers", 34.0, 88.8, 13],
      ["7", "every", 39.0, 91.8, 10],
      ["8", "coffee", 27.6, 93.5, 11],
      ["9", "small", 17.5, 93.2, 10],
      ["10", "stop", 35.6, 93.2, 10]
    ].map(([number, answer, x, y, w]) => ({
      id: `p42-text-${number}`,
      label: `Text ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p42-japanese-way",
      label: "Text b",
      type: "text",
      x: 57.0,
      y: 92.8,
      w: 24,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    ...Array.from({ length: 5 }).map((_, index) => ({
      id: `p42-people-${index + 1}`,
      label: `People ${index + 1}`,
      type: "select",
      options: ["a", "b", "c"],
      x: 53.0,
      y: 22.0 + index * 9.2,
      w: 5,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 7 }).map((_, index) => ({
      id: `p42-can-${index + 1}`,
      label: `Can ${index + 1}`,
      type: "checkbox",
      x: 89.5,
      y: 70.5 + index * 3.3,
      w: 3,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  43: [
    ...[
      ["1", "75%", 29.2, 63.6, 8],
      ["2", "66%", 14.0, 68.3, 8],
      ["3", "48%", 29.3, 68.3, 8],
      ["4", "46%", 25.0, 70.9, 8],
      ["5", "10%", 12.0, 73.7, 8]
    ].map(([number, answer, x, y, w]) => ({
      id: `p43-percent-${number}`,
      label: `1a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p43-polly-same-weekends",
      label: "1c",
      type: "text",
      x: 55.0,
      y: 41.0,
      w: 25,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    ...[
      [1, 53.2],
      [2, 55.5],
      [3, 57.8],
      [5, 62.4],
      [6, 64.7],
      [7, 67.0],
      [8, 69.3],
      [9, 71.6]
    ].map(([number, y]) => ({
      id: `p43-polly-day-${number}`,
      label: `1d ${number}`,
      type: "select",
      options: ["Fr", "Sa", "Su"],
      x: 55.7,
      y,
      w: 6,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    {
      id: "p43-weekend-same",
      label: "1e",
      type: "text",
      x: 55.0,
      y: 77.8,
      w: 32,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    ...[
      ["1", "go", 78.0, 87.0],
      ["2", "meet", 73.0, 90.6],
      ["3", "stay", 74.2, 93.6]
    ].map(([number, answer, x, y]) => ({
      id: `p43-verbphrase-${number}`,
      label: `2a ${number}`,
      type: "text",
      x,
      y,
      w: 9,
      answer,
      compact: true,
      mini: true
    }))
  ],
  44: [
    ...[
      ["1", "What's your favourite part of the weekend?|What is your favourite part of the weekend", 10.8, 16.1, 31],
      ["2", "Are you tired on Sunday evening?", 10.8, 22.7, 31],
      ["3", "What do you usually do on Saturday?", 10.8, 29.2, 31],
      ["4", "Do you do the same thing every weekend?", 10.8, 35.8, 31]
    ].map(([number, answer, x, y, w]) => ({
      id: `p44-order-${number}`,
      label: `3a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true
    })),
    ...[
      ["1a", "Do you", 48.2, 21.2, 9],
      ["1b", "do you", 53.0, 26.0, 9],
      ["2", "Do you", 48.2, 30.4, 9],
      ["3", "Do you", 48.2, 39.3, 9],
      ["4a", "Do you", 48.2, 46.3, 9],
      ["4b", "do you", 57.5, 50.7, 9],
      ["5a", "Do you", 48.2, 56.0, 9],
      ["5b", "do you", 57.5, 60.3, 9],
      ["6", "do you", 58.7, 66.0, 9],
      ["7", "do you", 54.0, 72.0, 9],
      ["8", "do you", 53.6, 78.6, 9],
      ["9", "Are you", 48.2, 84.4, 9],
      ["10", "do you", 58.7, 90.6, 9],
      ["11", "'s|is", 51.0, 96.0, 7]
    ].map(([id, answer, x, y, w]) => ({
      id: `p44-weekend-question-${id}`,
      label: `5a ${id}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 11 }).map((_, index) => ({
      id: `p44-partner-answer-${index + 1}`,
      label: `5b ${index + 1}`,
      type: "text",
      x: 73.0,
      y: 21.7 + index * 6.6,
      w: 20,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  45: [
    ...[
      ["sam", "No|No, she doesn't|No, she does not", 42.0],
      ["rupert", "No|No, she doesn't|No, she does not", 48.0]
    ].map(([person, answer, x]) => ({
      id: `p45-love-${person}`,
      label: `1a ${person}`,
      type: "text",
      x,
      y: 20.2,
      w: 13,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["2", "Come", 70.0, 31.5, 10],
      ["3", "Listen", 70.0, 39.0, 10],
      ["4", "talk", 72.0, 46.0, 10],
      ["5", "Don't|Do not", 70.0, 52.8, 10],
      ["6", "go", 70.0, 61.5, 8],
      ["7", "Open", 69.3, 65.0, 9],
      ["8", "Stand", 70.0, 68.0, 9],
      ["9", "look", 69.3, 71.1, 9],
      ["10", "say", 74.5, 78.5, 9]
    ].map(([number, answer, x, y, w]) => ({
      id: `p45-dialogue-${number}`,
      label: `1b ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["2", "me", 22.5, 88.3, 9],
      ["3a", "you", 18.0, 93.0, 8],
      ["3b", "me", 27.5, 94.6, 8],
      ["4", "him", 49.2, 90.3, 9],
      ["5", "it", 48.4, 94.2, 8],
      ["6", "them", 48.4, 96.2, 10]
    ].map(([number, answer, x, y, w]) => ({
      id: `p45-pronoun-${number}`,
      label: `1c ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 4 }).map((_, index) => ({
      id: `p45-object-pronoun-${index + 1}`,
      label: `1f ${index + 1}`,
      type: "text",
      x: 69.8,
      y: 86.8 + index * 2.4,
      w: 12,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  46: [
    ...[
      ["1", "D", 15.2],
      ["2", "C", 17.1],
      ["3", "E", 19.0],
      ["4", "F", 20.9],
      ["5", "A", 22.8],
      ["6", "G", 24.7],
      ["7", "B", 26.6]
    ].map(([number, answer, y]) => ({
      id: `p46-film-kind-${number}`,
      label: `2a ${number}`,
      type: "text",
      x: 10.8,
      y,
      w: 4,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p46-like-all-films",
      label: "3b",
      type: "text",
      x: 9.0,
      y: 36.8,
      w: 24,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    ...Array.from({ length: 5 }).map((_, index) => ({
      id: `p46-pronoun-ref-${index + 1}`,
      label: `3c ${index + 1}`,
      type: "text",
      x: 29.5 + (index % 2) * 21.0,
      y: 46.5 + Math.floor(index / 2) * 4.4,
      w: 18,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    {
      id: "p46-films-opinion",
      label: "3d",
      type: "text",
      x: 9.0,
      y: 55.5,
      w: 35,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    ...Array.from({ length: 9 }).map((_, index) => ({
      id: `p46-chart-${index + 1}`,
      label: `4c ${index + 1}`,
      type: "text",
      x: 10.0 + (index % 3) * 18.0,
      y: 82.0 + Math.floor(index / 3) * 4.0,
      w: 16,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  47: [
    ...[
      ["1", "C", 11.0, 20.9],
      ["2", "A", 11.0, 22.7],
      ["3", "E", 11.0, 24.5],
      ["4", "B", 11.0, 26.4],
      ["5", "D", 11.0, 28.3]
    ].map(([number, answer, x, y]) => ({
      id: `p47-special-day-${number}`,
      label: `1a ${number}`,
      type: "select",
      options: ["A", "B", "C", "D", "E"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "February", 30.0, 37.5, 12],
      ["2", "May", 31.0, 39.6, 9],
      ["3", "January, June, July|January June July|January, June and July", 30.0, 41.8, 18],
      ["4", "September, October, November, December|September October November December|September, October, November and December", 27.0, 44.0, 23]
    ].map(([number, answer, x, y, w]) => ({
      id: `p47-month-question-${number}`,
      label: `1c ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "b", 65.0, 29.2],
      ["2", "c", 84.4, 29.2],
      ["3", "b", 50.2, 45.4],
      ["4", "b", 70.3, 55.0],
      ["5", "a", 33.0, 69.0],
      ["6", "a", 66.0, 70.2],
      ["7", "c", 52.6, 88.5],
      ["8", "b", 49.2, 95.0],
      ["9", "a", 86.5, 95.0]
    ].map(([number, answer, x, y]) => ({
      id: `p47-ordinals-quiz-${number}`,
      label: `2a ${number}`,
      type: "select",
      options: ["a", "b", "c"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    }))
  ],
  48: [
    ...[
      ["1", "second|2nd", 26.8, 41.4, 10],
      ["2", "first|1st", 36.2, 43.7, 10],
      ["3", "second|2nd", 29.2, 45.9, 10],
      ["4", "birthday", 32.1, 48.2, 12]
    ].map(([number, answer, x, y, w]) => ({
      id: `p48-date-dialogue-${number}`,
      label: `3a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "to his dad's house|his dad's house|to his father's house|his father's house|to see his dad|to see his father", 23.7, 57.3, 21],
      ["2", "a bottle of wine|wine|some wine", 23.7, 62.2, 17],
      ["3", "2nd July|the second of July|2 July|2/7|July 2nd|July second", 23.7, 67.0, 17]
    ].map(([number, answer, x, y, w]) => ({
      id: `p48-rob-dad-${number}`,
      label: `3c ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p48-phone-why",
      label: "4a",
      type: "text",
      x: 63.0,
      y: 36.5,
      w: 25,
      answer: "to talk about her trip to London|about her trip to London|because he needs to talk about her trip to London",
      compact: true,
      mini: true
    },
    ...[
      ["1", "F", 59.5, 48.0],
      ["2", "F", 59.5, 54.0],
      ["3", "T", 59.5, 59.4],
      ["4", "F", 59.5, 64.7],
      ["5", "F", 59.5, 70.2]
    ].map(([number, answer, x, y]) => ({
      id: `p48-phone-true-false-${number}`,
      label: `4b ${number}`,
      type: "select",
      options: ["T", "F"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", 78.0],
      ["2", 80.8],
      ["3", 83.6],
      ["4", 86.4],
      ["5", 89.2],
      ["6", 92.0]
    ].map(([number, y]) => ({
      id: `p48-important-birthday-${number}`,
      label: `3g ${number}`,
      type: "text",
      x: 63.0,
      y,
      w: 27,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  49: [
    ...[
      ["1", "the USA|USA|United States|the United States", 23.4, 35.4, 16],
      ["2", "Mexico", 20.4, 43.1, 13],
      ["3", "the UK|UK|United Kingdom|the United Kingdom", 9.2, 51.4, 13],
      ["4", "South Africa", 9.2, 60.6, 15],
      ["5", "Pakistan", 9.2, 68.6, 13]
    ].map(([number, answer, x, y, w]) => ({
      id: `p49-driving-country-${number}`,
      label: `1a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["A", "3", 46.4, 41.8],
      ["B", "2", 46.4, 53.1],
      ["C", "1", 46.4, 65.0]
    ].map(([letter, answer, x, y]) => ({
      id: `p49-tweet-photo-${letter}`,
      label: `2a ${letter}`,
      type: "select",
      options: ["1", "2", "3"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "help", 56.6, 80.5, 9],
      ["2", "book", 57.5, 82.8, 9],
      ["3", "start", 57.5, 87.1, 9],
      ["4", "meet", 72.6, 89.2, 9],
      ["5", "come", 62.3, 91.7, 9],
      ["6", "come", 63.6, 95.5, 9]
    ].map(([number, answer, x, y, w]) => ({
      id: `p49-phone-verb-${number}`,
      label: `2c ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    }))
  ],
  50: [
    {
      id: "p50-driving-test-pass",
      label: "2d",
      type: "select",
      options: ["Yes", "No"],
      x: 38.0,
      y: 19.2,
      w: 8,
      answer: "No",
      compact: true,
      mini: true
    },
    ...[
      ["negative", "can't|cannot", 17.0, 39.7, 9],
      ["question", "Can", 10.4, 43.1, 7],
      ["yes", "can", 17.2, 46.5, 7],
      ["no", "can't|cannot", 16.0, 50.0, 8]
    ].map(([part, answer, x, y, w]) => ({
      id: `p50-can-chart-${part}`,
      label: `2e ${part}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "a", 8.8, 70.7],
      ["2", "b", 8.8, 73.8],
      ["3", "b", 8.8, 76.8],
      ["4", "a", 8.8, 79.9]
    ].map(([number, answer, x, y]) => ({
      id: `p50-can-listening-${number}`,
      label: `3c ${number}`,
      type: "select",
      options: ["a", "b"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "train", 17.4, 90.3, 12],
      ["2", "shop|clothes shop|store", 17.4, 93.3, 12],
      ["3", "restaurant", 48.8, 90.3, 14],
      ["4", "street", 50.2, 93.3, 12]
    ].map(([number, answer, x, y, w]) => ({
      id: `p50-place-${number}`,
      label: `3e ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["2", "can pay", 61.0, 50.9, 17],
      ["3", "can't use|cannot use", 61.0, 54.0, 18],
      ["4", "can park", 61.0, 57.0, 17],
      ["5", "can have", 61.0, 60.1, 17],
      ["6", "can use", 61.0, 63.1, 17],
      ["7", "can't take|cannot take", 61.0, 66.1, 18],
      ["8", "can't play|cannot play", 61.0, 69.2, 18],
      ["9", "can change", 61.0, 72.2, 18],
      ["10", "can't drive|cannot drive", 61.0, 75.2, 18]
    ].map(([number, answer, x, y, w]) => ({
      id: `p50-sign-${number}`,
      label: `4a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 4 }).map((_, index) => ({
      id: `p50-tourist-sentence-${index + 1}`,
      label: `5b ${index + 1}`,
      type: "text",
      x: 55.0,
      y: 88.5 + index * 2.6,
      w: 37,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  51: [
    ...[
      ["1", "reading", 14.2, 55.1, 13],
      ["2", "swimming", 14.2, 58.1, 13],
      ["3", "cooking", 14.2, 61.2, 13]
    ].map(([number, answer, x, y, w]) => ({
      id: `p51-activity-${number}`,
      label: `1a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "William", 21.6, 79.2, 13],
      ["2", "Luke", 19.2, 82.0, 11],
      ["3", "Daniel", 21.8, 84.9, 12]
    ].map(([number, answer, x, y, w]) => ({
      id: `p51-profile-match-${number}`,
      label: `2a ${number}`,
      type: "select",
      options: ["William", "Daniel", "Luke"],
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["dont-like", "3", 9.9, 94.2],
      ["hate", "4", 23.8, 94.2],
      ["like", "2", 35.2, 94.2],
      ["love", "1", 46.4, 94.2]
    ].map(([word, answer, x, y]) => ({
      id: `p51-opinion-scale-${word}`,
      label: `2b ${word}`,
      type: "select",
      options: ["1", "2", "3", "4"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    }))
  ],
  52: [
    ...[
      ["1", "eating", 59.0, 18.0, 11],
      ["2", "travelling|traveling", 58.8, 25.1, 13],
      ["3", "shopping", 58.8, 31.6, 13],
      ["4", "dancing", 57.2, 38.4, 12],
      ["5", "watching", 58.3, 45.0, 13],
      ["6", "running", 58.3, 51.7, 12],
      ["7", "going", 61.6, 54.4, 10],
      ["8", "driving", 58.3, 61.0, 12],
      ["9", "listening", 69.5, 61.0, 13],
      ["10", "singing", 70.2, 63.7, 12]
    ].map(([number, answer, x, y, w]) => ({
      id: `p52-alone-friends-${number}`,
      label: `4a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", 66.5],
      ["2", 68.9]
    ].map(([number, y]) => ({
      id: `p52-agree-person-${number}`,
      label: `4b ${number}`,
      type: "text",
      x: 50.5,
      y,
      w: 18,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    {
      id: "p52-song-opinion",
      label: "5a",
      type: "text",
      x: 10.0,
      y: 73.0,
      w: 30,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    ...[
      ["1", "Oxford", 78.6, 69.9, 10],
      ["2", "13|thirteen", 70.7, 72.7, 7],
      ["3", "students", 70.5, 75.3, 10],
      ["4", "Nell", 80.8, 78.0, 8],
      ["5a", "Wednesdays", 71.7, 80.7, 11],
      ["5b", "Saturdays", 82.5, 80.7, 11],
      ["6", "three|3", 72.8, 83.4, 8],
      ["7", "month", 80.0, 86.1, 8],
      ["8", "bars", 67.7, 88.8, 8],
      ["9", "jazz", 76.6, 91.5, 8],
      ["10", "talk", 84.6, 94.1, 7],
      ["11", "happy", 78.3, 94.8, 9],
      ["12", "group", 77.0, 96.9, 9]
    ].map(([number, answer, x, y, w]) => ({
      id: `p52-choir-video-${number}`,
      label: `5b ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    }))
  ],
  53: [
    ...[
      ["1", "a", 6.5, 24.2],
      ["2", "b", 6.5, 30.0],
      ["3", "a", 6.5, 34.1],
      ["4", "b", 6.5, 38.0],
      ["5", "a", 6.5, 42.2],
      ["6", "a", 6.5, 46.2],
      ["7", "b", 6.5, 50.5],
      ["8", "b", 6.5, 54.5],
      ["9", "a", 6.5, 58.8],
      ["10", "b", 6.5, 63.0],
      ["11", "a", 6.5, 67.7],
      ["12", "a", 6.5, 73.3],
      ["13", "b", 6.5, 78.0],
      ["14", "b", 6.5, 82.0],
      ["15", "a", 6.5, 86.1]
    ].map(([number, answer, x, y]) => ({
      id: `p53-grammar-${number}`,
      label: `G ${number}`,
      type: "select",
      options: ["a", "b"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "play", 54.0, 22.2, 8],
      ["2", "pay", 54.0, 24.5, 8],
      ["3a", "walk", 60.0, 26.7, 8],
      ["3b", "ski", 61.0, 29.0, 7],
      ["4a", "meet", 55.0, 31.4, 8],
      ["4b", "go", 51.5, 33.7, 7],
      ["5a", "go", 57.0, 36.2, 7],
      ["5b", "swim", 58.0, 38.5, 9],
      ["6a", "do", 51.7, 40.8, 7],
      ["6b", "play", 69.0, 40.8, 8]
    ].map(([number, answer, x, y, w]) => ({
      id: `p53-verb-${number}`,
      label: `Va ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "seventh", 52.8, 46.0, 10],
      ["2", "twelfth", 55.0, 49.3, 10],
      ["3", "twentieth", 54.0, 53.5, 11],
      ["4", "thirty-first|thirty first|31st", 53.0, 59.6, 12],
      ["5", "March", 80.0, 46.2, 9],
      ["6", "May", 80.0, 49.6, 8],
      ["7", "July", 80.0, 52.8, 8],
      ["8", "November", 79.0, 58.5, 11]
    ].map(([number, answer, x, y, w]) => ({
      id: `p53-next-word-${number}`,
      label: `Vb ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "cooking", 57.0, 75.3, 10],
      ["2", "camping", 71.0, 75.3, 10],
      ["3", "travelling|traveling", 84.5, 75.3, 12],
      ["4", "flying", 45.8, 86.8, 9],
      ["5", "painting", 58.8, 86.8, 10],
      ["6", "running", 72.5, 86.8, 10],
      ["7", "swimming", 86.0, 86.8, 10]
    ].map(([number, answer, x, y, w]) => ({
      id: `p53-activity-${number}`,
      label: `Vc ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "thumb", 11.0, 94.5, 10],
      ["2", "singer", 11.0, 96.5, 10],
      ["3", "owl", 24.5, 92.0, 10],
      ["4", "boot", 24.5, 95.2, 9],
      ["5", "bull", 24.5, 96.5, 9]
    ].map(([number, answer, x, y, w]) => ({
      id: `p53-sound-picture-${number}`,
      label: `Pa ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "1", 57.0, 96.6],
      ["2", "1", 67.5, 96.6],
      ["3", "2", 76.5, 96.6],
      ["4", "3", 86.5, 96.6],
      ["5", "1", 95.0, 96.6]
    ].map(([number, answer, x, y]) => ({
      id: `p53-stress-${number}`,
      label: `Pc ${number}`,
      type: "select",
      options: ["1", "2", "3"],
      x,
      y,
      w: 4,
      answer,
      compact: true,
      mini: true
    }))
  ],
  54: [
    ...[
      ["1", "St George's Market|St Georges Market", 10.3, 34.6, 32],
      ["2", "The Titanic museum|Titanic museum", 10.3, 48.2, 32],
      ["3", "World-class golf|World class golf", 10.3, 64.0, 32]
    ].map(([number, answer, x, y, w]) => ({
      id: `p54-reading-heading-${number}`,
      label: `Text a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "No", 9.0, 79.2],
      ["2", "Yes", 9.0, 81.6],
      ["3", "Yes", 9.0, 84.1],
      ["4", "No", 9.0, 86.7],
      ["5", "Yes", 9.0, 89.4],
      ["6", "No", 9.0, 93.0],
      ["7", "Yes", 9.0, 97.0]
    ].map(([number, answer, x, y]) => ({
      id: `p54-reading-info-${number}`,
      label: `Text b ${number}`,
      type: "select",
      options: ["Yes", "No"],
      x,
      y,
      w: 7,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "a", 55.0, 22.0],
      ["2", "b", 55.0, 31.0],
      ["3", "a", 55.0, 39.0],
      ["4", "c", 55.0, 47.0],
      ["5", "b", 55.0, 56.0]
    ].map(([number, answer, x, y]) => ({
      id: `p54-people-${number}`,
      label: `People ${number}`,
      type: "select",
      options: ["a", "b", "c"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...Array.from({ length: 6 }).map((_, index) => ({
      id: `p54-can-do-${index + 1}`,
      label: `Can do ${index + 1}`,
      type: "checkbox",
      x: 91.8,
      y: 72.0 + index * 3.2,
      w: 4,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  55: [
    ...[
      ["homework", 53.0, 38.8],
      ["reading", 40.8, 42.8],
      ["dinner", 37.5, 48.4]
    ].map(([key, x, y]) => ({
      id: `p55-not-true-${key}`,
      label: "1a",
      type: "checkbox",
      x,
      y,
      w: 4,
      answer: "true",
      compact: true,
      mini: true
    })),
    {
      id: "p55-present-continuous-rule",
      label: "1b",
      type: "select",
      options: ["a", "b"],
      x: 82.0,
      y: 27.1,
      w: 5,
      answer: "b",
      compact: true,
      mini: true
    },
    ...[
      ["1", "He's reading a story|He is reading a story|reading a story", 66.2, 37.0, 24],
      ["2", "He's watching TV|He is watching TV|He's watching football on TV|watching TV|watching football on TV", 66.2, 40.3, 24],
      ["3", "He's drinking|He is drinking|He's drinking Coke|He's drinking a beer|drinking", 66.2, 43.6, 24],
      ["4", "He's playing a video game|He is playing a video game|playing a video game", 66.2, 46.9, 24],
      ["5", "He's having a shower|He is having a shower|having a shower", 66.2, 50.2, 24],
      ["6", "He's going to bed|He is going to bed|going to bed", 66.2, 53.5, 24]
    ].map(([number, answer, x, y, w]) => ({
      id: `p55-tony-evening-${number}`,
      label: `1d ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", 65.0, 58.7],
      ["2", 65.0, 61.5],
      ["3", 65.0, 64.3]
    ].map(([number, x, y]) => ({
      id: `p55-home-guess-${number}`,
      label: `1e ${number}`,
      type: "text",
      x,
      y,
      w: 28,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  56: [
    ...[
      ["1", "She's eating|She is eating|eating", 13.0, 40.3, 16],
      ["2", "They're cooking|They are cooking|cooking", 25.0, 40.3, 18],
      ["3", "He's listening to music|He is listening to music|listening to music", 38.5, 40.3, 20],
      ["4", "She's reading|She is reading|reading", 13.0, 53.2, 16],
      ["5", "They're playing tennis|They are playing tennis|playing tennis", 25.0, 53.2, 20],
      ["6", "He's doing housework|He is doing housework|He's cleaning the window|He is cleaning the window|cleaning the window", 38.5, 53.2, 22]
    ].map(([number, answer, x, y, w]) => ({
      id: `p56-picture-action-${number}`,
      label: `2c ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "staying", 21.0, 68.9, 10],
      ["2", "phoning", 21.0, 72.0, 10]
    ].map(([number, answer, x, y, w]) => ({
      id: `p56-travel-verb-${number}`,
      label: `3a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "buying presents|shopping", 28.0, 80.2, 20],
      ["2", "packing|packing the suitcase|packing a suitcase", 23.0, 83.0, 19],
      ["3", "is renting a car|renting a car|hiring a car", 28.0, 85.8, 20],
      ["4", "are waiting for a bus|waiting for a bus", 33.0, 88.6, 22]
    ].map(([number, answer, x, y, w]) => ({
      id: `p56-listening-action-${number}`,
      label: `3c ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1a", "football shirt", 29.0, 88.8, 14],
      ["1b", "bag", 43.0, 88.8, 8],
      ["2", "has", 28.0, 91.3, 8],
      ["3a", "small", 31.8, 94.0, 8],
      ["3b", "three|3", 48.0, 94.0, 8],
      ["4a", "23", 26.5, 96.6, 6],
      ["4b", "13", 45.0, 96.6, 6]
    ].map(([number, answer, x, y, w]) => ({
      id: `p56-listening-choice-${number}`,
      label: `3d ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "B", 60.0, 17.2],
      ["2", "D", 60.0, 21.1],
      ["3", "C", 60.0, 27.1],
      ["4", "A", 60.0, 32.4],
      ["5", "E", 60.0, 37.4]
    ].map(([number, answer, x, y]) => ({
      id: `p56-message-match-${number}`,
      label: `4a ${number}`,
      type: "select",
      options: ["A", "B", "C", "D", "E"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "bus stop", 87.0, 71.5, 11],
      ["2", "outside", 79.0, 74.4, 10],
      ["3", "traffic", 79.2, 78.4, 10],
      ["4", "box office", 60.2, 83.4, 13],
      ["5", "towards", 79.0, 89.0, 10]
    ].map(([number, answer, x, y, w]) => ({
      id: `p56-message-word-${number}`,
      label: `4c ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    }))
  ],
  57: [
    {
      id: "p57-why-undercover",
      label: "1b",
      type: "text",
      x: 10.0,
      y: 50.5,
      w: 32,
      answer: "to know more about his workers and problems in his company|to know more about the workers and problems in his company|to know more about his workers|to find out what is happening in the company",
      compact: true,
      mini: true
    },
    ...[
      ["1", "T", 10.0, 61.8],
      ["2", "F", 10.0, 66.0],
      ["3", "T", 10.0, 70.0],
      ["4", "T", 10.0, 73.4],
      ["5", "F", 10.0, 77.5],
      ["6", "F", 10.0, 82.1],
      ["7", "F", 10.0, 86.4],
      ["8", "F", 10.0, 91.0]
    ].map(([number, answer, x, y]) => ({
      id: `p57-undercover-tf-${number}`,
      label: `1c ${number}`,
      type: "select",
      options: ["T", "F"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p57-friday-check",
      label: "1d",
      type: "text",
      x: 10.0,
      y: 94.0,
      w: 33,
      answer: "He tells the workers who he really is|He says he isn't Andy|He says he is David Clarke|He asks them to make changes",
      compact: true,
      mini: true
    },
    {
      id: "p57-programme-opinion",
      label: "1e",
      type: "text",
      x: 10.0,
      y: 97.0,
      w: 33,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }
  ],
  58: [
    ...[
      ["2", "is working|'s working", 39.0, 16.6, 13],
      ["3", "wears", 20.5, 19.6, 9],
      ["4", "is wearing|'s wearing", 39.0, 19.6, 13]
    ].map(([number, answer, x, y, w]) => ({
      id: `p58-grammar-work-wear-${number}`,
      label: `2a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["simple", "every day", 36.0, 28.3, 12],
      ["continuous", "today|now|today / now|today now", 39.5, 30.8, 13]
    ].map(([part, answer, x, y, w]) => ({
      id: `p58-rule-${part}`,
      label: `2c ${part}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "a T-shirt|T-shirt|T shirt", 10.4, 52.5, 10],
      ["2", "jeans", 20.0, 52.5, 9],
      ["3", "a suit|suit", 29.6, 52.5, 9],
      ["4", "a hat|hat", 39.0, 52.5, 9],
      ["5", "a jacket|jacket", 48.0, 52.5, 10]
    ].map(([number, answer, x, y, w]) => ({
      id: `p58-clothes-photo-${number}`,
      label: `3a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["egg-1", "dress", 10.5, 82.5, 8],
      ["egg-2", "sweater", 10.5, 85.4, 9],
      ["boot-1", "shoes", 20.2, 82.5, 8],
      ["boot-2", "suit", 20.2, 85.4, 8],
      ["cat-1", "cap", 29.8, 82.5, 8],
      ["cat-2", "hat", 29.8, 85.4, 8],
      ["cat-3", "jacket", 29.8, 88.3, 9],
      ["phone", "coat", 39.4, 82.5, 8],
      ["owl", "trousers", 48.8, 82.5, 10],
      ["tree", "jeans", 58.2, 82.5, 8]
    ].map(([key, answer, x, y, w]) => ({
      id: `p58-clothes-sound-${key}`,
      label: `3d ${key}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p58-sandra-positive",
      label: "4b",
      type: "select",
      options: ["positive", "negative"],
      x: 80.0,
      y: 47.6,
      w: 11,
      answer: "positive",
      compact: true,
      mini: true
    },
    ...[
      ["1", "clothes for men and women|informal clothes for men and women|men's and women's clothes|trousers, T-shirts and sweaters|trousers T-shirts sweaters", 63.5, 57.0, 29],
      ["2", "She helps customers find clothes|helps customers find clothes|helping customers", 63.5, 61.2, 29],
      ["3", "the people|the people are nice|making new friends|she's making a lot of new friends", 63.5, 65.4, 29],
      ["4", "She can't sit down|She cannot sit down|standing up all the time|that she can't sit down", 63.5, 69.6, 29],
      ["5", "work there on Saturdays|work at FatFace on Saturdays|work in the shop on Saturdays", 63.5, 74.0, 29],
      ["6", "from FatFace|from the shop|from work", 63.5, 79.0, 24]
    ].map(([number, answer, x, y, w]) => ({
      id: `p58-sandra-question-${number}`,
      label: `4c ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[1, 2, 3].map((number, index) => ({
      id: `p58-speaking-clothes-${number}`,
      label: `4d ${number}`,
      type: "text",
      x: 63.5,
      y: 87.2 + index * 3.3,
      w: 29,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  59: [
    ...[
      ["A", "2", 9.6, 20.9],
      ["B", "1", 9.6, 45.5],
      ["C", "3", 9.6, 70.5]
    ].map(([letter, answer, x, y]) => ({
      id: `p59-photo-${letter}`,
      label: `1a ${letter}`,
      type: "select",
      options: ["1", "2", "3"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "match", 63.5, 21.0, 10],
      ["2", "Sunday", 79.2, 21.0, 10],
      ["3", "four o'clock|4 o'clock|4.00|four", 64.8, 28.1, 11],
      ["4", "lunch", 80.5, 35.7, 10],
      ["5", "birthday", 76.4, 41.3, 11],
      ["6", "half past three|3.30|three thirty", 76.6, 48.1, 13],
      ["7", "know", 64.0, 56.9, 9],
      ["8", "burger", 72.8, 59.8, 10],
      ["9", "hungry", 75.6, 62.4, 10],
      ["10", "coffee", 72.4, 65.1, 10],
      ["11", "water", 74.8, 70.4, 10],
      ["12", "coffee", 73.8, 73.3, 10],
      ["13", "Milk", 63.5, 76.1, 10]
    ].map(([number, answer, x, y, w]) => ({
      id: `p59-dialogue-gap-${number}`,
      label: `1b ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    }))
  ],
  60: [
    ...[
      ["1", "a coffee|coffee|to have a coffee", 46.7, 18.0, 20],
      ["2", "to come to an exhibition|come to an exhibition|go to an exhibition|an exhibition|the Picasso exhibition|a Picasso exhibition", 46.7, 21.0, 24],
      ["3", "meet one evening|to meet one evening|have dinner|to have dinner|see a show|to see a show|meet for dinner", 46.7, 24.0, 24]
    ].map(([number, answer, x, y, w]) => ({
      id: `p60-steve-invite-${number}`,
      label: `3a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "well", 53.0, 35.5, 9],
      ["2", "starting to rain", 53.0, 40.4, 18],
      ["3", "an hour", 58.5, 45.3, 12],
      ["4", "can't|cannot", 58.5, 50.2, 10],
      ["5", "isn't|is not", 62.5, 55.1, 10]
    ].map(([number, answer, x, y, w]) => ({
      id: `p60-circle-answer-${number}`,
      label: `3b ${number}`,
      type: "select",
      options:
        number === "1"
          ? ["well", "tired"]
          : number === "2"
            ? ["raining", "starting to rain"]
            : number === "3"
              ? ["half an hour", "an hour"]
              : number === "4"
                ? ["can", "can't"]
                : ["is", "isn't"],
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p60-party-plan",
      label: "5b",
      type: "text",
      x: 47.0,
      y: 82.3,
      w: 34,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    {
      id: "p60-class-count",
      label: "5c",
      type: "text",
      x: 47.0,
      y: 89.8,
      w: 18,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    {
      id: "p60-email-invite",
      label: "5d",
      type: "textarea",
      x: 66.0,
      y: 88.8,
      w: 28,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }
  ],
  61: [
    ...[
      ["bed", "3", 9.0, 91.5],
      ["chair", "4", 18.0, 91.5],
      ["mirror", "5", 28.2, 91.5],
      ["picture", "1", 38.7, 91.5],
      ["window", "2", 50.2, 91.5]
    ].map(([word, answer, x, y]) => ({
      id: `p61-hotel-room-${word}`,
      label: `1b ${word}`,
      type: "select",
      options: ["1", "2", "3", "4", "5"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["lift", "X", 62.5, 28.9],
      ["view", "V", 69.5, 28.9],
      ["tv", "V", 81.0, 28.9],
      ["wifi", "V", 88.0, 28.9],
      ["restaurant", "X", 62.5, 31.3],
      ["bar", "V", 73.5, 31.3],
      ["shops", "X", 82.0, 31.3]
    ].map(([thing, answer, x, y]) => ({
      id: `p61-hotel-has-${thing}`,
      label: `2a ${thing}`,
      type: "select",
      options: ["V", "X"],
      x,
      y,
      w: 4.5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "a", 62.2, 43.2],
      ["2", "b", 62.2, 49.7],
      ["3", "b", 62.2, 55.6]
    ].map(([number, answer, x, y]) => ({
      id: `p61-grammar-rule-${number}`,
      label: `2b ${number}`,
      type: "select",
      options: ["a", "b"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[1, 2, 3].map((number, index) => ({
      id: `p61-classroom-school-sentence-${number}`,
      label: `2f ${number}`,
      type: "text",
      x: 64.0,
      y: 88.3 + index * 3.2,
      w: 29,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  62: [
    ...[
      ["airport", "chair", 55.2, 34.6],
      ["beer", "ear", 61.6, 34.6],
      ["dear", "ear", 66.2, 34.6],
      ["idea", "ear", 71.0, 34.6],
      ["really", "ear", 76.2, 34.6],
      ["repair", "chair", 82.2, 34.6],
      ["their", "chair", 88.8, 34.6],
      ["were", "ear", 55.2, 37.9],
      ["where", "chair", 62.5, 37.9],
      ["year", "ear", 69.6, 37.9]
    ].map(([word, answer, x, y]) => ({
      id: `p62-sound-${word}`,
      label: `3b ${word}`,
      type: "select",
      options: ["ear", "chair"],
      x,
      y,
      w: 5.8,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "on", 58.0, 61.2],
      ["2", "under", 72.3, 61.2],
      ["3", "in", 86.5, 61.2]
    ].map(([number, answer, x, y]) => ({
      id: `p62-preposition-picture-${number}`,
      label: `4a ${number}`,
      type: "select",
      options: ["in", "on", "under"],
      x,
      y,
      w: 7.5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["2", "on", 69.0, 80.4],
      ["3", "in", 88.0, 80.4],
      ["4", "under", 58.0, 91.0],
      ["5", "under", 73.0, 91.0],
      ["6", "in", 88.0, 91.0]
    ].map(([number, answer, x, y]) => ({
      id: `p62-remote-${number}`,
      label: `4b ${number}`,
      type: "select",
      options: ["in", "on", "under"],
      x,
      y,
      w: 7.5,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p62-communication-hotel-room",
      label: "4c",
      type: "text",
      x: 55.5,
      y: 96.0,
      w: 36,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }
  ],
  63: [
    ...[
      ["1", "Jason", 7.2, 25.1],
      ["2", "detective", 28.4, 24.6]
    ].map(([number, answer, x, y]) => ({
      id: `p63-photo-person-${number}`,
      label: `1a ${number}`,
      type: "select",
      options: ["Jason", "detective"],
      x,
      y,
      w: 11,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "seven", 25.0, 51.6, 8],
      ["2", "home", 16.6, 54.9, 10],
      ["3", "home", 23.8, 57.9, 10],
      ["4", "wife", 9.7, 60.9, 10],
      ["5", "pub", 20.5, 66.7, 9],
      ["6", "alone", 20.5, 70.2, 10],
      ["7", "friend", 25.5, 73.4, 10]
    ].map(([number, answer, x, y, w]) => ({
      id: `p63-interview-gap-${number}`,
      label: `1b ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "was", 27.4, 82.3, 8],
      ["2", "weren't|were not", 27.4, 85.7, 10],
      ["3", "Were", 26.3, 89.2, 8],
      ["4", "wasn't|was not", 27.3, 92.6, 10]
    ].map(([number, answer, x, y, w]) => ({
      id: `p63-past-be-${number}`,
      label: `1c ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "taxi driver", 56.2, 24.4, 13],
      ["2", "14", 55.0, 27.3, 7],
      ["3", "at school", 79.0, 30.1, 15],
      ["4", "taxi", 80.0, 34.0, 10],
      ["5", "Black Horse", 68.8, 37.4, 18],
      ["6", "Street", 51.5, 40.6, 10],
      ["7", "wife", 63.2, 44.2, 10],
      ["8", "Jason's wife|Jason’s wife", 76.0, 44.2, 15]
    ].map(([number, answer, x, y, w]) => ({
      id: `p63-kevin-info-${number}`,
      label: `2a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p63-kevin-story-false",
      label: "2b",
      type: "text",
      x: 47.0,
      y: 46.9,
      w: 41,
      answer: "Because he says Jason's wife was at the pub, but she was at home|He says Jason's wife was at the pub but she was at home|Jason's wife was at home|because Jason's wife was at home",
      compact: true,
      mini: true
    },
    ...[
      ["1", "in", 62.0, 56.0],
      ["2", "at", 62.0, 61.8]
    ].map(([number, answer, x, y]) => ({
      id: `p63-vocab-answer-${number}`,
      label: `3a ${number}`,
      type: "select",
      options: ["in", "on", "at"],
      x,
      y,
      w: 6,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "at", 53.0, 70.9],
      ["2", "in", 65.4, 70.9],
      ["3", "on", 78.8, 70.9]
    ].map(([number, answer, x, y]) => ({
      id: `p63-preposition-chart-${number}`,
      label: `3b ${number}`,
      type: "select",
      options: ["in", "on", "at"],
      x,
      y,
      w: 6,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p63-past-sentence-practice",
      label: "1e",
      type: "text",
      x: 9.0,
      y: 97.0,
      w: 33,
      answer: "",
      free: true,
      compact: true,
      mini: true
    },
    {
      id: "p63-place-practice",
      label: "3d",
      type: "text",
      x: 51.0,
      y: 95.0,
      w: 31,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }
  ],
  64: [
    ...[
      ["2", "she was on a train|on a train", 17.5, 16.1, 30],
      ["3", "she was on a plane|on a plane", 17.5, 19.9, 30],
      ["4", "she was in a hotel|in a hotel", 17.5, 24.0, 34],
      ["5", "she was in the street|in the street", 17.5, 28.1, 34],
      ["6", "she was in a restaurant|in a restaurant", 17.5, 32.1, 34],
      ["7", "she was in bed|in bed", 17.5, 36.3, 31]
    ].map(([number, answer, x, y, w]) => ({
      id: `p64-jasons-wife-${number}`,
      label: `3e ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "Oxford", 62.5, 35.6, 14],
      ["2", "a hotel|hotel", 62.5, 38.9, 14],
      ["3", "a bank|bank", 62.5, 42.2, 14]
    ].map(([number, answer, x, y, w]) => ({
      id: `p64-video-a-${number}`,
      label: `5a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "T", 61.0, 46.6],
      ["2", "F", 61.0, 53.0],
      ["3", "F", 61.0, 58.4],
      ["4", "T", 61.0, 63.2],
      ["5", "F", 61.0, 69.7],
      ["6", "T", 61.0, 75.0],
      ["7", "F", 61.0, 80.6],
      ["8", "T", 61.0, 86.2],
      ["9", "T", 61.0, 91.1]
    ].map(([number, answer, x, y]) => ({
      id: `p64-video-tf-${number}`,
      label: `5b ${number}`,
      type: "select",
      options: ["T", "F"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", 9.8, 62.8],
      ["2", 9.8, 72.2],
      ["3", 9.8, 82.1],
      ["4", 9.8, 93.0]
    ].map(([number, x, y]) => ({
      id: `p64-speaking-answer-${number}`,
      label: `4b ${number}`,
      type: "text",
      x,
      y,
      w: 31,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    {
      id: "p64-video-opinion",
      label: "5c",
      type: "text",
      x: 62.5,
      y: 94.8,
      w: 31,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }
  ],
  65: [
    ...[
      ["1", "b", 14.2, 22.6],
      ["2", "a", 13.5, 27.0],
      ["3", "b", 13.5, 32.5],
      ["4", "a", 7.2, 38.0],
      ["5", "a", 25.0, 43.2],
      ["6", "a", 7.2, 49.0],
      ["7", "b", 7.2, 56.0],
      ["8", "b", 7.2, 62.1],
      ["9", "b", 17.2, 67.2],
      ["10", "a", 7.2, 72.6],
      ["11", "b", 26.0, 78.0],
      ["12", "a", 9.0, 83.4],
      ["13", "b", 19.0, 88.7],
      ["14", "a", 14.0, 94.0],
      ["15", "b", 7.2, 95.3]
    ].map(([number, answer, x, y]) => ({
      id: `p65-grammar-${number}`,
      label: `G ${number}`,
      type: "select",
      options: ["a", "b"],
      x,
      y,
      w: 4.5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "waiting", 57.0, 27.0, 11],
      ["2", "phoning", 69.0, 30.8, 11],
      ["3", "carrying", 76.4, 34.5, 11],
      ["4", "arriving", 69.5, 38.0, 11],
      ["5", "wearing", 72.5, 41.7, 11]
    ].map(([number, answer, x, y, w]) => ({
      id: `p65-vocab-verb-${number}`,
      label: `Va ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "dress", 59.2, 50.4, 10],
      ["2", "jacket", 72.7, 50.4, 10],
      ["3", "shirt", 86.5, 50.4, 10],
      ["4", "skirt", 45.5, 59.4, 10],
      ["5", "suit", 59.0, 59.4, 10],
      ["6", "trousers", 73.2, 59.4, 12],
      ["7", "hat", 88.5, 59.4, 9]
    ].map(([number, answer, x, y, w]) => ({
      id: `p65-clothes-${number}`,
      label: `Vb ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "Reception|reception", 75.5, 65.1, 13],
      ["2", "lift", 77.5, 68.5, 9],
      ["3", "gift shop", 77.0, 71.7, 14],
      ["4", "bathroom", 65.8, 75.1, 12],
      ["5", "car park", 73.8, 78.4, 14]
    ].map(([number, answer, x, y, w]) => ({
      id: `p65-hotel-word-${number}`,
      label: `Vc ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "under", 68.0, 84.4],
      ["2", "on", 68.0, 88.2],
      ["3", "on", 68.0, 92.0],
      ["4", "under", 68.0, 95.8],
      ["5", "in", 52.5, 94.5]
    ].map(([number, answer, x, y]) => ({
      id: `p65-room-prep-${number}`,
      label: `Vd ${number}`,
      type: "select",
      options: ["in", "on", "under"],
      x,
      y,
      w: 7,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "in", 81.5, 91.5],
      ["2", "on", 84.5, 95.1],
      ["3", "at", 70.2, 95.8]
    ].map(([number, answer, x, y]) => ({
      id: `p65-at-in-on-${number}`,
      label: `Ve ${number}`,
      type: "select",
      options: ["at", "in", "on"],
      x,
      y,
      w: 6,
      answer,
      compact: true,
      mini: true
    }))
  ],
  66: [
    ...[
      ["1", "bird", 16.0, 18.2],
      ["2", "egg", 16.0, 25.6],
      ["3", "chair", 36.6, 11.3],
      ["4", "ear", 36.6, 18.2],
      ["5", "train", 36.6, 25.6]
    ].map(([number, answer, x, y]) => ({
      id: `p66-sound-picture-${number}`,
      label: `Pa ${number}`,
      type: "select",
      options: ["bird", "egg", "chair", "ear", "train"],
      x,
      y,
      w: 8,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "travel", 9.0, 39.0, 10],
      ["2", "arrive", 22.0, 37.0, 10],
      ["3", "restaurant", 26.0, 39.0, 12],
      ["4", "cupboard", 39.0, 37.0, 12],
      ["5", "reception", 39.0, 39.0, 12]
    ].map(([number, answer, x, y, w]) => ({
      id: `p66-stress-${number}`,
      label: `Pc ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["A", "3", 6.6, 54.1],
      ["B", "6", 6.6, 61.6],
      ["C", "2", 6.6, 69.0],
      ["D", "5", 6.6, 76.5],
      ["E", "4", 6.6, 84.0],
      ["F", "1", 6.6, 91.4]
    ].map(([letter, answer, x, y]) => ({
      id: `p66-tweet-order-${letter}`,
      label: `Text ${letter}`,
      type: "select",
      options: ["1", "2", "3", "4", "5", "6"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "There's a balcony|balcony", 9.0, 97.0, 13],
      ["2", "feeling a bit nervous|nervous", 23.0, 97.0, 13],
      ["3", "We're having amazing tapas in a bar|amazing tapas|tapas", 35.8, 97.0, 13],
      ["4", "We're now lying on our bed|lying on our bed", 48.8, 97.0, 13]
    ].map(([number, answer, x, y, w]) => ({
      id: `p66-photo-match-${number}`,
      label: `Text b ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "a", 56.8, 22.7],
      ["2", "c", 56.8, 33.4],
      ["3", "c", 56.8, 45.0],
      ["4", "b", 56.8, 57.0],
      ["5", "b", 56.8, 70.2]
    ].map(([number, answer, x, y]) => ({
      id: `p66-people-${number}`,
      label: `People ${number}`,
      type: "select",
      options: ["a", "b", "c"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[1, 2, 3, 4, 5, 6].map((number, index) => ({
      id: `p66-can-say-${number}`,
      label: `Can ${number}`,
      type: "checkbox",
      x: 92.2,
      y: 81.0 + index * 2.8,
      w: 5,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ],
  67: [
    ...[
      ["1", "a", 12.2, 21.9],
      ["2", "b", 12.2, 26.6],
      ["3", "b", 12.2, 31.8]
    ].map(([number, answer, x, y]) => ({
      id: `p67-dominic-choice-${number}`,
      label: `1a ${number}`,
      type: "select",
      options: ["a", "b"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "F", 11.0, 36.1],
      ["2", "C", 11.0, 39.9],
      ["3", "D", 11.0, 43.4],
      ["4", "E", 11.0, 47.0],
      ["5", "A", 11.0, 51.4],
      ["6", "B", 11.0, 56.6]
    ].map(([number, answer, x, y]) => ({
      id: `p67-photo-match-${number}`,
      label: `1b ${number}`,
      type: "select",
      options: ["A", "B", "C", "D", "E", "F"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["booked", "booked", 30.7, 89.2, 12],
      ["arrived", "arrived", 30.7, 92.6, 12],
      ["didnt", "didn't|did not", 30.7, 95.8, 12]
    ].map(([key, answer, x, y, w]) => ({
      id: `p67-regular-chart-${key}`,
      label: `1c ${key}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "Yes", 84.0, 79.2],
      ["2", "No", 84.0, 82.6],
      ["3", "No", 84.0, 85.8],
      ["4", "No", 84.0, 89.0],
      ["5", "Yes", 84.0, 92.2],
      ["6", "No", 84.0, 95.4]
    ].map(([number, answer, x, y]) => ({
      id: `p67-did-answer-${number}`,
      label: `1e ${number}`,
      type: "select",
      options: ["Yes", "No"],
      x,
      y,
      w: 6,
      answer,
      compact: true,
      mini: true
    }))
  ],
  68: [
    ...[
      ["1", 42.0, 52.2],
      ["2", 42.0, 55.4],
      ["3", 42.0, 58.6],
      ["4", 42.0, 63.4],
      ["5", 42.0, 66.6],
      ["6", 42.0, 69.8],
      ["7", 42.0, 74.8],
      ["8", 42.0, 78.0],
      ["9", 42.0, 81.2]
    ].map(([number, x, y]) => ({
      id: `p68-speaking-did-${number}`,
      label: `3a ${number}`,
      type: "checkbox",
      x,
      y,
      w: 5,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    {
      id: "p68-usa-liked",
      label: "4a liked",
      type: "text",
      x: 50.0,
      y: 13.7,
      w: 39,
      answer: "They liked their house and Sacha liked his school|their house and Sacha's school|the house and Sacha's school",
      compact: true,
      mini: true
    },
    {
      id: "p68-usa-problem",
      label: "4a problem",
      type: "text",
      x: 50.0,
      y: 17.2,
      w: 39,
      answer: "They missed their friends and family; they didn't like the food; they needed to rent a car|They missed their friends and family and didn't like the food|missed friends and family, didn't like the food, needed to rent a car|They needed to rent a car",
      compact: true,
      mini: true
    },
    {
      id: "p68-title-country",
      label: "4b",
      type: "text",
      x: 80.0,
      y: 34.8,
      w: 11,
      answer: "the USA|USA",
      compact: true,
      mini: true
    },
    ...[
      ["1", "Miriam was very happy at work|Miriam really liked her job|very happy", 71.0, 72.4, 24],
      ["2", "Dominic worked from home|worked from home", 71.0, 75.5, 24],
      ["3", "Life in the USA was quite cheap|It was quite cheap|quite cheap|cheap", 71.0, 78.6, 24],
      ["4", "The children learned to swim|learned to swim|swim", 71.0, 81.7, 24],
      ["5", "The people in Durham were very friendly|very friendly", 71.0, 84.8, 24],
      ["6", "The National Parks were very different|very different|different", 71.0, 87.9, 24],
      ["7", "country music|They listened to country music", 71.0, 91.0, 24],
      ["8", "They stayed in Durham for one year|one year|for a year", 71.0, 94.1, 24],
      ["9", "because Miriam's job finished|Miriam's job finished|because his wife's job finished", 71.0, 96.8, 24]
    ].map(([number, answer, x, y, w]) => ({
      id: `p68-correct-info-${number}`,
      label: `4c ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p68-lived-abroad",
      label: "4d",
      type: "text",
      x: 50.5,
      y: 94.8,
      w: 18,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }
  ],
  69: [
    ...[
      ["have-breakfast", "breakfast|have breakfast", 77.0, 15.7, 11],
      ["have-coffee", "a coffee|coffee", 88.2, 17.7, 10],
      ["have-dinner", "dinner|have dinner", 75.0, 19.9, 10],
      ["have-lunch", "lunch|have lunch", 88.6, 20.8, 9],
      ["have-nice-day", "a nice day|nice day", 76.5, 23.1, 12],
      ["have-shower", "a shower|shower", 87.0, 23.8, 11],
      ["go-to-bed", "to bed|go to bed", 60.8, 28.7, 9],
      ["go-home", "home|go home", 69.2, 28.7, 9],
      ["go-out", "out|go out", 59.2, 32.5, 7],
      ["go-school", "to school|go to school", 66.7, 34.7, 11],
      ["do-homework", "homework|do homework", 79.6, 28.5, 12],
      ["do-housework", "housework|do housework", 86.8, 30.0, 11],
      ["do-sport", "sport|sports|do sport", 79.8, 33.3, 10],
      ["do-yoga", "yoga|do yoga", 90.0, 34.2, 8]
    ].map(([id, answer, x, y, w]) => ({
      id: `p69-vocab-${id}`,
      label: "1a",
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["home", 8.7, 49.0],
      ["museum", 8.7, 51.5],
      ["cafe", 32.9, 51.5]
    ].map(([id, x, y]) => ({
      id: `p69-place-${id}`,
      label: "2a",
      type: "checkbox",
      x,
      y,
      w: 4.5,
      answer: "true",
      compact: true,
      mini: true
    })),
    ...[
      ["1", "home", 81.5, 64.6, 11],
      ["2", "flight", 73.2, 67.8, 11],
      ["3", "classes|class", 71.6, 74.7, 11],
      ["4", "British", 57.6, 76.7, 11],
      ["5", "lunch", 68.0, 79.2, 10],
      ["6", "free", 67.8, 83.8, 9],
      ["7", "homework", 65.6, 87.5, 12],
      ["8", "week", 71.5, 90.9, 9],
      ["9", "mother", 71.5, 93.6, 10],
      ["10", "shopping", 80.6, 96.3, 12]
    ].map(([number, answer, x, y, w]) => ({
      id: `p69-dialogue-${number}`,
      label: `2b ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p69-noise",
      label: "2c",
      type: "text",
      x: 8.5,
      y: 59.4,
      w: 30,
      answer: "a boy in Linda's room|Dylan in Linda's room|a boy|Dylan",
      compact: true,
      mini: true
    },
    ...[
      ["get", "got", 43.5, 76.0],
      ["go", "went", 43.5, 80.0],
      ["have", "had", 43.5, 84.1],
      ["do", "did", 43.5, 88.2]
    ].map(([id, answer, x, y]) => ({
      id: `p69-grammar-${id}`,
      label: "3a",
      type: "text",
      x,
      y,
      w: 8,
      answer,
      compact: true,
      mini: true
    }))
  ],
  70: [
    {
      id: "p70-filmed-lives",
      label: "5a",
      type: "text",
      x: 8.5,
      y: 36.7,
      w: 34,
      answer: "They filmed their lives|People filmed their lives|filmed their lives",
      compact: true,
      mini: true
    },
    ...[
      ["1", "shaved", 73.7, 14.9, 11],
      ["2", "cleaned shoes|cleaned the shoes", 57.0, 30.1, 12],
      ["3a", "arrived", 75.3, 30.1, 8],
      ["3b", "Kathmandu", 83.5, 30.1, 10],
      ["4a", "did", 56.5, 44.7, 7],
      ["4b", "skydive|a skydive", 55.0, 47.5, 10],
      ["5", "got married|married", 79.5, 45.7, 13]
    ].map(([number, answer, x, y, w]) => ({
      id: `p70-caption-${number}`,
      label: `5b ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "normal things", 8.5, 54.0],
      ["2", "unusual things", 8.5, 57.3]
    ].map(([number, label, x, y]) => ({
      id: `p70-reading-free-${number}`,
      label: `5c ${number}`,
      type: "text",
      x,
      y,
      w: 36,
      answer: "",
      free: true,
      compact: true,
      mini: true
    })),
    ...[
      ["do", "did", 8.2, 65.4, 6],
      ["get-up", "got up", 13.7, 65.4, 8],
      ["go", "went", 21.6, 65.4, 7],
      ["have", "had", 27.8, 65.4, 6],
      ["open", "opened", 34.1, 65.4, 8],
      ["wash", "washed", 42.0, 65.4, 8],
      ["work", "worked", 50.0, 65.4, 8]
    ].map(([id, answer, x, y, w]) => ({
      id: `p70-past-${id}`,
      label: "5d",
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "got up", 20.2, 71.5, 10],
      ["2", "opened", 27.4, 76.7, 10],
      ["3", "did", 10.6, 82.1, 8],
      ["4", "worked", 10.6, 85.1, 10],
      ["5a", "went", 24.7, 88.3, 9],
      ["5b", "had", 32.4, 91.1, 8],
      ["6", "washed", 31.0, 95.5, 10]
    ].map(([number, answer, x, y, w]) => ({
      id: `p70-sentence-${number}`,
      label: `5e ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    }))
  ],
  71: [
    ...[
      ["A", "phone shop", 57.6, 47.1, 12],
      ["B", "Chinese restaurant|Chinese", 37.0, 67.2, 14],
      ["C", "park", 64.0, 71.0, 13],
      ["D", "coffee shop|cafe", 51.7, 84.6, 13]
    ].map(([letter, answer, x, y, w]) => ({
      id: `p71-map-place-${letter}`,
      label: `1b ${letter}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p71-pair-place",
      label: "1d",
      type: "text",
      x: 55.0,
      y: 38.0,
      w: 28,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }
  ],
  72: [
    ...[
      ["1", "C", 14.2, 34.8],
      ["2", "A", 28.0, 34.8],
      ["3", "B", 41.8, 34.8]
    ].map(([number, answer, x, y]) => ({
      id: `p72-direction-picture-${number}`,
      label: `2a ${number}`,
      type: "select",
      options: ["A", "B", "C"],
      x,
      y,
      w: 5,
      answer,
      compact: true,
      mini: true
    })),
    {
      id: "p72-bank-first",
      label: "2b",
      type: "select",
      options: ["A", "B", "C"],
      x: 38.0,
      y: 41.8,
      w: 5,
      answer: "B",
      compact: true,
      mini: true
    },
    {
      id: "p72-bank-now",
      label: "2d",
      type: "select",
      options: ["A", "B", "C"],
      x: 38.0,
      y: 90.0,
      w: 5,
      answer: "C",
      compact: true,
      mini: true
    },
    {
      id: "p72-phone-reason",
      label: "3a",
      type: "text",
      x: 52.5,
      y: 41.4,
      w: 40,
      answer: "To check she got his email about the hotel|He is phoning to check she got his email about the hotel|to check she got his email",
      compact: true,
      mini: true
    },
    ...[
      ["1", "Indigo", 65.3, 51.0, 9],
      ["2", "London", 75.0, 51.0, 9],
      ["3", "Station", 66.0, 56.0, 10],
      ["4", "airport", 70.0, 60.0, 10],
      ["5", "15|fifteen", 66.0, 63.8, 8],
      ["6", "left", 70.5, 70.0, 8],
      ["7", "straight on", 65.0, 74.0, 12],
      ["8", "right", 57.8, 78.1, 8],
      ["9", "opposite", 57.8, 82.0, 10]
    ].map(([number, answer, x, y, w]) => ({
      id: `p72-hotel-${number}`,
      label: `3b ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    }))
  ],
  73: [
    ...[
      ["1a", "stop", 24.0, 42.9, 8],
      ["1b", "arrive, exchange, move, phone|arrive exchange move phone", 24.0, 47.4, 19],
      ["1c", "start, wait|start wait", 24.0, 52.1, 13]
    ].map(([number, answer, x, y, w]) => ({
      id: `p73-regular-quiz-${number}`,
      label: number,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["buy", "bought", 18.0, 70.8],
      ["leave", "left", 18.0, 74.0],
      ["say", "said", 18.0, 77.2],
      ["see", "saw", 18.0, 80.4],
      ["send", "sent", 34.2, 70.8],
      ["sit", "sat", 34.2, 74.0],
      ["tell", "told", 34.2, 77.2],
      ["write", "wrote", 34.2, 80.4]
    ].map(([verb, answer, x, y]) => ({
      id: `p73-irregular-${verb}`,
      label: verb,
      type: "text",
      x,
      y,
      w: 9,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "at the station|on the platform|at the station / on the platform", 55.4, 89.8, 20],
      ["2", "Chanel No. 5|Chanel No 5", 55.4, 92.3, 15],
      ["3", "classical music|music", 55.4, 94.8, 14],
      ["4", "have a cup of coffee|to have a cup of coffee|a cup of coffee", 55.4, 97.2, 19]
    ].map(([number, answer, x, y, w]) => ({
      id: `p73-reading-${number}`,
      label: `2 ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    }))
  ],
  74: [
    ...[
      ["5", "She works in property|in property|flats and houses", 13.4, 43.2, 22],
      ["6", "He works for Citibank|Citibank|for Citibank", 13.4, 45.8, 18],
      ["7", "He lives in Chelsea and she lives near Chelsea|David lives near Chelsea and Olivia lives in Chelsea|Chelsea", 13.4, 48.4, 30],
      ["8", "Because she offered to drive him home|she offered to drive him home|to drive him home", 13.4, 51.0, 31]
    ].map(([number, answer, x, y, w]) => ({
      id: `p74-reading-${number}`,
      label: `2 ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1a", "go", ["go", "went"], 31.5, 59.5, 8],
      ["1b", "went", ["go", "went"], 31.5, 61.6, 8],
      ["1c", "buy", ["buy", "bought"], 31.5, 63.7, 9],
      ["1d", "bought", ["buy", "bought"], 31.5, 65.8, 9],
      ["1e", "Was", ["Did", "Was"], 31.5, 67.9, 8],
      ["1f", "wasn't", ["didn't", "wasn't"], 31.5, 70.0, 9],
      ["2a", "did you do", ["did you do", "did you"], 35.0, 74.1, 13],
      ["2b", "went", ["was", "went"], 31.5, 76.2, 8],
      ["2c", "saw", ["see", "saw"], 44.0, 76.2, 7],
      ["2d", "Did", ["Did", "Was"], 31.5, 78.3, 8],
      ["2e", "like", ["like", "liked"], 42.8, 78.3, 8],
      ["2f", "didn't like", ["didn't like", "didn't liked"], 34.8, 81.4, 13],
      ["2g", "was", ["was", "were"], 49.4, 81.4, 7]
    ].map(([number, answer, options, x, y, w]) => ({
      id: `p74-grammar-${number}`,
      label: `3a ${number}`,
      type: "select",
      options,
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "BMW|a BMW", 73.0, 38.8, 10],
      ["2", "two tickets for a Beethoven concert at the Royal Albert Hall|a Beethoven concert|Beethoven concert", 73.0, 42.1, 20],
      ["3a", "in the bar|bar", 69.0, 45.3, 10],
      ["3b", "7.30|7:30|at 7.30|at 7:30", 81.0, 45.3, 8]
    ].map(([number, answer, x, y, w]) => ({
      id: `p74-video-a-${number}`,
      label: `4a ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["1", "7.00|7:00|at 7.00|at 7:00", 76.0, 66.4, 9],
      ["2", "He got a message from Olivia. He left her ticket at the box office and sat down in his seat.|got a message from Olivia and left her ticket at the box office|got a message from Olivia", 76.0, 72.0, 18],
      ["3", "He phoned Olivia|phoned Olivia", 76.0, 77.4, 14],
      ["4", "He left the concert hall and went home|left the concert hall and went home", 76.0, 81.8, 18]
    ].map(([number, answer, x, y, w]) => ({
      id: `p74-video-b-${number}`,
      label: `4b ${number}`,
      type: "text",
      x,
      y,
      w,
      answer,
      compact: true,
      mini: true
    })),
    ...[
      ["5", 76.0, 87.4],
      ["6", 76.0, 92.2]
    ].map(([number, x, y]) => ({
      id: `p74-video-free-${number}`,
      label: `4b ${number}`,
      type: "text",
      x,
      y,
      w: 18,
      answer: "",
      free: true,
      compact: true,
      mini: true
    }))
  ]
};

init();

async function init() {
  try {
    const response = await fetch("public/manifest.json?v=20260612-bookmatter1", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Manifest load failed: ${response.status}`);
    }
    manifest = await response.json();
    pageInput.max = String(manifest.pageCount);
    pageTotal.textContent = `/ ${manifest.pageCount}`;
    populateLessonSelect();
    currentPage = clampPage(currentPage);
    bindEvents();
    renderPages({ resetScroll: true });
  } catch (error) {
    statusLine.textContent = "Не удалось загрузить учебник. Проверь, запущен ли локальный сервер.";
    console.error(error);
  }
}

function bindEvents() {
  prevPage.addEventListener("click", () => goToPage(currentPage - pageStep()));
  nextPage.addEventListener("click", () => goToPage(currentPage + pageStep()));
  pageInput.addEventListener("change", () => goToPage(Number(pageInput.value)));
  pageInput.addEventListener("blur", () => goToPage(Number(pageInput.value)));
  pageInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    goToPage(Number(pageInput.value));
    pageInput.blur();
  });
  lessonSelect.addEventListener("change", () => goToPage(Number(lessonSelect.value)));
  zoomSelect.addEventListener("change", renderPages);
  spreadMode.addEventListener("change", () => {
    currentPage = clampPage(currentPage);
    renderPages();
  });

  addField.addEventListener("click", () => {
    addMode = !addMode;
    if (addMode) templateMode = false;
    addField.classList.toggle("primary", addMode);
    addTemplate.classList.remove("primary");
    setStatus(addMode ? "Кликни по странице, где нужно добавить поле ответа." : "");
    document.querySelectorAll(".answer-layer").forEach((layer) => {
      layer.classList.toggle("armed", addMode || templateMode);
    });
  });

  addTemplate.addEventListener("click", () => {
    templateMode = !templateMode;
    if (templateMode) addMode = false;
    addTemplate.classList.toggle("primary", templateMode);
    addField.classList.remove("primary");
    setStatus(templateMode ? "Кликни в начале задания: здесь появится выбранный набор полей." : "");
    document.querySelectorAll(".answer-layer").forEach((layer) => {
      layer.classList.toggle("armed", addMode || templateMode);
    });
  });

  editFields.addEventListener("click", () => {
    editMode = !editMode;
    editFields.classList.toggle("primary", editMode);
    setStatus(editMode ? "Режим правки: перетаскивай личные поля за заголовок, меняй ширину круглой ручкой." : "");
    renderPages();
  });

  checkPage.addEventListener("click", checkVisiblePages);
  showAnswers.addEventListener("click", revealVisibleAnswers);
  clearPage.addEventListener("click", clearVisiblePages);
  importAnswers.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", importSavedAnswers);
  exportAnswers.addEventListener("click", exportAllAnswers);
  window.addEventListener("resize", renderPages);
  window.addEventListener("hashchange", handleHashChange);
}

function renderPages({ resetScroll = false } = {}) {
  if (!manifest) return;

  const pages = visiblePageNumbers();
  pagesHost.innerHTML = "";
  pageInput.value = String(currentPage);
  syncLessonSelect();
  updateNavState();

  pages.forEach((pageNumber) => {
    const meta = manifest.pages[pageNumber - 1];
    const nativeLesson = nativeLessonForPage(pageNumber);
    const node = pageTemplate.content.firstElementChild.cloneNode(true);
    const surface = node.querySelector(".page-surface");
    const image = node.querySelector(".page-image");
    const layer = node.querySelector(".answer-layer");

    node.dataset.page = String(pageNumber);
    node.querySelector(".page-label").textContent = nativeLesson ? `${nativeLesson.title} · native` : `Страница ${pageNumber}`;
    if (nativeLesson) {
      renderNativeLessonPage({ surface, image, layer, pageNumber, nativeLesson });
      pagesHost.appendChild(node);
      return;
    }

    surface.style.setProperty("--page-width", `${pageWidth(meta)}px`);
    image.src = `public/${meta.file}`;
    image.alt = `${manifest.title}, страница ${pageNumber}`;
    layer.dataset.page = String(pageNumber);
    layer.classList.toggle("armed", addMode || templateMode);
    layer.addEventListener("click", handleLayerClick);

    widgetsForPage(pageNumber).forEach((widget) => {
      layer.appendChild(renderWidget(pageNumber, widget));
    });

    pagesHost.appendChild(node);
  });

  const nativeLesson = nativeLessonForVisiblePages(pages);
  if (nativeLesson) {
    setStatus(`${nativeLesson.title}: нативная интерактивная страница. Поля, ответы или заметки находятся внутри урока.`);
    if (resetScroll) resetReaderScroll();
    return;
  }

  const builtIns = pages.flatMap((page) => builtInWidgets[page] || []);
  const checkedBuiltIns = builtIns.filter((widget) => !widget.free && widget.answer);
  const freeBuiltIns = builtIns.filter((widget) => widget.free || !widget.answer);
  const customCount = pages.reduce((total, page) => total + (customFields[page] || []).length, 0);
  const parts = [`Показаны страницы ${pages.join(" и ")} из ${manifest.pageCount}`];
  if (checkedBuiltIns.length) parts.push(`проверяемых полей: ${checkedBuiltIns.length}`);
  if (freeBuiltIns.length) parts.push(`свободных полей: ${freeBuiltIns.length}`);
  if (customCount) parts.push(`личных полей: ${customCount}`);
  setStatus(parts.join("; "));
  if (resetScroll) resetReaderScroll();
}

function resetReaderScroll() {
  const reset = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });

  clearTimeout(resetScrollTimer);
  reset();
  resetScrollTimer = setTimeout(() => {
    reset();
    resetScrollTimer = null;
  }, 0);
}

function renderNativeLessonPage({ surface, image, layer, nativeLesson }) {
  surface.classList.add("native-lesson-surface");
  surface.style.setProperty("--page-width", `${nativePageWidth()}px`);
  image.remove();
  layer.remove();

  const embed = document.createElement("div");
  embed.className = "native-lesson-embed";
  embed.dataset.src = nativeLesson.url;
  surface.appendChild(embed);
  loadNativeLessonEmbed(embed, nativeLesson.url);
}

async function loadNativeLessonEmbed(embed, url) {
  const shadow = embed.attachShadow({ mode: "open" });
  shadow.innerHTML = `<div class="native-loading">Loading ${escapeHtml(embed.dataset.src || "lesson")}...</div>`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Native lesson load failed: ${response.status}`);

    const lessonUrl = new URL(url, location.href);
    const baseUrl = new URL(lessonUrl.href);
    baseUrl.pathname = baseUrl.pathname.replace(/[^/]*$/, "");
    baseUrl.search = "";
    baseUrl.hash = "";

    const html = await response.text();
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const lessonJson = parsed.querySelector("#lesson-json")?.textContent || "{}";
    const lesson = JSON.parse(lessonJson);

    shadow.innerHTML = "";
    const hostStyle = document.createElement("style");
    hostStyle.textContent = `
      :host {
        display: block;
        min-height: 860px;
        background: transparent;
        color: var(--ink, #111827);
        font-family: Inter, Arial, Helvetica, sans-serif;
      }
      .native-shadow-content {
        min-height: inherit;
      }
      .native-loading,
      .native-error {
        min-height: 260px;
        display: grid;
        place-items: center;
        border-radius: 8px;
        background: #fff;
        color: #111827;
        font: 700 16px Arial, sans-serif;
        box-shadow: 0 18px 48px rgba(15, 23, 42, 0.12);
      }
      .native-error {
        color: #9f2f1d;
      }
    `;
    shadow.appendChild(hostStyle);

    for (const link of parsed.querySelectorAll('link[rel="stylesheet"]')) {
      const href = link.getAttribute("href");
      if (!href) continue;
      const stylesheetUrl = new URL(href, baseUrl.href).href;

      try {
        const stylesheetResponse = await fetch(stylesheetUrl, { cache: "no-store" });
        if (!stylesheetResponse.ok) throw new Error(`Stylesheet load failed: ${stylesheetResponse.status}`);

        const stylesheet = document.createElement("style");
        stylesheet.textContent = rewriteNativeCssUrls((await stylesheetResponse.text()).replace(/:root\b/g, ":host"), stylesheetUrl);
        shadow.appendChild(stylesheet);
      } catch (error) {
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = stylesheetUrl;
        shadow.appendChild(stylesheet);
        console.warn("Falling back to linked native stylesheet", error);
      }
    }

    const content = document.createElement("div");
    content.className = "native-shadow-content";
    Array.from(parsed.body.children).forEach((child) => {
      if (child.matches("script")) return;
      content.appendChild(document.importNode(child, true));
    });
    rewriteNativeAssetUrls(content, baseUrl.href);
    shadow.appendChild(content);
    initEmbeddedNativeLesson(shadow, lesson);
  } catch (error) {
    shadow.innerHTML = `<div class="native-error">Could not load native lesson.</div>`;
    console.error(error);
  }
}

function rewriteNativeCssUrls(css, baseUrl) {
  return css.replace(/url\((['"]?)(?!data:|https?:|\/|#)([^'")]+)\1\)/g, (_, quote, value) => {
    const trimmed = value.trim();
    return `url("${new URL(trimmed, baseUrl).href}")`;
  });
}

function rewriteNativeAssetUrls(root, baseUrl) {
  root.querySelectorAll("[src]").forEach((node) => {
    const value = node.getAttribute("src");
    if (value && !value.startsWith("data:")) node.setAttribute("src", new URL(value, baseUrl).href);
  });
  root.querySelectorAll("[poster]").forEach((node) => {
    const value = node.getAttribute("poster");
    if (value && !value.startsWith("data:")) node.setAttribute("poster", new URL(value, baseUrl).href);
  });
  root.querySelectorAll("a[href]").forEach((node) => {
    const value = node.getAttribute("href");
    if (value && !value.startsWith("#")) node.setAttribute("href", new URL(value, baseUrl).href);
  });
}

function initEmbeddedNativeLesson(root, lesson) {
  const storagePrefix = "ef-native-attempt:";
  const fields = lesson.fields || [];
  const fieldById = Object.fromEntries(fields.map((field) => [field.id, field]));
  const scorable = () => fields.filter((field) => !field.readonly && !field.free);
  const fillable = () => fields.filter((field) => !field.readonly);
  const byId = (id) => root.getElementById(id);
  let toastTimer;

  const normalize = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[’`´]/g, "'")
      .replace(/\s+/g, " ")
      .replace(/[^a-z0-9']/g, "")
      .replace(/'/g, "");

  const fieldSelector = (field) => `[data-field-id="${CSS.escape(field.id)}"]`;
  const controlFor = (field) => root.querySelector(fieldSelector(field));
  const expected = (field) => (field.answers || []).map(normalize).filter(Boolean);
  const isCorrect = (field, value) => {
    const normalized = normalize(value);
    return !!normalized && expected(field).includes(normalized);
  };
  const storageKey = () => `${storagePrefix}${lesson.lesson_id}`;

  const valueFor = (field) => {
    const control = controlFor(field);
    if (!control) return "";
    if (control.type === "checkbox" || control.type === "radio") return control.checked ? control.value : "";
    return control.value || "";
  };

  const setValue = (field, value) => {
    const control = controlFor(field);
    if (!control) return;
    if (control.type === "checkbox" || control.type === "radio") {
      control.checked = normalize(control.value) === normalize(value);
      return;
    }
    control.value = value || "";
  };

  const readValues = () => Object.fromEntries(fields.map((field) => [field.id, valueFor(field)]));

  const writeValues = (values) => {
    fields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(values, field.id)) setValue(field, values[field.id]);
    });
  };

  const saveValues = () => {
    localStorage.setItem(storageKey(), JSON.stringify({ values: readValues(), updated_at: new Date().toISOString() }));
  };

  const clearState = (control) => control?.classList.remove("state-ok", "state-bad", "state-empty");

  const updateProgress = () => {
    const activeFields = fillable();
    const values = readValues();
    const filled = activeFields.filter((field) => String(values[field.id] || "").trim()).length;
    const pct = activeFields.length ? Math.round((filled / activeFields.length) * 100) : 0;
    const progressBar = byId("progressBar");
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (byId("progressText")) byId("progressText").textContent = `${pct}%`;
    if (byId("filledStat")) byId("filledStat").textContent = String(filled);
    if (byId("totalStat")) byId("totalStat").textContent = String(activeFields.length);
  };

  const grade = () => {
    const values = readValues();
    let correct = 0;
    scorable().forEach((field) => {
      if (isCorrect(field, values[field.id])) correct += 1;
    });
    const total = scorable().length;
    return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0, values };
  };

  const showToast = (message) => {
    const toast = byId("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  };

  const installInlineAnswerStyles = () => {
    if (root.getElementById("nativeInlineAnswerStyles")) return;
    const style = document.createElement("style");
    style.id = "nativeInlineAnswerStyles";
    style.textContent = `
      .native-answer-hint {
        display: inline-flex;
        align-items: center;
        min-height: 22px;
        max-width: min(260px, 70vw);
        margin-left: 6px;
        padding: 2px 7px;
        border: 1px solid #f4a8a1;
        border-radius: 7px;
        background: #fff7f5;
        color: #982f23;
        font: 800 12px/1.25 Arial, Helvetica, sans-serif;
        box-shadow: 0 6px 14px rgba(120, 40, 30, .12);
        vertical-align: middle;
        white-space: normal;
        overflow-wrap: anywhere;
      }
      .native-answer-hint::before {
        content: "Answer:";
        margin-right: 4px;
        color: #7a231a;
        font-weight: 900;
      }
      .native-answer-hint.overlay {
        position: absolute;
        z-index: 12;
        margin: 0;
        transform: translate(4px, -1px);
        pointer-events: none;
      }
      .native-answer-reveal {
        width: 24px;
        height: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 4px;
        border: 1px solid #b7c7df;
        border-radius: 50%;
        background: #fff;
        color: #26588f;
        font: 900 13px/1 Arial, Helvetica, sans-serif;
        box-shadow: 0 5px 12px rgba(35, 70, 110, .14);
        cursor: pointer;
        opacity: .42;
        vertical-align: middle;
      }
      .native-answer-reveal:hover,
      .native-answer-reveal:focus {
        border-color: #26588f;
        background: #eef6ff;
        outline: none;
        opacity: 1;
      }
      .native-answer-reveal.overlay {
        position: absolute;
        z-index: 13;
        margin: 0;
        transform: translate(4px, -2px);
      }
      .native-zoomable-image {
        cursor: zoom-in;
      }
      .native-image-zoom {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 18px;
        border: 0;
        background: rgba(12, 17, 28, .86);
        cursor: zoom-out;
      }
      .native-image-zoom img {
        display: block;
        max-width: 96vw;
        max-height: 92vh;
        width: auto;
        height: auto;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 28px 80px rgba(0, 0, 0, .42);
      }
      .native-image-zoom button {
        position: fixed;
        top: 14px;
        right: 14px;
        width: 38px;
        height: 38px;
        border: 1px solid rgba(255, 255, 255, .42);
        border-radius: 50%;
        background: rgba(255, 255, 255, .94);
        color: #172033;
        font: 900 22px/1 Arial, Helvetica, sans-serif;
        cursor: pointer;
      }
      .answer.state-ok + .native-answer-hint,
      .answer:focus + .native-answer-hint {
        display: none;
      }
      @media (max-width: 760px) {
        .native-answer-hint {
          font-size: 11px;
          padding: 2px 5px;
        }
      }
    `;
    root.appendChild(style);
  };

  const answerText = (field) => String((field.answers || []).find((answer) => String(answer || "").trim()) || "");

  const removeAnswerHint = (field) => {
    root.querySelector(`[data-answer-hint-for="${CSS.escape(field.id)}"]`)?.remove();
  };

  const positionOverlayHint = (hint, control) => {
    const x = Number.parseFloat(control.style.getPropertyValue("--x"));
    const y = Number.parseFloat(control.style.getPropertyValue("--y"));
    const w = Number.parseFloat(control.style.getPropertyValue("--w"));
    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
    hint.classList.add("overlay");
    hint.style.left = `${Math.min(95, x + (Number.isFinite(w) ? w : 0))}%`;
    hint.style.top = `${y}%`;
    control.parentElement?.appendChild(hint);
    return true;
  };

  const showAnswerHint = (field) => {
    const control = controlFor(field);
    const answer = answerText(field);
    if (!control || !answer) return;
    removeAnswerHint(field);
    const hint = document.createElement("span");
    hint.className = "native-answer-hint";
    hint.dataset.answerHintFor = field.id;
    hint.textContent = answer;
    const isOverlay = control.classList.contains("overlay-field") || getComputedStyle(control).position === "absolute";
    if (isOverlay && positionOverlayHint(hint, control)) return;
    control.insertAdjacentElement("afterend", hint);
  };

  const clearAnswerHints = () => {
    root.querySelectorAll(".native-answer-hint").forEach((hint) => hint.remove());
  };

  const removeRevealButtons = () => {
    root.querySelectorAll(".native-answer-reveal").forEach((button) => button.remove());
  };

  const positionOverlayReveal = (button, control) => {
    const x = Number.parseFloat(control.style.getPropertyValue("--x"));
    const y = Number.parseFloat(control.style.getPropertyValue("--y"));
    const w = Number.parseFloat(control.style.getPropertyValue("--w"));
    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
    button.classList.add("overlay");
    button.style.left = `${Math.min(96, x + (Number.isFinite(w) ? w : 0))}%`;
    button.style.top = `${y}%`;
    control.parentElement?.appendChild(button);
    return true;
  };

  const revealSingleAnswer = (field) => {
    const answer = answerText(field);
    const control = controlFor(field);
    if (!answer || !control) return;
    setValue(field, answer);
    clearState(control);
    control.classList.add("state-ok");
    removeAnswerHint(field);
    root.querySelector(`[data-answer-reveal-for="${CSS.escape(field.id)}"]`)?.remove();
    updateProgress();
    saveValues();
    if (byId("resultBox")) byId("resultBox").textContent = "Answer inserted for this field.";
    showToast("Answer inserted.");
  };

  const showAnswerReveal = (field) => {
    const control = controlFor(field);
    if (!control || field.readonly || field.free || !answerText(field)) return;
    if (root.querySelector(`[data-answer-reveal-for="${CSS.escape(field.id)}"]`)) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "native-answer-reveal";
    button.dataset.answerRevealFor = field.id;
    button.setAttribute("aria-label", "Show answer for this field");
    button.title = "Show answer for this field";
    button.textContent = "?";
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () => revealSingleAnswer(field));
    const isOverlay = control.classList.contains("overlay-field") || getComputedStyle(control).position === "absolute";
    if (isOverlay && positionOverlayReveal(button, control)) return;
    control.insertAdjacentElement("afterend", button);
  };

  const initAnswerReveals = () => {
    scorable().forEach(showAnswerReveal);
  };

  const closeImageZoom = () => {
    root.querySelector(".native-image-zoom")?.remove();
  };

  const openImageZoom = (image) => {
    closeImageZoom();
    const overlay = document.createElement("div");
    overlay.className = "native-image-zoom";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Enlarged exercise image");
    const zoomed = document.createElement("img");
    zoomed.src = image.currentSrc || image.src;
    zoomed.alt = image.alt || "";
    const close = document.createElement("button");
    close.type = "button";
    close.setAttribute("aria-label", "Close image");
    close.textContent = "x";
    overlay.append(zoomed, close);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target === close) closeImageZoom();
    });
    root.appendChild(overlay);
    close.focus();
  };

  const initImageZoom = () => {
    root.querySelectorAll(".dialogue-card img, .grammar-photo img, .photo-option img, .goodbye-card img").forEach((image) => {
      if (image.dataset.nativeZoomReady === "true") return;
      image.dataset.nativeZoomReady = "true";
      image.classList.add("native-zoomable-image");
      image.setAttribute("title", "Click to enlarge");
      image.addEventListener("click", () => openImageZoom(image));
    });
  };

  const check = () => {
    const result = grade();
    clearAnswerHints();
    if (!result.total) {
      if (byId("scoreStat")) byId("scoreStat").textContent = "-";
      if (byId("percentStat")) byId("percentStat").textContent = "-";
      if (byId("resultBox")) byId("resultBox").textContent = "This section has no fixed answers. Notes saved.";
      saveValues();
      showToast("Notes saved.");
      return;
    }
    scorable().forEach((field) => {
      const control = controlFor(field);
      clearState(control);
      const value = valueFor(field);
      if (!String(value).trim()) control?.classList.add("state-empty");
      else if (isCorrect(field, value)) control?.classList.add("state-ok");
      else control?.classList.add("state-bad");
      if (!String(value).trim() || !isCorrect(field, value)) showAnswerHint(field);
    });
    if (byId("scoreStat")) byId("scoreStat").textContent = String(result.correct);
    if (byId("percentStat")) byId("percentStat").textContent = `${result.percent}%`;
    if (byId("resultBox")) byId("resultBox").textContent = `Checked: ${result.correct}/${result.total} correct (${result.percent}%). Corrections are shown next to the fields.`;
    saveValues();
    showToast(`Checked: ${result.correct}/${result.total}`);
  };

  const showAnswers = () => {
    removeRevealButtons();
    clearAnswerHints();
    if (!scorable().length) {
      updateProgress();
      saveValues();
      if (byId("scoreStat")) byId("scoreStat").textContent = "-";
      if (byId("percentStat")) byId("percentStat").textContent = "-";
      if (byId("resultBox")) byId("resultBox").textContent = "No fixed answers for this section.";
      showToast("No fixed answers.");
      return;
    }
    scorable().forEach((field) => {
      setValue(field, field.answers?.[0] || "");
      const control = controlFor(field);
      clearState(control);
      control?.classList.add("state-ok");
    });
    updateProgress();
    saveValues();
    if (byId("scoreStat")) byId("scoreStat").textContent = String(scorable().length);
    if (byId("percentStat")) byId("percentStat").textContent = "100%";
    if (byId("resultBox")) byId("resultBox").textContent = "Answers inserted.";
    showToast("Answers inserted.");
  };

  const reset = () => {
    removeRevealButtons();
    clearAnswerHints();
    fillable().forEach((field) => {
      setValue(field, "");
      clearState(controlFor(field));
    });
    localStorage.removeItem(storageKey());
    updateProgress();
    initAnswerReveals();
    if (byId("scoreStat")) byId("scoreStat").textContent = "-";
    if (byId("percentStat")) byId("percentStat").textContent = "-";
    if (byId("resultBox")) byId("resultBox").textContent = "Fields reset.";
    showToast("Reset.");
  };

  const exportAttempt = () => {
    const payload = {
      lesson_id: lesson.lesson_id,
      exported_at: new Date().toISOString(),
      values: readValues(),
      score: grade()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${lesson.lesson_id || "native_lesson"}_attempt.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const initGameBoard = () => {
    const rollButton = byId("rollDie");
    const resetButton = byId("resetToken");
    const dieValue = byId("dieValue");
    if (!rollButton || !resetButton || !dieValue || rollButton.dataset.nativeGameReady === "true") return;

    rollButton.dataset.nativeGameReady = "true";
    let position = 0;

    const setPosition = (next) => {
      position = Math.max(0, Math.min(30, next));
      root.querySelectorAll(".square.current").forEach((square) => square.classList.remove("current"));
      if (position > 0) {
        const current = root.querySelector(`.square[data-square="${position}"]`);
        current?.classList.add("current");
        current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    rollButton.addEventListener("click", () => {
      const roll = Math.floor(Math.random() * 6) + 1;
      dieValue.textContent = String(roll);
      setPosition(position + roll);
    });

    resetButton.addEventListener("click", () => {
      dieValue.textContent = "-";
      setPosition(0);
      root.querySelector(".game-board")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const shipStates = ["", "ship", "hit", "miss"];
  const shipMarks = {
    ship: "S",
    hit: "H",
    miss: "X"
  };

  const buildShipGrid = (board) => {
    const grid = board.querySelector(".ship-grid");
    if (!grid || grid.children.length) return;
    "ABCDEFGHIJ".split("").forEach((row) => {
      for (let column = 1; column <= 10; column += 1) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "ship-cell";
        cell.dataset.cell = `${row}${column}`;
        cell.dataset.state = "";
        cell.setAttribute("aria-label", `${row}${column}`);
        cell.setAttribute("aria-pressed", "false");
        grid.appendChild(cell);
      }
    });
  };

  const serializeShipBoard = (board) =>
    [...board.querySelectorAll(".ship-cell")]
      .map((cell) => `${cell.dataset.cell}:${cell.dataset.state || ""}`)
      .filter((entry) => !entry.endsWith(":"))
      .join(";");

  const applyShipBoardValue = (board, value) => {
    const states = Object.fromEntries(
      String(value || "")
        .split(";")
        .map((entry) => entry.split(":"))
        .filter(([cell, state]) => cell && shipStates.includes(state))
    );
    board.querySelectorAll(".ship-cell").forEach((cell) => {
      const state = states[cell.dataset.cell] || "";
      cell.dataset.state = state;
      cell.textContent = shipMarks[state] || "";
      cell.setAttribute("aria-pressed", state ? "true" : "false");
    });
  };

  const syncShipBoardValue = (board) => {
    const fieldId = board.dataset.boardFieldId;
    const control = root.querySelector(`[data-field-id="${CSS.escape(fieldId)}"]`);
    if (!control) return;
    control.value = serializeShipBoard(board);
    clearState(control);
    updateProgress();
    saveValues();
  };

  const initShipBoards = () => {
    root.querySelectorAll(".ship-board[data-board-field-id]").forEach((board) => {
      buildShipGrid(board);
      applyShipBoardValue(board, valueFor({ id: board.dataset.boardFieldId }));
      if (board.dataset.nativeBoardReady === "true") return;
      board.dataset.nativeBoardReady = "true";
      board.querySelectorAll(".ship-cell").forEach((cell) => {
        cell.addEventListener("click", () => {
          const currentIndex = shipStates.indexOf(cell.dataset.state || "");
          const nextState = shipStates[(currentIndex + 1) % shipStates.length];
          cell.dataset.state = nextState;
          cell.textContent = shipMarks[nextState] || "";
          cell.setAttribute("aria-pressed", nextState ? "true" : "false");
          syncShipBoardValue(board);
        });
      });
    });
  };

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey()) || "{}");
    if (saved.values) writeValues(saved.values);
  } catch (error) {
    localStorage.removeItem(storageKey());
  }

  root.querySelectorAll("[data-field-id]").forEach((control) => {
    const field = fieldById[control.dataset.fieldId];
    if (!field) return;
    if (field.readonly) {
      control.value = field.initial_value || field.answers?.[0] || "";
      control.setAttribute("readonly", "readonly");
    }
    control.addEventListener("input", () => {
      clearState(control);
      removeAnswerHint(field);
      if (!field.free && answerText(field)) showAnswerReveal(field);
      updateProgress();
      saveValues();
    });
    control.addEventListener("change", () => {
      clearState(control);
      removeAnswerHint(field);
      if (!field.free && answerText(field)) showAnswerReveal(field);
      updateProgress();
      saveValues();
    });
    control.addEventListener("focus", () => showAnswerReveal(field));
  });

  installInlineAnswerStyles();
  initAnswerReveals();
  initShipBoards();
  updateProgress();
  byId("checkBtn")?.addEventListener("click", check);
  byId("answersBtn")?.addEventListener("click", showAnswers);
  byId("resetBtn")?.addEventListener("click", () => {
    reset();
    initShipBoards();
  });
  byId("exportBtn")?.addEventListener("click", exportAttempt);
  initGameBoard();
  initImageZoom();
  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeImageZoom();
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function nativeLessonForPage(pageNumber) {
  return nativeLessons.find((lesson) => pageNumber >= lesson.startPage && pageNumber <= lesson.endPage) || null;
}

function nativeLessonForVisiblePages(pages) {
  return pages.map(nativeLessonForPage).find(Boolean) || null;
}

function populateLessonSelect() {
  lessonSelect.innerHTML = "";
  lessonIndex.forEach((item) => {
    lessonSelect.appendChild(new Option(item.title, String(item.page)));
  });
}

function syncLessonSelect() {
  const current = [...lessonIndex].reverse().find((item) => currentPage >= item.page) || lessonIndex[0];
  lessonSelect.value = String(current.page);
}

function renderWidget(pageNumber, widget) {
  const box = document.createElement("div");
  box.className = "answer-widget";
  if (widget.compact) box.classList.add("compact");
  if (widget.mini) box.classList.add("mini");
  if (widget.custom) box.classList.add("note", "custom-field");
  if (widget.custom && editMode) box.classList.add("editing");
  if (widget.custom && widget.answer) box.classList.add("has-key");
  box.style.setProperty("--x", widget.x);
  box.style.setProperty("--y", widget.y);
  box.style.setProperty("--w", widget.w || 18);
  box.dataset.id = widget.id;
  box.dataset.page = String(pageNumber);
  box.dataset.answer = widget.answer || "";
  box.dataset.free = widget.free ? "true" : "false";

  const label = document.createElement("div");
  label.className = "label";
  const labelText = document.createElement("span");
  labelText.className = "label-text";
  labelText.textContent = widget.label || "Ответ";
  label.appendChild(labelText);

  if (widget.custom) {
    const tools = document.createElement("span");
    tools.className = "field-tools";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.title = "Удалить поле";
    remove.textContent = "x";
    remove.addEventListener("click", () => removeCustomField(pageNumber, widget.id));
    tools.appendChild(remove);
    label.appendChild(tools);
  }

  const control = createControl(widget);
  setControlValue(control, widget, valueFor(widget));
  control.addEventListener("input", () => saveWidgetValue(pageNumber, widget, getControlValue(control, widget)));
  control.addEventListener("change", () => saveWidgetValue(pageNumber, widget, getControlValue(control, widget)));

  const feedback = document.createElement("div");
  feedback.className = "feedback";

  box.append(label, control, feedback);

  if (widget.custom) {
    const editor = renderCustomFieldEditor(pageNumber, widget, labelText);
    box.appendChild(editor);

    labelText.addEventListener("pointerdown", (event) => startDragCustomField(event, pageNumber, widget, box));
    const resize = document.createElement("div");
    resize.className = "resize-handle";
    resize.title = "Изменить ширину";
    resize.addEventListener("pointerdown", (event) => startResizeCustomField(event, pageNumber, widget, box));
    box.appendChild(resize);
  }

  return box;
}

function createControl(widget) {
  if (widget.type === "select") {
    const select = document.createElement("select");
    select.appendChild(new Option("", ""));
    (widget.options || []).forEach((option) => {
      select.appendChild(new Option(option, option));
    });
    return select;
  }

  if (widget.type === "textarea") {
    const textarea = document.createElement("textarea");
    textarea.rows = 3;
    textarea.placeholder = "Напиши ответ здесь";
    return textarea;
  }

  if (widget.type === "checkbox") {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.title = widget.label || "Отметить";
    return checkbox;
  }

  const input = document.createElement("input");
  input.type = "text";
  input.autocomplete = "off";
  input.placeholder = "Ответ";
  return input;
}

function getControlValue(control, widget) {
  if (widget.type === "checkbox") return control.checked ? "true" : "";
  return control.value;
}

function setControlValue(control, widget, value) {
  if (widget.type === "checkbox") {
    control.checked = value === true || value === "true";
    return;
  }
  control.value = value || "";
}

function renderCustomFieldEditor(pageNumber, widget, labelText) {
  const editor = document.createElement("div");
  editor.className = "field-editor";

  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Название";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = widget.label || "";
  titleInput.placeholder = "Например: Exercise 3a";
  titleInput.addEventListener("pointerdown", (event) => event.stopPropagation());
  titleInput.addEventListener("input", () => {
    labelText.textContent = titleInput.value || "Ответ";
    updateCustomField(pageNumber, widget.id, { label: titleInput.value || "Ответ" });
  });
  titleLabel.appendChild(titleInput);

  const answerLabel = document.createElement("label");
  answerLabel.textContent = "Правильный ответ";
  const answerInput = document.createElement("input");
  answerInput.type = "text";
  answerInput.value = widget.answer || "";
  answerInput.placeholder = "Оставь пустым для свободного ответа";
  answerInput.addEventListener("pointerdown", (event) => event.stopPropagation());
  answerInput.addEventListener("input", () => {
    const answer = answerInput.value;
    updateCustomField(pageNumber, widget.id, { answer });
    const box = answerInput.closest(".answer-widget");
    box.dataset.answer = answer;
    box.dataset.free = answer ? "false" : "true";
    box.classList.toggle("has-key", Boolean(answer));
    box.classList.remove("correct", "incorrect", "unchecked");
    box.querySelector(".feedback").textContent = answer ? "Ключ сохранен" : "Свободный ответ";
  });
  answerLabel.appendChild(answerInput);

  editor.append(titleLabel, answerLabel);
  return editor;
}

function widgetsForPage(pageNumber) {
  const builtIns = (builtInWidgets[pageNumber] || []).map((widget) => ({ ...widget, custom: false }));
  const customs = (customFields[pageNumber] || []).map((widget) => ({ ...widget, custom: true }));
  return [...builtIns, ...customs];
}

function handleLayerClick(event) {
  if ((!addMode && !templateMode) || event.target !== event.currentTarget) return;

  const layer = event.currentTarget;
  const pageNumber = Number(layer.dataset.page);
  const point = pointFromLayerEvent(event, layer);

  if (templateMode) {
    addTemplateFields(pageNumber, point);
    templateMode = false;
    addTemplate.classList.remove("primary");
    renderPages();
    return;
  }

  addSingleCustomField(pageNumber, point);
  addMode = false;
  addField.classList.remove("primary");
  renderPages();
}

function pointFromLayerEvent(event, layer) {
  const rect = layer.getBoundingClientRect();
  return {
    x: Number(clamp(((event.clientX - rect.left) / rect.width) * 100, 1, 88).toFixed(2)),
    y: Number(clamp(((event.clientY - rect.top) / rect.height) * 100, 1, 94).toFixed(2))
  };
}

function addSingleCustomField(pageNumber, point) {
  const type = fieldType.value === "textarea" ? "textarea" : "text";
  const field = {
    id: `custom-${Date.now()}`,
    label: type === "textarea" ? "Развернутый ответ" : "Мой ответ",
    type,
    x: point.x,
    y: point.y,
    w: type === "textarea" ? 30 : 18,
    answer: "",
    value: ""
  };

  customFields[pageNumber] = [...(customFields[pageNumber] || []), field];
  saveJson(STORAGE_CUSTOM, customFields);
}

function addTemplateFields(pageNumber, point) {
  const now = Date.now();
  const template = templateSelect.value;
  const fields = [];

  const addFieldFromTemplate = (field, index) => {
    fields.push({
      id: `custom-${now}-${index}`,
      answer: "",
      value: "",
      ...field,
      x: Number(clamp(field.x, 1, 88).toFixed(2)),
      y: Number(clamp(field.y, 1, 94).toFixed(2))
    });
  };

  if (template === "writing") {
    addFieldFromTemplate(
      {
        label: "Развернутый ответ",
        type: "textarea",
        x: point.x,
        y: point.y,
        w: 38
      },
      0
    );
  } else if (template === "checks6") {
    Array.from({ length: 6 }).forEach((_, index) => {
      addFieldFromTemplate(
        {
          label: `Готово ${index + 1}`,
          type: "checkbox",
          x: point.x,
          y: point.y + index * 4.3,
          w: 18
        },
        index
      );
    });
  } else if (template === "twoColumn10") {
    Array.from({ length: 10 }).forEach((_, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      addFieldFromTemplate(
        {
          label: `Ответ ${index + 1}`,
          type: "text",
          x: point.x + col * 21,
          y: point.y + row * 5.2,
          w: 17
        },
        index
      );
    });
  } else {
    const count = template === "short10" ? 10 : 5;
    Array.from({ length: count }).forEach((_, index) => {
      addFieldFromTemplate(
        {
          label: `Ответ ${index + 1}`,
          type: "text",
          x: point.x,
          y: point.y + index * 5.1,
          w: 20
        },
        index
      );
    });
  }

  customFields[pageNumber] = [...(customFields[pageNumber] || []), ...fields];
  saveJson(STORAGE_CUSTOM, customFields);
}

function removeCustomField(pageNumber, id) {
  customFields[pageNumber] = (customFields[pageNumber] || []).filter((field) => field.id !== id);
  saveJson(STORAGE_CUSTOM, customFields);
  renderPages();
}

function updateCustomField(pageNumber, id, updates) {
  customFields[pageNumber] = (customFields[pageNumber] || []).map((field) => {
    if (field.id !== id) return field;
    return { ...field, ...updates };
  });
  saveJson(STORAGE_CUSTOM, customFields);
}

function startDragCustomField(event, pageNumber, widget, box) {
  if (!editMode || !widget.custom) return;
  event.preventDefault();
  event.stopPropagation();

  const surface = box.closest(".page-surface");
  const rect = surface.getBoundingClientRect();
  const start = {
    pointerX: event.clientX,
    pointerY: event.clientY,
    x: Number(widget.x) || 1,
    y: Number(widget.y) || 1
  };
  let nextX = start.x;
  let nextY = start.y;

  const move = (moveEvent) => {
    const dx = ((moveEvent.clientX - start.pointerX) / rect.width) * 100;
    const dy = ((moveEvent.clientY - start.pointerY) / rect.height) * 100;
    nextX = clamp(start.x + dx, 1, 96);
    nextY = clamp(start.y + dy, 1, 96);
    box.style.setProperty("--x", Number(nextX.toFixed(2)));
    box.style.setProperty("--y", Number(nextY.toFixed(2)));
  };

  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    updateCustomField(pageNumber, widget.id, {
      x: Number(nextX.toFixed(2)),
      y: Number(nextY.toFixed(2))
    });
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

function startResizeCustomField(event, pageNumber, widget, box) {
  if (!editMode || !widget.custom) return;
  event.preventDefault();
  event.stopPropagation();

  const surface = box.closest(".page-surface");
  const rect = surface.getBoundingClientRect();
  const start = {
    pointerX: event.clientX,
    w: Number(widget.w) || 18
  };
  let nextW = start.w;

  const move = (moveEvent) => {
    const dx = ((moveEvent.clientX - start.pointerX) / rect.width) * 100;
    nextW = clamp(start.w + dx, 8, 70);
    box.style.setProperty("--w", Number(nextW.toFixed(2)));
  };

  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    updateCustomField(pageNumber, widget.id, {
      w: Number(nextW.toFixed(2))
    });
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

function saveWidgetValue(pageNumber, widget, value) {
  if (widget.custom) {
    customFields[pageNumber] = (customFields[pageNumber] || []).map((field) => {
      if (field.id !== widget.id) return field;
      return { ...field, value };
    });
    saveJson(STORAGE_CUSTOM, customFields);
    return;
  }

  savedValues[widget.id] = value;
  saveJson(STORAGE_VALUES, savedValues);
}

function valueFor(widget) {
  if (widget.custom) return widget.value || "";
  return savedValues[widget.id] || "";
}

function checkVisiblePages() {
  const nativeLesson = nativeLessonForVisiblePages(visiblePageNumbers());
  if (nativeLesson) {
    setStatus(`${nativeLesson.title}: используйте кнопки проверки внутри нативного урока.`);
    return;
  }

  const widgets = [...document.querySelectorAll(".answer-widget")];
  let checked = 0;
  let correct = 0;
  let free = 0;

  widgets.forEach((box) => {
    const control = box.querySelector("input, select, textarea");
    const feedback = box.querySelector(".feedback");
    const answer = box.dataset.answer || "";
    const widget = findWidget(box.dataset.id);
    const isFree = box.dataset.free === "true" || !answer;
    const rawValue = widget ? getControlValue(control, widget) : control.value;
    const value = normalize(rawValue);

    box.classList.remove("correct", "incorrect", "unchecked");
    if (isFree) {
      free += 1;
      box.classList.add("unchecked");
      if (widget?.type === "checkbox") {
        feedback.textContent = value ? "Отмечено" : "Свободно";
      } else {
        feedback.textContent = value ? "Сохранено" : "Свободно";
      }
      return;
    }

    checked += 1;
    if (!value) {
      box.classList.add("unchecked");
      feedback.textContent = "Заполни поле";
      return;
    }

    if (matchesAnswer(value, answer)) {
      correct += 1;
      box.classList.add("correct");
      feedback.textContent = "Верно";
    } else {
      box.classList.add("incorrect");
      feedback.textContent = "Проверь еще раз";
    }
  });

  if (!checked && free) {
    setStatus(`Свободных полей на странице: ${free}.`);
    return;
  }

  setStatus(`Проверка: ${correct} / ${checked} верно${free ? `; свободных полей: ${free}` : ""}.`);
}

function revealVisibleAnswers() {
  const nativeLesson = nativeLessonForVisiblePages(visiblePageNumbers());
  if (nativeLesson) {
    setStatus(`${nativeLesson.title}: ответы открываются кнопкой внутри нативного урока.`);
    return;
  }

  document.querySelectorAll(".answer-widget").forEach((box) => {
    if (box.dataset.free === "true") return;
    const answer = box.dataset.answer || "";
    if (!answer) return;
    const control = box.querySelector("input, select, textarea");
    const widget = findWidget(box.dataset.id);
    if (!widget) return;
    const value = answerForReveal(answer);
    setControlValue(control, widget, value);
    saveWidgetValue(Number(box.dataset.page), widget, value);
  });
  checkVisiblePages();
}

function clearVisiblePages() {
  const nativeLesson = nativeLessonForVisiblePages(visiblePageNumbers());
  if (nativeLesson) {
    setStatus(`${nativeLesson.title}: очистка выполняется кнопкой внутри нативного урока.`);
    return;
  }

  document.querySelectorAll(".answer-widget").forEach((box) => {
    const control = box.querySelector("input, select, textarea");
    const widget = findWidget(box.dataset.id);
    if (widget) {
      setControlValue(control, widget, "");
    } else {
      control.value = "";
    }
    box.classList.remove("correct", "incorrect", "unchecked");
    box.querySelector(".feedback").textContent = "";
    if (widget) saveWidgetValue(Number(box.dataset.page), widget, "");
  });
  setStatus("Поля на открытой странице очищены.");
}

function exportAllAnswers() {
  const checkedAnswers = {};
  Object.values(builtInWidgets)
    .flat()
    .forEach((widget) => {
      checkedAnswers[widget.id] = {
        label: widget.label,
        expected: widget.free ? null : widget.answer || null,
        value: savedValues[widget.id] || ""
      };
    });

  const payload = {
    book: manifest?.title || "English File Beginner - Student's Book",
    pageCount: manifest?.pageCount || 137,
    exportedAt: new Date().toISOString(),
    checkedAnswers,
    customFields
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "english-file-beginner-answers.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setStatus("Ответы и личные поля подготовлены для скачивания.");
}

function importSavedAnswers() {
  const file = importFile.files?.[0];
  importFile.value = "";
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const payload = JSON.parse(String(reader.result || "{}"));
      if (!payload || typeof payload !== "object") {
        throw new Error("Invalid file");
      }

      if (payload.checkedAnswers && typeof payload.checkedAnswers === "object") {
        savedValues = Object.fromEntries(
          Object.entries(payload.checkedAnswers).map(([id, item]) => [id, item?.value || ""])
        );
        saveJson(STORAGE_VALUES, savedValues);
      }

      if (payload.customFields && typeof payload.customFields === "object") {
        customFields = payload.customFields;
        saveJson(STORAGE_CUSTOM, customFields);
      }

      renderPages();
      setStatus("Ответы и личные поля загружены из файла.");
    } catch (error) {
      console.error(error);
      setStatus("Не удалось загрузить файл ответов. Нужен JSON, скачанный из этой версии учебника.");
    }
  });
  reader.readAsText(file, "utf-8");
}

function findWidget(id) {
  for (const page of visiblePageNumbers()) {
    const widget = widgetsForPage(page).find((item) => item.id === id);
    if (widget) return widget;
  }
  return null;
}

function goToPage(pageNumber) {
  currentPage = clampPage(pageNumber);
  history.replaceState(null, "", `#page=${currentPage}`);
  renderPages({ resetScroll: true });
}

function handleHashChange() {
  const nextPage = clampPage(getStartPage());
  if (nextPage === currentPage) return;
  currentPage = nextPage;
  renderPages({ resetScroll: true });
}

function visiblePageNumbers() {
  if (nativeLessonForPage(currentPage)) return [currentPage];
  if (!spreadMode.checked || currentPage >= manifest.pageCount) return [currentPage];
  return [currentPage, currentPage + 1];
}

function pageStep() {
  const nativeLesson = nativeLessonForPage(currentPage);
  if (nativeLesson) return Math.max(1, nativeLesson.endPage - currentPage + 1);
  return spreadMode.checked ? 2 : 1;
}

function pageWidth(meta) {
  const zoom = zoomSelect.value;
  const minWidth = meta.minFitWidth || 320;
  if (zoom !== "fit") return Math.max(minWidth, Math.round(meta.width * Number(zoom)));

  const readerWidth = document.querySelector(".reader").clientWidth - 36;
  const columns = spreadMode.checked ? 2 : 1;
  const gaps = spreadMode.checked ? 18 : 0;
  const width = Math.floor((readerWidth - gaps) / columns);
  return clamp(width, minWidth, meta.width);
}

function nativePageWidth() {
  const zoom = zoomSelect.value;
  if (zoom !== "fit") return Math.max(360, Math.round(1240 * Number(zoom)));

  const readerWidth = document.querySelector(".reader").clientWidth - 36;
  return clamp(readerWidth, 360, 1240);
}

function updateNavState() {
  prevPage.disabled = currentPage <= 1;
  nextPage.disabled = currentPage >= manifest.pageCount;
}

function getStartPage() {
  const match = location.hash.match(/page=(\d+)/);
  return match ? Number(match[1]) : 1;
}

function clampPage(pageNumber) {
  return clamp(Number(pageNumber) || 1, 1, manifest ? manifest.pageCount : 137);
}

function normalize(value) {
  return String(value).trim().toLowerCase().replace(/\s+/g, " ");
}

function acceptedAnswers(answer) {
  return String(answer)
    .split("|")
    .map((item) => normalize(item))
    .filter(Boolean);
}

function matchesAnswer(value, answer) {
  return acceptedAnswers(answer).includes(value);
}

function answerForReveal(answer) {
  return String(answer).split("|")[0] || "";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setStatus(text) {
  statusLine.textContent = text;
  statusLine.classList.toggle("hidden", !text);
}

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function resetIfRequested() {
  const params = new URLSearchParams(location.search);
  if (!params.has("fresh")) return;

  localStorage.removeItem(STORAGE_VALUES);
  localStorage.removeItem(STORAGE_CUSTOM);
  history.replaceState(null, "", `${location.pathname}${location.hash || ""}`);
}
