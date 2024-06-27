import { useCallback, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";

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

  // Delete Data
  // const handleDelete = async (id) => {
  //   try {
  //     await deleteDoc(doc(db, collectionName, id));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleView = (data) => {
    navigate(`${data.id}`);
  };

  const handleUpdate = (data) => {
    navigate("update", { state: data });
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
        classes={{}}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
          sorting: {
            sortModel: [{ field: "batchNumber", sort: "desc" }],
          },
        }}
        pageSizeOptions={[25, 50, 100]}
      />
    </div>
  );
};

export default DataTable;
