import { useEffect, useState } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import EditIcon from "@mui/icons-material/Edit";
import BuildIcon from "@mui/icons-material/Build";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import axios from "axios";

const columns = [
  {
    field: "actions",
    headerName: "Actions",
    width: 300,
    renderCell: (param) => {
      return (
        <>
          <Tooltip title="Add">
            <Button>
              <AddIcon></AddIcon>
            </Button>
          </Tooltip>
          <Tooltip title="Page Edit">
            <Button>
              <EditIcon></EditIcon>
            </Button>
          </Tooltip>
          <Tooltip title="Parcel Edit">
            <Button>
              <BuildIcon></BuildIcon>
            </Button>
          </Tooltip>
          {param.rowNode.type === "leaf" ? (
            <Tooltip title="Delete">
              <Button>
                <DeleteIcon></DeleteIcon>
              </Button>
            </Tooltip>
          ) : (
            <></>
          )}
        </>
      );
    },
  },
];

/**
 * Formats an array for the hierarchy values for grid rows
 * @param {*} menu
 * @returns An array of menu names that represents a parent-child relationship between the menus
 */
const getHierarchy = (menu) => {
  const hierarchy = [menu.name];
  if (menu.children.length) {
    menu.children.forEach((child) => hierarchy.push(child.name));
  }
  return hierarchy;
};

const getTreeDataPath = (row) => row.hierarchy;

export default function ParcelTree() {
  const [gridRows, setGridRows] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/menu/types").then((response) => {
      const menuKeys = Object.keys(response.data);
      const topLevelMenus = [];
      menuKeys.forEach((menu) => {
        topLevelMenus.push(response.data[menu]);
      });
      const orderedMenus = topLevelMenus
        .flat()
        .sort((a, b) => a.name.localeCompare(b.name));

      const formattedRows = orderedMenus.map((menu) => {
        return {
          id: orderedMenus.indexOf(menu) + 1,
          hierarchy: getHierarchy(menu),
        };
      });
      setGridRows(formattedRows);
    });
  }, []);

  return (
    <div style={{ height: "80vh", width: "80%", padding: 50 }}>
      <DataGridPro
        treeData
        rows={gridRows}
        columns={columns}
        getTreeDataPath={getTreeDataPath}
        groupingColDef={{ headerName: "Page", flex: true }}
      />
    </div>
  );
}
