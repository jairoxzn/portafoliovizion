import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { calculateQuoteTotals, lineTotal, formatMoney, quoteStatusLabel } from "@/lib/quotes";
import { formatDate } from "@/lib/utils";

const COLORS = {
  electric: "#00AEEF",
  cobalt: "#1C4E80",
  carbon: "#1A1A1B",
  muted: "#6B7280",
  border: "#E5E7EB",
  surfaceMuted: "#F4F5F7",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: COLORS.carbon,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: `2 solid ${COLORS.electric}`,
  },
  companyHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 44, height: 44, objectFit: "contain" },
  companyName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: COLORS.cobalt },
  companyLine: { fontSize: 9, color: COLORS.muted, marginTop: 2 },
  quoteTitleBlock: { alignItems: "flex-end" },
  quoteNumber: { fontSize: 14, fontFamily: "Helvetica-Bold", color: COLORS.electric },
  quoteMeta: { fontSize: 9, color: COLORS.muted, marginTop: 2 },
  statusBadge: {
    marginTop: 6,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    backgroundColor: COLORS.cobalt,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
  },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.cobalt,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clientBox: {
    backgroundColor: COLORS.surfaceMuted,
    padding: 10,
    borderRadius: 4,
  },
  clientName: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  clientLine: { fontSize: 9, color: COLORS.muted, marginTop: 2 },
  paragraph: { fontSize: 9.5, lineHeight: 1.5, color: "#374151" },
  table: { marginTop: 4 },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: COLORS.cobalt,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 3,
  },
  tableHeaderCell: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#FFFFFF" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottom: `1 solid ${COLORS.border}`,
  },
  tableCell: { fontSize: 9.5 },
  colDesc: { flex: 3 },
  colQty: { flex: 0.8, textAlign: "center" },
  colPrice: { flex: 1.2, textAlign: "right" },
  colTotal: { flex: 1.2, textAlign: "right" },
  totalsBox: { marginTop: 10, alignSelf: "flex-end", width: 220 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  totalsLabel: { fontSize: 9.5, color: COLORS.muted },
  totalsValue: { fontSize: 9.5 },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTop: `1.5 solid ${COLORS.cobalt}`,
  },
  grandTotalLabel: { fontSize: 11, fontFamily: "Helvetica-Bold", color: COLORS.cobalt },
  grandTotalValue: { fontSize: 13, fontFamily: "Helvetica-Bold", color: COLORS.cobalt },
  bulletRow: { flexDirection: "row", marginBottom: 3 },
  bulletMark: { width: 10, fontSize: 9.5 },
  bulletText: { fontSize: 9.5, flex: 1 },
  twoColumns: { flexDirection: "row", gap: 20 },
  column: { flex: 1 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    borderTop: `1 solid ${COLORS.border}`,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 8, color: COLORS.muted },
});

export function QuotePdfDocument({ quote, settings, logo }) {
  const totals = calculateQuoteTotals(quote.items, quote.discount, quote.taxRate);

  return (
    <Document title={`Cotización ${quote.number}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.companyHeader}>
            {logo && <Image src={logo} style={styles.logo} alt="" />}
            <View>
              <Text style={styles.companyName}>{settings.companyName}</Text>
              {settings.email && <Text style={styles.companyLine}>{settings.email}</Text>}
              {settings.phone && <Text style={styles.companyLine}>{settings.phone}</Text>}
              {settings.address && <Text style={styles.companyLine}>{settings.address}</Text>}
            </View>
          </View>
          <View style={styles.quoteTitleBlock}>
            <Text style={styles.quoteNumber}>{quote.number}</Text>
            <Text style={styles.quoteMeta}>Fecha: {formatDate(quote.issueDate, { day: "2-digit", month: "2-digit", year: "numeric" })}</Text>
            {quote.validUntil && (
              <Text style={styles.quoteMeta}>
                Válida hasta: {formatDate(quote.validUntil, { day: "2-digit", month: "2-digit", year: "numeric" })}
              </Text>
            )}
            <Text style={styles.statusBadge}>{quoteStatusLabel(quote.status)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <View style={styles.clientBox}>
            <Text style={styles.clientName}>{quote.client.name}</Text>
            {quote.client.taxId && <Text style={styles.clientLine}>RUC/DNI: {quote.client.taxId}</Text>}
            {quote.client.contactName && (
              <Text style={styles.clientLine}>
                Contacto: {quote.client.contactName}
                {quote.client.contactRole ? ` (${quote.client.contactRole})` : ""}
              </Text>
            )}
            {quote.client.email && <Text style={styles.clientLine}>{quote.client.email}</Text>}
            {quote.client.phone && <Text style={styles.clientLine}>{quote.client.phone}</Text>}
            {quote.client.address && <Text style={styles.clientLine}>{quote.client.address}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{quote.title}</Text>
          <Text style={styles.paragraph}>{quote.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de servicios</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, styles.colDesc]}>Descripción</Text>
              <Text style={[styles.tableHeaderCell, styles.colQty]}>Cant.</Text>
              <Text style={[styles.tableHeaderCell, styles.colPrice]}>Precio unit.</Text>
              <Text style={[styles.tableHeaderCell, styles.colTotal]}>Subtotal</Text>
            </View>
            {quote.items.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={[styles.tableCell, styles.colDesc]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.colPrice]}>{formatMoney(item.unitPrice, quote.currency)}</Text>
                <Text style={[styles.tableCell, styles.colTotal]}>{formatMoney(lineTotal(item), quote.currency)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{formatMoney(totals.subtotal, quote.currency)}</Text>
            </View>
            {totals.discount > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Descuento</Text>
                <Text style={styles.totalsValue}>-{formatMoney(totals.discount, quote.currency)}</Text>
              </View>
            )}
            {quote.taxRate > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Impuesto ({quote.taxRate}%)</Text>
                <Text style={styles.totalsValue}>{formatMoney(totals.tax, quote.currency)}</Text>
              </View>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>{formatMoney(totals.total, quote.currency)}</Text>
            </View>
          </View>
        </View>

        {(quote.scopeIncludes.length > 0 || quote.scopeExcludes.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alcance</Text>
            <View style={styles.twoColumns}>
              {quote.scopeIncludes.length > 0 && (
                <View style={styles.column}>
                  <Text style={[styles.clientLine, { fontFamily: "Helvetica-Bold", marginBottom: 4 }]}>Incluye</Text>
                  {quote.scopeIncludes.map((line, index) => (
                    <View style={styles.bulletRow} key={index}>
                      <Text style={styles.bulletMark}>✓</Text>
                      <Text style={styles.bulletText}>{line}</Text>
                    </View>
                  ))}
                </View>
              )}
              {quote.scopeExcludes.length > 0 && (
                <View style={styles.column}>
                  <Text style={[styles.clientLine, { fontFamily: "Helvetica-Bold", marginBottom: 4 }]}>No incluye</Text>
                  {quote.scopeExcludes.map((line, index) => (
                    <View style={styles.bulletRow} key={index}>
                      <Text style={styles.bulletMark}>✕</Text>
                      <Text style={styles.bulletText}>{line}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {quote.paymentTerms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Forma de pago</Text>
            <Text style={styles.paragraph}>{quote.paymentTerms}</Text>
          </View>
        )}

        {quote.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas y condiciones</Text>
            <Text style={styles.paragraph}>{quote.notes}</Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{settings.companyName}</Text>
          <Text style={styles.footerText}>
            {settings.email || ""} {settings.phone ? `· ${settings.phone}` : ""}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
