import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useEffect } from "react";
import { format } from "date-fns";

interface PurchaseOrderDocumentProps {
  purchases: PurchaseProps;
}

type PurchaseProps = {
  purchaseId: string;
  timeStamp: string;
  Suppliers: {
    supplierId: string;
    supplierName: string;
    supplierAddress: string;
    supplierContact: string;
  };
  PurchaseStatus: {
    purchaseStatusId: string;
    status: string;
  };
  PurchaseDetails: PurchaseDetailProps[];
  subTotal: number;
  amountPaid: number;
  shippingFee: number;
  totalAmount: number;
};

type PurchaseDetailProps = {
  purchaseDetailsId: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  Products: {
    productId: string;
    name: string;
    price: number;
    stockQuantity: number;
  };
};

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  header: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "blue",
  },
  subHeader: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: { marginBottom: 10, marginTop: 10 },
  subSection: { textAlign: "right" },
  label: { fontWeight: "bold", fontSize: 12 },
  table: { marginTop: 10, borderWidth: 1, borderColor: "#ccc" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  columnHeader: {
    flex: 1,
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#f3f3f3",
    paddingVertical: 8,
  },
  column: { flex: 1, fontSize: 10, textAlign: "center" },
  totalSection: {
    marginTop: 15,
    padding: 10,
    textAlign: "right",
    alignSelf: "flex-end",
    width: 180,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "bold",
    width: 100, // Adjusted width
  },
  summaryValue: {
    fontSize: 12,
    textAlign: "right",
    width: 80, // Adjusted width
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: "100%",
    alignSelf: "flex-end",
    marginVertical: 10,
  },
  footer: { marginTop: 20, textAlign: "center", fontSize: 10 },
});

const PurchaseOrderDocument = ({ purchases }: PurchaseOrderDocumentProps) => {
  useEffect(() => {
    console.log("PurchaseOrderDocument", purchases);
  }, [purchases]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>Mr.Kuru</Text>
        <Text style={styles.subHeader}>Purchase Order</Text>

        {/* Supplier Details */}
        <View style={styles.section}>
          <Text style={styles.label}>Supplier:</Text>
          <Text style={styles.label}>{purchases?.Suppliers?.supplierName}</Text>
          <Text style={styles.label}>
            {purchases?.Suppliers?.supplierAddress}
          </Text>
          <Text style={styles.label}>
            {purchases?.Suppliers?.supplierContact}
          </Text>
        </View>

        {/* Purchase Details */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Purchase Status: {purchases?.PurchaseStatus?.status}
          </Text>

          <Text style={styles.label}>
            Payment Status:{" "}
            {purchases?.amountPaid > 0 ? "Credit Line" : "Paid Fully"}
          </Text>

          <View style={styles.subSection}>
            <Text style={styles.label}>
              Purchase Date:{" "}
              {purchases && format(purchases?.timeStamp, "dd/MM/yyyy hh:mm")}
            </Text>
          </View>
        </View>

        {/* Table Headers */}
        <View style={styles.table}>
          <View style={[styles.row, { backgroundColor: "#f3f3f3" }]}>
            <Text style={(styles.columnHeader, { width: "150px" })}>
              Product Name
            </Text>
            <Text
              style={
                (styles.columnHeader, { width: "90px", textAlign: "center" })
              }
            >
              Product Price
            </Text>
            <Text
              style={
                (styles.columnHeader, { width: "90px", textAlign: "center" })
              }
            >
              Unit Price
            </Text>
            <Text
              style={
                (styles.columnHeader, { width: "20px", textAlign: "center" })
              }
            >
              Qty
            </Text>
            <Text
              style={
                (styles.columnHeader, { width: "90px", textAlign: "center" })
              }
            >
              Total
            </Text>
            <Text
              style={
                (styles.columnHeader, { width: "90px", textAlign: "center" })
              }
            >
              Net Profit
            </Text>
          </View>

          {/* Table Rows (Dynamic) */}
          {purchases?.PurchaseDetails?.map((item: PurchaseDetailProps) => (
            <View key={item?.purchaseDetailsId} style={styles.row}>
              <Text style={(styles.column, { width: "150px" })}>
                {item.Products?.name}
              </Text>
              <Text
                style={(styles.column, { width: "90px", textAlign: "center" })}
              >
                {item?.Products.price}
              </Text>
              <Text
                style={(styles.column, { width: "90px", textAlign: "center" })}
              >
                {item?.unitPrice.toFixed(2)}
              </Text>
              <Text
                style={(styles.column, { width: "20px", textAlign: "center" })}
              >
                {item?.quantity}
              </Text>
              <Text
                style={(styles.column, { width: "90px", textAlign: "center" })}
              >
                {item?.totalPrice.toFixed(2)}
              </Text>
              <Text
                style={(styles.column, { width: "90px", textAlign: "center" })}
              >
                {(
                  item?.Products?.price * item.quantity -
                  item?.totalPrice
                ).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary Section */}
        <View style={styles.totalSection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal :</Text>
            <Text style={styles.summaryValue}>{purchases?.subTotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Fee :</Text>
            <Text style={styles.summaryValue}>{purchases?.shippingFee}</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount :</Text>
            <Text style={styles.summaryValue}>{purchases?.totalAmount}</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount Paid :</Text>
            <Text style={styles.summaryValue}>{purchases?.amountPaid}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Balance :</Text>
            <Text style={styles.summaryValue}>
              {purchases?.subTotal - purchases?.amountPaid}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PurchaseOrderDocument;
