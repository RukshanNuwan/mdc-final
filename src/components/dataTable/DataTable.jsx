import { useCallback, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

import "./dataTable.css";
import { db } from "../../config/firebase.config";

const DataTable = ({ columnName, location }) => {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  const fetchDataWithoutLocation = useCallback(async () => {
    const q = query(
      collection(db, "production_data"),
      orderBy("wet_added_at", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      setData(list);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchDataWithLocation = useCallback(async () => {
    try {
      const q = query(
        collection(db, "production_data"),
        where("location", "==", location),
        orderBy("wet_added_at", "desc")
      );
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          let list = [];
          snapshot.docs.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setData(list);
        },
        (error) => {
          console.log(error);
        }
      );

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error);
    }
  }, [location]);

  useEffect(() => {
    if (location) fetchDataWithLocation();
    else fetchDataWithoutLocation();
  }, [fetchDataWithLocation, fetchDataWithoutLocation, location]);

  const handleView = (data) => {
    navigate("view", { state: data });
  };

  const handleUpdate = (data) => {
    navigate("update", { state: data });
  };

  const handleDelete = async (data) => {
    try {
      Swal.fire({
        title: "Do you want to delete?",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#ff007f",
        confirmButtonText: "Yes",
        cancelButtonColor: "#0d1b2a",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Do you get any permission to delete this data?",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#ff007f",
            confirmButtonText: "Yes",
            cancelButtonColor: "#0d1b2a",
          }).then(async (result) => {
            if (result.isConfirmed) {
              await deleteDoc(doc(db, "production_data", data.id));
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="d-flex gap-4">
            <div>
              <InfoIcon
                className="tableAction"
                onClick={() => handleView(params.row)}
              />
            </div>

            <div>
              <EditIcon
                className="tableAction"
                onClick={() => handleUpdate(params.row)}
              />
            </div>

            <div>
              <DeleteIcon
                className="tableAction"
                onClick={() => handleDelete(params.row)}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columnName.concat(actionColumn)}
        // slots={{ toolbar: GridToolbar }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
          sorting: {
            sortModel: [{ field: "wet_added_at", sort: "desc" }],
          },
        }}
        pageSizeOptions={[25, 50, 100]}
      />
    </div>
  );
};

export default DataTable;
