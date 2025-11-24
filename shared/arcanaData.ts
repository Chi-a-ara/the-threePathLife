/**
 * Complete Arcana Knowledge Base
 * Descriptions for all 22 Major Arcana used in Destiny Matrix
 */

export interface ArcanaInfo {
  number: number;
  name: string;
  keywords: string[];
  positive: string;
  negative: string;
  career: string;
  relationships: string;
  health: string;
  spiritual: string;
}

export const ARCANA_DATA: Record<number, ArcanaInfo> = {
  1: {
    number: 1,
    name: "The Pioneer",
    keywords: ["Leadership", "Independence", "Initiative", "New Beginnings"],
    positive: "Strong drive for autonomy and self-reliance. Natural leadership abilities and executive skills. Entrepreneurial spirit and business acumen. Innovative thinking and original ideas. Strong willpower and determination to manifest goals into reality.",
    negative: "Can be overly dominant if unbalanced. Struggles with collaboration. May show aggressive tendencies. Lacks patience with slower processes.",
    career: "Best suited for entrepreneurial ventures and leadership positions where they can exercise autonomy. Excels in starting new businesses, project management, and pioneering work in any industry.",
    relationships: "Need to learn cooperation and compromise while maintaining healthy boundaries. Must balance independence with interdependence.",
    health: "Requires physical outlets for strong energy. Prone to stress from overwork. Benefits from regular exercise and stress management.",
    spiritual: "Path of self-mastery and responsible use of personal power. Learning to lead with wisdom rather than force.",
  },
  2: {
    number: 2,
    name: "The Secret",
    keywords: ["Intuition", "Partnership", "Duality", "Inner Knowledge"],
    positive: "Deep connection to subconscious wisdom. Strong psychic and empathic abilities. Natural diplomatic and mediating skills. Talent for creating win-win partnerships. Access to hidden or occult knowledge.",
    negative: "Struggles with maintaining healthy boundaries. Difficulty balancing giving and receiving. May doubt inner guidance. Overly sensitive to others' energies.",
    career: "Excel in partnership-oriented work and roles requiring emotional intelligence. Ideal for counseling, psychology, mediation, teaching, and spiritual practices.",
    relationships: "Natural mediators but must avoid codependency. Need to balance caring for others with self-care.",
    health: "Sensitive to environment and others' energies. Needs regular emotional cleansing and boundary work.",
    spiritual: "Deep connection to intuitive and psychic realms. Path of developing and trusting inner wisdom.",
  },
  3: {
    number: 3,
    name: "The Empress",
    keywords: ["Creativity", "Femininity", "Abundance", "Nurturing"],
    positive: "Natural creative and artistic abilities. Deep emotional intelligence and empathy. Nurturing and life-giving energy. Ability to manifest beauty and abundance. Understanding of human nature and natural counseling abilities.",
    negative: "Struggles balancing emotions with practicality. Difficulty setting healthy boundaries. May become codependent. Overly sensitive at times.",
    career: "Thrive in creative fields and nurturing professions. Excellent in teaching, healthcare, beauty, fashion, and any field requiring emotional intelligence.",
    relationships: "Natural caregivers who must learn to receive as well as give. Create warm, loving environments.",
    health: "Connected to reproductive and emotional wellbeing. Benefits from creative expression and emotional release.",
    spiritual: "Path of divine feminine wisdom and creation. Learning to birth new realities through creative power.",
  },
  4: {
    number: 4,
    name: "The Emperor",
    keywords: ["Structure", "Authority", "Masculinity", "Foundation"],
    positive: "Natural command presence and strategic thinking. Ability to create order from chaos. Strong leadership and protection of others. Excellent at establishing systems and processes. Manifests material success through discipline.",
    negative: "Can become rigid and inflexible. May struggle with control issues. Aggressive tendencies if unbalanced. Lacks emotional awareness.",
    career: "Excel in structured environments and positions of authority. Ideal for construction, engineering, military, executive leadership, and fields requiring order.",
    relationships: "Need to balance strength with sensitivity. Must learn to express emotions and vulnerability.",
    health: "Benefits from disciplined physical routines. May hold tension in body from over-control.",
    spiritual: "Path of mastery through discipline and order. Learning to lead with both strength and compassion.",
  },
  5: {
    number: 5,
    name: "The Pope",
    keywords: ["Knowledge", "Tradition", "Teaching", "Wisdom"],
    positive: "Deep wisdom and learning abilities. Natural teacher and mentor. Respect for tradition and established systems. Ability to bridge spiritual and material worlds. Excellent communicator of complex ideas.",
    negative: "Can become dogmatic or rigid in beliefs. May resist necessary change. Overly attached to tradition. Struggles with new paradigms.",
    career: "Excel in education, religious or spiritual leadership, counseling, and any field requiring wisdom transmission. Natural consultants and advisors.",
    relationships: "Seek partners who share values and beliefs. Need intellectual and spiritual connection.",
    health: "Benefits from traditional healing methods. May need to balance mental activity with physical movement.",
    spiritual: "Path of wisdom keeper and spiritual teacher. Learning to honor tradition while remaining open to evolution.",
  },
  6: {
    number: 6,
    name: "Love",
    keywords: ["Relationships", "Choice", "Union", "Harmony"],
    positive: "Deep capacity for love and connection. Natural ability to create harmony. Understanding of relationship dynamics. Makes wise choices in partnerships. Brings people together.",
    negative: "May struggle with codependency. Difficulty making decisions. Fear of commitment or over-commitment. Loses self in relationships.",
    career: "Excel in relationship-oriented fields like counseling, matchmaking, diplomacy, and customer relations. Natural mediators and peacemakers.",
    relationships: "Central life theme. Must learn to balance self-love with love for others. Creates deep, meaningful connections.",
    health: "Emotional health directly impacts physical health. Benefits from harmonious relationships and environments.",
    spiritual: "Path of learning unconditional love and sacred union. Understanding love as a spiritual force.",
  },
  7: {
    number: 7,
    name: "Movement",
    keywords: ["Progress", "Victory", "Determination", "Willpower"],
    positive: "Strong determination and willpower. Ability to overcome obstacles. Natural competitor and winner. Excellent at setting and achieving goals. Brings momentum to projects.",
    negative: "Can become overly aggressive or competitive. May run over others. Difficulty with patience and rest. Burnout from constant pushing.",
    career: "Excel in competitive fields like sales, sports, military, and entrepreneurship. Natural achievers and go-getters.",
    relationships: "Need to balance drive for success with relationship needs. Must learn when to slow down and connect.",
    health: "High energy but prone to burnout. Needs to balance activity with rest and recovery.",
    spiritual: "Path of directed will and purposeful action. Learning to align personal will with divine will.",
  },
  8: {
    number: 8,
    name: "Justice",
    keywords: ["Balance", "Fairness", "Truth", "Karma"],
    positive: "Strong sense of justice and fairness. Ability to see all sides of situations. Natural judge and arbiter. Understands cause and effect. Brings balance to chaos.",
    negative: "Can be overly critical or judgmental. Black and white thinking. Difficulty with forgiveness. Harsh on self and others.",
    career: "Excel in law, justice system, accounting, and any field requiring fairness and balance. Natural judges and mediators.",
    relationships: "Seek equality and fairness in partnerships. Need honest, transparent communication.",
    health: "Health reflects inner balance. Benefits from practices that restore equilibrium.",
    spiritual: "Path of understanding karma and cosmic justice. Learning compassion alongside discernment.",
  },
  9: {
    number: 9,
    name: "The Hermit",
    keywords: ["Wisdom", "Solitude", "Inner Light", "Introspection"],
    positive: "Deep inner wisdom and self-knowledge. Ability to guide others through darkness. Comfortable with solitude. Excellent researcher and analyst. Illuminates truth.",
    negative: "Can become isolated or withdrawn. May avoid social connection. Overly critical or perfectionist. Difficulty sharing wisdom.",
    career: "Excel in research, analysis, spiritual guidance, writing, and any field requiring deep focus. Natural philosophers and truth-seekers.",
    relationships: "Need alone time to recharge. Seek deep, meaningful connections over superficial socializing.",
    health: "Benefits from quiet, contemplative practices. May need encouragement to stay physically active.",
    spiritual: "Path of inner illumination and wisdom. Learning to share light with others after inner journey.",
  },
  10: {
    number: 10,
    name: "Fortune",
    keywords: ["Cycles", "Destiny", "Change", "Opportunity"],
    positive: "Understanding of life cycles and timing. Ability to recognize and seize opportunities. Adaptable to change. Trusts in destiny and flow. Brings luck to endeavors.",
    negative: "May feel victim to circumstances. Difficulty with stability. Overly reliant on luck. Resists necessary changes.",
    career: "Excel in fields requiring timing and adaptability like trading, consulting, and entrepreneurship. Natural opportunists.",
    relationships: "Need partners who can flow with life's changes. Must learn to create stability within change.",
    health: "Health fluctuates with life cycles. Benefits from understanding body's natural rhythms.",
    spiritual: "Path of surrendering to divine timing. Learning to dance with destiny rather than resist it.",
  },
  11: {
    number: 11,
    name: "Strength",
    keywords: ["Courage", "Inner Power", "Compassion", "Taming"],
    positive: "Inner strength and courage. Ability to tame inner beasts with compassion. Patient and persistent. Combines power with gentleness. Natural healer.",
    negative: "May suppress anger or passion. Difficulty asserting boundaries. Over-controlling of self. Fears own power.",
    career: "Excel in healing professions, animal work, counseling, and any field requiring patient strength. Natural therapists and trainers.",
    relationships: "Bring patience and compassion to partnerships. Must learn to express needs and desires.",
    health: "Strong constitution but may ignore body's signals. Benefits from gentle, consistent self-care.",
    spiritual: "Path of mastering lower nature with love. Learning that true strength is compassionate.",
  },
  12: {
    number: 12,
    name: "Sacrifice",
    keywords: ["Surrender", "New Perspective", "Letting Go", "Pause"],
    positive: "Ability to see from new perspectives. Wisdom through surrender. Understanding of sacrifice for higher purpose. Patience in waiting. Spiritual insights.",
    negative: "May become stuck or martyred. Difficulty taking action. Victim mentality. Sacrifices self unnecessarily.",
    career: "Excel in spiritual work, counseling, and fields requiring patience. Natural mystics and contemplatives.",
    relationships: "Must learn healthy sacrifice versus martyrdom. Need partners who appreciate depth.",
    health: "May need to address chronic issues. Benefits from alternative healing and rest.",
    spiritual: "Path of ego death and rebirth. Learning to surrender control to higher wisdom.",
  },
  13: {
    number: 13,
    name: "Death",
    keywords: ["Transformation", "Endings", "Rebirth", "Release"],
    positive: "Powerful transformation abilities. Understands cycles of death and rebirth. Releases what no longer serves. Facilitates change in others. Phoenix energy.",
    negative: "Fear of change or loss. Clings to past. May create unnecessary endings. Difficulty with transitions.",
    career: "Excel in transformation work like therapy, hospice, change management. Natural transformers and alchemists.",
    relationships: "Relationships go through deep transformations. Must learn to release with grace.",
    health: "Strong regenerative abilities. Benefits from practices supporting renewal.",
    spiritual: "Path of death and rebirth. Learning to die to old self repeatedly to evolve.",
  },
  14: {
    number: 14,
    name: "Temperance",
    keywords: ["Balance", "Moderation", "Alchemy", "Integration"],
    positive: "Ability to blend opposites harmoniously. Natural healer and alchemist. Patient and moderate. Integrates diverse elements. Brings peace and balance.",
    negative: "May lack passion or direction. Overly cautious. Difficulty with extremes. Avoids necessary conflict.",
    career: "Excel in healing arts, diplomacy, chemistry, and fields requiring balance. Natural healers and mediators.",
    relationships: "Bring harmony and balance to partnerships. Need patient, stable connections.",
    health: "Benefits from balanced lifestyle. Natural understanding of holistic health.",
    spiritual: "Path of alchemical transformation. Learning to transmute base into gold through balance.",
  },
  15: {
    number: 15,
    name: "The Devil",
    keywords: ["Shadow", "Materialism", "Bondage", "Temptation"],
    positive: "Understanding of shadow self. Ability to work with taboo or difficult energies. Material success and manifestation. Powerful magnetism.",
    negative: "Addictions and attachments. Materialism over spirituality. Manipulation of others. Trapped by own desires.",
    career: "Excel in business, finance, psychology, and fields working with shadow. Natural entrepreneurs and psychologists.",
    relationships: "Intense, passionate connections. Must learn healthy boundaries and avoid codependency.",
    health: "Prone to addictive patterns. Benefits from shadow work and addiction recovery.",
    spiritual: "Path of integrating shadow. Learning to use power wisely and break free from bondage.",
  },
  16: {
    number: 16,
    name: "The Tower",
    keywords: ["Upheaval", "Revelation", "Breakthrough", "Liberation"],
    positive: "Catalyst for necessary change. Breaks through illusions. Liberates from false structures. Brings truth to light. Revolutionary energy.",
    negative: "Creates unnecessary chaos. Destructive patterns. Difficulty with stability. Resistance to rebuilding.",
    career: "Excel in revolutionary work, demolition, crisis management. Natural change agents and truth-tellers.",
    relationships: "Relationships may experience sudden changes. Must learn to rebuild after upheaval.",
    health: "May experience sudden health crises. Benefits from stress management and grounding.",
    spiritual: "Path of ego destruction and liberation. Learning that breakdown precedes breakthrough.",
  },
  17: {
    number: 17,
    name: "The Star",
    keywords: ["Hope", "Inspiration", "Healing", "Guidance"],
    positive: "Brings hope and inspiration to others. Natural healer and guide. Connection to higher realms. Optimistic and faith-filled. Illuminates path forward.",
    negative: "May be overly idealistic. Difficulty with practical matters. Disappointment when reality doesn't match vision.",
    career: "Excel in healing arts, counseling, inspiration work. Natural healers and hope-bringers.",
    relationships: "Bring hope and healing to partnerships. Need spiritual connection with partners.",
    health: "Strong healing abilities. Benefits from energy work and spiritual practices.",
    spiritual: "Path of being a light for others. Learning to channel divine inspiration and healing.",
  },
  18: {
    number: 18,
    name: "The Moon",
    keywords: ["Intuition", "Mystery", "Subconscious", "Illusion"],
    positive: "Deep intuitive and psychic abilities. Access to subconscious realms. Understanding of mystery and magic. Creative imagination. Dream work.",
    negative: "Confusion and illusion. Difficulty distinguishing reality from fantasy. Anxiety and fear. Lost in subconscious.",
    career: "Excel in creative arts, psychology, mystical work. Natural psychics and artists.",
    relationships: "Deep, intuitive connections. Must learn to communicate clearly despite intuitive knowing.",
    health: "Sensitive to lunar cycles and emotions. Benefits from dream work and emotional processing.",
    spiritual: "Path of navigating subconscious realms. Learning to trust intuition while staying grounded.",
  },
  19: {
    number: 19,
    name: "The Sun",
    keywords: ["Joy", "Success", "Vitality", "Clarity"],
    positive: "Radiant joy and vitality. Natural success and achievement. Clarity and truth. Brings light to situations. Optimistic and life-affirming.",
    negative: "May be overly confident or arrogant. Difficulty with shadow aspects. Avoids darkness. Superficial positivity.",
    career: "Excel in leadership, entertainment, teaching. Natural leaders and performers.",
    relationships: "Bring joy and vitality to partnerships. Need positive, growth-oriented connections.",
    health: "Strong vitality and life force. Benefits from sunlight and outdoor activities.",
    spiritual: "Path of embodying divine light. Learning to shine without burning others.",
  },
  20: {
    number: 20,
    name: "Judgment",
    keywords: ["Awakening", "Calling", "Rebirth", "Absolution"],
    positive: "Spiritual awakening and calling. Ability to rise above past. Forgiveness and absolution. Answers higher calling. Rebirth into new life.",
    negative: "Harsh self-judgment. Difficulty forgiving self or others. Ignores calling. Stuck in past mistakes.",
    career: "Excel in spiritual leadership, counseling, transformation work. Natural awakeners and rebirthers.",
    relationships: "Relationships support spiritual awakening. Must learn forgiveness and release of past.",
    health: "Health improves with spiritual awakening. Benefits from forgiveness practices.",
    spiritual: "Path of answering soul's calling. Learning to forgive and be reborn into higher purpose.",
  },
  21: {
    number: 21,
    name: "The World",
    keywords: ["Completion", "Integration", "Wholeness", "Success"],
    positive: "Completion of major cycles. Integration of all parts. Worldly success and recognition. Wholeness and fulfillment. Mastery achieved.",
    negative: "Fear of completion or success. Difficulty with endings. May start over unnecessarily. Lacks integration.",
    career: "Excel in international work, completion projects, mastery fields. Natural completers and integrators.",
    relationships: "Seek complete, whole partnerships. Need relationships that honor wholeness.",
    health: "Holistic health and integration. Benefits from practices supporting wholeness.",
    spiritual: "Path of integration and completion. Learning to honor endings and celebrate wholeness.",
  },
  22: {
    number: 22,
    name: "The Fool",
    keywords: ["New Beginnings", "Innocence", "Freedom", "Leap of Faith"],
    positive: "Spontaneous and free. Trusts in universe. Takes leaps of faith. Beginner's mind. Unlimited potential. Joyful and playful.",
    negative: "Reckless or naive. Lacks planning. Avoids responsibility. Perpetual beginner. Difficulty with commitment.",
    career: "Excel in creative fields, entrepreneurship, adventure work. Natural innovators and risk-takers.",
    relationships: "Need freedom and adventure in partnerships. Must learn balance between freedom and commitment.",
    health: "Benefits from spontaneous movement and play. May need grounding practices.",
    spiritual: "Path of trust and surrender. Learning to take leaps of faith while staying grounded.",
  },
};

/**
 * Get short description for an arcana
 */
export function getArcanaShortDescription(number: number): string {
  const arcana = ARCANA_DATA[number];
  if (!arcana) return "Unknown arcana";
  return `${arcana.name}: ${arcana.keywords.join(", ")}`;
}

/**
 * Get full arcana information
 */
export function getArcanaInfo(number: number): ArcanaInfo | null {
  return ARCANA_DATA[number] || null;
}
