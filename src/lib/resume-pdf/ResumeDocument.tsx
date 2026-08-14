import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { site } from "@/content/data/site";
import { experience } from "@/content/data/experience";
import { education } from "@/content/data/education";
import { skills } from "@/content/data/skills";
import { credentials } from "@/content/data/credentials";
import { projects } from "@/content/data/projects";
import { characterReference } from "@/content/data/reference";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#171717" },
  name: { fontSize: 20, fontWeight: 700, marginBottom: 2 },
  title: { fontSize: 12, color: "#2563eb", marginBottom: 8 },
  contactLine: { fontSize: 9, color: "#6b7280", marginBottom: 16 },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 3,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  itemTitle: { fontWeight: 700 },
  itemMeta: { color: "#6b7280" },
  bullet: { marginLeft: 10, marginBottom: 2 },
  paragraph: { marginBottom: 10, lineHeight: 1.4 },
  skillLine: { marginBottom: 3 },
});

export function ResumeDocument() {
  const engineeringProjects = projects.filter((p) => p.category === "engineering");
  const academicProjects = projects.filter((p) => p.category === "academic");

  return (
    <Document title={`${site.name} — Resume`} author={site.name}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{site.name}</Text>
        <Text style={styles.title}>{site.title}</Text>
        <Text style={styles.contactLine}>
          {site.location} | {site.email} | {site.social.github}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.paragraph}>{site.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {experience.map((item) => (
            <View key={item.org} style={{ marginBottom: 8 }}>
              <View style={styles.itemRow}>
                <Text style={styles.itemTitle}>
                  {item.role} — {item.org}
                </Text>
                <Text style={styles.itemMeta}>
                  {item.period}
                  {item.location ? ` · ${item.location}` : ""}
                </Text>
              </View>
              {item.bullets.map((b) => (
                <Text key={b} style={styles.bullet}>
                  • {b}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((item) => (
            <View key={item.school} style={{ marginBottom: 6 }}>
              <View style={styles.itemRow}>
                <Text style={styles.itemTitle}>{item.school}</Text>
                <Text style={styles.itemMeta}>{item.period}</Text>
              </View>
              <Text>{item.detail}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {[...engineeringProjects, ...academicProjects].map((p) => (
            <View key={p.slug} style={{ marginBottom: 6 }}>
              <Text style={styles.itemTitle}>{p.title}</Text>
              <Text>{p.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {skills.map((group) => (
            <Text key={group.category} style={styles.skillLine}>
              <Text style={{ fontWeight: 700 }}>{group.category}: </Text>
              {group.items.join(", ")}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications & Seminars</Text>
          {credentials.map((c) => (
            <View key={c.title} style={styles.itemRow}>
              <Text>{c.title} — {c.issuer}</Text>
              <Text style={styles.itemMeta}>{c.date}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Character Reference</Text>
          <Text>{characterReference.name}</Text>
          <Text style={styles.itemMeta}>{characterReference.title}</Text>
        </View>
      </Page>
    </Document>
  );
}
