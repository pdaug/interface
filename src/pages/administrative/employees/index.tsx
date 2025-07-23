// pages
import EmployeesList from "./EmployeesList.tsx";
import EmployeesInspect from "./EmployeesInspect.tsx";

export default [
  {
    index: true,
    Component: EmployeesList,
  },
  {
    path: "inspect",
    Component: EmployeesInspect,
  },
  {
    path: "inspect/:id",
    Component: EmployeesInspect,
  },
];
