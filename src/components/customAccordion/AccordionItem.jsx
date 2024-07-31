const AccordionItem = ({ item }) => {
  return (
    <div className="bg-dark-blue-2 rounded-1 p-2 text-white-50">
      <div className="row">
        <div className="col">
          <p className="smallText">Date</p>
          <p className="smallText fw-bold text-white">
            {item.packing_production_date}
          </p>
        </div>

        <div className="col">
          <p className="smallText">Type</p>
          <p className="smallText fw-bold text-white">
            {item.packing_type === "packing_type_20" ? "20kg" : "Other"}
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <p className="smallText">Job sheet #</p>
          <p className="smallText fw-bold text-white">
            {item.packing_job_sheet_number}
          </p>
        </div>
      </div>

      {item.packing_type === "packing_type_20" && (
        <>
          <div className="row">
            <div className="col">
              <p className="smallText">Craft bag code</p>
              <p className="smallText fw-bold text-white">
                {item.packing_craft_bag_number}
              </p>
            </div>

            <div className="col">
              <p className="smallText">Bag number(s)</p>
              <p className="smallText fw-bold text-white">
                {item.packing_bag_numbers.join(", ")}
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <p className="smallText">Bag # range start</p>
              <p className="smallText fw-bold text-white">
                {item.packing_bag_number_range_start}
              </p>
            </div>

            <div className="col">
              <p className="smallText">Bag # range end</p>
              <p className="smallText fw-bold text-white">
                {item.packing_bag_number_range_end}
              </p>
            </div>
          </div>
        </>
      )}

      {item.packing_type === "packing_type_other" && (
        <>
          <div className="row">
            <div className="col">
              <p className="smallText">Carton box #</p>
              <p className="smallText fw-bold text-white">
                {item.packing_carton_box_number}
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <p className="smallText">Time range start</p>
              <p className="smallText fw-bold text-white">
                {item.packing_packet_time_range_start}
              </p>
            </div>

            <div className="col">
              <p className="smallText">Time range end</p>
              <p className="smallText fw-bold text-white">
                {item.packing_packet_time_range_end}
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <p className="smallText">Bag # range start</p>
              <p className="smallText fw-bold text-white">
                {item.packing_bag_number_range_start}
              </p>
            </div>

            <div className="col">
              <p className="smallText">Bag # range end</p>
              <p className="smallText fw-bold text-white">
                {item.packing_bag_number_range_end}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccordionItem;
