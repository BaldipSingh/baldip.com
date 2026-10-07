/*
 * data.js — ALL site content lives here.
 * Edit this file only; app.js renders everything from it.
 *
 * It's a plain script (not an ES module) that sets window.SITE_DATA,
 * so the site also works when index.html is opened straight from disk.
 *
 * Search for "TODO" to find every placeholder you still need to fill in.
 */
window.SITE_DATA = {
  profile: {
    name: "Baldip-Robin Singh",
    shortName: "Robin",
    initials: "BRS",
    location: "New York",
    role: "Senior Sales Engineer, IBM",
    tagline: "Technical seller. Builder. Operator.",
    headshot: "assets/headshot.jpg",
    headshotAlt: "Portrait of Baldip-Robin Singh",
    // SHA-256 of the gate password. See README → "Change the password".
    passwordHash: "b4eb71306c2267a12979550569be28017dff1b00e790ac016129b80c3d660214",
    bio: [
      "I'm Robin — Baldip on paper — a Senior Sales Engineer and Brand Technical Specialist at IBM, where I carry a quota across Data Integration, Data Intelligence, and Data Security.",
      "Outside IBM I run a 15-truck fleet, a content agency, and a sports analytics practice. I also teach seventh-grade social studies and help organize Sikh Hoops. The common thread: I like understanding how a system works, then making it run better.",
      // TODO: add one personal sentence — what drives you, or what people should know first.
    ],
  },

  // Story chapters, in order. `id` becomes the anchor (#story/<id> is not used; chapter nav scrolls).
  chapters: [
    {
      id: "foundation",
      title: "The foundation",
      lede: "It started with code, and an internship at IBM.",
      body: [
        "A computer science degree taught me how systems are put together: data structures, networks, the discipline of making something that actually runs.",
        "I joined IBM as a Brand Seller Intern and found the place where that technical grounding mattered most — in the room with customers, translating what a platform does into what a business needs.",
        // TODO: add your school, graduation year, or a moment from the internship that stuck with you.
      ],
    },
    {
      id: "specialist",
      title: "The specialist",
      lede: "From generalist to the person in the room who knows the data.",
      body: [
        "I moved into technical specialist roles in Data Integration, then Data Security, and today I'm a Senior Sales Engineer covering Data Integration, Data Intelligence, and Data Security.",
        "The job is part architect, part closer. I size deals, bring proof points to the table, and carry a revenue number — so the technical answer has to be both right and persuasive.",
        // TODO: add a representative (non-confidential) win or the kind of problem you love solving.
      ],
    },
    {
      id: "builder",
      title: "The builder",
      lede: "When the tools didn't exist, I made them.",
      body: [
        "On my own initiative I built interactive One Pagers — seller-enablement hubs that help other IBM sellers understand and position products quickly. I deployed them on GitHub Pages, the same way this site runs.",
        "Building for other sellers sharpened how I think about my own work: if a colleague can't explain it in a minute, the customer won't buy it in an hour.",
        // TODO: add how the One Pagers are used today (teams, products covered) if you can share it.
      ],
    },
    {
      id: "operator",
      title: "The operator",
      lede: "Fifteen trucks and a content agency teach you things a CRM can't.",
      body: [
        "I run WLR/VLR Trucking LLC, a fleet of 15 trucks. Drivers, maintenance, compliance, cash flow — operating a real business keeps me honest about what customers mean when they talk about cost and risk.",
        "I also run Coshish Media, a content agency, where the craft is telling a clear story to the right audience.",
        // TODO: add when you started each business and one thing each has taught you.
      ],
    },
    {
      id: "analyst",
      title: "The analyst",
      lede: "An MBA in Business Analytics, and a practice that tests it.",
      body: [
        "My MBA in Business Analytics gave structure to an instinct I already had: decide with data, then check whether you were right.",
        "My sports analytics practice puts that to work on data-driven betting analysis, where the scoreboard tells you quickly whether your model holds up.",
        // TODO: add your MBA program/school and a sentence on your analytical approach.
      ],
    },
    {
      id: "teacher",
      title: "The teacher and organizer",
      lede: "The classroom and the court.",
      body: [
        "Part-time, I teach seventh-grade social studies. Twelve-year-olds are the toughest audience there is — they make you earn their attention every single day.",
        "I'm also a volunteer organizer at Sikh Hoops, a 501(c)(3) nonprofit, helping bring community together through basketball.",
        // TODO: add what you do for Sikh Hoops (events, leagues, fundraising) and why it matters to you.
      ],
    },
    {
      id: "next",
      title: "What's next",
      lede: "A technical seller who builds things and runs businesses.",
      body: [
        "Every chapter here is the same skill in a different setting: learn how the system works, find what's slowing it down, and do something about it.",
        "If you're building something where that combination matters, I'd like to hear about it.",
        // TODO: name the kinds of roles, partnerships, or conversations you want.
      ],
      cta: { label: "Get in touch", href: "#contact" },
    },
  ],

  // Interactive career timeline. Order matters (left → right / top → bottom).
  // `when` is display text, so "2019", "Summer 2019" or "Now" all work.
  timeline: [
    {
      when: "TODO: year", // TODO: graduation year
      title: "B.S. in Computer Science",
      track: "Education",
      detail: "Foundation in software, systems, and data.", // TODO: school name
    },
    {
      when: "TODO: year", // TODO
      title: "Brand Seller Intern, IBM",
      track: "IBM",
      detail: "First seat at IBM, learning how enterprise software is sold.",
    },
    {
      when: "TODO: year", // TODO
      title: "Data Integration Technical Specialist, IBM",
      track: "IBM",
      detail: "Technical specialist for IBM's data integration portfolio.",
    },
    {
      when: "TODO: year", // TODO
      title: "Data Security Technical Specialist, IBM",
      track: "IBM",
      detail: "Technical specialist for IBM's data security portfolio.",
    },
    {
      when: "TODO: year", // TODO
      title: "MBA in Business Analytics",
      track: "Education",
      detail: "Analytics, strategy, and decision-making with data.", // TODO: school name
    },
    {
      when: "TODO: year", // TODO
      title: "Built the IBM One Pagers",
      track: "Builder",
      detail: "Interactive seller-enablement hubs, built on my own initiative and deployed on GitHub Pages.",
    },
    {
      when: "Now",
      title: "Senior Sales Engineer, IBM",
      track: "IBM",
      detail: "Brand Technical Specialist covering Data Integration, Data Intelligence, and Data Security. Quota-carrying.",
    },
  ],

  // "What I do" grid. Each item's tags drive the filter chips.
  filters: ["Enterprise Sales", "Ventures", "Builder", "Community", "Education"],
  work: [
    {
      title: "IBM Sales Engineering",
      tags: ["Enterprise Sales"],
      text: "Senior Sales Engineer across Data Integration, Data Intelligence, and Data Security. Deal sizing, proof points, and a revenue quota.",
    },
    {
      title: "IBM One Pagers",
      tags: ["Builder", "Enterprise Sales"],
      text: "Interactive seller-enablement hubs I built on my own initiative and deployed on GitHub Pages.",
      // link: "https://…", // TODO (optional): add a public link if one can be shared
    },
    {
      title: "WLR/VLR Trucking LLC",
      tags: ["Ventures"],
      text: "Owner and operator of a fleet of 15 trucks.",
    },
    {
      title: "Coshish Media",
      tags: ["Ventures", "Builder"],
      text: "A content agency.", // TODO: describe who Coshish Media works with and what it makes
    },
    {
      title: "Sports analytics",
      tags: ["Ventures", "Builder"],
      text: "A practice built on data-driven sports betting analysis.",
    },
    {
      title: "Seventh-grade social studies",
      tags: ["Education"],
      text: "Part-time teacher.", // TODO: add school or district if you want it public
    },
    {
      title: "Sikh Hoops",
      tags: ["Community"],
      text: "Volunteer organizer at a 501(c)(3) nonprofit built around basketball and community.",
    },
  ],

  // Expertise. `level` is a 1–5 self-assessment that drives the visual meter.
  // TODO: adjust levels to how you want to present yourself.
  skills: [
    { name: "Data integration", level: 5, note: "Pipelines, movement, and making data usable." },
    { name: "Data security", level: 5, note: "Protecting sensitive data and proving it." },
    { name: "Data intelligence", level: 4, note: "Catalog, lineage, and governance." },
    { name: "Solution engineering", level: 5, note: "Architecture that maps to business outcomes." },
    { name: "Deal strategy", level: 4, note: "Sizing, proof points, and navigating to close." },
    { name: "Analytics", level: 4, note: "Models, measurement, and decisions with data." },
  ],

  contact: {
    email: "info@baldip.com", // TODO: your email address
    linkedin: "https://www.linkedin.com/in/baldip",
    resume: "assets/resume.pdf", // TODO: drop your résumé PDF at this path
    // Formspree: create a form at https://formspree.io, copy the ID from its endpoint
    // (https://formspree.io/f/abcdwxyz → "abcdwxyz") and paste it here.
    formspreeId: "[FORMSPREE_ID]", // TODO
  },
};
