import { sanitizeCmsHtml } from "@/lib/html/sanitize";

export type CommitteeOfficer = {
  role: string;
  name: string;
  tier: "lead" | "officer";
};

export type CommitteeContent = {
  intro: string;
  officers: CommitteeOfficer[];
  members: string[];
};

function stripTags(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractLines(html: string) {
  const sanitized = sanitizeCmsHtml(html);
  const fromTags = [...sanitized.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripTags(m[1]))
    .filter(Boolean);

  if (fromTags.length > 0) return fromTags;

  const plain = stripTags(sanitized);
  return plain ? plain.split(/\n+/).map((s) => s.trim()).filter(Boolean) : [];
}

function parseRoleLine(line: string): CommitteeOfficer | null {
  const match = line.match(
    /^(President|Secretary|Joint\s+Secretary)\s*[-–—:]\s*(.+)$/i
  );
  if (!match) return null;

  const role = match[1].replace(/\s+/g, " ");
  const name = match[2].trim();
  const normalizedRole =
    role.toLowerCase() === "president"
      ? "President"
      : role.toLowerCase() === "secretary"
        ? "Secretary"
        : "Joint Secretary";

  return {
    role: normalizedRole,
    name,
    tier: normalizedRole === "President" ? "lead" : "officer",
  };
}

function parseMembersLine(line: string): string[] | null {
  const match = line.match(/^Members\s*[-–—:]\s*(.+)$/i);
  if (!match) return null;
  return match[1]
    .split(/,\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const DEFAULT_COMMITTEE: CommitteeContent = {
  intro: "Currently, the library is managed by the following committee.",
  officers: [
    { role: "President", name: "KVD Mallikarjuna Rao", tier: "lead" },
    { role: "Secretary", name: "Venkat Pallapothu", tier: "officer" },
    { role: "Joint Secretary", name: "Kakaraparthi Chandra Mohan", tier: "officer" },
  ],
  members: [
    "Kakaraparthi Sreenivas Prasad",
    "Konjetty Ramakrishna",
    "Vutukuri Sudhakar",
    "Kakaraparthi Ananda Mohan",
  ],
};

export function parseCommitteeContent(html: string): CommitteeContent | null {
  const lines = extractLines(html);
  if (lines.length === 0) return null;

  const hasCommittee =
    lines.some((line) => /committee|president|secretary|members/i.test(line));
  if (!hasCommittee) return null;

  let intro = "";
  const officers: CommitteeOfficer[] = [];
  let members: string[] = [];

  for (const line of lines) {
    const role = parseRoleLine(line);
    if (role) {
      officers.push(role);
      continue;
    }

    const memberList = parseMembersLine(line);
    if (memberList) {
      members = memberList;
      continue;
    }

    if (/committee/i.test(line)) {
      intro = line.replace(/\s+/g, " ").trim();
      continue;
    }

    if (members.length === 0 && line.includes(",") && officers.length > 0) {
      members = line
        .split(/,\s*/)
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (!intro && officers.length === 0) {
      intro = line;
    }
  }

  if (officers.length === 0 && members.length === 0) return null;

  return {
    intro: intro || DEFAULT_COMMITTEE.intro,
    officers: officers.length > 0 ? officers : DEFAULT_COMMITTEE.officers,
    members: members.length > 0 ? members : DEFAULT_COMMITTEE.members,
  };
}

export function isManagementSlug(slug: string) {
  return slug === "current-management" || slug === "management";
}
