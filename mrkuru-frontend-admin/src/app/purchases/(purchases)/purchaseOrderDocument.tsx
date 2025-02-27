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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subHeader: {
    textAlign: "center",
    fontSize: 14,
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
    borderTopWidth: 1,
    borderTopColor: "#000",
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
        <Text style={styles.header}>Mr.Kuru Electronics</Text>
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
              Purchase Date: {format(purchases?.timeStamp, "dd/MM/yyyy hh:mm")}
            </Text>
          </View>
        </View>

        {/* Table Headers */}
        <View style={styles.table}>
          <View style={[styles.row, { backgroundColor: "#f3f3f3" }]}>
            <Text style={(styles.columnHeader, { width: "120px" })}>
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
            <Text style={styles.columnHeader}>Total</Text>
            <Text style={styles.columnHeader}>Net Profit</Text>
          </View>

          {/* Table Rows (Dynamic) */}
          {purchases?.PurchaseDetails?.map((item: PurchaseDetailProps) => (
            <View key={item?.purchaseDetailsId} style={styles.row}>
              <Text style={(styles.column, { width: "120px" })}>
                {item.Products?.name}
              </Text>
              <Text
                style={(styles.column, { width: "90px", textAlign: "center" })}
              >
                {item.Products.price}
              </Text>
              <Text
                style={(styles.column, { width: "90px", textAlign: "center" })}
              >
                {item.unitPrice.toFixed(2)}
              </Text>
              <Text
                style={(styles.column, { width: "20px", textAlign: "center" })}
              >
                {item.quantity}
              </Text>
              <Text style={styles.column}>{item.totalPrice.toFixed(2)}</Text>
              <Text style={styles.column}>
                {(item?.Products?.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary Section */}
        <View style={styles.totalSection}>
          <Text style={styles.label}>Subtotal: {purchases?.subTotal}</Text>
          <Text style={styles.label}>Amount Paid: {purchases?.amountPaid}</Text>
          <Text style={styles.label}>
            Balance: {purchases?.subTotal - purchases?.amountPaid}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PurchaseOrderDocument;
