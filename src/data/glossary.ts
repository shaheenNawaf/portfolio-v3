/** Industry shorthand used in project/experience copy, expanded via <abbr> on render. */
export const glossary: Record<string, string> = {
  ROAS: "Return on ad spend",
  NGR: "Net gaming revenue",
  CCV: "Concurrent viewers",
  DAU: "Daily active users",
  KYC: "Know your customer (identity verification)",
  O2O: "Offline-to-online",
  GTM: "Go-to-market",
  D2C: "Direct-to-consumer",
  CAC: "Customer acquisition cost",
  CPA: "Cost per acquisition",
  QoQ: "Quarter over quarter",
  MoM: "Month over month",
  UA: "User acquisition",
};

const pattern = new RegExp(`\\b(${Object.keys(glossary).join("|")})\\b`, "g");

/** Split text into plain strings (even indexes) and glossary terms (odd indexes). */
export const splitTerms = (text: string): string[] => text.split(pattern);
