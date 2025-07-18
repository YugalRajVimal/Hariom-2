import React from "react";
import { Page, Text, View, Document, Image, Font } from "@react-pdf/renderer";

import { ToWords } from "to-words";
Font.registerHyphenationCallback((word) => [word]);

const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: false,
    ignoreDecimal: true,
    ignoreZeroCurrency: false,
    doNotAddOnly: true,
  },
});

const convertAmountToWords = (amount) => {
  const rounded = Math.round(amount); // you can also use Math.floor() if needed
  const words = toWords.convert(rounded);
  return `${words} Rupees`;
};

const InvoicePDF = ({ allDetails = {}, billDetails = {} }) => (
  <Document>
    <Page
      size="A4"
      style={{
        padding: 20,
        fontSize: 9,
        fontFamily: "Helvetica",
        lineHeight: 1.4,
      }}
    >
      <View
        style={{
          border: "1 solid black",
        }}
      >
        {/* Header */}
        <Text
          style={{
            backgroundColor: "#000",
            padding: 5,
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 12,
            textTransform: "uppercase",
          }}
        >
          TAX INVOICE
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
            <Text style={{ fontWeight: "bold" }}>GSTIN: </Text>
            07AUAPA8929Q1Z5
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>PAN: </Text>
            AUAPA8929Q
          </Text>
        </View>

        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingHorizontal: 4,
            paddingTop: 4,
            gap: 4,
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
                width: 120,
                height: 70,
                objectFit: "contain",
                zIndex: 1,
              }}
            />
            {/* <View
              style={{
                width: 95,
                height: 69,
                position: "absolute",
                top: 4,
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
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 2,
              marginBottom: 4,
              color: "#4B5563",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "red",
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              Hariom Advertising Company
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold", color: "black" }}>
                Office Address:{" "}
              </Text>
              10/22, GF East Patel Nagar, Near HDFC Bank, New Delhi - 110008
            </Text>

            <Text>
              <Text>
                <Text style={{ fontWeight: "bold", color: "black" }}>
                  State Name:{" "}
                </Text>
                Delhi, Code : 07
              </Text>{" "}
              |{" "}
              <Text>
                <Text style={{ fontWeight: "bold", color: "black" }}>
                  Phone:{" "}
                </Text>
                011-4100 1800
              </Text>{" "}
            </Text>
            <Text>
              <Text>
                <Text style={{ fontWeight: "bold", color: "black" }}>
                  Mobile:{" "}
                </Text>
                +91 9811555181, 9711009701
              </Text>{" "}
              |{" "}
              <Text>
                <Text style={{ fontWeight: "bold", color: "black" }}>
                  Email:{" "}
                </Text>
                hariomadtvcompany@gmail.com
              </Text>
            </Text>
          </View>
        </View>

        {/* Buyer and Invoice Info */}
        <View
          style={{
            flexDirection: "row",
            borderTop: "1 solid black",
            height: "180px",
            fontSize: 8,
          }}
        >
          <View
            style={{
              flex: 2,
              flexDirection: "column",
              borderRight: "1 solid black",
              padding: 2,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Buyer (Bill to)</Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                paddingHorizontal: 4,
                paddingBottom: 4,
              }}
            >
              {allDetails.billClientName
                ? allDetails.billClientName
                : allDetails.clientName}
            </Text>
            <Text
              style={{ fontSize: 10, paddingHorizontal: 4, paddingBottom: 4 }}
            >
              <Text style={{ fontWeight: "bold" }}>Address :</Text>
              {allDetails.address}
            </Text>
          </View>
          <View style={{ flex: 2, flexDirection: "column" }}>
            <View style={{ flexDirection: "row", flex: 2 }}>
              <View
                style={{
                  flex: 1,
                  gap: 2,
                  borderRight: "1 solid black",
                  borderBottom: "1 solid black",
                  padding: 2,
                }}
              >
                <Text>Invoice No.</Text>
                <Text style={{ fontWeight: "bold" }}>{allDetails.orderId}</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  gap: 2,
                  borderBottom: "1 solid black",
                  padding: 2,
                }}
              >
                <Text>Dated:</Text>
                <Text style={{ fontWeight: "bold" }}>
                  {billDetails.billDate
                    ? `${new Date(billDetails.billDate).getDate()}/${
                        new Date(billDetails.billDate).getMonth() + 1
                      }/${new Date(billDetails.billDate).getFullYear()}`
                    : ""}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", flex: 2 }}>
              <View
                style={{
                  flex: 1,
                  borderRight: "1 solid black",
                  borderBottom: "1 solid black",
                  padding: 2,
                }}
              >
                <Text>Client GST No.</Text>
                <Text style={{ fontWeight: "bold" }}>
                  {billDetails.clientGSTNumber
                    ? billDetails.clientGSTNumber
                    : "N/A"}
                </Text>
              </View>
              <View
                style={{ flex: 1, borderBottom: "1 solid black", padding: 2 }}
              >
                <Text>Mode/Terms of Payment</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", flex: 2 }}>
              <View
                style={{
                  flex: 1,
                  borderRight: "1 solid black",
                  borderBottom: "1 solid black",
                  padding: 2,
                }}
              >
                <Text>Reference No. & Date</Text>
              </View>
              <View
                style={{ flex: 1, borderBottom: "1 solid black", padding: 2 }}
              >
                <Text>Other References</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", flex: 2 }}>
              <View
                style={{
                  flex: 1,
                  borderRight: "1 solid black",
                  borderBottom: "1 solid black",
                  padding: 2,
                }}
              >
                <Text>Buyer's Order No.</Text>
              </View>
              <View
                style={{ flex: 1, borderBottom: "1 solid black", padding: 2 }}
              >
                <Text>Dated</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", flex: 2 }}>
              <View
                style={{
                  flex: 1,
                  borderRight: "1 solid black",
                  borderBottom: "1 solid black",
                  padding: 2,
                }}
              >
                <Text>Dispatch Doc No.</Text>
              </View>
              <View
                style={{ flex: 1, borderBottom: "1 solid black", padding: 2 }}
              >
                <Text>Delivery Note Date</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", flex: 2 }}>
              <View
                style={{
                  flex: 1,
                  borderRight: "1 solid black",
                  // borderBottom: "1 solid black",
                  padding: 2,
                }}
              >
                <Text>Dispatched through</Text>
              </View>
              <View style={{ flex: 1, padding: 2 }}>
                <Text>HUE</Text>
                <Text style={{ fontWeight: "bold" }}>{allDetails.hui}</Text>
              </View>
            </View>
            {/* <View style={{ flexDirection: "row", flex: 4, padding: 2 }}>
              <View style={{ flex: 1 }}>
                <Text>Terms of Delivery</Text>
              </View>
            </View> */}
          </View>
        </View>

        {/* Goods Table */}
        <View
          style={{
            flexDirection: "row",

            borderTop: "1 solid black",
          }}
        >
          <View
            style={{
              width: "5%",
              marginRight: 5,
              borderRight: "1 solid black",
              padding: 2,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Sl No</Text>
          </View>
          <View
            style={{
              width: "45%",
              borderRight: "1 solid black",
              padding: 2,
              textAlign: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              Description of Advertisement
            </Text>
          </View>
          <View
            style={{
              width: "10%",
              borderRight: "1 solid black",
              padding: 2,
              textAlign: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Quantity </Text>
          </View>
          <View
            style={{
              width: "10%",
              borderRight: "1 solid black",
              padding: 2,
              textAlign: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Rate</Text>
          </View>
          <View
            style={{
              width: "10%",
              borderRight: "1 solid black",
              padding: 2,
              textAlign: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Width</Text>
          </View>
          <View
            style={{
              width: "10%",
              borderRight: "1 solid black",
              padding: 2,
              textAlign: "center",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Height</Text>
          </View>
          <View style={{ width: "10%", padding: 2, textAlign: "center" }}>
            <Text style={{ fontWeight: "bold" }}>Amount</Text>
          </View>
        </View>

        {/* Sample Row */}
        <View
          style={{
            flexDirection: "row",
            borderTop: "1 solid black",
            // height: "170px",
          }}
        >
          <View
            style={{
              width: "5%",
              marginRight: 5,
              borderRight: "1 solid black",
              padding: 2,
              textAlign: "center",
            }}
          >
            <Text>1</Text>
          </View>
          <View
            style={{
              width: "45%",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRight: "1 solid black",
              padding: 2,
              paddingBottom: 4,
            }}
          >
            <View>
              {billDetails.descHeading && (
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "bold",
                    paddingHorizontal: 2,
                  }}
                >
                  {billDetails.descHeading}
                </Text>
              )}
              <Text style={{ fontSize: 10, paddingLeft: 4 }}>
                PUB : {allDetails.publicationName}
              </Text>
              <Text style={{ fontSize: 10, paddingLeft: 4 }}>
                DOI :{" "}
                {allDetails.dateOfInsertion
                  ? `${new Date(allDetails.dateOfInsertion).getDate()}/${
                      new Date(allDetails.dateOfInsertion).getMonth() + 1
                    }/${new Date(allDetails.dateOfInsertion).getFullYear()}`
                  : ""}
              </Text>
              {/* <Text style={{ fontSize: 10, paddingLeft: 4 }}>
                Remark : {allDetails.remark}
              </Text> */}
              <Text style={{ fontSize: 10, paddingLeft: 4 }}>
                Category : {allDetails.category}
              </Text>
              {allDetails.amountSummary && (
                <Text style={{ fontSize: 10, paddingHorizontal: 4 }}>
                  Acc. Summary :{allDetails.amountSummary}
                </Text>
              )}
            </View>
            {/* <View
              style={{
                flexDirection: "column",
                textAlign: "right",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              <Text>OUTPUT C GST@2.5%</Text>
              <Text>OUTPUT UT GST/ S GST@2.5% </Text>
            </View> */}
          </View>

          <View
            style={{
              width: "40%",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRight: "1 solid black",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: "25.4%",
                  borderRight: "1 solid black",
                  borderBottom: "1 solid black",
                  textAlign: "center",
                }}
              >
                <Text
                  style={{
                    padding: 2,
                  }}
                >
                  {/* {allDetails.roMultiplyBy} */}
                </Text>
              </View>
              <View
                style={{
                  width: "25.5%",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderBottom: "1 solid black",
                  borderRight: "1 solid black",
                  textAlign: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      padding: 2,
                    }}
                  >
                    {/* {allDetails.qRate}{" "} */}
                  </Text>
                </View>
                {/* <View
              style={{
                flexDirection: "column",
                textAlign: "right",
                fontSize: 10,
              }}
            >
              <Text>2.5%</Text>
              <Text>2.5%</Text>
            </View> */}
              </View>
              <View
                style={{
                  width: "25.5%",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderBottom: "1 solid black",
                  borderRight: "1 solid black",
                  textAlign: "center",
                }}
              >
                <Text
                  style={{
                    padding: 2,
                  }}
                >
                  {allDetails.roWidth}{" "}
                </Text>

                {/* <View>
              <Text> </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                textAlign: "right",
                fontSize: 10,
              }}
            >
              <Text>2.5</Text>
              <Text>2.5</Text>
            </View> */}
              </View>
              <View
                style={{
                  width: "25%",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textAlign: "center",
                }}
              >
                <Text style={{ borderBottom: "1 solid black", padding: 2 }}>
                  {allDetails.roHeight}{" "}
                </Text>

                {/* <View>
              <Text> </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                textAlign: "right",
                fontSize: 10,
              }}
            >
              <Text>%</Text>
              <Text>%</Text>
            </View> */}
              </View>
            </View>
            <View
              style={{
                flex: 1,
                borderBottom: "1 solid black",
                justifyContent: "flex-end",
                paddingRight: 4,
              }}
            >
              <Text
                style={{
                  textAlign: "right",
                }}
              >
                Discount
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                borderBottom: "1 solid black",
                justifyContent: "flex-end",
                paddingRight: 4,
              }}
            >
              <Text
                style={{
                  textAlign: "right",
                }}
              >
                After Discount
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                borderBottom: "1 solid black",
                justifyContent: "flex-end",
                paddingRight: 4,
              }}
            >
              <Text
                style={{
                  textAlign: "right",
                }}
              >
                {allDetails.typeOfGST == "CGST+SGST" &&
                  `CGST ${allDetails.percentageOfGST}% + SGST ${allDetails.percentageOfGST}%`}
                {allDetails.typeOfGST == "IGST" &&
                  `IGST ${allDetails.percentageOfGST}%`}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                paddingRight: 4,
              }}
            >
              <Text
                style={{
                  textAlign: "right",
                }}
              >
                Net Amount
              </Text>
            </View>
          </View>

          <View
            style={{
              width: "10%",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  textAlign: "right",
                  borderBottom: "1 solid black",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: "1.5px",
                }}
              >
                {Number(allDetails.billAmount).toFixed(2)}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "74px",
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",
                    borderBottom: "1 solid black",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: "1.5px",
                  }}
                >
                  {Number(allDetails.discount).toFixed(2)}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",
                    borderBottom: "1 solid black",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: "1.5px",
                  }}
                >
                  <Text>
                    {(
                      Number(allDetails.billAmount) -
                      Number(allDetails.discount)
                    ).toFixed(2)}
                  </Text>
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",
                    borderBottom: "1 solid black",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: "1.5px",
                  }}
                >
                  {allDetails.typeOfGST == "CGST+SGST" &&
                    `${(
                      ((Number(allDetails.billAmount) - allDetails.discount) *
                        (allDetails.percentageOfGST * 2)) /
                      100
                    ).toFixed(2)}`}
                  {allDetails.typeOfGST == "IGST" &&
                    `${(
                      ((Number(allDetails.billAmount) - allDetails.discount) *
                        allDetails.percentageOfGST) /
                      100
                    ).toFixed(2)}`}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",

                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: 2,
                    textAlign: "right",
                    fontWeight: "bold",
                    fontSize: 10,
                  }}
                >
                  {/* {Math.ceil(
                    Number(allDetails.billAmount) -
                        allDetails.discount +
                      (Number(allDetails.billAmount) -
                        allDetails.discount * allDetails.percentageOfGST) /
                        100
                  )} */}
                  {`${Math.ceil(Number(allDetails.billTotalAmount))}`}
                </Text>
              </View>
            </View>
            {/* <View
              style={{
                flexDirection: "column",
                fontSize: 10,
              }}
            >
              <Text>{Math.ceil(Number(allDetails.billAmount) -
                        allDetails.discount * 0.025)}</Text>
              <Text>{Math.ceil(Number(allDetails.billAmount) -
                        allDetails.discount * 0.025)}</Text>
            </View> */}
          </View>
        </View>

        {/* Result Row */}
        {/* <View
          style={{
            flexDirection: "row",
            borderTop: "1 solid black",
          }}
        >
          <View
            style={{
              width: "5%",
              marginRight: 5,
              borderRight: "1 solid black",
              padding: 2,
            }}
          >
            <Text>1</Text>
          </View>
          <View
            style={{
              width: "45%",
              borderRight: "1 solid black",
              padding: 2,
              textAlign: "right",
            }}
          >
            <Text>Total</Text>
          </View>
          <View
            style={{ width: "40%", borderRight: "1 solid black", padding: 2 }}
          >
            <Text></Text>
          </View>

          <View
            style={{
              width: "10%",
              padding: 2,
              textAlign: "right",
              fontWeight: "bold",
              fontSize: 10,
            }}
          >
            <Text>
              {Math.ceil(
                Number(allDetails.billAmount) -
                        allDetails.discount + Number(allDetails.billAmount) -
                        allDetails.discount * 0.05
              )}
            </Text>
          </View>
        </View> */}

        <View
          style={{
            display: "flex",
            borderTop: "1px solid black",
            flexDirection: "column",
            fontSize: 9,
          }}
        >
          {/* Row 1: Main Header */}
          <View
            style={{
              flexDirection: "row",
              borderBottom: "1px solid black",
              alignItems: "center",
              minHeight: 30,
            }}
          >
            <View
              style={{
                height: "100%",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              <Text
                style={{
                  padding: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                Amount Chargeable (in words) :{" "}
              </Text>
              <Text style={{ fontWeight: "bold", paddingHorizontal: 4 }}>
                Indian Rupees{" "}
                {convertAmountToWords(Number(allDetails.billTotalAmount))} Only
              </Text>
            </View>

            <Text
              style={{
                padding: 4,
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                borderRight: "none",
                textAlign: "right",
              }}
            >
              E. & O.E
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: "60px",
              fontSize: 10,
            }}
          >
            <View
              style={{
                flex: 2,
                flexDirection: "column",
                borderRight: "1px solid black",
                alignItems: "center",
                height: "100%",
              }}
            >
              <View
                style={{
                  flex: 4,
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text>HSN / SAC </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Text>998363</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  borderBottom: "1px solid black",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  width: "100%",
                  paddingRight: 4,
                }}
              >
                <Text>Total</Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                borderRight: "1px solid black",
                alignItems: "center",
                height: "100%",
              }}
            >
              <View
                style={{
                  flex: 2,
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text>Taxable Value</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text>
                  {(
                    Number(allDetails.billAmount) - allDetails.discount
                  ).toFixed(2)}
                </Text>
              </View>{" "}
              <View
                style={{
                  flex: 1,
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  width: "100%",
                  fontWeight: "bold",
                }}
              >
                <Text>
                  {(
                    Number(allDetails.billAmount) - allDetails.discount
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                borderRight: "1px solid black",
                alignItems: "center",
                height: "100%",
              }}
            >
              <View
                style={{
                  flex: 1,
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {allDetails.typeOfGST == "CGST+SGST" && (
                  <Text>Central tax</Text>
                )}
                {allDetails.typeOfGST == "IGST" && <Text>IGST</Text>}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    borderRight: "1px solid black",
                    alignItems: "center",
                    width: "40%",
                    height: "100%",
                  }}
                >
                  <Text>Rate</Text>
                </View>{" "}
                <View
                  style={{
                    alignItems: "center",
                    width: "60%",
                    height: "100%",
                  }}
                >
                  <Text>Amount</Text>
                </View>
              </View>{" "}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    borderRight: "1px solid black",
                    alignItems: "center",
                    width: "40%",
                    height: "100%",
                  }}
                >
                  <Text>{allDetails.percentageOfGST}%</Text>
                </View>{" "}
                <View
                  style={{
                    alignItems: "center",
                    width: "60%",
                    height: "100%",
                  }}
                >
                  <Text>
                    {(
                      ((Number(allDetails.billAmount) - allDetails.discount) *
                        allDetails.percentageOfGST) /
                      100
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    borderRight: "1px solid black",
                    alignItems: "center",
                    width: "40%",
                    height: "100%",
                  }}
                >
                  <Text></Text>
                </View>{" "}
                <View
                  style={{
                    alignItems: "center",
                    width: "60%",
                    height: "100%",
                    fontWeight: "bold",
                  }}
                >
                  <Text>
                    {(
                      ((Number(allDetails.billAmount) - allDetails.discount) *
                        allDetails.percentageOfGST) /
                      100
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                borderRight: "1px solid black",
                alignItems: "center",
                height: "100%",
              }}
            >
              <View
                style={{
                  flex: 1,
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {allDetails.typeOfGST == "CGST+SGST" && <Text>State tax</Text>}
                {allDetails.typeOfGST == "IGST" && ""}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    borderRight: "1px solid black",
                    alignItems: "center",
                    width: "40%",
                    height: "100%",
                  }}
                >
                  <Text>Rate</Text>
                </View>{" "}
                <View
                  style={{
                    alignItems: "center",
                    width: "60%",
                    height: "100%",
                  }}
                >
                  <Text>Amount</Text>
                </View>
              </View>{" "}
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    borderRight: "1px solid black",
                    alignItems: "center",
                    width: "40%",
                    height: "100%",
                  }}
                >
                  {allDetails.typeOfGST == "CGST+SGST" && (
                    <Text>{allDetails.percentageOfGST}%</Text>
                  )}
                  {allDetails.typeOfGST == "IGST" && <Text></Text>}
                </View>{" "}
                <View
                  style={{
                    alignItems: "center",
                    width: "60%",
                    height: "100%",
                  }}
                >
                  {allDetails.typeOfGST == "CGST+SGST" && (
                    <Text>
                      {(
                        ((Number(allDetails.billAmount) - allDetails.discount) *
                          allDetails.percentageOfGST) /
                        100
                      ).toFixed(2)}
                    </Text>
                  )}
                  {allDetails.typeOfGST == "IGST" && <Text></Text>}
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    borderRight: "1px solid black",
                    alignItems: "center",
                    width: "40%",
                    height: "100%",
                  }}
                >
                  <Text></Text>
                </View>{" "}
                <View
                  style={{
                    alignItems: "center",
                    width: "60%",
                    height: "100%",
                    fontWeight: "bold",
                  }}
                >
                  {allDetails.typeOfGST == "CGST+SGST" && (
                    <Text>
                      {(
                        ((Number(allDetails.billAmount) - allDetails.discount) *
                          allDetails.percentageOfGST) /
                        100
                      ).toFixed(2)}
                    </Text>
                  )}
                  {allDetails.typeOfGST == "IGST" && <Text></Text>}
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
              }}
            >
              <View
                style={{
                  flex: 2,
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text>Total Tax Amount</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {allDetails.typeOfGST == "CGST+SGST" && (
                  <Text>
                    {(
                      ((Number(allDetails.billAmount) - allDetails.discount) *
                        (allDetails.percentageOfGST * 2)) /
                      100
                    ).toFixed(2)}
                  </Text>
                )}
                {allDetails.typeOfGST == "IGST" && (
                  <Text>
                    {(
                      ((Number(allDetails.billAmount) - allDetails.discount) *
                        allDetails.percentageOfGST) /
                      100
                    ).toFixed(2)}
                  </Text>
                )}
              </View>{" "}
              <View
                style={{
                  flex: 1,
                  borderBottom: "1px solid black",
                  alignItems: "center",
                  width: "100%",
                  fontWeight: "bold",
                }}
              >
                {allDetails.typeOfGST == "CGST+SGST" && (
                  <Text>
                    {(
                      ((Number(allDetails.billAmount) - allDetails.discount) *
                        (allDetails.percentageOfGST * 2)) /
                      100
                    ).toFixed(2)}
                  </Text>
                )}
                {allDetails.typeOfGST == "IGST" && (
                  <Text>
                    {(
                      ((Number(allDetails.billAmount) - allDetails.discount) *
                        allDetails.percentageOfGST) /
                      100
                    ).toFixed(2)}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Row 2: Subheaders */}
          {/* <View
            style={{
              flexDirection: "row",
              borderBottom: "1px solid black",
              alignItems: "center",
              minHeight: 24,
            }}
          >
            <Text
              style={{
                width: "20%",
                borderRight: "1px solid black",
                padding: 4,
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "#f0f0f0",
              }}
            >
              HSN/SAC
            </Text>
            <Text
              style={{
                width: "20%",
                borderRight: "1px solid black",
                padding: 4,
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "#f0f0f0",
              }}
            >
              Taxable Value
            </Text>
            <Text
              style={{
                width: "20%",
                borderRight: "1px solid black",
                padding: 4,
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "#f0f0f0",
              }}
            >
              Central Tax
            </Text>
            <Text
              style={{
                width: "20%",
                borderRight: "1px solid black",
                padding: 4,
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "#f0f0f0",
              }}
            >
              State Tax
            </Text>
            <Text
              style={{
                width: "20%",
                padding: 4,
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "#f0f0f0",
              }}
            >
              Total Tax Amount
            </Text>
          </View> */}

          {/* Row 3: Data */}
          {/* <View
            style={{
              flexDirection: "row",
              borderBottom: "1px solid black",
              alignItems: "center",
              minHeight: 24,
            }}
          >
            <Text
              style={{
                width: "20%",
                borderRight: "1px solid black",
                padding: 4,
              }}
            >
              998363
            </Text>
            <Text
              style={{
                width: "20%",
                borderRight: "1px solid black",
                padding: 4,
              }}
            ></Text>
            <Text
              style={{
                width: "20%",
                borderRight: "1px solid black",
                padding: 4,
              }}
            ></Text>
            <Text
              style={{
                width: "20%",
                borderRight: "1px solid black",
                padding: 4,
              }}
            ></Text>
            <Text
              style={{
                width: "20%",
                padding: 4,
              }}
            ></Text>
          </View> */}

          {/* Row 4: Totals */}
          {/* <View
            style={{
              flexDirection: "row",
              borderBottom: "1px solid black",
              alignItems: "center",
              minHeight: 24,
            }}
          >
            <Text
              style={{
                width: "20%",
                borderRight: "1px solid black",
                padding: 4,
              }}
            >
              Total
            </Text>
            <Text
              style={{
                width: "20%",
                borderRight: "1px solid black",
                padding: 4,
              }}
            ></Text>
            <Text
              style={{
                width: "20%",
                borderRight: "1px solid black",
                padding: 4,
              }}
            ></Text>
            <Text
              style={{
                width: "20%",
                borderRight: "1px solid black",
                padding: 4,
              }}
            ></Text>
            <Text
              style={{
                width: "20%",
                padding: 4,
              }}
            ></Text>
          </View> */}
        </View>

        <View style={{ fontSize: 9, width: "100%" }}>
          {/* Row 1: TAX Amount in Words */}
          <View
            style={{
              borderBottom: "1px solid black",
              padding: 4,
              minHeight: 20,
              justifyContent: "center",
            }}
          >
            <Text>
              TAX Amount (in words) -{" "}
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                {allDetails.typeOfGST == "CGST+SGST"
                  ? convertAmountToWords(
                      (
                        ((Number(allDetails.billAmount) - allDetails.discount) *
                          (allDetails.percentageOfGST * 2)) /
                        100
                      ).toFixed(2)
                    )
                  : allDetails.typeOfGST == "IGST"
                  ? convertAmountToWords(
                      (
                        ((Number(allDetails.billAmount) - allDetails.discount) *
                          allDetails.percentageOfGST) /
                        100
                      ).toFixed(2)
                    )
                  : ""}
              </Text>
            </Text>
          </View>

          {/* Row 2: Declaration */}
          <View
            style={{
              borderBottom: "1px solid black",
              padding: 4,
            }}
          >
            <Text>
              <Text style={{ fontWeight: "bold" }}>Declaration</Text>
            </Text>
            <Text>
              1). All remittance should be payable to the{" "}
              <Text style={{ fontWeight: "bold" }}>
                "Hariom Advertising Company"
              </Text>
              . 2). Invoice payment within 30 days. 3). Bill if not paid within
              due date will attract intt. @ 24%, 4). All disputes subject to
              Delhi Jurisdiction only. 5). Any disputes to this bill will be
              only be entertaining within two days of Recpt. of this bill, 6).{" "}
              <Text style={{ fontWeight: "bold" }}>
                HDFC BANK A/c:-03132000005293 IFSC: HDFC0001365 Branch:
              </Text>{" "}
              East Patel Nagar, New Delhi-110008, 7).{" "}
              <Text style={{ fontWeight: "bold" }}>
                @1% TDS Applicable Under Section 194 (c) on taxable value of
                Invoice.
              </Text>
            </Text>
          </View>

          {/* Row 3: Signature Section */}
          <View
            style={{
              flexDirection: "row",
              borderBottom: "1px solid black",
              minHeight: 80,
            }}
          >
            <View
              style={{
                width: "50%",
                borderRight: "1px solid black",
                padding: 4,
                justifyContent: "flex-end",
              }}
            >
              <Text>Customer's Seal and Signature</Text>
            </View>
            <View
              style={{
                width: "50%",
                padding: 4,
                flexDirection: "col",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <Text style={{ textAlign: "right", fontWeight: "bold" }}>
                for Hariom Advertising Company
              </Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  paddingTop: 10,
                  width: "100%",
                }}
              >
                <Image
                  src="/sign2.jpeg"
                  style={{
                    height: 44,
                    zIndex: 1,
                  }}
                />
              </View>
              <Text style={{ textAlign: "right", marginTop: 10 }}>
                Authorised Signatory
              </Text>
            </View>
          </View>

          {/* Row 4: Footer Note */}
          <View
            style={{
              paddingHorizontal: 4,
              paddingVertical: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>This is a Computer Generated Invoice</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
