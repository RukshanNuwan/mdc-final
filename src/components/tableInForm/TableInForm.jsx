import { Link } from 'react-router-dom';

const TableInForm = ({ id }) => {
  const handleAddNew = () => {
    const tableBody = document.getElementById(id);

    const newRow = document.createElement('tr');
    const newBagNumber = document.createElement('td');
    const newBagWeight = document.createElement('td');
    const newInletTemp = document.createElement('td');
    const newOutletTemp = document.createElement('td');
    const newAtomizer = document.createElement('td');
    const newSpecialNote = document.createElement('td');

    const newBagNumberInput = document.createElement('input');
    newBagNumberInput.type = 'number';

    const newBagWeightInput = document.createElement('input');
    newBagWeightInput.type = 'number';

    const newInletInput = document.createElement('input');
    newInletInput.type = 'number';

    const newOutletInput = document.createElement('input');
    newOutletInput.type = 'number';

    const newAtomizerInput = document.createElement('input');
    newAtomizerInput.type = 'number';

    const newSpecialNoteInput = document.createElement('input');
    newSpecialNoteInput.type = 'text';

    newBagNumber.appendChild(newBagNumberInput);
    newBagWeight.appendChild(newBagWeightInput);
    newInletTemp.appendChild(newInletInput);
    newOutletTemp.appendChild(newOutletInput);
    newAtomizer.appendChild(newAtomizerInput);
    newSpecialNote.appendChild(newSpecialNoteInput);

    newRow.appendChild(newBagNumber);
    newRow.appendChild(newBagWeight);
    newRow.appendChild(newInletTemp);
    newRow.appendChild(newOutletTemp);
    newRow.appendChild(newAtomizer);
    newRow.appendChild(newSpecialNote);

    tableBody.appendChild(newRow);
  };

  return (
    <>
      <table id={id}>
        <thead>
          <tr>
            <th>Bag number</th>
            <th>Bag weight</th>
            <th>Inlet</th>
            <th>Outlet</th>
            <th>Atomizer</th>
            <th>Special notes</th>
          </tr>
        </thead>
        <tbody id="singleBagDataTableBody">
          <tr>
            <td>
              <input type="number" />
            </td>
            <td>
              <input type="number" />
            </td>
            <td>
              <input type="number" />
            </td>
            <td>
              <input type="number" />
            </td>
            <td>
              <input type="number" />
            </td>
            <td>
              <input type="text" />
            </td>
          </tr>
        </tbody>
      </table>

      <Link onClick={handleAddNew}>Add</Link>
    </>
  );
};

export default TableInForm;
