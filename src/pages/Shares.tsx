// pages
import DocumentsShare from "./tool/documents/DocumentsShare";
import SalesShare from "./products/sale/SalesShare";
import SalesDocumentShare from "./products/sale/SalesDocumentShare";
import OrdersShare from "./services/orders/OrdersShare";
import OrdersDocumentShare from "./services/orders/OrdersDocumentShare";

// others
import ErrorPage from "./ErrorPage";

export default {
  path: "share",
  errorElement: <ErrorPage />,
  children: [
    // documents
    {
      path: "document/:id",
      Component: DocumentsShare,
    },
    // sales
    {
      path: "sale/:id",
      Component: SalesShare,
    },
    {
      path: "sale/:id/document/:type",
      Component: SalesDocumentShare,
    },
    // orders
    {
      path: "order/:id",
      Component: OrdersShare,
    },
    {
      path: "order/:id/document/:type",
      Component: OrdersDocumentShare,
    },
  ],
};
