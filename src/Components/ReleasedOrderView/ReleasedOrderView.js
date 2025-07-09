import React from "react";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";

const ReleasedOrderPDF = ({ orderId, showRODetails = {} }) => (
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
                color: "red",
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
                www.hariommad.com
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

        {/* Released Order Title */}
        <Text
          style={{
            textAlign: "center",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
            color: "#ffffff",
            fontSize: 16,
            backgroundColor: "black",
            padding: 2,
          }}
        >
          Released Order
        </Text>

        {/* Details Section */}
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            marginBottom: 10,
            paddingHorizontal: 4,
          }}
        >
          {[
            // {
            //   label1: "Date:",
            //   value1: new Date(showRODetails.insertionDate).toLocaleDateString(),
            // },
            {
              label1: "Publication Name",
              value1: showRODetails.publicationName,
              label2: "Date",
              value2: `${new Date(showRODetails.dateOfInsertion).getDate()}/${
                new Date(showRODetails.dateOfInsertion).getMonth() + 1
              }/${new Date(showRODetails.dateOfInsertion).getFullYear()}`,
            },
            {
              label1: "Agency Code",
              value1: showRODetails.agencyCode,
            },
            // {
            //   label1: "Client Id:",
            //   value1: showRODetails.clientId,
            //   label2: "Client Name:",
            //   value2: showRODetails.clientName,
            // },
            {
              label1: "HUI",
              value1: showRODetails.hui,
              label2: "R.O. No.",
              value2: orderId,
            },
            {
              label1: "Order Reference/code",
              value1: showRODetails.orderRefId,
              label2: "Category",
              value2: showRODetails.category,
            },
            {
              label1: "Code",
              value1: showRODetails.code,
            },
            // {
            //   label1: "Reference No.",
            //   value1: showRODetails.referenceNo,
            //   label2: "Number of Ads:",
            //   value2: showRODetails.noOfAds,
            // },
          ].map((row, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 8,
              }}
            >
              <View style={{ flexDirection: "row", width: "50%" }}>
                <Text
                  style={{ fontWeight: "bold", marginRight: 8, width: "110px" }}
                >
                  {row.label1}
                </Text>
                <Text>: {row.value1}</Text>
              </View>
              {row.label2 && (
                <View style={{ flexDirection: "row", width: "50%" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      marginRight: 8,
                      width: "70px",
                    }}
                  >
                    {row.label2}
                  </Text>
                  <Text>: {row.value2}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            paddingVertical: 4,
            borderBottomWidth: 1,
            borderColor: "black",
            paddingHorizontal: 4,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              marginRight: 8,
              fontSize: "10px",
              width: "110px",
            }}
          >
            Client Name
          </Text>
          <Text style={{ fontSize: 14, color: "red", fontWeight: "bold" }}>
            : {showRODetails.clientName}
          </Text>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "black",
            paddingHorizontal: 4,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginTop: 8,
              marginBottom: 8,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              Note:{" "}
            </Text>
            Please publish the following advertisement Strictly as per schedule
            only voucher copies must be supplied to the advertiser, and us
            immediately after the publication to each insertion.
          </Text>
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
              borderTopWidth: 0,
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
              "Scheme",
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
              {showRODetails.publicationName}
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
              {new Date(showRODetails.dateOfInsertion).getDate()}/
              {new Date(showRODetails.dateOfInsertion).getMonth() + 1}/
              {new Date(showRODetails.dateOfInsertion).getFullYear()}
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
              {showRODetails.position}
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
              {showRODetails.roRate}
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
              {showRODetails.roWidth} x {showRODetails.roHeight}
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
              {showRODetails.scheme}
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
              {Math.ceil(showRODetails.roAmount)}
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
                gap: 10,
                marginBottom: 10,
                padding: 10,
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#374151" }}>
                Remarks:
              </Text>
              <Text style={{ textAlign: "right" }}>{showRODetails.remark}</Text>
            </View>
            {/* Special Instructions */}
            <View
              style={{
                width: "100%",
                flexDirection: "column",
                gap: 4,
                marginTop: 10,
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: 4,
                  color: "#111827",
                  textDecoration: "underline",
                }}
              >
                Special Instructions
              </Text>
              {[
                "1. Agency have no source to verify the intension/motive of the client OR legality of the advertisement. So, all legal responsibility of the advertisement will be born by the client. Newspaper can confirm the legality of the advertisement from his own sources before publication of the advertisement. In case of legal despute for the advertisement Client will be fully responsible. Advertising agency will not be responsible in any case of any legal dispute the advertisement published.",
                '2. Please don\'t honour our any "Released Order" without Authorised Signature of ANIL ARORA',
                "3. Agency will not be responsible for payment of bill raised the R.O. issued without above Authorised Person Signature.",
                "4. Please send us two voucher copies immediately after publication on the advertisement and tearsheet along with the bill.",
                "5. Please quote Release Order No. your bills and letters.",
                "6. Bill payment will be made after receipt of payment from client.",
                "7. All dispute subject to Delhi jurisdiction only.",
              ].map((point, i) => (
                <Text key={i} style={{ marginBottom: 2, fontSize: 8 }}>
                  {point}
                </Text>
              ))}
            </View>
          </View>
          <View
            style={{
              flex: 2,
              backgroundColor: "#FFFFFF",
              fontSize: 8,
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
                  flexDirection: "col",
                  justifyContent: "center",
                  alignItems: "center",

                  borderRight: "1px solid rgb(0,0,0)",
                }}
              >
                <Text>Trade Discount</Text>
                <Text>
                  {showRODetails.agencyCommission1}%+
                  {showRODetails.agencyCommission2
                    ? `${showRODetails.agencyCommission2}%+`
                    : ""}
                  {showRODetails.agencyCommission3
                    ? `${showRODetails.agencyCommission3}%`
                    : ""}
                </Text>
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
                  {Math.ceil(
                    showRODetails.roAmount *
                      ((parseFloat(showRODetails.agencyCommission1) +
                        (showRODetails.agencyCommission2
                          ? parseFloat(showRODetails.agencyCommission2)
                          : 0) +
                        (showRODetails.agencyCommission3
                          ? parseFloat(showRODetails.agencyCommission3)
                          : 0)) /
                        100)
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
                <Text>
                  {" "}
                  {Math.ceil(parseFloat(showRODetails.roTotalAmount))}
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
                <Text>GST {showRODetails.percentageOfGST}%</Text>
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
                    parseFloat(showRODetails.roTotalAmount) *
                      (showRODetails.percentageOfGST / 100)
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
                    parseFloat(showRODetails.roTotalAmount) +
                      parseFloat(showRODetails.roTotalAmount) *
                        (showRODetails.percentageOfGST / 100)
                  )}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 9,
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
                  paddingTop: 10,
                  width: "100%",
                }}
              >
                <Image
                  src="/sign.jpeg"
                  style={{
                    width: "80%",
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
          <Text>
            TO AVOID FAKE/TEMPERED OR OVERWRITE R.O KINDLY DO COUNTER
            CONFIRMATION ON DELHI - 9711009701, 9811555181
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ReleasedOrderPDF;
