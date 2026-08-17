// Document-lesson content for "Atomic Structure & Periodic Trends" (lib/mcatPath.ts's
// atomic-structure-periodic-trends LessonContent entry). See lib/documentLesson.ts
// for the shared shape.
import { DocumentLessonContent } from "../documentLesson";

export const atomicStructurePeriodicTrendsContent: DocumentLessonContent = {
  lessonIntro: {
    description: "Every chemical property tested on the MCAT—bond strength, reactivity, acidity—traces back to how electrons are arranged around a nucleus. This lesson covers what defines an atom and an isotope, how electrons fill orbitals, and the periodic trends that let you predict behavior from an element's position on the table alone.",
    objectives: [
      "Distinguish atomic number, mass number, and isotopes",
      "Write electron configurations using the Aufbau principle, Hund's rule, and the Pauli exclusion principle",
      "Predict relative atomic radius, ionization energy, electron affinity, and electronegativity from periodic position",
      "Explain why each periodic trend exists in terms of nuclear charge and shielding"
    ]
  },
  bigPicture: {
    flow: ["Protons/neutrons/electrons define the atom", "Electron configuration sets valence electrons", "Position on periodic table", "Predictable trends in size and reactivity"],
    caption: "The periodic table isn't a list to memorize—it's organized so that an element's row and column already tell you most of what you need to know about how it behaves."
  },
  concepts: [
    {
      number: "01",
      id: "atomic-structure-isotopes",
      title: "Atomic Structure and Isotopes",
      difficulty: "UNDERSTAND",
      coreIdea: "Atomic number (Z) is the proton count and defines the element; mass number (A) is protons plus neutrons, and isotopes of an element share Z but differ in neutron count (and therefore A).",
      learn: [
        "An atom's identity is fixed by its number of protons (atomic number, Z); a neutral atom has equal protons and electrons, while the number of neutrons can vary without changing what element it is.",
        "Isotopes are atoms of the same element (same Z) with different numbers of neutrons, giving them different mass numbers (A = protons + neutrons)—most elements exist as a natural mix of isotopes, which is why atomic masses on the periodic table are weighted averages, not whole numbers."
      ],
      mcatConnection: "Passages on radioactive decay, mass spectrometry, or isotope labeling all lean on this distinction—confusing atomic number with mass number is one of the most common quick-question errors.",
      quickCheck: {
        prompt: "Carbon-12 and carbon-14 are both forms of carbon. What makes them isotopes of the same element rather than different elements?",
        options: ["They have the same mass number", "They have the same number of protons", "They have the same number of neutrons", "They have the same number of electrons in their outer shell only"],
        correctIndex: 1,
        explanation: "Isotopes share the same atomic number (proton count), which is what defines the element—carbon-12 and carbon-14 differ in neutron count, which is exactly why their mass numbers differ."
      },
      keyTakeaway: "Atomic number (protons) defines the element; isotopes share that atomic number but differ in neutrons and therefore mass number."
    },
    {
      number: "02",
      id: "electron-configuration",
      title: "Electron Configuration",
      difficulty: "IDENTIFY",
      coreIdea: "Electrons fill orbitals from lowest to highest energy (Aufbau), singly before pairing within a subshell (Hund's rule), and no two electrons in an atom share all four quantum numbers (Pauli exclusion).",
      learn: [
        "The Aufbau principle fills orbitals in order of increasing energy (1s, 2s, 2p, 3s, 3p, 4s, 3d...); Hund's rule says electrons occupy degenerate orbitals within a subshell singly, with parallel spins, before any pairing occurs.",
        "The Pauli exclusion principle limits each orbital to two electrons, and only if their spins are opposite—together these three rules let you predict an atom's full electron configuration and, from that, its valence electron count and chemical behavior."
      ],
      mcatConnection: "You won't need to write out configurations for heavy elements, but recognizing valence electron count from an element's group number—and spotting stable, half-filled or fully-filled subshells (like Cr or Cu's exceptions)—shows up in bonding and periodic trend questions.",
      quickCheck: {
        prompt: "Why does nitrogen's ground-state electron configuration place one electron in each of its three 2p orbitals rather than pairing two electrons in one orbital first?",
        options: ["The Pauli exclusion principle forbids any pairing in p orbitals", "Hund's rule favors maximum unpaired electrons with parallel spin across degenerate orbitals before pairing", "The Aufbau principle requires filling from highest to lowest energy", "Nitrogen has too few electrons to pair any of them"],
        correctIndex: 1,
        explanation: "Hund's rule specifically governs how electrons distribute among orbitals of equal energy—single occupancy with parallel spins is lower energy than forcing a pair, which is why nitrogen's three 2p electrons each sit alone."
      },
      keyTakeaway: "Aufbau (lowest energy first), Hund's rule (singly occupy degenerate orbitals before pairing), and Pauli exclusion (max two electrons per orbital, opposite spins) together determine an atom's electron configuration."
    },
    {
      number: "03",
      id: "periodic-trends",
      title: "Periodic Trends",
      difficulty: "REASON",
      coreIdea: "Atomic radius decreases and ionization energy, electron affinity, and electronegativity generally increase left-to-right across a period, driven by increasing effective nuclear charge pulling valence electrons in tighter.",
      learn: [
        "Moving left to right across a period, effective nuclear charge increases while electrons are added to the same shell, so atomic radius shrinks and it becomes progressively harder to remove an electron (ionization energy rises) or easier to attract one (electronegativity, electron affinity rise).",
        "Moving down a group, each new row adds an entire electron shell, so atomic radius increases and the outermost electrons—now farther from the nucleus and more shielded by inner electrons—are held less tightly, so ionization energy and electronegativity decrease."
      ],
      mcatConnection: "Nearly every trend question is really testing effective nuclear charge and shielding, not memorized rankings—if you can explain why a trend exists, you can predict it for any two elements without having memorized their exact values.",
      quickCheck: {
        prompt: "Which explanation correctly accounts for why ionization energy generally increases across a period from left to right?",
        options: ["Atomic radius increases, making electrons easier to remove", "Effective nuclear charge increases, holding valence electrons more tightly", "Electrons are added to a new, farther shell", "Shielding from inner electrons increases substantially"],
        correctIndex: 1,
        explanation: "Across a period, electrons are added to the same shell while protons increase, so effective nuclear charge rises and pulls valence electrons in more tightly, requiring more energy to remove one—radius actually decreases, and shielding stays roughly constant since no new shell is added."
      },
      keyTakeaway: "Across a period, increasing effective nuclear charge shrinks atomic radius and raises ionization energy/electronegativity; down a group, added electron shells increase radius and lower them."
    }
  ]
};
