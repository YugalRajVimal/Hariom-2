import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FAFAFA",
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 12,
    color: "#4B5563",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1D4ED8",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  section: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    border: "1px solid #E5E7EB",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    color: "#374151",
    width: "40%",
  },
  value: {
    color: "#1F2937",
    width: "58%",
    textAlign: "right",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    paddingBottom: 4,
    marginTop: 10,
    fontWeight: "bold",
    color: "#6B7280",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  cell: {
    flex: 1,
    paddingHorizontal: 2,
  },
  footer: {
    marginTop: 20,
    textAlign: "center",
    color: "#DC2626",
    fontWeight: "bold",
  },
  subFooter: {
    marginTop: 4,
    color: "#6B7280",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111827",
    textDecoration: "underline",
  },
});

const QuotationPDF = ({ showQFDetails = {} }) => (
  <Document>
    <Page
      size="A4"
      style={{
        flexDirection: "column",
        backgroundColor: "#FAFAFA",
        padding: 30,
        fontSize: 10,
        fontFamily: "Helvetica",
        border: "1px solid rgb(0, 0, 0)",
      }}
    >
      {/* Header */}
      {/* Top Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 4,
        }}
      >
        <Text>GSTIN:07AUAPA8929Q1Z5</Text>
        <Text>PAN:AUAPA8929Q</Text>
      </View>

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 4,
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src="/logoView.png"
            style={{ width: 150, height: 100, objectFit: "contain" }}
          />
          <Text style={{ textAlign: "center" }}>
            Newspaper Advertising Company
          </Text>
        </View>

        <View
          style={{
            textAlign: "center",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            color: "#4B5563",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "red",
              marginBottom: 4,
              textTransform: "uppercase",
            }}
          >
            Hariom Advertising Company
          </Text>
          <Text>(Authorized Times Space Center from Times Of India)</Text>
          <Text>An INS Accredited</Text>
          <Text>
            Address:10/22, GF East Patel Nagar, Near HDFC Bank, New Delhi -
            110008
          </Text>
          <Text>
            Tel: +91 9811555181, 9711009701, 011 43401133, 011-41001800
          </Text>
          <Text>Website: www.hariomad.com</Text>
          <Text>Email: hariomadtvcompany@gmail.com</Text>
        </View>
      </View>

      {/* Quotation Title */}
      <Text
        style={{
          textAlign: "center",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
          color: "#ffffff",
          marginTop: 10,
          fontSize: 16,
          backgroundColor: "black",
          padding: 2,
        }}
      >
        Quotation
      </Text>
      {/* Quotation Details */}

      {/* Details Section */}
      <View style={{ flexDirection: "column", width: "100%" }}>
        {[
          {
            label1: "Client Name:",
            value1: showQFDetails.clientName,
            label2: "Date:",
            value2: new Date(showQFDetails.date).toLocaleDateString(),
          },
          {
            label1: "Quotation Form Number",
            value1: showQFDetails.quotationFormNumber,
            label2: "Publication:",
            value2: showQFDetails.publication,
          },
          {
            label1: "HUI",
            value1: showQFDetails.hui,
            label2: "Subject",
            value2: showQFDetails.subject,
          },
          {
            label1: "Rate",
            value1: showQFDetails.rate,
            label2: "Size",
            value2: showQFDetails.size,
          },
          {
            label1: "Address",
            value1: showQFDetails.address,
          },
        ].map((row, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: "row", width: "50%" }}>
              <Text style={{ fontWeight: "bold", marginRight: 4 }}>
                {row.label1}
              </Text>
              <Text>{row.value1}</Text>
            </View>
            {row.label2 && (
              <View style={{ flexDirection: "row", width: "50%" }}>
                <Text style={{ fontWeight: "bold", marginRight: 4 }}>
                  {row.label2}
                </Text>
                <Text>{row.value2}</Text>
              </View>
            )}
          </View>
        ))}
        <Text style={{ marginTop: 20 }}>
          Please publish the following advertisement Strictly as per schedule.
          Only voucher copies must be supplied to the advertiser and us
          immediately after the publication to each insertion.
        </Text>
      </View>
    </Page>
  </Document>
);

export default QuotationPDF;
