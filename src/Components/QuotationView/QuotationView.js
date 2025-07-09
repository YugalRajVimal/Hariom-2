import React from "react";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";

const QuotationPDF = ({ showQFDetails = {} }) => (
  <Document>
    <Page
      size="A4"
      style={{
        padding: 25,
        fontSize: 10,
        fontFamily: "Helvetica",
      }}
    >
      <View
        style={{
          height: "100%",
          flexDirection: "column",
          backgroundColor: "#FAFAFA",
          border: "1px solid rgb(0, 0, 0)",
        }}
      >
        {/* Quotation Title */}
        <Text
          style={{
            textAlign: "center",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: 16,
            backgroundColor: "black",
            padding: 2,
          }}
        >
          PROFORMA INVOICE
        </Text>

        {/* Top Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 4,
          }}
        >
          <Text>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              GSTIN:{" "}
            </Text>
            07AUAPA8929Q1Z5{" "}
          </Text>
          <Text>
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              PAN:{" "}
            </Text>
            AUAPA8929Q
          </Text>
        </View>

        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 4,
            paddingTop: 4,
            marginBottom: 8,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Image
              src="/logoView.png"
              style={{
                width: 130,
                height: 80,
                objectFit: "contain",
                zIndex: 1,
              }}
            />
            {/* <View
              style={{
                width: 107,
                height: 79,
                position: "absolute",
                top: 15,
                left: 15,
                backgroundColor: "lightgrey",
                zIndex: 2,
              }}
            ></View> */}
          </View>

          <View
            style={{
              textAlign: "center",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              marginBottom: 4,
              color: "#4B5563",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "black",
                marginBottom: 2,

                textTransform: "uppercase",
              }}
            >
              Hariom Advertising Company
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "semibold",
                color: "black",
                marginBottom: 2,
                textTransform: "uppercase",
              }}
            >
              ( An INS Accredited )
            </Text>
            <Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Office Address:{" "}
              </Text>
              10/22, GF East Patel Nagar, Near HDFC Bank, New Delhi - 110008
            </Text>
            <Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Office:{" "}
              </Text>
              A-45, 2nd Floor, Behind KFC, Connaught Place, New Delhi-110001
            </Text>

            <Text>
              <Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Web:{" "}
                </Text>
                www.hariomad.com
              </Text>{" "}
              |{" "}
              <Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Email:{" "}
                </Text>
                hariomadtvcompany@gmail.com
              </Text>
            </Text>
            <Text>
              <Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Phone:{" "}
                </Text>
                011-4100 1800
              </Text>{" "}
              |{" "}
              <Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Mobile:{" "}
                </Text>
                +91 9811555181, 9711009701
              </Text>
            </Text>
          </View>
        </View>

        {/* Quotation Details */}
        {/* Details  Section */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 8,
          }}
        >
          {/* Details Left Section */}

          {/* fontSize: 14, color: "red", fontWeight: "bold" */}

          <View style={{ flexDirection: "column", width: "50%" }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    width: "90px",
                    marginRight: 4,
                    fontSize: 10,
                  }}
                >
                  Customer Name
                </Text>
                <Text
                  style={{ fontWeight: "bold", marginRight: 2, fontSize: 14 }}
                >
                  :
                </Text>
                <Text
                  style={{ fontWeight: "bold", fontSize: 14, color: "red" }}
                >
                  {showQFDetails.clientName}
                </Text>
              </View>
            </View>

            {[
              {
                label1: "Address",
                value1: showQFDetails.address,
              },
              {
                label1: "Pincode",
                value1: showQFDetails.pincode,
              },
              {
                label1: "Contact No.",
                value1: showQFDetails.contactNo,
              },
              {
                label1: "Ref. No.",
                value1: showQFDetails.refNo,
              },
              {
                label1: "Payment Terms",
                value1: showQFDetails.paymentTerms,
              },
            ].map((row, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  width: "100%",
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      width: "90px",
                      marginRight: 4,
                    }}
                  >
                    {row.label1}
                  </Text>
                  <Text style={{ fontWeight: "bold", marginRight: 2 }}>:</Text>
                  <Text>{row.value1}</Text>
                </View>
              </View>
            ))}
          </View>
          {/* Details Right Section */}

          <View style={{ flexDirection: "column", width: "50%" }}>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-end",
                width: "100%",
                fontSize: 8,
              }}
            >
              <View style={{ flexDirection: "row", width: "70%" }}>
                <Text
                  style={{
                    width: "200px",
                    height: "20px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    textAlign: "right",
                    textTransform: "uppercase",
                    paddingHorizontal: 6,
                    paddingVertical: 4,
                  }}
                >
                  Date
                </Text>
                <Text
                  style={{
                    width: "170px",
                    height: "20px",
                    display: "flex",
                    justifyContent: "flex-start",
                    border: "1 solid black",
                    borderBottomWidth: 0,
                    alignItems: "center",
                    paddingHorizontal: 4,
                    paddingVertical: 4,
                  }}
                >
                  {`${new Date(showQFDetails.date).getDate()}/${
                    new Date(showQFDetails.date).getMonth() + 1
                  }/${new Date(showQFDetails.date).getFullYear()}`}
                </Text>
              </View>
              <View style={{ flexDirection: "row", width: "70%" }}>
                <Text
                  style={{
                    width: "200px",
                    height: "20px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    textAlign: "right",
                    textTransform: "uppercase",
                    paddingHorizontal: 6,
                    paddingVertical: 4,
                  }}
                >
                  Invoice
                </Text>
                <Text
                  style={{
                    width: "170px",
                    height: "20px",
                    display: "flex",
                    justifyContent: "flex-start",
                    border: "1 solid black",
                    borderBottomWidth: 0,
                    alignItems: "center",
                    paddingHorizontal: 4,
                    paddingVertical: 4,
                  }}
                >
                  {showQFDetails.invoice}
                </Text>
              </View>
              <View style={{ flexDirection: "row", width: "70%" }}>
                <Text
                  style={{
                    width: "200px",
                    height: "20px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    textAlign: "right",
                    textTransform: "uppercase",
                    paddingHorizontal: 6,
                    paddingVertical: 4,
                  }}
                >
                  Customer Id
                </Text>
                <Text
                  style={{
                    width: "170px",
                    height: "20px",
                    display: "flex",
                    justifyContent: "flex-start",
                    border: "1 solid black",
                    borderBottomWidth: 0,
                    alignItems: "center",
                    paddingHorizontal: 4,
                    paddingVertical: 4,
                  }}
                >
                  {showQFDetails.customerId}
                </Text>
              </View>
              <View style={{ flexDirection: "row", width: "70%" }}>
                <Text
                  style={{
                    width: "200px",
                    height: "20px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    textAlign: "right",
                    textTransform: "uppercase",
                    paddingHorizontal: 6,
                    paddingVertical: 4,
                  }}
                >
                  Due Date
                </Text>
                <Text
                  style={{
                    width: "170px",
                    height: "20px",
                    display: "flex",
                    justifyContent: "flex-start",
                    border: "1 solid black",
                    alignItems: "center",
                    paddingHorizontal: 4,
                    paddingVertical: 4,
                  }}
                >
                  {showQFDetails.dueDate
                    ? `${new Date(showQFDetails.dueDate).getDate()}/${
                        new Date(showQFDetails.dueDate).getMonth() + 1
                      }/${new Date(showQFDetails.dueDate).getFullYear()}`
                    : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Ad Table Section */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "black",
              borderLeftWidth: 0,
              borderRightWidth: 0,
              fontSize: 10,
              fontWeight: "bold",
              color: "black",
              textTransform: "uppercase",
            }}
          >
            {[
              "Publication / Edition",
              "Date of Insertion",
              "Position",
              "Rate",
              "Size (W x H)",
              "Scheme / Matter Instructions",
              "Amount (Rate x Size)",
            ].map((header, index) => (
              <Text
                key={index}
                style={{
                  flex: 1,
                  paddingHorizontal: 2,
                  paddingVertical: 6,
                  borderRightWidth: index < 6 ? 1 : 0,
                  borderRightColor: "black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {header}
              </Text>
            ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderColor: "black",
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
              height: "150px",
              fontSize: 11,
              borderColor: "black",
            }}
          >
            <Text
              style={{
                flex: 1,
                paddingHorizontal: 2,
                paddingVertical: 10,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "black",
              }}
            >
              {showQFDetails.publication}
            </Text>
            <Text
              style={{
                flex: 1,
                paddingHorizontal: 2,
                paddingVertical: 10,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "black",
              }}
            >
              {new Date(showQFDetails.dateOfInsertion).getDate()}/
              {new Date(showQFDetails.dateOfInsertion).getMonth() + 1}/
              {new Date(showQFDetails.dateOfInsertion).getFullYear()}
            </Text>
            <Text
              style={{
                flex: 1,
                paddingHorizontal: 2,
                paddingVertical: 10,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "black",
              }}
            >
              {showQFDetails.position}
            </Text>
            <Text
              style={{
                flex: 1,
                paddingHorizontal: 2,
                paddingVertical: 10,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "black",
              }}
            >
              {showQFDetails.rate}
            </Text>
            <Text
              style={{
                flex: 1,
                paddingHorizontal: 2,
                paddingVertical: 10,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "black",
              }}
            >
              {showQFDetails.width} x {showQFDetails.height}
            </Text>
            <Text
              style={{
                flex: 1,
                paddingHorizontal: 2,
                paddingVertical: 10,
                textAlign: "center",
                borderRightWidth: 1,
                borderRightColor: "black",
              }}
            >
              {showQFDetails.scheme}
            </Text>
            <Text
              style={{
                flex: 1,
                paddingHorizontal: 2,
                paddingVertical: 10,
                textAlign: "center",
                borderLeftWidth: 0,
                borderRightColor: "black",
              }}
            >
              {Math.ceil(showQFDetails.amount)}
            </Text>
          </View>
        </View>

        {/* Remark and Total Section */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid rgb(0, 0, 0)",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRight: "1px solid rgb(0, 0, 0)",
              width: "71.58%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 4,
                gap: 10,
                marginBottom: 10,
                padding: 5,
                borderBottom: "1px solid rgb(0, 0, 0)",
              }}
            >
              <Text style={{ fontSize: 8, color: "#374151" }}>Remarks:</Text>
              <Text style={{ textAlign: "left", paddingRight: 16 }}>
                {showQFDetails.remark}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                flex: 8,
                gap: 10,
                marginBottom: 10,
                paddingHorizontal: 4,
                fontSize: 8,
                borderBottom: "1px solid rgb(0, 0, 0)",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  color: "#374151",
                  textAlign: "center",
                }}
              >
                Bank Details
              </Text>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      width: "100px",
                      fontWeight: "bold",
                    }}
                  >
                    Bank Name
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginRight: 4,
                    }}
                  >
                    :
                  </Text>
                  <Text>HDFC Bank LTD.</Text>
                </View>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      width: "100px",
                      fontWeight: "bold",
                    }}
                  >
                    Branch Address
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginRight: 4,
                    }}
                  >
                    :
                  </Text>
                  <Text>10/30 East Patel Nagar, New Delhi-110008, Delhi </Text>
                </View>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      width: "100px",
                      fontWeight: "bold",
                    }}
                  >
                    Bank Account Number
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginRight: 4,
                    }}
                  >
                    :
                  </Text>
                  <Text>03032000005093</Text>
                </View>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      width: "100px",
                      fontWeight: "bold",
                    }}
                  >
                    Bank Branch IFSC Code
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginRight: 4,
                    }}
                  >
                    :
                  </Text>
                  <Text>HDFC0001365</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "column",
                flex: 7,
                gap: 10,
                marginBottom: 10,
                padding: 10,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 8 }}>
                Terms and Conditions
              </Text>

              <Text style={{ fontSize: 8 }}>
                1. All remittance should be payable to the{" "}
                <Text style={{ fontWeight: "bold" }}>
                  Hariom Advertising Company
                </Text>
                .
              </Text>

              <Text style={{ fontSize: 8 }}>
                2. Invoice payment within 30 days.
              </Text>

              <Text style={{ fontSize: 8 }}>
                3. Bill if not paid within due date will attract intt. @ 24%
              </Text>

              <Text style={{ fontSize: 8 }}>
                4. All disputes subject to Delhi Jurisdiction only.
              </Text>

              <Text style={{ fontSize: 8 }}>
                5. Any disputes to this bill will be only be entertaining within
                two days of Recpt. of this bill
              </Text>

              <Text style={{ fontSize: 8 }}>
                6.{" "}
                <Text style={{ fontWeight: "bold" }}>
                  @1% TDS Applicable Under Section 194 (c) on taxable value of
                  Invoice
                </Text>
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 2,
              backgroundColor: "#FFFFFF",
              fontSize: 8,
              height: "280px",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 3,
                borderBottom: "1px solid rgb(0,0,0)",
              }}
            >
              <View
                style={{
                  width: "50.3%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                  borderRight: "1px solid rgb(0,0,0)",
                }}
              >
                <Text>Trade Discount</Text>
              </View>
              <View
                style={{
                  width: "49.7%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text> {Math.ceil(parseFloat(showQFDetails.discount))}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                borderBottom: "1px solid rgb(0,0,0)",
              }}
            >
              <View
                style={{
                  width: "50.3%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                  borderRight: "1px solid rgb(0,0,0)",
                }}
              >
                <Text>Total Amount</Text>
              </View>
              <View
                style={{
                  width: "49.7%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text> {Math.ceil(parseFloat(showQFDetails.totalAmount))}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                borderBottom: "1px solid rgb(0,0,0)",
              }}
            >
              <View
                style={{
                  width: "50.3%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                  borderRight: "1px solid rgb(0,0,0)",
                }}
              >
                <Text>GST {parseFloat(showQFDetails.percentageOfGST)}%</Text>
              </View>
              <View
                style={{
                  width: "49.7%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>
                  {" "}
                  {Math.ceil(
                    parseFloat(showQFDetails.totalAmount) *
                      parseFloat(showQFDetails.percentageOfGST)
                  )}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                borderBottom: "1px solid rgb(0,0,0)",
              }}
            >
              <View
                style={{
                  width: "50.3%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                  borderRight: "1px solid rgb(0,0,0)",
                }}
              >
                <Text>Net Amount</Text>
              </View>
              <View
                style={{
                  width: "49.7%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>
                  {" "}
                  {Math.ceil(
                    parseFloat(showQFDetails.totalAmount) +
                      parseFloat(showQFDetails.totalAmount) *
                        parseFloat(showQFDetails.percentageOfGST)
                  )}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 9,
                width: "100%",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={{ fontSize: 10 }}>Your faithfully</Text>
                </View>

                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginTop: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    For Hariom Advertising Company
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 20,
                  width: "100%",
                }}
              >
                <Image
                  src="/sign.jpeg"
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                    objectFit: "contain",
                    zIndex: 1,
                  }}
                />
              </View>

              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  flexDirection: "column",
                  alignItems: "center",
                  // marginTop: 50,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Authorised Signatory
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            fontSize: 9,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: "25px",
          }}
        >
          <Text></Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default QuotationPDF;
