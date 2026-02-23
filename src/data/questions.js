export const technologies = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'JS',
    color: '#f7df1e',
    count: 5,
    description: 'Core JavaScript va ES6+ konseptlar',
  },
  {
    id: 'react',
    name: 'React',
    icon: '⚛',
    color: '#61dafb',
    count: 5,
    description: 'React hooks, lifecycle va best practices',
  },
  {
    id: 'css',
    name: 'CSS',
    icon: '◆',
    color: '#264de4',
    count: 4,
    description: 'Flexbox, Grid va zamonaviy CSS',
  },
  {
    id: 'algorithms',
    name: 'Algoritmlar',
    icon: '∑',
    color: '#e34c26',
    count: 4,
    description: 'Data structures va algoritmlar',
  },
];

export const questions = {
  javascript: [
    {
      id: 1,
      question: "let, const va var o'rtasidagi farq nima?",
      answer: "var - function scope, hoisting bilan. let va const - block scope. const - o'zgarmas reference, lekin object/array ichidagi qiymatlar o'zgarishi mumkin. let - qayta tayinlash mumkin.",
      difficulty: 'junior',
    },
    {
      id: 2,
      question: "Closure nima va qachon ishlatiladi?",
      answer: "Closure - funksiya o'z yaratilgan muhitdagi o'zgaruvchilarga kirish huquqiga ega bo'ladi. Lexical scoping tufayli inner function outer function o'zgaruvchilariga murojaat qiladi. Event handlers, callbacks va data encapsulation uchun ishlatiladi.",
      difficulty: 'middle',
    },
    {
      id: 3,
      question: "Event loop qanday ishlaydi?",
      answer: "Call stack, Web APIs, Task Queue va Microtask Queue. Synchronous kod birinchi bajariladi. Async callback'lar queue'ga qo'shiladi. Microtask (Promise) macrotask'dan oldin bajariladi. Event loop stack bo'sh bo'lganda queue'dan oladi.",
      difficulty: 'senior',
    },
    {
      id: 4,
      question: "Promise va async/await farqi?",
      answer: "Ikkalasi ham asynchronous kod uchun. Promise - .then()/.catch() zanjiri. async/await - synchronous ko'rinishda yozish, try/catch bilan xatolarni ushlash osonroq. async/await Promise ustiga qurilgan syntactic sugar.",
      difficulty: 'middle',
    },
    {
      id: 5,
      question: "this kalit so'zi qanday ishlaydi?",
      answer: "this - kontekstga bog'liq. Oddiy funksiyada - chaqiruvchi object. Arrow function - lexical this (parent scope). bind/call/apply - this ni qo'lda o'rnatish. Class da - instance.",
      difficulty: 'middle',
    },
  ],
  react: [
    {
      id: 1,
      question: "useState va useEffect qachon ishlatiladi?",
      answer: "useState - komponent state'ini boshqarish. useEffect - side effects (API, subscriptions, DOM). Dependency array bo'yicha qachon ishlashini nazorat qiladi. [] - mount da, [dep] - dep o'zgarganda.",
      difficulty: 'junior',
    },
    {
      id: 2,
      question: "Virtual DOM nima va qanday ishlaydi?",
      answer: "Virtual DOM - haqiqiy DOM ning yengil JavaScript nusxasi. O'zgarishlar avval Virtual DOM da, keyin diff algoritm orqali faqat o'zgargan qismlar haqiqiy DOM ga yoziladi. Bu performance optimizatsiyasi beradi.",
      difficulty: 'middle',
    },
    {
      id: 3,
      question: "useMemo va useCallback farqi?",
      answer: "useMemo - qiymatni memoize qiladi (hisoblash natijasi). useCallback - funksiyani memoize qiladi. Ikkalasi ham dependency array bilan. Child komponentlarga prop sifatida berilganda re-render'ni kamaytiradi.",
      difficulty: 'middle',
    },
    {
      id: 4,
      question: "React 18 da Concurrent Features nima?",
      answer: "useTransition, useDeferredValue - urgent va non-urgent yangilanishlarni ajratish. Suspense - lazy loading va data fetching. Automatic batching - barcha state yangilanishlari bir batch da. React 18 prioritizatsiya qiladi.",
      difficulty: 'senior',
    },
    {
      id: 5,
      question: "Custom hooks yaratishda qanday qoidalarga rioya qilish kerak?",
      answer: "use bilan boshlanishi shart. Boshqa hook'larni chaqirishi mumkin. Har bir render da bir xil tartibda chaqirilishi kerak (loop/condition ichida emas). Logic reuse va separation of concerns uchun.",
      difficulty: 'middle',
    },
  ],
  css: [
    {
      id: 1,
      question: "Flexbox va Grid farqi?",
      answer: "Flexbox - bir o'lchovli (row yoki column), content-first. Grid - ikki o'lchovli, layout-first. Grid - aniq column/row ta'riflash. Flexbox - elementlar o'z o'lchamiga moslashadi. Murakkab layoutlar uchun ikkalasini birga ishlatish mumkin.",
      difficulty: 'junior',
    },
    {
      id: 2,
      question: "BEM metodologiyasi nima?",
      answer: "Block__Element--Modifier. Block - mustaqil komponent. Element - block ichidagi qism (__). Modifier - variant yoki holat (--). Naming convention - CSS specificity muammosiz, qayta ishlatish oson.",
      difficulty: 'junior',
    },
    {
      id: 3,
      question: "CSS specificity qanday hisoblanadi?",
      answer: "Inline (1000) > ID (100) > Class/attribute (10) > Element (1). !important - barchadan yuqori. Bir xil bo'lsa - oxirgi yozilgan g'olib. Kam specificity - yaxshiroq (override oson).",
      difficulty: 'middle',
    },
    {
      id: 4,
      question: "Container queries vs Media queries?",
      answer: "Media queries - viewport o'lchamiga. Container queries - parent container o'lchamiga. Component o'z konteyneriga qarab responsive bo'ladi. @container - yangi standart. Card, sidebar kabi komponentlar uchun ideal.",
      difficulty: 'senior',
    },
  ],
  algorithms: [
    {
      id: 1,
      question: "Big O notation nima?",
      answer: "Algoritm vaqt va joy murakkabligini tavsiflaydi. O(1) - constant, O(n) - linear, O(n²) - quadratic. Worst case analiz. Katta ma'lumotlar uchun scalability baholash. O(n log n) - ko'p sort algoritmlar.",
      difficulty: 'junior',
    },
    {
      id: 2,
      question: "Hash table qanday ishlaydi?",
      answer: "Key-value juftliklar. Hash function key ni index ga aylantiradi. O(1) average lookup, insert, delete. Collision - bir xil index (chaining yoki open addressing). JavaScript da Object va Map hash table.",
      difficulty: 'middle',
    },
    {
      id: 3,
      question: "Recursion vs Iteration - qachon qaysi birini tanlash?",
      answer: "Recursion - tree, graph, divide-and-conquer uchun tabiiy. Stack overflow xavfi. Iteration - oddiy loop, kam xotira. Tail recursion - ba'zi tillarda optimizatsiya. Muammo tabiatiga qarab tanlash.",
      difficulty: 'middle',
    },
    {
      id: 4,
      question: "Dynamic programming prinsipi?",
      answer: "Muammoni kichik subproblemlarga bo'lish. Overlapping subproblems - natijani saqlash (memoization). Optimal substructure - optimal yechim subproblemlardan tuziladi. Fibonacci, knapsack - klassik misollar.",
      difficulty: 'senior',
    },
  ],
};
