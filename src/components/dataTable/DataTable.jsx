import { useCallback, useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
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

const DataTable = ({ collectionName, columnName, location }) => {
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  // Fetch Data from DB
  const fetchDataWithoutLocation = useCallback(async () => {
    const q = query(
      collection(db, collectionName),
      orderBy("timeStamp", "desc")
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
  }, [collectionName]);

  const fetchDataWithLocation = useCallback(async () => {
    try {
      const q = query(
        collection(db, collectionName),
        where("location", "==", location)
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
  }, [collectionName, location]);

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
        confirmButtonColor: "#0d1b2a",
        confirmButtonText: "Yes",
        cancelButtonColor: "#ff007f",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Do you get any permission to delete this data?",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#0d1b2a",
            confirmButtonText: "Yes",
            cancelButtonColor: "#ff007f",
          }).then(async (result) => {
            if (result.isConfirmed) {
              // Delete data from cutter section
              await deleteDoc(doc(db, "cutter_section", data.id)).then(
                async () => {
                  await deleteDoc(
                    doc(db, "wet_section", data.wet_batch_id)
                  ).then(async () => {});

                  // Get data from wet section by cutter batch id
                  const q = query(
                    collection(db, "mixing_section"),
                    where("cutter_batch_id", "==", data.id)
                  );
                  const querySnapshot = await getDocs(q);
                  querySnapshot.forEach((item) => {
                    // Delete data from wet section
                    deleteDoc(doc(db, "mixing_section", item.id)).then(() => {
                      Swal.fire(
                        "Deleted!",
                        "Your file has been deleted.",
                        "success"
                      );
                    });
                  });
                }
              );
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

            {params.row.sectionName === "cutter" && (
              <div>
                <DeleteIcon
                  className="tableAction"
                  onClick={() => handleDelete(params.row)}
                />
              </div>
            )}
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
            sortModel: [{ field: "timeStamp", sort: "desc" }],
          },
        }}
        pageSizeOptions={[25, 50, 100]}
      />
    </div>
  );
};

export default DataTable;
