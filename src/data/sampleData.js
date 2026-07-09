export const TODAY = "2026-07-09";

export const initialClients = [
  { id: 1, name: "Cafe Aroma", contact: "9847012345", notes: "Prefers festive, warm colors" },
  { id: 2, name: "Green Leaf Bakery", contact: "9847098765", notes: "" },
  { id: 3, name: "Upwork - Mia R", contact: "mia@example.com", notes: "US client, podcast clips" },
]

export const initialTeam = [
  { id: 1, name: "You", role: "Owner", contact: "soumya.t.l.84@gmail.com" },
  { id: 2, name: "Aravind", role: "Designer", contact: "aravind@example.com" },
  { id: 3, name: "Nisha", role: "Designer", contact: "nisha@example.com" },
]

export const initialProjects = [
  { id: 1, name: "Onam promo", clientId: 1, brief: "Festive Reels for Onam. No discounts mentioned, keep it warm and colorful.", status: "Active", due: "2026-07-15" },
  { id: 2, name: "Podcast clips batch", clientId: 3, brief: "5 vertical clips with burned-in captions from the July episode.", status: "Active", due: "2026-07-10" },
  { id: 3, name: "Logo refresh", clientId: 2, brief: "Refresh the bakery logo, keep the leaf motif.", status: "Completed", due: "2026-07-05" },
]

export const initialTasks = [
  {
    id: 1, projectId: 1, title: "Shoot and edit 3 Reels", assigneeId: 2,
    status: "In progress", priority: "High", due: "2026-07-11", manualPct: 0,
    notes: "Client wants festive colors, no discounts mentioned in the reel.",
    subtasks: [
      { id: 1, text: "Shoot raw footage", done: true },
      { id: 2, text: "Rough cut", done: true },
      { id: 3, text: "Add captions", done: false },
      { id: 4, text: "Client review", done: false },
    ],
    comments: [
      { id: 1, author: "Aravind", text: "Rough cut done, will send captions version tomorrow.", ts: "2026-07-08T18:20:00+05:30" },
    ],
  },
  {
    id: 2, projectId: 2, title: "Podcast clips batch", assigneeId: 2,
    status: "Not started", priority: "Medium", due: "2026-07-08", manualPct: 0,
    notes: "5 short clips, vertical format, captions burned in.",
    subtasks: [],
    comments: [],
  },
  {
    id: 3, projectId: 3, title: "Logo refresh", assigneeId: 3,
    status: "Done", priority: "Low", due: "2026-07-05", manualPct: 100,
    notes: "",
    subtasks: [
      { id: 1, text: "Concepts", done: true },
      { id: 2, text: "Final files export", done: true },
    ],
    comments: [
      { id: 1, author: "Nisha", text: "Final files exported and delivered.", ts: "2026-07-05T12:00:00+05:30" },
    ],
  },
  {
    id: 4, projectId: 1, title: "Design festive story templates", assigneeId: 3,
    status: "In review", priority: "Medium", due: "2026-07-10", manualPct: 80,
    notes: "3 templates, gold and green palette.",
    subtasks: [
      { id: 1, text: "Draft templates", done: true },
      { id: 2, text: "Owner review", done: false },
    ],
    comments: [
      { id: 1, author: "Nisha", text: "Drafts ready for your review.", ts: "2026-07-09T09:00:00+05:30" },
    ],
  },
]

export const initialInvoices = [
  { id: 1, clientId: 1, description: "July retainer", amount: 15000, currency: "INR", status: "Pending", issueDate: "2026-07-01", due: "2026-07-15" },
  { id: 2, clientId: 3, description: "Podcast clips x5", amount: 6000, currency: "INR", status: "Paid", issueDate: "2026-06-28", due: "2026-07-05" },
  { id: 3, clientId: 2, description: "Logo refresh, final payment", amount: 8000, currency: "INR", status: "Overdue", issueDate: "2026-06-15", due: "2026-06-30" },
]

export const initialLearningItems = [
  { id: 1, title: "Welcome and workflow overview", body: "This is a placeholder for onboarding content: how we name files, how to move a task to In review, how to leave update comments. Fill this in with your own house style guide." },
  { id: 2, title: "Brand and style references", body: "Placeholder for links/notes on brand colors, fonts, and past examples of approved work." },
]
